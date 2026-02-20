import { For, Show } from "solid-js"
import type { TurnInfo, TeamState } from "../../../shared/types"
import { cn } from "../../lib/cn"
import { Scoreboard } from "./Scoreboard"

interface TurnResultProps {
  turn: TurnInfo
  teamA: TeamState
  teamB: TeamState
  nextTeam: "A" | "B"
  scoreToWin: number
}

export function TurnResult(props: TurnResultProps) {
  const guessedCount = () => props.turn.wordsResolved.filter((w) => w.guessed).length
  const skippedCount = () => props.turn.wordsResolved.filter((w) => !w.guessed).length

  return (
    <div class="flex flex-col items-center gap-6 animate-fade-in">
      <h2 class="text-2xl font-bold">Підсумок раунду</h2>

      <Scoreboard
        teamA={props.teamA}
        teamB={props.teamB}
        scoreToWin={props.scoreToWin}
      />

      <div class="text-center">
        <p class="text-sm text-text-muted">
          {props.turn.explainer.nickname} пояснював(ла) за команду{" "}
          <span class={props.turn.team === "A" ? "text-team-a" : "text-team-b"}>
            {props.turn.team === "A" ? "Синіх" : "Жовтих"}
          </span>
        </p>
        <div class="flex items-center justify-center gap-4 mt-2">
          <span class="text-success font-medium">✓ {guessedCount()}</span>
          <span class="text-danger font-medium">✗ {skippedCount()}</span>
          <span class="text-accent font-bold">= {props.turn.scoreGained > 0 ? "+" : ""}{props.turn.scoreGained}</span>
        </div>
      </div>

      <div class="w-full max-w-sm space-y-1 max-h-48 overflow-y-auto">
        <For each={props.turn.wordsResolved}>
          {(result) => (
            <div
              class={cn(
                "flex items-center justify-between rounded-lg px-3 py-1.5 text-sm",
                result.guessed ? "bg-success/10 text-success" : "bg-danger/10 text-danger",
              )}
            >
              <span>{result.word}</span>
              <span>{result.guessed ? "✓" : "✗"}</span>
            </div>
          )}
        </For>
      </div>

      <div class="text-sm text-text-muted animate-pulse">
        Наступна команда:{" "}
        <span class={props.nextTeam === "A" ? "text-team-a font-medium" : "text-team-b font-medium"}>
          {props.nextTeam === "A" ? "Сині" : "Жовті"}
        </span>
        {" "}через кілька секунд...
      </div>
    </div>
  )
}
