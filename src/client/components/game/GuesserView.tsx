import { For } from "solid-js"
import { Timer } from "./Timer"
import { Scoreboard } from "./Scoreboard"
import { gameState } from "../../stores/game"
import { cn } from "../../lib/cn"

export function GuesserView() {
  return (
    <div class="flex flex-col items-center gap-5 animate-fade-in">
      <Scoreboard
        teamA={gameState.teamA}
        teamB={gameState.teamB}
        scoreToWin={gameState.settings.scoreToWin}
        currentTeam={gameState.currentTurn?.team}
      />

      <Timer timeLeft={gameState.timeLeft} total={gameState.settings.turnDuration} />

      <div class="text-center">
        <p class="text-sm font-medium">вгадуйте! 🎯</p>
        <p class="text-xs text-text-muted mt-0.5">
          {gameState.currentTurn?.explainer.nickname} пояснює
        </p>
      </div>

      <div class="w-full max-w-xs h-48 rounded-2xl glass border border-white/[0.06] flex flex-col items-center justify-center animate-pulse-glow">
        <span class="text-6xl animate-bounce-soft">🤔</span>
        <p class="text-xs text-text-dim mt-2">слухайте підказки...</p>
      </div>

      <div class="w-full max-w-xs space-y-1.5">
        <For each={[...(gameState.currentTurn?.wordsResolved ?? [])].reverse()}>
          {(result) => (
            <div
              class={cn(
                "flex items-center justify-between rounded-lg px-3 py-1.5 text-xs animate-slide-up glass-light",
                result.guessed
                  ? "border-l-2 border-l-success text-success"
                  : "border-l-2 border-l-danger text-danger",
              )}
            >
              <span>{result.guessed ? result.word : "..."}</span>
              <span>{result.guessed ? "+" : "-"}</span>
            </div>
          )}
        </For>
      </div>
    </div>
  )
}
