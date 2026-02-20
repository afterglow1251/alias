import { type JSX, splitProps } from "solid-js"
import { cn } from "../../lib/cn"

interface CardProps extends JSX.HTMLAttributes<HTMLDivElement> {}

export function Card(props: CardProps) {
  const [local, rest] = splitProps(props, ["class", "children"])

  return (
    <div
      class={cn("rounded-xl border border-border bg-surface p-6", local.class)}
      {...rest}
    >
      {local.children}
    </div>
  )
}
