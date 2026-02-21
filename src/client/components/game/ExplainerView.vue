<script setup lang="ts">
import { computed } from "vue"
import Timer from "./Timer.vue"
import WordCard from "./WordCard.vue"
import { useGameStore } from "../../stores/game"
import { cn } from "../../lib/cn"

const store = useGameStore()

const guessed = computed(() => store.state.currentTurn?.wordsResolved.filter((w) => w.guessed).length ?? 0)
const skipped = computed(() => store.state.currentTurn?.wordsResolved.filter((w) => !w.guessed).length ?? 0)
const reversedWords = computed(
  () => [...(store.state.currentTurn?.wordsResolved ?? [])].reverse(),
)
</script>

<template>
  <div class="flex flex-col items-center gap-4 animate-fade-in">
    <Timer :time-left="store.state.timeLeft" :total="store.state.settings.turnDuration" />

    <p class="text-xs text-muted-foreground rounded-full px-4 py-1.5 bg-secondary border">
      поясни слово команді, не називай його!
    </p>

    <WordCard :word="store.state.currentWord" @guessed="store.wordResult(true)" @skip="store.wordResult(false)" />

    <div class="flex items-center gap-2">
      <span class="rounded-full px-3 py-1 text-xs font-semibold text-success bg-success/10 border border-success/20">
        +{{ guessed }}
      </span>
      <span class="rounded-full px-3 py-1 text-xs font-semibold text-destructive bg-destructive/10 border border-destructive/20">
        -{{ skipped }}
      </span>
    </div>

    <div v-if="reversedWords.length" class="w-full max-w-sm space-y-1.5">
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
