<script setup lang="ts">
import { computed } from "vue"
import type { TurnInfo, TeamState } from "../../../shared/types"
import { TEAM_COLORS } from "../../../shared/teams"
import { Button } from "../ui/button"
import { useGameStore } from "../../stores/game"
import { cn } from "../../lib/cn"

const props = defineProps<{
  turn: TurnInfo
  teams: TeamState[]
  nextTeam: number
  scoreToWin: number
}>()

const store = useGameStore()

const guessed = computed(() => props.turn.wordsResolved.filter((w) => w.guessed).length)
const skipped = computed(() => props.turn.wordsResolved.filter((w) => !w.guessed).length)
const nextTeamColor = computed(() => TEAM_COLORS[props.nextTeam] ?? "#888")
const nextTeamName = computed(() => props.teams[props.nextTeam]?.name ?? "???")
const turnTeamName = computed(() => props.teams[props.turn.team]?.name ?? "???")

function toggleWord(index: number) {
  if (!store.isExplainer) return
  const word = props.turn.wordsResolved[index]
  if (!word) return
  store.editWordResult(index, !word.guessed)
}
</script>

<template>
  <div class="flex flex-col items-center gap-4 animate-fade-in">
    <div class="text-center">
      <p class="text-xs text-muted-foreground">
        {{ turn.explainer.nickname }} — {{ turnTeamName }}
      </p>
      <div class="flex items-center justify-center gap-3 mt-2">
        <span class="rounded-full px-3 py-1 text-sm font-semibold text-success bg-success/10 border border-success/20">
          +{{ guessed }}
        </span>
        <span class="rounded-full px-3 py-1 text-sm font-semibold text-destructive bg-destructive/10 border border-destructive/20">
          -{{ skipped }}
        </span>
        <span
          :class="cn(
            'text-4xl font-bold tabular-nums',
            turn.scoreGained >= 0 ? 'text-foreground' : 'text-destructive',
          )"
        >
          {{ turn.scoreGained > 0 ? '+' : '' }}{{ turn.scoreGained }}
        </span>
      </div>
    </div>

    <div class="w-full max-w-sm space-y-1 max-h-44 overflow-y-auto">
      <div
        v-for="(result, i) in turn.wordsResolved"
        :key="i"
        :class="cn(
          'flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm',
          result.guessed ? 'bg-success/10' : 'bg-destructive/10',
          store.isExplainer && 'cursor-pointer active:scale-[0.98] transition-transform',
        )"
        @click="toggleWord(i)"
      >
        <span :class="result.guessed ? 'text-success' : 'text-destructive'" class="text-xs">
          {{ result.guessed ? '✓' : '✕' }}
        </span>
        <span :class="!result.guessed && 'line-through text-muted-foreground'">{{ result.word }}</span>
      </div>
    </div>

    <p v-if="store.isExplainer" class="text-[11px] text-muted-foreground">
      натисніть на слово щоб змінити результат
    </p>

    <Button size="lg" class="w-full max-w-sm" @click="store.advanceTurn()">
      Далі
    </Button>

    <div
      class="rounded-full px-4 py-1.5 text-xs font-medium border bg-card"
      :style="{ color: nextTeamColor, borderColor: `${nextTeamColor}33` }"
    >
      далі: {{ nextTeamName }}
    </div>
  </div>
</template>
