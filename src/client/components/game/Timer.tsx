import { cn } from "../../lib/cn"

interface TimerProps {
  timeLeft: number
  total: number
}

export function Timer(props: TimerProps) {
  const percentage = () => (props.timeLeft / props.total) * 100
  const isWarning = () => props.timeLeft <= 10
  const isCritical = () => props.timeLeft <= 5

  return (
    <div class="flex flex-col items-center gap-2">
      <div
        class={cn(
          "text-4xl font-bold font-mono tabular-nums",
          isCritical() ? "animate-timer-warning text-danger" : isWarning() ? "text-warning" : "text-text",
        )}
      >
        {props.timeLeft}
      </div>
      <div class="w-full h-2 rounded-full bg-surface-light overflow-hidden">
        <div
          class={cn(
            "h-full rounded-full transition-all duration-1000 ease-linear",
            isCritical() ? "bg-danger" : isWarning() ? "bg-warning" : "bg-accent",
          )}
          style={{ width: `${percentage()}%` }}
        />
      </div>
    </div>
  )
}
