import { For } from "solid-js"
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
  const guessed = () => props.turn.wordsResolved.filter((w) => w.guessed).length
  const skipped = () => props.turn.wordsResolved.filter((w) => !w.guessed).length

  return (
    <div class="flex flex-col items-center gap-5 animate-fade-in">
      <Scoreboard
        teamA={props.teamA}
        teamB={props.teamB}
        scoreToWin={props.scoreToWin}
      />

      <div class="text-center">
        <p class="text-xs text-text-muted">
          {props.turn.explainer.nickname} —{" "}
          {props.turn.team === "A" ? "🧊 крижані" : "🌟 зоряні"}
        </p>
        <div class="flex items-center justify-center gap-3 mt-2">
          <span class="glass-light rounded-full px-3 py-1 text-sm font-semibold text-success border border-success/20">
            +{guessed()}
          </span>
          <span class="glass-light rounded-full px-3 py-1 text-sm font-semibold text-danger border border-danger/20">
            -{skipped()}
          </span>
          <span
            class={cn(
              "text-4xl font-bold tabular-nums",
              props.turn.scoreGained >= 0 ? "text-accent" : "text-danger",
            )}
          >
            {props.turn.scoreGained > 0 ? "+" : ""}{props.turn.scoreGained}
          </span>
        </div>
      </div>

      <div class="w-full max-w-xs space-y-1 max-h-44 overflow-y-auto">
        <For each={props.turn.wordsResolved}>
          {(result, i) => (
            <div
              class={cn(
                "flex items-center justify-between rounded-lg px-3 py-1.5 text-xs animate-slide-up glass-light",
                result.guessed
                  ? "border-l-2 border-l-success text-success"
                  : "border-l-2 border-l-danger text-danger",
              )}
              style={{ "animation-delay": `${i() * 50}ms`, "animation-fill-mode": "both" }}
            >
              <span>{result.word}</span>
              <span>{result.guessed ? "+" : "-"}</span>
            </div>
          )}
        </For>
      </div>

      <div
        class={cn(
          "glass-light rounded-full px-4 py-1.5 text-xs font-medium animate-pulse border",
          props.nextTeam === "A"
            ? "text-team-a border-team-a/20"
            : "text-team-b border-team-b/20",
        )}
      >
        далі: {props.nextTeam === "A" ? "🧊 крижані" : "🌟 зоряні"}...
      </div>
    </div>
  )
}
