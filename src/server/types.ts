import type { ServerWebSocket } from "bun"
import type { GamePhase, GameSettings, Player, WordResult } from "../shared/types"

export interface RoomClient {
  ws: ServerWebSocket<any> | null
  clientId: string
  nickname: string
  team: "A" | "B" | null
  isHost: boolean
  connected: boolean
}

export interface TurnData {
  team: "A" | "B"
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
  teamAScore: number
  teamBScore: number
  teamAExplainerIndex: number
  teamBExplainerIndex: number
  currentTurn: TurnData | null
  currentTeam: "A" | "B"
  timer: ReturnType<typeof setInterval> | null
  timeLeft: number
  winner: "A" | "B" | null
  totalRounds: number
}
