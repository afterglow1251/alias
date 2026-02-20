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

export function GameOver(props: GameOverProps) {
  const winnerName = () => (props.winner === "A" ? "Сині" : "Жовті")

  return (
    <div class="flex flex-col items-center gap-6 animate-fade-in">
      <div class="text-6xl animate-countdown">🏆</div>

      <h2 class={cn("text-3xl font-bold", props.winner === "A" ? "text-team-a" : "text-team-b")}>
        {winnerName()} перемогли!
      </h2>

      <Scoreboard
        teamA={props.teamA}
        teamB={props.teamB}
        scoreToWin={props.scoreToWin}
      />

      <div class="flex gap-4 mt-4">
        {props.isHost && (
          <Button variant="default" size="lg" onClick={props.onPlayAgain}>
            Грати ще
          </Button>
        )}
        <Button variant="outline" size="lg" onClick={props.onBackToLobby}>
          До головної
        </Button>
      </div>

      {!props.isHost && (
        <p class="text-sm text-text-muted">Очікуємо на хоста...</p>
      )}

      {/* Confetti */}
      <div class="fixed inset-0 pointer-events-none overflow-hidden z-50">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            class="absolute animate-confetti"
            style={{
              left: `${Math.random() * 100}%`,
              "animation-delay": `${Math.random() * 2}s`,
              "animation-duration": `${2 + Math.random() * 2}s`,
              "font-size": `${16 + Math.random() * 16}px`,
            }}
          >
            {["🎉", "🎊", "⭐", "✨", "🥳"][Math.floor(Math.random() * 5)]}
          </div>
        ))}
      </div>
    </div>
  )
}
