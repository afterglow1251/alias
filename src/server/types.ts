import type { ServerWebSocket } from "bun"
import type { GamePhase, GameSettings, WordResult } from "../shared/types"

export interface RoomClient {
  ws: ServerWebSocket<any> | null
  clientId: string
  nickname: string
  team: number | null
  isHost: boolean
  connected: boolean
}

export interface TurnData {
  team: number
  explainerClientId: string
  wordsResolved: WordResult[]
  scoreGained: number
  wordPool: string[]
  wordIndex: number
  currentWord: string | null
}

export interface Room {
  code: string
  hostId: string
  clients: Map<string, RoomClient>
  settings: GameSettings
  phase: GamePhase
  teamScores: number[]
  teamExplainerIndices: number[]
  teamNames: string[]
  currentTurn: TurnData | null
  currentTeam: number
  timer: ReturnType<typeof setInterval> | null
  timeLeft: number
  winner: number | null
  totalRounds: number
}
