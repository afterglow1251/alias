import { Show } from "solid-js"
import { cn } from "../../lib/cn"

interface WordCardProps {
  word: string | null
  onGuessed: () => void
  onSkip: () => void
}

export function WordCard(props: WordCardProps) {
  return (
    <div class="flex flex-col items-center gap-5">
      <Show
        when={props.word}
        fallback={
          <div class="w-full max-w-xs h-48 rounded-2xl glass-light border border-border flex items-center justify-center">
            <span class="text-2xl animate-waddle">🐧</span>
          </div>
        }
      >
        <div class="w-full max-w-xs h-48 rounded-2xl glass inner-glow border border-accent/20 flex items-center justify-center animate-scale-in relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-b from-accent/[0.04] to-transparent" />
          <span class="text-3xl md:text-4xl font-bold text-center px-6 relative z-10">{props.word}</span>
        </div>
      </Show>

      <div class="flex gap-3 w-full max-w-xs">
        <button
          onClick={props.onSkip}
          class={cn(
            "flex-1 py-4 rounded-xl text-lg font-bold transition-all active:scale-[0.97] cursor-pointer",
            "bg-gradient-to-b from-danger/20 to-danger/8 border border-danger/25 text-danger hover:from-danger/30 hover:to-danger/12 hover:shadow-[0_0_16px_rgba(251,113,133,0.12)]",
          )}
        >
          пропустити
        </button>
        <button
          onClick={props.onGuessed}
          class={cn(
            "flex-1 py-4 rounded-xl text-lg font-bold transition-all active:scale-[0.97] cursor-pointer",
            "bg-gradient-to-b from-success/20 to-success/8 border border-success/25 text-success hover:from-success/30 hover:to-success/12 hover:shadow-[0_0_16px_rgba(52,211,153,0.12)]",
          )}
        >
          вгадали!
        </button>
      </div>
    </div>
  )
}
