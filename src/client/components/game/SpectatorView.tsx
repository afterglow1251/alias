import { For } from "solid-js"
import { Timer } from "./Timer"
import { Scoreboard } from "./Scoreboard"
import { gameState } from "../../stores/game"
import { cn } from "../../lib/cn"

export function SpectatorView() {
  return (
    <div class="flex flex-col items-center gap-6 animate-fade-in">
      <Scoreboard
        teamA={gameState.teamA}
        teamB={gameState.teamB}
        scoreToWin={gameState.settings.scoreToWin}
        currentTeam={gameState.currentTurn?.team}
      />

      <Timer timeLeft={gameState.timeLeft} total={gameState.settings.turnDuration} />

      <div class="text-center">
        <p class="text-lg font-semibold text-text-muted">
          Команда {gameState.currentTurn?.team === "A" ? "Синіх" : "Жовтих"} грає
        </p>
        <p class="text-sm text-text-muted mt-1">
          {gameState.currentTurn?.explainer.nickname} пояснює
        </p>
      </div>

      <div class="w-full max-w-sm h-48 rounded-2xl bg-surface-light border border-border flex items-center justify-center">
        <span class="text-6xl">👀</span>
      </div>

      <div class="w-full max-w-sm space-y-2">
        <div class="text-sm text-text-muted text-center mb-2">Результати:</div>
        <For each={gameState.currentTurn?.wordsResolved ?? []}>
          {(result) => (
            <div
              class={cn(
                "flex items-center justify-between rounded-lg px-3 py-2 text-sm animate-slide-up",
                result.guessed ? "bg-success/10 text-success" : "bg-danger/10 text-danger",
              )}
            >
              <span>{result.guessed ? "✓ Вгадали" : "✗ Пропуск"}</span>
            </div>
          )}
        </For>
      </div>
    </div>
  )
}
