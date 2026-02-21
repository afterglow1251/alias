<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed } from "vue"
import { useRouter, useRoute } from "vue-router"
import { Button } from "../components/ui/button"
import RoomCode from "../components/lobby/RoomCode.vue"
import TeamPanel from "../components/lobby/TeamPanel.vue"
import GameSettings from "../components/lobby/GameSettings.vue"
import ExplainerView from "../components/game/ExplainerView.vue"
import GuesserView from "../components/game/GuesserView.vue"
import SpectatorView from "../components/game/SpectatorView.vue"
import TurnResult from "../components/game/TurnResult.vue"
import GameOver from "../components/game/GameOver.vue"
import { useGameStore } from "../stores/game"
import { setReconnectInfo } from "../services/ws"
import { clientId, nickname } from "../stores/auth"

const router = useRouter()
const route = useRoute()
const store = useGameStore()

let cleanup: (() => void) | null = null
let countdownTimer: ReturnType<typeof setInterval> | null = null
const countdown = ref(3)

onMounted(() => {
  cleanup = store.initStore()
})

onUnmounted(() => {
  cleanup?.()
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
})

// Countdown 3 → 2 → 1 during turn-start phase
watch(
  () => store.state.phase,
  (phase) => {
    if (countdownTimer) {
      clearInterval(countdownTimer)
      countdownTimer = null
    }
    if (phase === "turn-start") {
      countdown.value = 3
      countdownTimer = setInterval(() => {
        countdown.value--
        if (countdown.value <= 0) {
          clearInterval(countdownTimer!)
          countdownTimer = null
        }
      }, 1000)
    }
  },
)

// If URL has roomCode but store doesn't, join the room
watch(
  () => route.params.roomCode,
  (urlCode) => {
    const code = (urlCode as string | undefined)?.toUpperCase()
    if (code && !store.state.roomCode) {
      if (!nickname.value.trim()) {
        router.replace(`/?join=${code}`)
        return
      }
      store.joinRoom(code)
    }
  },
  { immediate: true },
)

// Sync URL when room code changes
watch(
  () => store.state.roomCode,
  (roomCode) => {
    if (roomCode) {
      const currentCode = (route.params.roomCode as string | undefined)?.toUpperCase()
      if (currentCode !== roomCode) {
        router.replace(`/lobby/${roomCode}`)
      }
    }
  },
)

// Set reconnect info when connected to a room
watch(
  () => store.state.roomCode,
  (roomCode) => {
    if (roomCode) {
      setReconnectInfo({
        roomCode,
        clientId: clientId.value,
        nickname: nickname.value,
      })
    }
  },
)

// Navigate home on error without room
watch(
  [() => store.state.roomCode, () => store.state.error],
  ([roomCode, error]) => {
    if (!roomCode && error) {
      router.push("/")
    }
  },
)

function handleLeave() {
  store.leaveRoom()
  router.push("/")
}

const canStart = computed(() => {
  if (!store.state.isHost) return false
  return store.state.teams.every((t) => t.players.length >= 2)
})

const totalInTeams = computed(() =>
  store.state.teams.reduce((sum, t) => sum + t.players.length, 0),
)

const isPlaying = computed(() =>
  store.state.phase !== "lobby",
)

const currentTeamName = computed(() => {
  const team = store.state.currentTurn?.team
  if (team == null) return ""
  return store.state.teams[team]?.name ?? ""
})

// Split teams for 3-column game layout
const leftTeams = computed(() => {
  const half = Math.ceil(store.state.teams.length / 2)
  return store.state.teams.slice(0, half).map((t, i) => ({ state: t, index: i }))
})

const rightTeams = computed(() => {
  const half = Math.ceil(store.state.teams.length / 2)
  return store.state.teams.slice(half).map((t, i) => ({ state: t, index: half + i }))
})
</script>

