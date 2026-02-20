import type { TeamState } from "../../../shared/types"
import { cn } from "../../lib/cn"

interface ScoreboardProps {
  teamA: TeamState
  teamB: TeamState
  scoreToWin: number
  currentTeam?: "A" | "B" | null
}

export function Scoreboard(props: ScoreboardProps) {
  const progressA = () => Math.min(100, (props.teamA.score / props.scoreToWin) * 100)
  const progressB = () => Math.min(100, (props.teamB.score / props.scoreToWin) * 100)

  return (
    <div class="flex flex-col items-center gap-2 w-full max-w-xs">
      <div class="flex items-center justify-center gap-4 w-full">
        <div
          class={cn(
            "flex flex-col items-center rounded-xl px-5 py-2.5 transition-all min-w-[90px] glass-light",
            props.currentTeam === "A"
              ? "border border-team-a/40 shadow-[0_0_20px_rgba(96,165,250,0.15)] team-a-top-accent"
              : "border border-white/[0.04]",
          )}
        >
          <span class="text-xs text-team-a">🧊 крижані</span>
          <span class="text-2xl font-bold text-team-a tabular-nums">{props.teamA.score}</span>
          <div class="w-full h-1 rounded-full bg-white/[0.06] mt-1 overflow-hidden">
            <div
              class="h-full rounded-full bg-team-a/50 transition-all duration-500"
              style={{ width: `${progressA()}%` }}
            />
          </div>
        </div>

        <span class="text-text-dim text-sm font-medium">vs</span>

        <div
          class={cn(
            "flex flex-col items-center rounded-xl px-5 py-2.5 transition-all min-w-[90px] glass-light",
            props.currentTeam === "B"
              ? "border border-team-b/40 shadow-[0_0_20px_rgba(251,191,36,0.15)] team-b-top-accent"
              : "border border-white/[0.04]",
          )}
        >
          <span class="text-xs text-team-b">🌟 зоряні</span>
          <span class="text-2xl font-bold text-team-b tabular-nums">{props.teamB.score}</span>
          <div class="w-full h-1 rounded-full bg-white/[0.06] mt-1 overflow-hidden">
            <div
              class="h-full rounded-full bg-team-b/50 transition-all duration-500"
              style={{ width: `${progressB()}%` }}
            />
          </div>
        </div>
      </div>

      <span class="text-[10px] text-text-dim">перемога: {props.scoreToWin} очок</span>
    </div>
  )
}
