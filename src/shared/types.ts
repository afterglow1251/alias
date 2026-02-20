export interface Player {
  clientId: string
  nickname: string
  team: "A" | "B" | null
  isHost: boolean
  connected: boolean
}

export interface TeamState {
  players: Player[]
  score: number
  currentExplainerIndex: number
}

export interface GameSettings {
  turnDuration: number // seconds (30, 45, 60, 90)
  scoreToWin: number // points to win (20, 30, 40, 50)
  categories: string[] // selected word categories
}

export type GamePhase = "lobby" | "turn-start" | "turn-active" | "turn-end" | "game-over"

export interface WordResult {
  word: string
  guessed: boolean
}

export interface TurnInfo {
  team: "A" | "B"
  explainer: Player
  wordsResolved: WordResult[]
  scoreGained: number
}

export interface RoomInfo {
  code: string
  clientId: string
  isHost: boolean
  players: Player[]
  teamA: TeamState
  teamB: TeamState
  settings: GameSettings
  phase: GamePhase
  currentTurn: TurnInfo | null
  timeLeft: number
  winner: "A" | "B" | null
  availableCategories: string[]
}
