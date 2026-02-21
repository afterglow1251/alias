import { reactive, ref, computed } from "vue"
import { defineStore } from "pinia"
import type { GamePhase, Player, TeamState, TurnInfo, GameSettings } from "../../shared/types"
import type { WSServerMessage } from "../../shared/ws-types"
import { TEAM_NAMES, DEFAULT_TEAM_COUNT } from "../../shared/teams"
import { addMessageHandler, send, connect, setReconnectInfo, disconnect } from "../services/ws"
import { clientId, nickname } from "./auth"

function makeDefaultTeams(count: number): TeamState[] {
  return Array.from({ length: count }, (_, i) => ({
    name: TEAM_NAMES[i] ?? `Team ${i + 1}`,
    players: [],
    score: 0,
    currentExplainerIndex: 0,
  }))
}

interface GameState {
  connected: boolean
  roomCode: string | null
  isHost: boolean
  players: Player[]
  teams: TeamState[]
  settings: GameSettings
  phase: GamePhase
  currentTurn: TurnInfo | null
  timeLeft: number
  currentWord: string | null
  winner: number | null
  error: string | null
}

function makeInitialState(): GameState {
  return {
    connected: false,
    roomCode: null,
    isHost: false,
    players: [],
    teams: makeDefaultTeams(DEFAULT_TEAM_COUNT),
    settings: { turnDuration: 60, scoreToWin: 30, teamCount: DEFAULT_TEAM_COUNT },
    phase: "lobby",
    currentTurn: null,
    timeLeft: 0,
    currentWord: null,
    winner: null,
    error: null,
  }
}

export const useGameStore = defineStore("game", () => {
  const state = reactive<GameState>(makeInitialState())

  const turnSummary = ref<{
    turn: TurnInfo
    teams: TeamState[]
    nextTeam: number
  } | null>(null)

  function handleMessage(msg: WSServerMessage) {
    switch (msg.type) {
      case "room-info": {
        const room = msg.room
        Object.assign(state, {
          connected: true,
          roomCode: room.code,
          isHost: room.isHost,
          players: room.players,
          teams: room.teams,
          settings: room.settings,
          phase: room.phase,
          currentTurn: room.currentTurn,
          timeLeft: room.timeLeft,
          winner: room.winner,
          error: null,
        })
        break
      }

      case "error":
        state.error = msg.message
        break

      case "player-joined":
        state.players = [...state.players.filter((p) => p.clientId !== msg.player.clientId), msg.player]
        break

      case "player-left": {
        state.players = state.players.filter((p) => p.clientId !== msg.clientId)
        state.teams = state.teams.map((team) => ({
          ...team,
          players: team.players.filter((p) => p.clientId !== msg.clientId),
        }))
        if (msg.newHostId) {
          state.isHost = msg.newHostId === clientId.value
          state.players = state.players.map((p) => ({ ...p, isHost: p.clientId === msg.newHostId }))
        }
        break
      }

      case "team-updated":
        state.teams = msg.teams
        state.players = state.players.map((p) => {
          for (let i = 0; i < msg.teams.length; i++) {
            if (msg.teams[i].players.find((tp) => tp.clientId === p.clientId)) {
              return { ...p, team: i }
            }
          }
          return { ...p, team: null }
        })
        break

      case "settings-updated":
        state.settings = msg.settings
        break

      case "phase-changed":
        state.phase = msg.phase
        state.currentTurn = msg.turn
        state.currentWord = null
        if (msg.phase === "lobby") {
          turnSummary.value = null
        }
        break

      case "new-word":
        state.currentWord = msg.word
        break

      case "word-resolved":
        state.teams = msg.teams
        if (state.currentTurn) {
          state.currentTurn = {
            ...state.currentTurn,
            wordsResolved: [...state.currentTurn.wordsResolved, msg.result],
            scoreGained: state.currentTurn.scoreGained + (msg.result.guessed ? 1 : -1),
          }
        }
        break

      case "timer-tick":
        state.timeLeft = msg.timeLeft
        break

      case "turn-summary":
        turnSummary.value = { turn: msg.turn, teams: msg.teams, nextTeam: msg.nextTeam }
        state.teams = msg.teams
        state.phase = "turn-end"
        break

      case "game-over":
        state.winner = msg.winner
        state.teams = msg.teams
        state.phase = "game-over"
        break

      case "team-name-updated":
        state.teams = state.teams.map((t, i) =>
          i === msg.team ? { ...t, name: msg.name } : t,
        )
        break

      case "player-kicked":
        if (msg.clientId === clientId.value) {
          disconnect()
          Object.assign(state, makeInitialState(), { error: "Тебе вигнали з кімнати" })
          turnSummary.value = null
        }
        break
    }
  }

  // Actions
  function createRoom() {
    connect(() => {
      send({ type: "join", clientId: clientId.value, nickname: nickname.value })
    })
  }

  function joinRoom(code: string) {
    connect(() => {
      send({ type: "join", clientId: clientId.value, nickname: nickname.value, roomCode: code })
    })
  }

  function joinTeam(team: number) {
    send({ type: "join-team", clientId: clientId.value, team })
  }

  function leaveTeam() {
    send({ type: "leave-team", clientId: clientId.value })
  }

  function updateSettings(settings: Partial<GameSettings>) {
    send({ type: "update-settings", clientId: clientId.value, settings })
  }

  function startGameAction() {
    send({ type: "start-game", clientId: clientId.value })
  }

  function wordResult(guessed: boolean) {
    send({ type: "word-result", clientId: clientId.value, guessed })
  }

  function playAgain() {
    send({ type: "start-game", clientId: clientId.value })
  }

  function shuffleTeams() {
    send({ type: "shuffle-teams", clientId: clientId.value })
  }

  function kickPlayer(targetClientId: string) {
    send({ type: "kick-player", clientId: clientId.value, targetClientId })
  }

  function updateTeamName(team: number, name: string) {
    send({ type: "update-team-name", clientId: clientId.value, team, name })
  }

  function leaveRoom() {
    disconnect()
    Object.assign(state, makeInitialState())
    turnSummary.value = null
  }

  function initStore() {
    const cleanup = addMessageHandler(handleMessage)

    if (state.roomCode) {
      setReconnectInfo({
        roomCode: state.roomCode,
        clientId: clientId.value,
        nickname: nickname.value,
      })
    }

    return cleanup
  }

  const isExplainer = computed(() => state.currentTurn?.explainer.clientId === clientId.value)

  const myTeam = computed(() => {
    const me = state.players.find((p) => p.clientId === clientId.value)
    return me?.team ?? null
  })

  const isMyTeamTurn = computed(() => state.currentTurn?.team === myTeam.value)

  return {
    state,
    turnSummary,
    isExplainer,
    myTeam,
    isMyTeamTurn,
    createRoom,
    joinRoom,
    joinTeam,
    leaveTeam,
    updateSettings,
    startGameAction,
    wordResult,
    playAgain,
    shuffleTeams,
    kickPlayer,
    updateTeamName,
    leaveRoom,
    initStore,
  }
})
