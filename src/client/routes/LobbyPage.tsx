import { Show, createEffect } from "solid-js"
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
  myTeam,
  initGameStore,
} from "../stores/game"
import { setReconnectInfo } from "../services/ws"
import { clientId, nickname } from "../stores/auth"
import { onCleanup } from "solid-js"

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

  createEffect(() => {
    if (!gameState.connected && !gameState.roomCode) {
      // Not connected to any room, go back to home
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
      gameState.teamB.players.length >= 2 &&
      gameState.settings.categories.length > 0
    )
  }

  return (
    <div class="min-h-dvh p-4 max-w-2xl mx-auto">
      <div class="space-y-6 animate-fade-in">
        <div class="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={handleLeave}>
            ← Назад
          </Button>
          <Show when={gameState.roomCode}>
            <RoomCode code={gameState.roomCode!} />
          </Show>
        </div>

        <Show when={gameState.error}>
          <div class="rounded-lg bg-danger/10 border border-danger/30 px-4 py-3 text-sm text-danger">
            {gameState.error}
          </div>
        </Show>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TeamPanel
            team="A"
            state={gameState.teamA}
            myTeam={myTeam()}
            onJoin={() => joinTeam("A")}
            onLeave={leaveTeam}
          />
          <TeamPanel
            team="B"
            state={gameState.teamB}
            myTeam={myTeam()}
            onJoin={() => joinTeam("B")}
            onLeave={leaveTeam}
          />
        </div>

        <Card>
          <GameSettings
            settings={gameState.settings}
            availableCategories={gameState.availableCategories}
            isHost={gameState.isHost}
            onUpdate={updateSettings}
          />
        </Card>

        <Show when={gameState.isHost}>
          <Button class="w-full" size="lg" onClick={startGameAction} disabled={!canStart()}>
            {canStart() ? "Почати гру!" : "Потрібно мін. 2 гравці в кожній команді"}
          </Button>
        </Show>

        <Show when={!gameState.isHost}>
          <div class="text-center text-sm text-text-muted">
            Очікуємо, поки хост почне гру...
          </div>
        </Show>
      </div>
    </div>
  )
}
