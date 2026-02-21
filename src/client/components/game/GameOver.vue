<script setup lang="ts">
import { computed } from "vue"
import type { TeamState } from "../../../shared/types"
import { TEAM_COLORS } from "../../../shared/teams"
import { Button } from "../ui/button"

const props = defineProps<{
  winner: number
  teams: TeamState[]
  scoreToWin: number
  isHost: boolean
}>()

defineEmits<{
  playAgain: []
  backToLobby: []
}>()

const winnerColor = computed(() => TEAM_COLORS[props.winner] ?? "#888")
const winnerName = computed(() => props.teams[props.winner]?.name ?? "???")

const CONFETTI_EMOJI = ["🎉", "⭐", "✨", "🎊", "🏆", "💎", "🔥", "💫"]

const confettiItems = Array.from({ length: 30 }, () => ({
  left: `${Math.random() * 100}%`,
  animationDelay: `${Math.random() * 2}s`,
  animationDuration: `${2 + Math.random() * 2}s`,
  fontSize: `${14 + Math.random() * 14}px`,
  sway: `${(Math.random() - 0.5) * 80}px`,
  emoji: CONFETTI_EMOJI[Math.floor(Math.random() * CONFETTI_EMOJI.length)],
}))
</script>

<template>
  <div class="flex flex-col items-center gap-6 animate-fade-in relative">
    <div
      class="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full animate-pulse pointer-events-none"
      :style="{
        background: `radial-gradient(circle, ${winnerColor}4d, transparent 70%)`,
        filter: 'blur(40px)',
      }"
    />

    <div class="relative animate-trophy">
      <div class="text-6xl">👑</div>
      <div class="text-4xl -mt-2 text-center">🏆</div>
    </div>

    <h2
      class="text-3xl font-extrabold"
      :style="{
        color: winnerColor,
        textShadow: `0 0 30px ${winnerColor}4d`,
      }"
    >
      {{ winnerName }} перемогли!
    </h2>

    <div class="flex gap-3 mt-2">
      <Button v-if="isHost" size="lg" @click="$emit('playAgain')">
        ще раз!
      </Button>
      <Button variant="outline" size="lg" @click="$emit('backToLobby')">
        назад
      </Button>
    </div>

    <p v-if="!isHost" class="text-xs text-muted-foreground">чекаємо на хоста...</p>

    <div class="fixed inset-0 pointer-events-none overflow-hidden z-50">
      <div
        v-for="(item, idx) in confettiItems"
        :key="idx"
        class="absolute animate-confetti"
        :style="{
          left: item.left,
          animationDelay: item.animationDelay,
          animationDuration: item.animationDuration,
          fontSize: item.fontSize,
          '--confetti-sway': item.sway,
        }"
      >
        {{ item.emoji }}
      </div>
    </div>
  </div>
</template>
