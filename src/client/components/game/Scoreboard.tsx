import type { TeamState } from "../../../shared/types"
import { cn } from "../../lib/cn"

interface ScoreboardProps {
  teamA: TeamState
  teamB: TeamState
  scoreToWin: number
  currentTeam?: "A" | "B" | null
}

export function Scoreboard(props: ScoreboardProps) {
  return (
    <div class="flex items-center justify-center gap-6">
      <div
        class={cn(
          "flex flex-col items-center rounded-xl px-6 py-3 transition-all",
          props.currentTeam === "A" ? "team-a-gradient border-2 border-team-a/50" : "bg-surface-light",
        )}
      >
        <span class="text-sm text-team-a font-medium">Сині</span>
        <span class="text-3xl font-bold text-team-a">{props.teamA.score}</span>
        <span class="text-xs text-text-muted">/ {props.scoreToWin}</span>
      </div>

      <div class="text-2xl font-bold text-text-muted">vs</div>

      <div
        class={cn(
          "flex flex-col items-center rounded-xl px-6 py-3 transition-all",
          props.currentTeam === "B" ? "team-b-gradient border-2 border-team-b/50" : "bg-surface-light",
        )}
      >
        <span class="text-sm text-team-b font-medium">Жовті</span>
        <span class="text-3xl font-bold text-team-b">{props.teamB.score}</span>
        <span class="text-xs text-text-muted">/ {props.scoreToWin}</span>
      </div>
    </div>
  )
}
