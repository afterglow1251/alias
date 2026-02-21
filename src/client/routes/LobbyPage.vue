<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed } from "vue"
import { useRouter, useRoute } from "vue-router"
import { Button } from "../components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog"
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

const settingsOpen = ref(false)
let cleanup: (() => void) | null = null

onMounted(() => {
  cleanup = store.initStore()
})

onUnmounted(() => {
  cleanup?.()
})

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
  <div class="min-h-dvh p-4 mx-auto max-w-5xl">
    <div class="space-y-4 py-3">
      <!-- Header: back + settings -->
      <div class="flex items-center justify-between">
        <button
          @click="handleLeave"
          class="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          title="назад"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <Dialog v-if="!isPlaying" v-model:open="settingsOpen">
          <DialogTrigger as-child>
            <Button variant="outline" size="icon-sm" title="налаштування">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Налаштування гри</DialogTitle>
            </DialogHeader>
            <GameSettings
              :settings="store.state.settings"
              :is-host="store.state.isHost"
              @update="store.updateSettings($event)"
            />
            <div v-if="store.state.roomCode" class="pt-2 border-t">
              <p class="text-xs text-muted-foreground mb-2">Код кімнати</p>
              <RoomCode :code="store.state.roomCode" />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div
        v-if="store.state.error"
        class="rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2 text-sm text-destructive text-center"
      >
        {{ store.state.error }}
      </div>

      <!-- Mobile: teams above center content in lobby -->
      <div v-if="!isPlaying" class="md:hidden grid grid-cols-2 gap-3">
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

      <!-- 3-column layout (always) -->
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
            :disabled="isPlaying && store.myTeam !== null"
            :score-to-win="isPlaying ? store.state.settings.scoreToWin : undefined"
            :is-current-turn="store.state.currentTurn?.team === t.index"
            @join="store.joinTeam(t.index)"
            @leave="store.leaveTeam()"
            @kick="store.kickPlayer($event)"
            @name-change="store.updateTeamName(t.index, $event)"
          />
        </div>

        <!-- Center content -->
        <div class="flex flex-col gap-4">
          <!-- ========== LOBBY ========== -->
          <template v-if="!isPlaying">
            <button
              v-if="store.state.isHost && totalInTeams >= 2"
              @click="store.shuffleTeams()"
              class="w-full text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer py-1"
            >
              перемішати
            </button>

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

          <!-- ========== GAME PHASES ========== -->
          <template v-else>
            <p v-if="store.myTeam === null" class="text-sm text-muted-foreground text-center py-2 animate-pulse">
              обери команду, щоб грати
            </p>
            <div class="flex flex-col items-center">
              <!-- turn-start -->
              <template v-if="store.state.phase === 'turn-start'">
                <div class="flex flex-col items-center gap-6 py-8">
                  <div class="text-center">
                    <p class="text-xs text-muted-foreground mb-2">
                      {{ currentTeamName }}
                    </p>
                    <p class="text-lg font-semibold">
                      {{ store.state.currentTurn?.explainer.nickname }} пояснює!
                    </p>
                  </div>
                  <template v-if="store.isExplainer">
                    <Button size="lg" @click="store.confirmTurnStart()">
                      Почати хід
                    </Button>
                  </template>
                  <p v-else class="text-sm text-muted-foreground animate-pulse">
                    чекаємо поки {{ store.state.currentTurn?.explainer.nickname }} почне...
                  </p>
                </div>
              </template>

              <!-- turn-active / turn-last-word -->
              <template v-else-if="store.state.phase === 'turn-active' || store.state.phase === 'turn-last-word'">
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
                  @back-to-lobby="store.backToLobby()"
                  @leave="handleLeave"
                />
              </template>
            </div>
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
            :disabled="isPlaying && store.myTeam !== null"
            :score-to-win="isPlaying ? store.state.settings.scoreToWin : undefined"
            :is-current-turn="store.state.currentTurn?.team === t.index"
            @join="store.joinTeam(t.index)"
            @leave="store.leaveTeam()"
            @kick="store.kickPlayer($event)"
            @name-change="store.updateTeamName(t.index, $event)"
          />
        </div>
      </div>

      <!-- Mobile: teams below game content -->
      <div v-if="isPlaying" class="md:hidden grid grid-cols-2 gap-3">
        <TeamPanel
          v-for="(team, i) in store.state.teams"
          :key="i"
          :team="i"
          :state="team"
          :my-team="store.myTeam"
          :is-host="store.state.isHost"
          :disabled="store.myTeam !== null"
          :score-to-win="store.state.settings.scoreToWin"
          :is-current-turn="store.state.currentTurn?.team === i"
          @join="store.joinTeam(i)"
        />
      </div>
    </div>
  </div>
</template>
