import type { ServerWebSocket } from "bun"
import type { Room, RoomClient } from "./types"
import type { RoomInfo, Player, TeamState, TurnInfo } from "../shared/types"
import type { WSServerMessage } from "../shared/ws-types"

const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
let clientCounter = 0

const rooms = new Map<string, Room>()

export function generateCode(): string {
  let code: string
  do {
    code = Array.from({ length: 5 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join("")
  } while (rooms.has(code))
  return code
}

export function generateClientId(): string {
  return `c_${++clientCounter}_${Date.now().toString(36)}`
}

export function getRoom(code: string): Room | undefined {
  return rooms.get(code)
}

export function createRoom(hostId: string, hostNickname: string, ws: ServerWebSocket<any>): Room {
  const code = generateCode()
  const host: RoomClient = {
    ws,
    clientId: hostId,
    nickname: hostNickname,
    team: null,
    isHost: true,
    connected: true,
  }

  const room: Room = {
    code,
    hostId,
    clients: new Map([[hostId, host]]),
    settings: {
      turnDuration: 60,
      scoreToWin: 30,
    },
    phase: "lobby",
    teamAScore: 0,
    teamBScore: 0,
    teamAExplainerIndex: 0,
    teamBExplainerIndex: 0,
    currentTurn: null,
    currentTeam: "A",
    timer: null,
    timeLeft: 0,
    winner: null,
    totalRounds: 0,
  }

  rooms.set(code, room)
  return room
}

export function joinRoom(room: Room, clientId: string, nickname: string, ws: ServerWebSocket<any>): RoomClient {
  const existing = room.clients.get(clientId)
  if (existing) {
    existing.ws = ws
    existing.connected = true
    existing.nickname = nickname
    return existing
  }

  const client: RoomClient = {
    ws,
    clientId,
    nickname,
    team: null,
    isHost: false,
    connected: true,
  }
  room.clients.set(clientId, client)
  return client
}

export function removeClient(room: Room, clientId: string): boolean {
  const client = room.clients.get(clientId)
  if (!client) return false

  room.clients.delete(clientId)

  if (room.clients.size === 0) {
    if (room.timer) clearInterval(room.timer)
    rooms.delete(room.code)
    return true
  }

  if (client.isHost) {
    const newHost = Array.from(room.clients.values()).find((c) => c.connected)
    if (newHost) {
      newHost.isHost = true
      room.hostId = newHost.clientId
    }
  }

  return false
}

export function getTeamPlayers(room: Room, team: "A" | "B"): RoomClient[] {
  return Array.from(room.clients.values()).filter((c) => c.team === team)
}

function toPlayer(c: RoomClient): Player {
  return {
    clientId: c.clientId,
    nickname: c.nickname,
    team: c.team,
    isHost: c.isHost,
    connected: c.connected,
  }
}

function toTeamState(room: Room, team: "A" | "B"): TeamState {
  return {
    players: getTeamPlayers(room, team).map(toPlayer),
    score: team === "A" ? room.teamAScore : room.teamBScore,
    currentExplainerIndex: team === "A" ? room.teamAExplainerIndex : room.teamBExplainerIndex,
  }
}

export function getTurnInfo(room: Room): TurnInfo | null {
  if (!room.currentTurn) return null
  const explainer = room.clients.get(room.currentTurn.explainerClientId)
  if (!explainer) return null
  return {
    team: room.currentTurn.team,
    explainer: toPlayer(explainer),
    wordsResolved: room.currentTurn.wordsResolved,
    scoreGained: room.currentTurn.scoreGained,
  }
}

export function getRoomInfo(room: Room, clientId: string): RoomInfo {
  const client = room.clients.get(clientId)
  return {
    code: room.code,
    clientId,
    isHost: client?.isHost ?? false,
    players: Array.from(room.clients.values()).map(toPlayer),
    teamA: toTeamState(room, "A"),
    teamB: toTeamState(room, "B"),
    settings: room.settings,
    phase: room.phase,
    currentTurn: getTurnInfo(room),
    timeLeft: room.timeLeft,
    winner: room.winner,
  }
}

export function broadcastToRoom(room: Room, message: WSServerMessage, excludeId?: string) {
  const data = JSON.stringify(message)
  for (const client of room.clients.values()) {
    if (client.clientId !== excludeId && client.ws && client.connected) {
      try {
        client.ws.send(data)
      } catch {
        // Client disconnected
      }
    }
  }
}

export function sendToClient(room: Room, clientId: string, message: WSServerMessage) {
  const client = room.clients.get(clientId)
  if (client?.ws && client.connected) {
    try {
      client.ws.send(JSON.stringify(message))
    } catch {
      // Client disconnected
    }
  }
}

export function getTeamStateForBroadcast(room: Room): { teamA: TeamState; teamB: TeamState } {
  return {
    teamA: toTeamState(room, "A"),
    teamB: toTeamState(room, "B"),
  }
}
