import { Show } from "solid-js"
import { cn } from "../../lib/cn"

interface WordCardProps {
  word: string | null
  onGuessed: () => void
  onSkip: () => void
}

export function WordCard(props: WordCardProps) {
  return (
    <div class="flex flex-col items-center gap-6">
      <Show
        when={props.word}
        fallback={
          <div class="w-full max-w-sm h-48 rounded-2xl bg-surface-light border border-border flex items-center justify-center">
            <span class="text-text-muted">Очікуємо слово...</span>
          </div>
        }
      >
        <div class="w-full max-w-sm h-48 rounded-2xl bg-surface border-2 border-accent/30 flex items-center justify-center animate-flip-in animate-pulse-glow">
          <span class="text-3xl md:text-4xl font-bold text-center px-4">{props.word}</span>
        </div>
      </Show>

      <div class="flex gap-4 w-full max-w-sm">
        <button
          onClick={props.onSkip}
          class={cn(
            "flex-1 py-4 rounded-xl text-lg font-bold transition-all active:scale-95 cursor-pointer",
            "bg-danger/20 border-2 border-danger/40 text-danger hover:bg-danger/30",
          )}
        >
          Пропустити ✗
        </button>
        <button
          onClick={props.onGuessed}
          class={cn(
            "flex-1 py-4 rounded-xl text-lg font-bold transition-all active:scale-95 cursor-pointer",
            "bg-success/20 border-2 border-success/40 text-success hover:bg-success/30",
          )}
        >
          Вгадали ✓
        </button>
      </div>
    </div>
  )
}
