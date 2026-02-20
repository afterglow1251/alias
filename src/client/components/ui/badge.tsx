import { type JSX, splitProps } from "solid-js"
import { cn } from "../../lib/cn"

interface BadgeProps extends JSX.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "team-a" | "team-b" | "success" | "danger"
}

export function Badge(props: BadgeProps) {
  const [local, rest] = splitProps(props, ["variant", "class", "children"])

  const variants = {
    default: "bg-accent/20 text-accent border-accent/30",
    "team-a": "bg-team-a/20 text-team-a border-team-a/30",
    "team-b": "bg-team-b/20 text-team-b border-team-b/30",
    success: "bg-success/20 text-success border-success/30",
    danger: "bg-danger/20 text-danger border-danger/30",
  }

  return (
    <span
      class={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        variants[local.variant || "default"],
        local.class,
      )}
      {...rest}
    >
      {local.children}
    </span>
  )
}
