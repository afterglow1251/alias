<script setup lang="ts">
import { computed } from "vue"
import type { TeamState } from "../../../shared/types"
import { TEAM_COLORS } from "../../../shared/teams"
import { Button } from "../ui/button"
import { cn } from "../../lib/cn"
import { clientId } from "../../stores/auth"

const props = defineProps<{
  team: number
  state: TeamState
  myTeam: number | null
  isHost?: boolean
  disabled?: boolean
  scoreToWin?: number
  isCurrentTurn?: boolean
}>()

const emit = defineEmits<{
  join: []
  leave: []
  kick: [clientId: string]
  nameChange: [name: string]
}>()

const isMyTeam = computed(() => props.myTeam === props.team)
const canEditName = computed(() => isMyTeam.value && !props.disabled)
const teamColor = computed(() => TEAM_COLORS[props.team] ?? "#888")
const isGameMode = computed(() => props.scoreToWin != null)
const scorePercent = computed(() => {
  if (!props.scoreToWin) return 0
  return Math.min(100, (props.state.score / props.scoreToWin) * 100)
})
</script>

<template>
  <div
    :class="cn(
      'flex flex-col rounded-lg bg-card border overflow-hidden transition-all',
      !isGameMode && !disabled && 'min-h-[10rem]',
    )"
    :style="isCurrentTurn ? {
      borderColor: `${teamColor}66`,
      boxShadow: `0 0 16px ${teamColor}1a`,
    } : undefined"
  >
    <!-- Colored top strip -->
    <div class="h-1" :style="{ backgroundColor: teamColor }" />

    <div class="p-3 flex flex-col gap-2">
      <!-- Header: name + count -->
      <div class="flex items-center justify-between">
        <template v-if="canEditName">
          <input
            type="text"
            :value="state.name"
            maxlength="16"
            class="text-sm font-semibold bg-transparent border-b border-dashed border-border outline-none w-full mr-2"
            :style="{ color: teamColor }"
            @input="emit('nameChange', ($event.target as HTMLInputElement).value)"
          />
        </template>
        <template v-else>
          <span class="text-sm font-semibold border-b border-transparent" :style="{ color: teamColor }">
            {{ state.name }}
          </span>
        </template>
        <span
          v-if="!isGameMode"
          class="text-xs tabular-nums min-w-5 text-center font-medium text-muted-foreground"
        >
          {{ state.players.length }}
        </span>
      </div>

      <!-- Score (game mode) -->
      <template v-if="isGameMode">
        <div class="text-center py-1">
          <span class="text-3xl font-bold tabular-nums" :style="{ color: teamColor }">
            {{ state.score }}
          </span>
        </div>
        <div class="w-full h-1 rounded-full bg-secondary overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-500"
            :style="{
              width: `${scorePercent}%`,
              backgroundColor: teamColor,
            }"
          />
        </div>
      </template>

      <!-- Player list -->
      <div :class="isGameMode ? 'space-y-0.5 mt-1' : 'space-y-1 min-h-[52px]'">
        <div
          v-for="player in state.players"
          :key="player.clientId"
          :class="cn(
            'flex items-center gap-2 rounded-md text-xs',
            isGameMode ? 'px-1.5 py-0.5' : 'px-2.5 py-1 text-sm',
            player.clientId === clientId ? 'bg-secondary font-medium' : '',
            !player.connected && 'opacity-40',
          )"
        >
          <span
            :class="cn(
              'w-1.5 h-1.5 rounded-full shrink-0',
              player.connected ? 'bg-success' : 'bg-muted-foreground',
            )"
          />
          <span class="truncate">{{ player.nickname }}</span>
          <span v-if="player.isHost" class="text-[10px] ml-auto">👑</span>
          <button
            v-if="isHost && !player.isHost && player.clientId !== clientId && !disabled"
            class="ml-auto text-xs text-muted-foreground hover:text-destructive transition-colors px-0.5 cursor-pointer"
            @click="emit('kick', player.clientId)"
            title="вигнати"
          >
            ✕
          </button>
        </div>
        <p v-if="state.players.length === 0 && !isGameMode" class="text-xs text-muted-foreground text-center py-3">
          порожньо
        </p>
      </div>

      <!-- Action (lobby mode only) -->
      <Button
        v-if="!disabled"
        variant="outline"
        size="sm"
        class="w-full"
        :class="isMyTeam && 'text-muted-foreground'"
        :style="!isMyTeam ? { color: teamColor, borderColor: `${teamColor}40` } : undefined"
        @click="isMyTeam ? emit('leave') : emit('join')"
      >
        {{ isMyTeam ? 'вийти' : 'приєднатись' }}
      </Button>
    </div>
  </div>
</template>
