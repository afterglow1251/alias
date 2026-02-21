<script setup lang="ts">
import { computed } from "vue"
import Timer from "./Timer.vue"
import WordCard from "./WordCard.vue"
import { useGameStore } from "../../stores/game"

const store = useGameStore()

const guessed = computed(() => store.state.currentTurn?.wordsResolved.filter((w) => w.guessed).length ?? 0)
const skipped = computed(() => store.state.currentTurn?.wordsResolved.filter((w) => !w.guessed).length ?? 0)
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
  </div>
</template>
