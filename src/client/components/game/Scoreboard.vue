<script setup lang="ts">
import type { TeamState } from "../../../shared/types"
import { TEAM_COLORS } from "../../../shared/teams"
import { cn } from "../../lib/cn"

const props = defineProps<{
  teams: TeamState[]
  scoreToWin: number
  currentTeam?: number | null
}>()
</script>

<template>
  <div class="flex flex-col items-center gap-2 w-full">
    <div class="flex items-center justify-center gap-2 w-full flex-wrap">
      <template v-for="(team, i) in teams" :key="i">
        <span v-if="i > 0" class="text-muted-foreground text-xs font-medium">vs</span>
        <div
          :class="
            cn(
              'flex flex-col items-center rounded-lg px-4 py-2 transition-all min-w-[80px] bg-card border',
            )
          "
          :style="
            currentTeam === i
              ? {
                  borderColor: `${TEAM_COLORS[i] ?? '#888'}66`,
                  boxShadow: `0 0 20px ${TEAM_COLORS[i] ?? '#888'}26`,
                }
              : undefined
          "
        >
          <span class="text-xs" :style="{ color: TEAM_COLORS[i] ?? '#888' }">{{ team.name }}</span>
          <span class="text-2xl font-bold tabular-nums" :style="{ color: TEAM_COLORS[i] ?? '#888' }">{{ team.score }}</span>
          <div class="w-full h-1 rounded-full bg-white/[0.06] mt-1 overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-500"
              :style="{
                width: `${Math.min(100, (team.score / scoreToWin) * 100)}%`,
                backgroundColor: `${TEAM_COLORS[i] ?? '#888'}80`,
              }"
            />
          </div>
        </div>
      </template>
    </div>

    <span class="text-[10px] text-muted-foreground">перемога: {{ scoreToWin }} очок</span>
  </div>
</template>
