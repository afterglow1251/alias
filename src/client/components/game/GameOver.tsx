import type { TeamState } from "../../../shared/types"
import { Button } from "../ui/button"
import { Scoreboard } from "./Scoreboard"
import { cn } from "../../lib/cn"

interface GameOverProps {
  winner: "A" | "B"
  teamA: TeamState
  teamB: TeamState
  scoreToWin: number
  isHost: boolean
  onPlayAgain: () => void
  onBackToLobby: () => void
}

const CONFETTI_EMOJI = ["🐧", "🎉", "⭐", "❄️", "✨", "🎊", "🏆", "💎"]

export function GameOver(props: GameOverProps) {
  const teamColor = () => (props.winner === "A" ? "team-a" : "team-b")
  const glowColor = () =>
    props.winner === "A" ? "rgba(96, 165, 250, 0.3)" : "rgba(251, 191, 36, 0.3)"

  return (
    <div class="flex flex-col items-center gap-6 animate-fade-in relative">
      {/* Pulsing team-color background glow */}
      <div
        class="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full animate-pulse-glow pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${glowColor()}, transparent 70%)`,
          filter: "blur(40px)",
        }}
      />

      {/* Trophy composition */}
      <div class="relative animate-trophy">
        <div class="text-6xl">👑</div>
        <div class="text-4xl -mt-2 text-center">🐧</div>
      </div>

      <h2
        class={cn("text-3xl font-extrabold", `text-${teamColor()}`)}
        style={{
          "text-shadow": `0 0 30px ${glowColor()}`,
        }}
      >
        {props.winner === "A" ? "🧊 крижані" : "🌟 зоряні"} перемогли!
      </h2>

      <Scoreboard
        teamA={props.teamA}
        teamB={props.teamB}
        scoreToWin={props.scoreToWin}
      />

      <div class="flex gap-3 mt-2 glass rounded-2xl p-3 inner-glow">
        {props.isHost && (
          <Button variant="default" size="lg" onClick={props.onPlayAgain}>
            ще раз! 🎯
          </Button>
        )}
        <Button variant="outline" size="lg" onClick={props.onBackToLobby}>
          назад
        </Button>
      </div>

      {!props.isHost && (
        <p class="text-xs text-text-muted">чекаємо на хоста... 🐧</p>
      )}

      {/* Confetti */}
      <div class="fixed inset-0 pointer-events-none overflow-hidden z-50">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            class="absolute animate-confetti"
            style={{
              left: `${Math.random() * 100}%`,
              "animation-delay": `${Math.random() * 2}s`,
              "animation-duration": `${2 + Math.random() * 2}s`,
              "font-size": `${14 + Math.random() * 14}px`,
              "--confetti-sway": `${(Math.random() - 0.5) * 80}px`,
            }}
          >
            {CONFETTI_EMOJI[Math.floor(Math.random() * CONFETTI_EMOJI.length)]}
          </div>
        ))}
      </div>
    </div>
  )
}
