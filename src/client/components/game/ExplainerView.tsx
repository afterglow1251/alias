import { Timer } from "./Timer"
import { Scoreboard } from "./Scoreboard"
import { WordCard } from "./WordCard"
import { gameState, wordResult } from "../../stores/game"

export function ExplainerView() {
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
        <p class="text-sm text-text-muted mb-1">Ви пояснюєте!</p>
        <p class="text-xs text-text-muted">Поясніть слово своїй команді, не використовуючи однокореневі слова</p>
      </div>

      <WordCard
        word={gameState.currentWord}
        onGuessed={() => wordResult(true)}
        onSkip={() => wordResult(false)}
      />

      <div class="text-sm text-text-muted">
        Вгадано: {gameState.currentTurn?.wordsResolved.filter((w) => w.guessed).length ?? 0} |
        Пропущено: {gameState.currentTurn?.wordsResolved.filter((w) => !w.guessed).length ?? 0}
      </div>
    </div>
  )
}
