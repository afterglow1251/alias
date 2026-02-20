import { Elysia } from "elysia"
import type { WSClientMessage } from "../../shared/ws-types"
import {
  createRoom,
  joinRoom,
  getRoom,
  removeClient,
  broadcastToRoom,
  getRoomInfo,
  getTeamPlayers,
  getTeamStateForBroadcast,
  sendToClient,
} from "../rooms"
import { startGame, handleWordResult, resetToLobby } from "../game"
import { wsToClientId, clientToRoom, pendingDisconnects } from "./state"

const GRACE_PERIOD = 10_000

export const wsHandler = new Elysia().ws("/ws", {
  message(ws, raw) {
    let msg: WSClientMessage
    try {
      msg = typeof raw === "string" ? JSON.parse(raw) : (raw as WSClientMessage)
    } catch {
      return
    }

    switch (msg.type) {
      case "join": {
        const { clientId, nickname, roomCode } = msg

        // Clear pending disconnect if reconnecting
        const pending = pendingDisconnects.get(clientId)
        if (pending) {
          clearTimeout(pending)
          pendingDisconnects.delete(clientId)
        }

        wsToClientId.set(ws, clientId)

        let room
        if (roomCode) {
          room = getRoom(roomCode.toUpperCase())
          if (!room) {
            ws.send(JSON.stringify({ type: "error", message: "Кімнату не знайдено" }))
            return
          }
          joinRoom(room, clientId, nickname, ws as any)
        } else {
          room = createRoom(clientId, nickname, ws as any)
        }

        clientToRoom.set(clientId, room.code)

        // Send full room state to joining client
        ws.send(JSON.stringify({ type: "room-info", room: getRoomInfo(room, clientId) }))

        // Notify others
        const client = room.clients.get(clientId)!
        broadcastToRoom(
          room,
          {
            type: "player-joined",
            player: {
              clientId: client.clientId,
              nickname: client.nickname,
              team: client.team,
              isHost: client.isHost,
              connected: client.connected,
            },
          },
          clientId,
        )
        break
      }

      case "join-team": {
        const clientId = msg.clientId
        const roomCode = clientToRoom.get(clientId)
        if (!roomCode) return
        const room = getRoom(roomCode)
        if (!room) return

        const client = room.clients.get(clientId)
        if (!client) return
        if (room.phase !== "lobby") return

        client.team = msg.team

        const teams = getTeamStateForBroadcast(room)
        broadcastToRoom(room, {
          type: "team-updated",
          teamA: teams.teamA,
          teamB: teams.teamB,
        })
        break
      }

      case "leave-team": {
        const clientId = msg.clientId
        const roomCode = clientToRoom.get(clientId)
        if (!roomCode) return
        const room = getRoom(roomCode)
        if (!room) return

        const client = room.clients.get(clientId)
        if (!client) return
        if (room.phase !== "lobby") return

        client.team = null

        const teams = getTeamStateForBroadcast(room)
        broadcastToRoom(room, {
          type: "team-updated",
          teamA: teams.teamA,
          teamB: teams.teamB,
        })
        break
      }

      case "update-settings": {
        const clientId = msg.clientId
        const roomCode = clientToRoom.get(clientId)
        if (!roomCode) return
        const room = getRoom(roomCode)
        if (!room || room.hostId !== clientId) return
        if (room.phase !== "lobby") return

        Object.assign(room.settings, msg.settings)

        broadcastToRoom(room, {
          type: "settings-updated",
          settings: room.settings,
        })
        break
      }

      case "start-game": {
        const clientId = msg.clientId
        const roomCode = clientToRoom.get(clientId)
        if (!roomCode) return
        const room = getRoom(roomCode)
        if (!room || room.hostId !== clientId) return

        if (room.phase === "game-over") {
          resetToLobby(room)
          return
        }

        const teamA = getTeamPlayers(room, "A")
        const teamB = getTeamPlayers(room, "B")

        if (teamA.length < 2 || teamB.length < 2) {
          sendToClient(room, clientId, {
            type: "error",
            message: "Потрібно мінімум 2 гравці в кожній команді",
          })
          return
        }

        startGame(room)
        break
      }

      case "word-result": {
        const clientId = msg.clientId
        const roomCode = clientToRoom.get(clientId)
        if (!roomCode) return
        const room = getRoom(roomCode)
        if (!room) return

        handleWordResult(room, clientId, msg.guessed)
        break
      }

      case "shuffle-teams": {
        const clientId = msg.clientId
        const roomCode = clientToRoom.get(clientId)
        if (!roomCode) return
        const room = getRoom(roomCode)
        if (!room || room.hostId !== clientId) return
        if (room.phase !== "lobby") return

        // Gather all players who are in a team
        const inTeam = Array.from(room.clients.values()).filter((c) => c.team !== null)
        // Shuffle using Fisher-Yates
        for (let i = inTeam.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[inTeam[i], inTeam[j]] = [inTeam[j], inTeam[i]]
        }
        // Split evenly between teams
        const half = Math.ceil(inTeam.length / 2)
        for (let i = 0; i < inTeam.length; i++) {
          inTeam[i].team = i < half ? "A" : "B"
        }

        const teams = getTeamStateForBroadcast(room)
        broadcastToRoom(room, {
          type: "team-updated",
          teamA: teams.teamA,
          teamB: teams.teamB,
        })
        break
      }

      case "kick-player": {
        const clientId = msg.clientId
        const targetClientId = msg.targetClientId
        const roomCode = clientToRoom.get(clientId)
        if (!roomCode) return
        const room = getRoom(roomCode)
        if (!room || room.hostId !== clientId) return
        if (targetClientId === clientId) return // Can't kick yourself

        const target = room.clients.get(targetClientId)
        if (!target) return

        // Notify the kicked player
        sendToClient(room, targetClientId, { type: "player-kicked", clientId: targetClientId })

        // Close their WebSocket
        if (target.ws) {
          try { target.ws.close() } catch {}
        }

        // Clear pending disconnect timer if any
        const pending = pendingDisconnects.get(targetClientId)
        if (pending) {
          clearTimeout(pending)
          pendingDisconnects.delete(targetClientId)
        }

        // Remove from room
        removeClient(room, targetClientId)
        clientToRoom.delete(targetClientId)

        // Notify remaining players
        broadcastToRoom(room, {
          type: "player-left",
          clientId: targetClientId,
          newHostId: room.hostId,
        })

        // Update teams
        const teams = getTeamStateForBroadcast(room)
        broadcastToRoom(room, {
          type: "team-updated",
          teamA: teams.teamA,
          teamB: teams.teamB,
        })
        break
      }
    }
  },

  close(ws) {
    const clientId = wsToClientId.get(ws)
    if (!clientId) return

    wsToClientId.delete(ws)

    const roomCode = clientToRoom.get(clientId)
    if (!roomCode) return
    const room = getRoom(roomCode)
    if (!room) return

    const client = room.clients.get(clientId)
    if (client) {
      client.connected = false
      client.ws = null
    }

    // Grace period — wait before full removal
    const timeout = setTimeout(() => {
      pendingDisconnects.delete(clientId)
      const currentRoom = getRoom(roomCode)
      if (!currentRoom) return

      const isEmpty = removeClient(currentRoom, clientId)
      clientToRoom.delete(clientId)

      if (!isEmpty) {
        broadcastToRoom(currentRoom, {
          type: "player-left",
          clientId,
          newHostId: currentRoom.hostId,
        })
      }
    }, GRACE_PERIOD)

    pendingDisconnects.set(clientId, timeout)
  },
})
