import { createSignal, For } from "solid-js"
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
    <button
      onClick={copyCode}
      class={cn(
        "flex items-center gap-1.5 rounded-xl glass inner-glow px-3 py-2 font-mono text-lg font-bold tracking-widest transition-all hover:border-accent/40 hover:shadow-[0_0_16px_rgba(125,211,252,0.1)] cursor-pointer",
        copied() && "border-success/50 text-success shadow-[0_0_16px_rgba(52,211,153,0.15)]",
      )}
    >
      <For each={props.code.split("")}>
        {(letter) => (
          <span class="inline-block">{letter}</span>
        )}
      </For>
      <span class="text-sm ml-1">{copied() ? "ok!" : "📋"}</span>
    </button>
  )
}
