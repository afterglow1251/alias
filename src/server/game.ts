import type { Room } from "./types"
import {
  broadcastToRoom,
  sendToClient,
  getTeamPlayers,
  getTurnInfo,
  getTeamStateForBroadcast,
} from "./rooms"
import { getWordPool } from "./words"
import { startTimer, stopTimer } from "./timer"
import { getDb } from "./db/index"
import { gameHistory } from "./db/schema"

const TURN_START_DELAY = 3000

export function startGame(room: Room) {
  if (room.phase !== "lobby") return

  const teamA = getTeamPlayers(room, "A")
  const teamB = getTeamPlayers(room, "B")

  if (teamA.length < 2 || teamB.length < 2) return

  room.teamAScore = 0
  room.teamBScore = 0
  room.teamAExplainerIndex = 0
  room.teamBExplainerIndex = 0
  room.currentTeam = "A"
  room.winner = null
  room.totalRounds = 0

  startTurn(room)
}

export function startTurn(room: Room) {
  const team = room.currentTeam
  const players = getTeamPlayers(room, team)
  if (players.length === 0) return

  const explainerIndex = team === "A" ? room.teamAExplainerIndex : room.teamBExplainerIndex
  const explainer = players[explainerIndex % players.length]

  const wordPool = getWordPool(room.settings.categories, 200)

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

  room.currentTurn.wordsResolved.push({ word, guessed })

  if (guessed) {
    room.currentTurn.scoreGained++
    if (room.currentTurn.team === "A") {
      room.teamAScore++
    } else {
      room.teamBScore++
    }
  } else {
    // Skip penalty: -1 point
    room.currentTurn.scoreGained--
    if (room.currentTurn.team === "A") {
      room.teamAScore--
    } else {
      room.teamBScore--
    }
  }

  const teams = getTeamStateForBroadcast(room)
  broadcastToRoom(room, {
    type: "word-resolved",
    result: { word: guessed ? word : "???", guessed },
    teamA: teams.teamA,
    teamB: teams.teamB,
  })

  sendNextWord(room)
}

export function endTurn(room: Room) {
  if (!room.currentTurn) return

  stopTimer(room)

  room.totalRounds++
  room.phase = "turn-end"
  room.currentTurn.currentWord = null

  const teams = getTeamStateForBroadcast(room)
  const turnInfo = getTurnInfo(room)!

  // Advance explainer index
  const currentTeam = room.currentTurn.team
  const teamPlayers = getTeamPlayers(room, currentTeam)
  if (currentTeam === "A") {
    room.teamAExplainerIndex = (room.teamAExplainerIndex + 1) % teamPlayers.length
  } else {
    room.teamBExplainerIndex = (room.teamBExplainerIndex + 1) % teamPlayers.length
  }

  // Check win condition
  const scoreToWin = room.settings.scoreToWin
  if (room.teamAScore >= scoreToWin || room.teamBScore >= scoreToWin) {
    const winner = room.teamAScore >= scoreToWin ? "A" as const : "B" as const
    room.winner = winner
    room.phase = "game-over"

    broadcastToRoom(room, {
      type: "game-over",
      winner,
      teamA: teams.teamA,
      teamB: teams.teamB,
    })

    recordGame(room)
    return
  }

  // Switch teams
  const nextTeam = currentTeam === "A" ? "B" as const : "A" as const
  room.currentTeam = nextTeam

  broadcastToRoom(room, {
    type: "turn-summary",
    turn: turnInfo,
    teamA: teams.teamA,
    teamB: teams.teamB,
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
  room.teamAScore = 0
  room.teamBScore = 0
  room.teamAExplainerIndex = 0
  room.teamBExplainerIndex = 0
  room.winner = null
  room.totalRounds = 0

  broadcastToRoom(room, {
    type: "phase-changed",
    phase: "lobby",
    turn: null,
  })
}

async function recordGame(room: Room) {
  try {
    const db = getDb()
    if (!db || !room.winner) return
    await db.insert(gameHistory).values({
      roomCode: room.code,
      winnerTeam: room.winner,
      teamAScore: room.teamAScore,
      teamBScore: room.teamBScore,
      totalRounds: room.totalRounds,
    })
  } catch (e) {
    console.error("Failed to record game:", e)
  }
}
