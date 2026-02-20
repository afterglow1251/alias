import { type JSX, splitProps } from "solid-js"
import { cn } from "../../lib/cn"

interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "team-a" | "team-b" | "success" | "danger"
  size?: "sm" | "md" | "lg"
}

export function Button(props: ButtonProps) {
  const [local, rest] = splitProps(props, ["variant", "size", "class", "children"])

  const variants = {
    default:
      "bg-gradient-to-b from-accent/25 to-accent/10 border-accent/30 text-accent hover:from-accent/35 hover:to-accent/15 hover:border-accent/50 hover:shadow-[0_0_20px_rgba(125,211,252,0.15)]",
    outline:
      "border border-border bg-white/[0.03] hover:bg-white/[0.06] text-text backdrop-blur-sm",
    ghost: "bg-transparent hover:bg-white/[0.05] text-text-muted hover:text-text",
    "team-a":
      "bg-gradient-to-b from-team-a/25 to-team-a/10 border-team-a/30 text-team-a hover:from-team-a/35 hover:to-team-a/15 hover:shadow-[0_0_20px_rgba(96,165,250,0.15)]",
    "team-b":
      "bg-gradient-to-b from-team-b/25 to-team-b/10 border-team-b/30 text-team-b hover:from-team-b/35 hover:to-team-b/15 hover:shadow-[0_0_20px_rgba(251,191,36,0.15)]",
    success:
      "bg-gradient-to-b from-success/25 to-success/10 border-success/30 text-success hover:from-success/35 hover:to-success/15 hover:shadow-[0_0_20px_rgba(52,211,153,0.15)]",
    danger:
      "bg-gradient-to-b from-danger/25 to-danger/10 border-danger/30 text-danger hover:from-danger/35 hover:to-danger/15 hover:shadow-[0_0_20px_rgba(251,113,133,0.15)]",
  }

  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-lg",
    md: "px-4 py-2.5 text-sm rounded-xl",
    lg: "px-6 py-3 text-base rounded-xl",
  }

  return (
    <button
      class={cn(
        "inline-flex items-center justify-center font-medium border transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.97] hover:-translate-y-[1px] backdrop-blur-sm",
        variants[local.variant || "default"],
        sizes[local.size || "md"],
        local.class,
      )}
      {...rest}
    >
      {local.children}
    </button>
  )
}
