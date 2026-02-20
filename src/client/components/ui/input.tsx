import { type JSX, splitProps } from "solid-js"
import { cn } from "../../lib/cn"

interface InputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {}

export function Input(props: InputProps) {
  const [local, rest] = splitProps(props, ["class"])

  return (
    <input
      class={cn(
        "w-full rounded-xl border border-border bg-white/[0.04] backdrop-blur-sm px-4 py-3 text-text shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/40 focus:shadow-[0_0_16px_rgba(125,211,252,0.1)] transition-all duration-200",
        local.class,
      )}
      {...rest}
    />
  )
}
