<script setup lang="ts">
import { computed } from "vue"
import { cn } from "../../lib/cn"

const props = defineProps<{
  timeLeft: number
  total: number
}>()

const SIZE = 100
const STROKE = 6
const RADIUS = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

const percentage = computed(() => props.timeLeft / props.total)
const dashOffset = computed(() => CIRCUMFERENCE * (1 - percentage.value))
const isWarning = computed(() => props.timeLeft <= 10)
const isCritical = computed(() => props.timeLeft <= 5)

const strokeColor = computed(() => {
  if (isCritical.value) return "hsl(0 84% 60%)"
  if (isWarning.value) return "hsl(45 93% 58%)"
  return "hsl(0 0% 80%)"
})

const glowColor = computed(() => {
  if (isCritical.value) return "rgba(248, 113, 113, 0.3)"
  if (isWarning.value) return "rgba(251, 191, 36, 0.2)"
  return "rgba(200, 200, 200, 0.1)"
})
</script>

<template>
  <div class="relative flex items-center justify-center" :style="{ width: `${SIZE}px`, height: `${SIZE}px` }">
    <svg :width="SIZE" :height="SIZE" class="absolute -rotate-90">
      <!-- Background ring -->
      <circle
        :cx="SIZE / 2"
        :cy="SIZE / 2"
        :r="RADIUS"
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        :stroke-width="STROKE"
      />
      <!-- Animated ring -->
      <circle
        :cx="SIZE / 2"
        :cy="SIZE / 2"
        :r="RADIUS"
        fill="none"
        :stroke="strokeColor"
        :stroke-width="STROKE"
        stroke-linecap="round"
        :stroke-dasharray="CIRCUMFERENCE"
        :stroke-dashoffset="dashOffset"
        :style="{
          transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease',
          filter: `drop-shadow(0 0 8px ${glowColor})`,
        }"
      />
    </svg>
    <span
      :class="
        cn(
          'text-3xl font-bold font-mono tabular-nums',
          isCritical ? 'animate-timer-warning text-destructive' : isWarning ? 'text-amber-400' : 'text-foreground',
        )
      "
    >
      {{ timeLeft }}
    </span>
  </div>
</template>
