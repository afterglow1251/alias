import type { GameSettings, GamePhase, Player, TeamState, TurnInfo, WordResult } from "./types"

// Client → Server
export type WSClientMessage =
  | { type: "join"; clientId: string; nickname: string; roomCode?: string }
  | { type: "join-team"; clientId: string; team: number }
  | { type: "leave-team"; clientId: string }
  | { type: "update-settings"; clientId: string; settings: Partial<GameSettings> }
  | { type: "start-game"; clientId: string }
  | { type: "word-result"; clientId: string; guessed: boolean; awardTeam?: number }
  | { type: "confirm-turn-start"; clientId: string }
  | { type: "shuffle-teams"; clientId: string }
  | { type: "kick-player"; clientId: string; targetClientId: string }
  | { type: "update-team-name"; clientId: string; team: number; name: string }
  | { type: "advance-turn"; clientId: string }
  | { type: "edit-word-result"; clientId: string; wordIndex: number; guessed: boolean }
  | { type: "restart-game"; clientId: string }
  | { type: "back-to-lobby"; clientId: string }

// Server → Client
export type WSServerMessage =
  | { type: "room-info"; room: import("./types").RoomInfo }
  | { type: "error"; message: string }
  | { type: "player-joined"; player: Player }
  | { type: "player-left"; clientId: string; newHostId: string | null }
  | { type: "player-kicked"; clientId: string }
  | { type: "team-updated"; teams: TeamState[] }
  | { type: "settings-updated"; settings: GameSettings }
  | { type: "phase-changed"; phase: GamePhase; turn: TurnInfo | null }
  | { type: "new-word"; word: string }
  | { type: "word-resolved"; result: WordResult; teams: TeamState[]; awardTeam?: number }
  | { type: "timer-tick"; timeLeft: number }
  | { type: "turn-summary"; turn: TurnInfo; teams: TeamState[]; nextTeam: number }
  | { type: "game-over"; winner: number; teams: TeamState[] }
  | { type: "team-name-updated"; team: number; name: string }
