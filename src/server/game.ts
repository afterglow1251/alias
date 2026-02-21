import type { Room } from "./types"
import {
  broadcastToRoom,
  sendToClient,
  getTeamPlayers,
  getTurnInfo,
  getTeamsBroadcast,
} from "./rooms"
import { getWordPool } from "./words"
import { startTimer, stopTimer } from "./timer"

const TURN_START_DELAY = 3000

export function startGame(room: Room) {
  if (room.phase !== "lobby") return

  const teamCount = room.settings.teamCount
  for (let i = 0; i < teamCount; i++) {
    const players = getTeamPlayers(room, i)
    if (players.length < 2) return
  }

  room.teamScores = Array.from({ length: teamCount }, () => 0)
  room.teamExplainerIndices = Array.from({ length: teamCount }, () => 0)
  room.currentTeam = 0
  room.winner = null
  room.totalRounds = 0

  startTurn(room)
}

export function startTurn(room: Room) {
  const team = room.currentTeam
  const players = getTeamPlayers(room, team)
  if (players.length === 0) return

  const explainerIndex = room.teamExplainerIndices[team] ?? 0
  const explainer = players[explainerIndex % players.length]

  const wordPool = getWordPool(200)

  room.currentTurn = {
    team,
    explainerClientId: explainer.clientId,
    wordsResolved: [],
    scoreGained: 0,
    wordPool,
    wordIndex: 0,
    currentWord: null,
  }

  room.phase = "turn-start"
  room.timeLeft = room.settings.turnDuration

  broadcastToRoom(room, {
    type: "phase-changed",
    phase: "turn-start",
    turn: getTurnInfo(room),
  })

  setTimeout(() => {
    if (room.phase !== "turn-start") return
    room.phase = "turn-active"

    broadcastToRoom(room, {
      type: "phase-changed",
      phase: "turn-active",
      turn: getTurnInfo(room),
    })

    sendNextWord(room)
    startTimer(room)
  }, TURN_START_DELAY)
}

export function sendNextWord(room: Room) {
  if (!room.currentTurn) return

  const { wordPool, wordIndex } = room.currentTurn

  if (wordIndex >= wordPool.length) {
    endTurn(room)
    return
  }

  const word = wordPool[wordIndex]
  room.currentTurn.currentWord = word
  room.currentTurn.wordIndex++

  sendToClient(room, room.currentTurn.explainerClientId, {
    type: "new-word",
    word,
  })
}

export function handleWordResult(room: Room, clientId: string, guessed: boolean) {
  if (!room.currentTurn || room.phase !== "turn-active") return
  if (room.currentTurn.explainerClientId !== clientId) return

  const word = room.currentTurn.currentWord
  if (!word) return

  const team = room.currentTurn.team

  room.currentTurn.wordsResolved.push({ word, guessed })

  if (guessed) {
    room.currentTurn.scoreGained++
    room.teamScores[team]++
  } else {
    room.currentTurn.scoreGained--
    room.teamScores[team]--
  }

  const { teams } = getTeamsBroadcast(room)
  broadcastToRoom(room, {
    type: "word-resolved",
    result: { word, guessed },
    teams,
  })

  sendNextWord(room)
}

export function endTurn(room: Room) {
  if (!room.currentTurn) return

  stopTimer(room)

  room.totalRounds++
  room.phase = "turn-end"
  room.currentTurn.currentWord = null

  const { teams } = getTeamsBroadcast(room)
  const turnInfo = getTurnInfo(room)!

  // Advance explainer index
  const currentTeam = room.currentTurn.team
  const teamPlayers = getTeamPlayers(room, currentTeam)
  if (teamPlayers.length > 0) {
    room.teamExplainerIndices[currentTeam] = ((room.teamExplainerIndices[currentTeam] ?? 0) + 1) % teamPlayers.length
  }

  // Check win condition - find first team that reached scoreToWin
  const scoreToWin = room.settings.scoreToWin
  let winnerTeam: number | null = null
  for (let i = 0; i < room.settings.teamCount; i++) {
    if ((room.teamScores[i] ?? 0) >= scoreToWin) {
      winnerTeam = i
      break
    }
  }

  if (winnerTeam !== null) {
    room.winner = winnerTeam
    room.phase = "game-over"

    broadcastToRoom(room, {
      type: "game-over",
      winner: winnerTeam,
      teams,
    })

    return
  }

  // Switch to next team
  const nextTeam = (currentTeam + 1) % room.settings.teamCount
  room.currentTeam = nextTeam

  broadcastToRoom(room, {
    type: "turn-summary",
    turn: turnInfo,
    teams,
    nextTeam,
  })

  // Auto-start next turn after 5 seconds
  setTimeout(() => {
    if (room.phase === "turn-end") {
      startTurn(room)
    }
  }, 5000)
}

export function resetToLobby(room: Room) {
  stopTimer(room)
  room.phase = "lobby"
  room.currentTurn = null
  const teamCount = room.settings.teamCount
  room.teamScores = Array.from({ length: teamCount }, () => 0)
  room.teamExplainerIndices = Array.from({ length: teamCount }, () => 0)
  room.winner = null
  room.totalRounds = 0

  broadcastToRoom(room, {
    type: "phase-changed",
    phase: "lobby",
    turn: null,
  })
}
