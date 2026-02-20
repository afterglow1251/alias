import { cn } from "../../lib/cn"

interface TimerProps {
  timeLeft: number
  total: number
}

export function Timer(props: TimerProps) {
  const SIZE = 100
  const STROKE = 6
  const RADIUS = (SIZE - STROKE) / 2
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS

  const percentage = () => props.timeLeft / props.total
  const dashOffset = () => CIRCUMFERENCE * (1 - percentage())
  const isWarning = () => props.timeLeft <= 10
  const isCritical = () => props.timeLeft <= 5

  const strokeColor = () => {
    if (isCritical()) return "#fb7185"
    if (isWarning()) return "#fbbf24"
    return "#7dd3fc"
  }

  const glowColor = () => {
    if (isCritical()) return "rgba(251, 113, 133, 0.4)"
    if (isWarning()) return "rgba(251, 191, 36, 0.3)"
    return "rgba(125, 211, 252, 0.3)"
  }

  return (
    <div class="relative flex items-center justify-center" style={{ width: `${SIZE}px`, height: `${SIZE}px` }}>
      <svg width={SIZE} height={SIZE} class="absolute -rotate-90">
        {/* Background ring */}
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          stroke-width={STROKE}
        />
        {/* Animated ring */}
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={strokeColor()}
          stroke-width={STROKE}
          stroke-linecap="round"
          stroke-dasharray={CIRCUMFERENCE}
          stroke-dashoffset={dashOffset()}
          style={{
            transition: "stroke-dashoffset 1s linear, stroke 0.5s ease",
            filter: `drop-shadow(0 0 8px ${glowColor()})`,
          }}
        />
      </svg>
      <span
        class={cn(
          "text-3xl font-bold font-mono tabular-nums",
          isCritical() ? "animate-timer-warning text-danger" : isWarning() ? "text-warning" : "text-accent",
        )}
      >
        {props.timeLeft}
      </span>
    </div>
  )
}
