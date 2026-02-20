import { Show, Switch, Match, createEffect, onCleanup } from "solid-js"
import { useNavigate } from "@solidjs/router"
import { ExplainerView } from "../components/game/ExplainerView"
import { GuesserView } from "../components/game/GuesserView"
import { SpectatorView } from "../components/game/SpectatorView"
import { TurnResult } from "../components/game/TurnResult"
import { GameOver } from "../components/game/GameOver"
import { Scoreboard } from "../components/game/Scoreboard"
import {
  gameState,
  turnSummary,
  isExplainer,
  isMyTeamTurn,
  playAgain,
  leaveRoom,
  initGameStore,
} from "../stores/game"
import { clientId, nickname } from "../stores/auth"
import { setReconnectInfo } from "../services/ws"

export function GamePage() {
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
    if (gameState.phase === "lobby") {
      navigate("/lobby")
    }
  })

  function handleLeave() {
    leaveRoom()
    navigate("/")
  }

  return (
    <div class="min-h-dvh p-4 max-w-lg mx-auto">
      <div class="space-y-6">
        <Switch>
          {/* Turn Start — countdown announcement */}
          <Match when={gameState.phase === "turn-start"}>
            <div class="flex flex-col items-center justify-center min-h-[60dvh] gap-6 animate-fade-in">
              <Scoreboard
                teamA={gameState.teamA}
                teamB={gameState.teamB}
                scoreToWin={gameState.settings.scoreToWin}
                currentTeam={gameState.currentTurn?.team}
              />
              <div class="text-center">
                <p class="text-lg text-text-muted mb-2">
                  Команда{" "}
                  <span
                    class={
                      gameState.currentTurn?.team === "A"
                        ? "text-team-a font-bold"
                        : "text-team-b font-bold"
                    }
                  >
                    {gameState.currentTurn?.team === "A" ? "Синіх" : "Жовтих"}
                  </span>
                </p>
                <p class="text-2xl font-bold mb-4">
                  {gameState.currentTurn?.explainer.nickname} пояснює!
                </p>
                <div class="text-6xl animate-countdown">3...</div>
              </div>
              <Show when={isExplainer()}>
                <p class="text-accent font-medium">Приготуйтесь — ви пояснюєте!</p>
              </Show>
            </div>
          </Match>

          {/* Turn Active */}
          <Match when={gameState.phase === "turn-active"}>
            <Show
              when={isExplainer()}
              fallback={
                <Show when={isMyTeamTurn()} fallback={<SpectatorView />}>
                  <GuesserView />
                </Show>
              }
            >
              <ExplainerView />
            </Show>
          </Match>

          {/* Turn End — summary */}
          <Match when={gameState.phase === "turn-end"}>
            <Show when={turnSummary()}>
              {(summary) => (
                <TurnResult
                  turn={summary().turn}
                  teamA={summary().teamA}
                  teamB={summary().teamB}
                  nextTeam={summary().nextTeam}
                  scoreToWin={gameState.settings.scoreToWin}
                />
              )}
            </Show>
          </Match>

          {/* Game Over */}
          <Match when={gameState.phase === "game-over"}>
            <Show when={gameState.winner}>
              <GameOver
                winner={gameState.winner!}
                teamA={gameState.teamA}
                teamB={gameState.teamB}
                scoreToWin={gameState.settings.scoreToWin}
                isHost={gameState.isHost}
                onPlayAgain={playAgain}
                onBackToLobby={handleLeave}
              />
            </Show>
          </Match>
        </Switch>
      </div>
    </div>
  )
}
