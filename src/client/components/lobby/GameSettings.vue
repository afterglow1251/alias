<script setup lang="ts">
import type { GameSettings as GameSettingsType } from "../../../shared/types"
import { MIN_TEAMS, MAX_TEAMS } from "../../../shared/teams"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"

const props = defineProps<{
  settings: GameSettingsType
  isHost: boolean
}>()

const emit = defineEmits<{
  update: [settings: Partial<GameSettingsType>]
}>()

const TIMER_OPTIONS = [30, 45, 60, 90].map((n) => ({ value: String(n), label: `${n}с` }))
const SCORE_OPTIONS = [20, 30, 40, 50].map((n) => ({ value: String(n), label: String(n) }))
const TEAM_COUNT_OPTIONS = Array.from(
  { length: MAX_TEAMS - MIN_TEAMS + 1 },
  (_, i) => ({ value: String(i + MIN_TEAMS), label: String(i + MIN_TEAMS) }),
)
</script>

<template>
  <div class="space-y-2.5">
    <div class="flex items-center justify-between gap-3">
      <span class="text-sm text-muted-foreground">Команди</span>
      <Select
        :model-value="String(settings.teamCount)"
        @update:model-value="emit('update', { teamCount: Number($event) })"
        :disabled="!isHost"
      >
        <SelectTrigger class="w-[80px]">
          <SelectValue placeholder="..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="opt in TEAM_COUNT_OPTIONS" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div class="flex items-center justify-between gap-3">
      <span class="text-sm text-muted-foreground">Час</span>
      <Select
        :model-value="String(settings.turnDuration)"
        @update:model-value="emit('update', { turnDuration: Number($event) })"
        :disabled="!isHost"
      >
        <SelectTrigger class="w-[80px]">
          <SelectValue placeholder="..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="opt in TIMER_OPTIONS" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div class="flex items-center justify-between gap-3">
      <span class="text-sm text-muted-foreground">Очки</span>
      <Select
        :model-value="String(settings.scoreToWin)"
        @update:model-value="emit('update', { scoreToWin: Number($event) })"
        :disabled="!isHost"
      >
        <SelectTrigger class="w-[80px]">
          <SelectValue placeholder="..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="opt in SCORE_OPTIONS" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div class="flex items-center justify-between gap-3">
      <span class="text-sm text-muted-foreground">Штраф за пропуск</span>
      <button
        @click="isHost && emit('update', { skipPenalty: !settings.skipPenalty })"
        :class="[
          'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
          settings.skipPenalty ? 'bg-primary' : 'bg-muted',
          !isHost && 'opacity-50 cursor-not-allowed',
        ]"
        role="switch"
        :aria-checked="settings.skipPenalty"
      >
        <span
          :class="[
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow ring-0 transition-transform',
            settings.skipPenalty ? 'translate-x-5' : 'translate-x-0',
          ]"
        />
      </button>
    </div>
    <div class="flex items-center justify-between gap-3">
      <span class="text-sm text-muted-foreground">Останнє слово</span>
      <button
        @click="isHost && emit('update', { lastWordInfinite: !settings.lastWordInfinite })"
        :class="[
          'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
          settings.lastWordInfinite ? 'bg-primary' : 'bg-muted',
          !isHost && 'opacity-50 cursor-not-allowed',
        ]"
        role="switch"
        :aria-checked="settings.lastWordInfinite"
      >
        <span
          :class="[
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow ring-0 transition-transform',
            settings.lastWordInfinite ? 'translate-x-5' : 'translate-x-0',
          ]"
        />
      </button>
    </div>
    <p v-if="!isHost" class="text-[11px] text-muted-foreground text-center pt-1">
      тільки хост може змінювати
    </p>
  </div>
</template>
