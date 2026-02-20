import type { GameSettings, GamePhase, Player, RoomInfo, TeamState, TurnInfo, WordResult } from "./types"

// Client → Server
export type WSClientMessage =
  | { type: "join"; clientId: string; nickname: string; roomCode?: string }
  | { type: "join-team"; clientId: string; team: "A" | "B" }
  | { type: "leave-team"; clientId: string }
  | { type: "update-settings"; clientId: string; settings: Partial<GameSettings> }
  | { type: "start-game"; clientId: string }
  | { type: "word-result"; clientId: string; guessed: boolean }
  | { type: "shuffle-teams"; clientId: string }
  | { type: "kick-player"; clientId: string; targetClientId: string }

// Server → Client
export type WSServerMessage =
  | { type: "room-info"; room: RoomInfo }
  | { type: "error"; message: string }
  | { type: "player-joined"; player: Player }
  | { type: "player-left"; clientId: string; newHostId: string | null }
  | { type: "player-kicked"; clientId: string }
  | { type: "team-updated"; teamA: TeamState; teamB: TeamState }
  | { type: "settings-updated"; settings: GameSettings }
  | { type: "phase-changed"; phase: GamePhase; turn: TurnInfo | null }
  | { type: "new-word"; word: string }
  | { type: "word-resolved"; result: WordResult; teamA: TeamState; teamB: TeamState }
  | { type: "timer-tick"; timeLeft: number }
  | { type: "turn-summary"; turn: TurnInfo; teamA: TeamState; teamB: TeamState; nextTeam: "A" | "B" }
  | { type: "game-over"; winner: "A" | "B"; teamA: TeamState; teamB: TeamState }