<template>
  <div class="min-h-dvh p-4 mx-auto" :class="isPlaying ? 'max-w-5xl' : 'max-w-lg'">
    <div class="space-y-4 animate-fade-in py-3">
      <!-- Header: back + room code -->
      <div class="flex items-center justify-between">
        <button
          @click="handleLeave"
          class="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          ← назад
        </button>
        <RoomCode v-if="store.state.roomCode" :code="store.state.roomCode" />
      </div>

      <div
        v-if="store.state.error"
        class="rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2 text-sm text-destructive text-center"
      >
        {{ store.state.error }}
      </div>

      <!-- ========== LOBBY PHASE ========== -->
      <template v-if="!isPlaying">
        <!-- Teams grid -->
        <div class="grid grid-cols-2 gap-3">
          <TeamPanel
            v-for="(team, i) in store.state.teams"
            :key="i"
            :team="i"
            :state="team"
            :my-team="store.myTeam"
            :is-host="store.state.isHost"
            @join="store.joinTeam(i)"
            @leave="store.leaveTeam()"
            @kick="store.kickPlayer($event)"
            @name-change="store.updateTeamName(i, $event)"
          />
        </div>

        <button
          v-if="store.state.isHost && totalInTeams >= 2"
          @click="store.shuffleTeams()"
          class="w-full text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer py-1"
        >
          перемішати
        </button>

        <!-- Settings -->
        <div class="rounded-lg bg-card border px-4 py-3">
          <GameSettings
            :settings="store.state.settings"
            :is-host="store.state.isHost"
            @update="store.updateSettings($event)"
          />
        </div>

        <!-- Start button -->
        <template v-if="store.state.isHost">
          <Button
            class="w-full"
            size="lg"
            @click="store.startGameAction()"
            :disabled="!canStart"
          >
            {{ canStart ? 'Грати!' : 'потрібно 2+ в кожній команді' }}
          </Button>
        </template>

        <p v-if="!store.state.isHost" class="text-xs text-muted-foreground text-center py-1">
          чекаємо на хоста...
        </p>
      </template>

      <!-- ========== GAME PHASES (3-column layout) ========== -->
      <template v-else>
        <div class="grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] gap-4 items-start">
          <!-- Left teams (desktop) -->
          <div class="hidden md:flex flex-col gap-3">
            <TeamPanel
              v-for="t in leftTeams"
              :key="t.index"
              :team="t.index"
              :state="t.state"
              :my-team="store.myTeam"
              :is-host="store.state.isHost"
              disabled
              :score-to-win="store.state.settings.scoreToWin"
              :is-current-turn="store.state.currentTurn?.team === t.index"
            />
          </div>

          <!-- Center: game content -->
          <div class="flex flex-col items-center">
            <!-- turn-start -->
            <template v-if="store.state.phase === 'turn-start'">
              <div class="flex flex-col items-center gap-6 animate-fade-in py-8">
                <div class="text-center">
                  <p class="text-xs text-muted-foreground mb-2">
                    {{ currentTeamName }}
                  </p>
                  <p class="text-lg font-semibold mb-4">
                    {{ store.state.currentTurn?.explainer.nickname }} пояснює!
                  </p>
                  <div :key="countdown" class="text-5xl animate-countdown">{{ countdown }}...</div>
                </div>
                <p
                  v-if="store.isExplainer"
                  class="text-xs text-muted-foreground rounded-full px-4 py-1.5 bg-secondary border"
                >
                  приготуйся — це ти!
                </p>
              </div>
            </template>

            <!-- turn-active -->
            <template v-else-if="store.state.phase === 'turn-active'">
              <ExplainerView v-if="store.isExplainer" />
              <GuesserView v-else-if="store.isMyTeamTurn" />
              <SpectatorView v-else />
            </template>

            <!-- turn-end -->
            <template v-else-if="store.state.phase === 'turn-end'">
              <TurnResult
                v-if="store.turnSummary"
                :turn="store.turnSummary.turn"
                :teams="store.turnSummary.teams"
                :next-team="store.turnSummary.nextTeam"
                :score-to-win="store.state.settings.scoreToWin"
              />
            </template>

            <!-- game-over -->
            <template v-else-if="store.state.phase === 'game-over'">
              <GameOver
                v-if="store.state.winner != null"
                :winner="store.state.winner"
                :teams="store.state.teams"
                :score-to-win="store.state.settings.scoreToWin"
                :is-host="store.state.isHost"
                @play-again="store.playAgain()"
                @back-to-lobby="handleLeave"
              />
            </template>
          </div>

          <!-- Right teams (desktop) -->
          <div class="hidden md:flex flex-col gap-3">
            <TeamPanel
              v-for="t in rightTeams"
              :key="t.index"
              :team="t.index"
              :state="t.state"
              :my-team="store.myTeam"
              :is-host="store.state.isHost"
              disabled
              :score-to-win="store.state.settings.scoreToWin"
              :is-current-turn="store.state.currentTurn?.team === t.index"
            />
          </div>
        </div>

        <!-- Mobile: show teams below game content -->
        <div class="md:hidden grid grid-cols-2 gap-3 mt-4">
          <TeamPanel
            v-for="(team, i) in store.state.teams"
            :key="i"
            :team="i"
            :state="team"
            :my-team="store.myTeam"
            :is-host="store.state.isHost"
            disabled
            :score-to-win="store.state.settings.scoreToWin"
            :is-current-turn="store.state.currentTurn?.team === i"
          />
        </div>
      </template>
    </div>
  </div>
</template>
