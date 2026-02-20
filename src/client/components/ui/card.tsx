import { type JSX, splitProps } from "solid-js"
import { cn } from "../../lib/cn"

interface CardProps extends JSX.HTMLAttributes<HTMLDivElement> {}

export function Card(props: CardProps) {
  const [local, rest] = splitProps(props, ["class", "children"])

  return (
    <div
      class={cn("rounded-2xl p-6 glass inner-glow", local.class)}
      {...rest}
    >
      {local.children}
    </div>
  )
}
