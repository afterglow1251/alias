import { type JSX, splitProps } from "solid-js"
import { cn } from "../../lib/cn"

interface InputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {}

export function Input(props: InputProps) {
  const [local, rest] = splitProps(props, ["class"])

  return (
    <input
      class={cn(
        "w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all duration-200",
        local.class,
      )}
      {...rest}
    />
  )
}
