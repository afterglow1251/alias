<script setup lang="ts">
import { computed } from "vue"
import Timer from "./Timer.vue"
import WordCard from "./WordCard.vue"
import { Button } from "../ui/button"
import { TEAM_COLORS } from "../../../shared/teams"
import { useGameStore } from "../../stores/game"
import { cn } from "../../lib/cn"

const store = useGameStore()

const isLastWord = computed(() => store.state.phase === "turn-last-word")
const showTeamPicker = computed(() => isLastWord.value && store.state.settings.lastWordForAll)

const guessed = computed(() => store.state.currentTurn?.wordsResolved.filter((w) => w.guessed).length ?? 0)
const skipped = computed(() => store.state.currentTurn?.wordsResolved.filter((w) => !w.guessed).length ?? 0)
const reversedWords = computed(
  () => [...(store.state.currentTurn?.wordsResolved ?? [])].reverse(),
)

function awardToTeam(teamIndex: number) {
  store.wordResult(true, teamIndex)
}

function nobodyGuessed() {
  store.wordResult(false)
}
</script>

<template>
  <div class="flex flex-col items-center gap-4 animate-fade-in">
    <Timer v-if="!isLastWord" :time-left="store.state.timeLeft" :total="store.state.settings.turnDuration" />

    <p v-if="isLastWord" class="text-xs text-muted-foreground rounded-full px-4 py-1.5 bg-secondary border animate-pulse">
      останнє слово!
    </p>
    <p v-else class="text-xs text-muted-foreground rounded-full px-4 py-1.5 bg-secondary border">
      поясни слово команді, не називай його!
    </p>

    <!-- Team picker for last word -->
    <template v-if="showTeamPicker">
      <div
        class="w-full max-w-sm h-44 rounded-lg bg-card border flex items-center justify-center"
      >
        <span class="text-3xl font-bold text-center px-6 break-words">{{ store.state.currentWord }}</span>
      </div>

      <p class="text-xs text-muted-foreground">хто вгадав?</p>
      <div class="flex flex-wrap justify-center gap-2 w-full max-w-sm">
        <Button
          v-for="(team, i) in store.state.teams"
          :key="i"
          size="sm"
          variant="outline"
          class="cursor-pointer"
          :style="{ color: TEAM_COLORS[i], borderColor: `${TEAM_COLORS[i]}66` }"
          @click="awardToTeam(i)"
        >
          {{ team.name }}
        </Button>
      </div>
      <Button
        variant="destructive"
        size="sm"
        class="cursor-pointer"
        @click="nobodyGuessed()"
      >
        ніхто
      </Button>
    </template>

    <!-- Normal word card -->
    <template v-else>
      <WordCard :word="store.state.currentWord" @guessed="store.wordResult(true)" @skip="store.wordResult(false)" />
    </template>

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
