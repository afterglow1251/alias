import { For } from "solid-js"
import { Timer } from "./Timer"
import { Scoreboard } from "./Scoreboard"
import { gameState } from "../../stores/game"
import { cn } from "../../lib/cn"

export function GuesserView() {
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
        <p class="text-lg font-semibold">Ваша команда вгадує!</p>
        <p class="text-sm text-text-muted mt-1">
          {gameState.currentTurn?.explainer.nickname} пояснює слова
        </p>
      </div>

      <div class="w-full max-w-sm h-48 rounded-2xl bg-surface border-2 border-accent/20 flex items-center justify-center">
        <span class="text-6xl">🤔</span>
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
              <span>{result.guessed ? result.word : "???"}</span>
              <span>{result.guessed ? "✓" : "✗"}</span>
            </div>
          )}
        </For>
      </div>
    </div>
  )
}
