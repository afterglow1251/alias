import { createSignal } from "solid-js"
import { cn } from "../../lib/cn"

interface RoomCodeProps {
  code: string
}

export function RoomCode(props: RoomCodeProps) {
  const [copied, setCopied] = createSignal(false)

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(props.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
    }
  }

  return (
    <div class="flex items-center gap-3">
      <div class="text-sm text-text-muted">Код кімнати:</div>
      <button
        onClick={copyCode}
        class={cn(
          "flex items-center gap-2 rounded-lg border border-border bg-surface-light px-4 py-2 font-mono text-xl font-bold tracking-widest transition-all hover:border-accent cursor-pointer",
          copied() && "border-success text-success",
        )}
      >
        {props.code}
        <span class="text-sm">{copied() ? "✓" : "📋"}</span>
      </button>
    </div>
  )
}
