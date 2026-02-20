import { Show, createEffect, onCleanup } from "solid-js"
import { useNavigate } from "@solidjs/router"
import { Card } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { RoomCode } from "../components/lobby/RoomCode"
import { TeamPanel } from "../components/lobby/TeamPanel"
import { GameSettings } from "../components/lobby/GameSettings"
import {
  gameState,
  joinTeam,
  leaveTeam,
  updateSettings,
  startGameAction,
  leaveRoom,
  shuffleTeams,
  kickPlayer,
  myTeam,
  initGameStore,
} from "../stores/game"
import { setReconnectInfo } from "../services/ws"
import { clientId, nickname } from "../stores/auth"

export function LobbyPage() {
  const navigate = useNavigate()

  const cleanup = initGameStore()
  onCleanup(cleanup)

  createEffect(() => {
    if (gameState.roomCode) {
      setReconnectInfo({
        roomCode: gameState.roomCode,
        clientId: clientId(),
        nickname: nickname(),
      })
    }
  })

  createEffect(() => {
    if (gameState.phase === "turn-start" || gameState.phase === "turn-active") {
      navigate("/game")
    }
  })

  // Redirect kicked players to home
  createEffect(() => {
    if (!gameState.roomCode && gameState.error) {
      navigate("/")
    }
  })

  function handleLeave() {
    leaveRoom()
    navigate("/")
  }

  const canStart = () => {
    return (
      gameState.isHost &&
      gameState.teamA.players.length >= 2 &&
      gameState.teamB.players.length >= 2
    )
  }

  return (
    <div class="min-h-dvh p-4 max-w-lg mx-auto">
      <div class="space-y-5 animate-fade-in py-4">
        <div class="flex items-center justify-between glass rounded-xl px-3 py-2 inner-glow">
          <Button variant="ghost" size="sm" onClick={handleLeave}>
            ← назад
          </Button>
          <Show when={gameState.roomCode}>
            <RoomCode code={gameState.roomCode!} />
          </Show>
        </div>

        <div class="text-center">
          <span class="text-3xl animate-waddle inline-block">🐧</span>
          <p class="glass-light inline-block rounded-full px-4 py-1.5 text-xs text-text-muted mt-2 border border-white/[0.04]">
            збирайте друзів за кодом кімнати!
          </p>
        </div>

        <Show when={gameState.error}>
          <div class="rounded-xl bg-danger/10 border border-danger/20 px-4 py-3 text-sm text-danger text-center">
            {gameState.error}
          </div>
        </Show>

        <div class="grid grid-cols-2 gap-3">
          <div class="animate-slide-in-left">
            <TeamPanel
              team="A"
              state={gameState.teamA}
              myTeam={myTeam()}
              isHost={gameState.isHost}
              onJoin={() => joinTeam("A")}
              onLeave={leaveTeam}
              onKick={kickPlayer}
            />
          </div>
          <div class="animate-slide-in-right">
            <TeamPanel
              team="B"
              state={gameState.teamB}
              myTeam={myTeam()}
              isHost={gameState.isHost}
              onJoin={() => joinTeam("B")}
              onLeave={leaveTeam}
              onKick={kickPlayer}
            />
          </div>
        </div>

        <Show when={gameState.isHost && (gameState.teamA.players.length + gameState.teamB.players.length) >= 2}>
          <Button variant="ghost" size="sm" class="w-full" onClick={shuffleTeams}>
            🔀 перемішати команди
          </Button>
        </Show>

        <Card class="space-y-0">
          <GameSettings
            settings={gameState.settings}
            isHost={gameState.isHost}
            onUpdate={updateSettings}
          />
        </Card>

        <Show when={gameState.isHost}>
          <Button
            class={canStart() ? "w-full animate-pulse-glow" : "w-full"}
            size="lg"
            onClick={startGameAction}
            disabled={!canStart()}
          >
            {canStart() ? "грати! 🎯" : "потрібно 2+ в кожній команді"}
          </Button>
        </Show>

        <Show when={!gameState.isHost}>
          <p class="glass-light inline-flex items-center rounded-full px-4 py-1.5 text-xs text-text-muted mx-auto border border-white/[0.04]">
            чекаємо на хоста... 🐧
          </p>
        </Show>
      </div>
    </div>
  )
}
