export interface Player {
  clientId: string
  nickname: string
  team: number | null
  isHost: boolean
  connected: boolean
}

export interface TeamState {
  name: string
  players: Player[]
  score: number
  currentExplainerIndex: number
}

export interface GameSettings {
  turnDuration: number // seconds (30, 45, 60, 90)
  scoreToWin: number // points to win (20, 30, 40, 50)
  teamCount: number // 2-6
  skipPenalty: boolean // true = -1 for skip, false = 0
  lastWordInfinite: boolean // true = finish last word after timer
  lastWordForAll: boolean // true = any team can guess last word
}

export type GamePhase = "lobby" | "turn-start" | "turn-active" | "turn-last-word" | "turn-end" | "game-over"

export interface WordResult {
  word: string
  guessed: boolean
}

export interface TurnInfo {
  team: number
  explainer: Player
  wordsResolved: WordResult[]
  scoreGained: number
}

export interface RoomInfo {
  code: string
  clientId: string
  isHost: boolean
  players: Player[]
  teams: TeamState[]
  settings: GameSettings
  phase: GamePhase
  currentTurn: TurnInfo | null
  timeLeft: number
  winner: number | null
}
