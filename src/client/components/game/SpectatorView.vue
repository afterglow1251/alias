<script setup lang="ts">
import { computed } from "vue"
import Timer from "./Timer.vue"
import { useGameStore } from "../../stores/game"
import { cn } from "../../lib/cn"

const store = useGameStore()

const currentTeamName = computed(() => {
  const team = store.state.currentTurn?.team
  if (team == null) return ""
  return store.state.teams[team]?.name ?? ""
})

const reversedWords = computed(
  () => [...(store.state.currentTurn?.wordsResolved ?? [])].reverse(),
)
</script>

<template>
  <div class="flex flex-col items-center gap-4 animate-fade-in">
    <Timer :time-left="store.state.timeLeft" :total="store.state.settings.turnDuration" />

    <div class="text-center">
      <p class="text-xs text-muted-foreground">
        {{ currentTeamName }} грають
      </p>
      <p class="text-xs text-muted-foreground mt-0.5">
        {{ store.state.currentTurn?.explainer.nickname }} пояснює
      </p>
    </div>

    <div class="w-full max-w-sm space-y-1.5">
      <div
        v-for="(result, idx) in reversedWords"
        :key="idx"
        :class="cn(
          'flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm',
          result.guessed ? 'bg-success/10' : 'bg-destructive/10',
        )"
      >
        <span :class="result.guessed ? 'text-success' : 'text-destructive'" class="text-xs">
          {{ result.guessed ? '✓' : '✕' }}
        </span>
        <span :class="!result.guessed && 'line-through text-muted-foreground'">{{ result.word }}</span>
      </div>
    </div>
  </div>
</template>
