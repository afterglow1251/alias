import { Timer } from "./Timer"
import { Scoreboard } from "./Scoreboard"
import { WordCard } from "./WordCard"
import { gameState, wordResult } from "../../stores/game"

export function ExplainerView() {
  const guessed = () => gameState.currentTurn?.wordsResolved.filter((w) => w.guessed).length ?? 0
  const skipped = () => gameState.currentTurn?.wordsResolved.filter((w) => !w.guessed).length ?? 0

  return (
    <div class="flex flex-col items-center gap-5 animate-fade-in">
      <Scoreboard
        teamA={gameState.teamA}
        teamB={gameState.teamB}
        scoreToWin={gameState.settings.scoreToWin}
        currentTeam={gameState.currentTurn?.team}
      />

      <Timer timeLeft={gameState.timeLeft} total={gameState.settings.turnDuration} />

      <p class="text-xs text-text-muted text-center glass-light rounded-full px-4 py-1.5 border border-white/[0.04]">
        поясни слово команді, не називай його! 🐧
      </p>

      <WordCard
        word={gameState.currentWord}
        onGuessed={() => wordResult(true)}
        onSkip={() => wordResult(false)}
      />

      <div class="flex items-center gap-2">
        <span class="glass-light rounded-full px-3 py-1 text-xs font-semibold text-success border border-success/20">
          +{guessed()}
        </span>
        <span class="glass-light rounded-full px-3 py-1 text-xs font-semibold text-danger border border-danger/20">
          -{skipped()}
        </span>
      </div>
    </div>
  )
}
