import { type JSX, splitProps } from "solid-js"
import { cn } from "../../lib/cn"

interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "team-a" | "team-b" | "success" | "danger"
  size?: "sm" | "md" | "lg"
}

export function Button(props: ButtonProps) {
  const [local, rest] = splitProps(props, ["variant", "size", "class", "children"])

  const variants = {
    default: "bg-accent hover:bg-accent/80 text-white",
    outline: "border border-border bg-transparent hover:bg-surface-light text-text",
    ghost: "bg-transparent hover:bg-surface-light text-text",
    "team-a": "bg-team-a hover:bg-team-a/80 text-white",
    "team-b": "bg-team-b hover:bg-team-b/80 text-black",
    success: "bg-success hover:bg-success/80 text-white",
    danger: "bg-danger hover:bg-danger/80 text-white",
  }

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  }

  return (
    <button
      class={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-95",
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
