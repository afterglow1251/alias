<script setup lang="ts">
import { computed } from "vue"
import Timer from "./Timer.vue"
import { useGameStore } from "../../stores/game"
import { cn } from "../../lib/cn"

const store = useGameStore()

const reversedWords = computed(
  () => [...(store.state.currentTurn?.wordsResolved ?? [])].reverse(),
)
</script>

<template>
  <div class="flex flex-col items-center gap-4 animate-fade-in">
    <Timer :time-left="store.state.timeLeft" :total="store.state.settings.turnDuration" />

    <div class="text-center">
      <p class="text-sm font-medium">вгадуйте!</p>
      <p class="text-xs text-muted-foreground mt-0.5">
        {{ store.state.currentTurn?.explainer.nickname }} пояснює
      </p>
    </div>

    <div class="w-full max-w-sm space-y-1.5">
      <div
        v-for="(result, idx) in reversedWords"
        :key="idx"
        :class="cn(
          'flex items-center justify-between rounded-lg px-3 py-1.5 text-xs animate-slide-up bg-white/[0.04]',
          result.guessed
            ? 'border-l-2 border-l-success text-success'
            : 'border-l-2 border-l-destructive text-destructive',
        )"
      >
        <span>{{ result.word }}</span>
      </div>
    </div>
  </div>
</template>
