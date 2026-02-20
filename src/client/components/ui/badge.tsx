import { type JSX, splitProps } from "solid-js"
import { cn } from "../../lib/cn"

interface BadgeProps extends JSX.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "team-a" | "team-b" | "success" | "danger"
}

export function Badge(props: BadgeProps) {
  const [local, rest] = splitProps(props, ["variant", "class", "children"])

  const variants = {
    default: "bg-accent/15 text-accent border-accent/25 shadow-[0_0_8px_rgba(125,211,252,0.1)]",
    "team-a": "bg-team-a/15 text-team-a border-team-a/25 shadow-[0_0_8px_rgba(96,165,250,0.1)]",
    "team-b": "bg-team-b/15 text-team-b border-team-b/25 shadow-[0_0_8px_rgba(251,191,36,0.1)]",
    success: "bg-success/15 text-success border-success/25 shadow-[0_0_8px_rgba(52,211,153,0.1)]",
    danger: "bg-danger/15 text-danger border-danger/25 shadow-[0_0_8px_rgba(251,113,133,0.1)]",
  }

  return (
    <span
      class={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm",
        variants[local.variant || "default"],
        local.class,
      )}
      {...rest}
    >
      {local.children}
    </span>
  )
}
