import { createStore } from "solid-js/store"
import { createSignal, onCleanup } from "solid-js"
import type { RoomInfo, GamePhase, Player, TeamState, TurnInfo, WordResult, GameSettings } from "../../shared/types"
import type { WSServerMessage } from "../../shared/ws-types"
import { addMessageHandler, send, connect, setReconnectInfo, disconnect } from "../services/ws"
import { clientId, nickname } from "./auth"

interface GameState {
  connected: boolean
  roomCode: string | null
  isHost: boolean
  players: Player[]
  teamA: TeamState
  teamB: TeamState
  settings: GameSettings
  phase: GamePhase
  currentTurn: TurnInfo | null
  timeLeft: number
  currentWord: string | null
  winner: "A" | "B" | null
  availableCategories: string[]
  error: string | null
}

const initialState: GameState = {
  connected: false,
  roomCode: null,
  isHost: false,
  players: [],
  teamA: { players: [], score: 0, currentExplainerIndex: 0 },
  teamB: { players: [], score: 0, currentExplainerIndex: 0 },
  settings: { turnDuration: 60, scoreToWin: 30, categories: [] },
  phase: "lobby",
  currentTurn: null,
  timeLeft: 0,
  currentWord: null,
  winner: null,
  availableCategories: [],
  error: null,
}

const [state, setState] = createStore<GameState>({ ...initialState })
const [turnSummary, setTurnSummary] = createSignal<{
  turn: TurnInfo
  teamA: TeamState
  teamB: TeamState
  nextTeam: "A" | "B"
} | null>(null)

function handleMessage(msg: WSServerMessage) {
  switch (msg.type) {
    case "room-info": {
      const room = msg.room
      setState({
        connected: true,
        roomCode: room.code,
        isHost: room.isHost,
        players: room.players,
        teamA: room.teamA,
        teamB: room.teamB,
        settings: room.settings,
        phase: room.phase,
        currentTurn: room.currentTurn,
        timeLeft: room.timeLeft,
        winner: room.winner,
        availableCategories: room.availableCategories,
        error: null,
      })
      break
    }

    case "error":
      setState("error", msg.message)
      break

    case "player-joined":
      setState("players", (prev) => [...prev.filter((p) => p.clientId !== msg.player.clientId), msg.player])
      break

    case "player-left": {
      setState("players", (prev) => prev.filter((p) => p.clientId !== msg.clientId))
      // Update teams
      setState("teamA", "players", (prev) => prev.filter((p) => p.clientId !== msg.clientId))
      setState("teamB", "players", (prev) => prev.filter((p) => p.clientId !== msg.clientId))
      if (msg.newHostId) {
        setState("isHost", msg.newHostId === clientId())
        setState("players", (prev) =>
          prev.map((p) => ({ ...p, isHost: p.clientId === msg.newHostId })),
        )
      }
      break
    }

    case "team-updated":
      setState({ teamA: msg.teamA, teamB: msg.teamB })
      // Update players list too
      setState("players", (prev) =>
        prev.map((p) => {
          const inA = msg.teamA.players.find((tp) => tp.clientId === p.clientId)
          const inB = msg.teamB.players.find((tp) => tp.clientId === p.clientId)
          return { ...p, team: inA ? "A" as const : inB ? "B" as const : null }
        }),
      )
      break

    case "settings-updated":
      setState("settings", msg.settings)
      break

    case "phase-changed":
      setState({ phase: msg.phase, currentTurn: msg.turn, currentWord: null })
      if (msg.phase === "lobby") {
        setTurnSummary(null)
      }
      break

    case "new-word":
      setState("currentWord", msg.word)
      break

    case "word-resolved":
      setState({ teamA: msg.teamA, teamB: msg.teamB })
      if (state.currentTurn) {
        setState("currentTurn", "wordsResolved", (prev) => [...prev, msg.result])
        setState("currentTurn", "scoreGained", (prev) => prev + (msg.result.guessed ? 1 : -1))
      }
      break

    case "timer-tick":
      setState("timeLeft", msg.timeLeft)
      break

    case "turn-summary":
      setTurnSummary({ turn: msg.turn, teamA: msg.teamA, teamB: msg.teamB, nextTeam: msg.nextTeam })
      setState({ teamA: msg.teamA, teamB: msg.teamB, phase: "turn-end" })
      break

    case "game-over":
      setState({ winner: msg.winner, teamA: msg.teamA, teamB: msg.teamB, phase: "game-over" })
      break
  }
}

// Actions
export function createRoom() {
  connect(() => {
    send({ type: "join", clientId: clientId(), nickname: nickname() })
  })
}

export function joinRoom(code: string) {
  connect(() => {
    send({ type: "join", clientId: clientId(), nickname: nickname(), roomCode: code })
  })
}

export function joinTeam(team: "A" | "B") {
  send({ type: "join-team", clientId: clientId(), team })
}

export function leaveTeam() {
  send({ type: "leave-team", clientId: clientId() })
}

export function updateSettings(settings: Partial<GameSettings>) {
  send({ type: "update-settings", clientId: clientId(), settings })
}

export function startGameAction() {
  send({ type: "start-game", clientId: clientId() })
}

export function wordResult(guessed: boolean) {
  send({ type: "word-result", clientId: clientId(), guessed })
}

export function playAgain() {
  send({ type: "start-game", clientId: clientId() })
}

export function leaveRoom() {
  disconnect()
  setState({ ...initialState })
  setTurnSummary(null)
}

export function initGameStore() {
  const cleanup = addMessageHandler(handleMessage)

  // Set reconnect info when connected to a room
  if (state.roomCode) {
    setReconnectInfo({
      roomCode: state.roomCode,
      clientId: clientId(),
      nickname: nickname(),
    })
  }

  return cleanup
}

export function isExplainer(): boolean {
  return state.currentTurn?.explainer.clientId === clientId()
}

export function myTeam(): "A" | "B" | null {
  const me = state.players.find((p) => p.clientId === clientId())
  return me?.team ?? null
}

export function isMyTeamTurn(): boolean {
  return state.currentTurn?.team === myTeam()
}

export { state as gameState, turnSummary }
