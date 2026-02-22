<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRouter, useRoute } from "vue-router"
import { Card } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { nickname, setNickname } from "../stores/auth"
import { useGameStore } from "../stores/game"

const router = useRouter()
const route = useRoute()
const store = useGameStore()

const roomCode = ref("")
const showJoin = ref(false)
const error = ref("")

onMounted(() => {
  const joinCode = route.query.join
  if (joinCode && typeof joinCode === "string") {
    roomCode.value = joinCode.toUpperCase()
    showJoin.value = true
  }
})

function validateNickname(): boolean {
  const name = nickname.value.trim()
  if (!name) {
    error.value = "Як тебе звати? :)"
    return false
  }
  if (name.length < 2 || name.length > 12) {
    error.value = name.length < 2 ? "Мінімум 2 символи" : "Максимум 12 символів"
    return false
  }
  return true
}

function handleCreate() {
  if (!validateNickname()) return
  store.createRoom()
  router.push("/lobby")
}

function handleJoin() {
  if (!validateNickname()) return
  if (!roomCode.value.trim()) {
    error.value = "Введи код кімнати"
    return
  }
  const code = roomCode.value.trim().toUpperCase()
  store.joinRoom(code)
  router.push(`/lobby/${code}`)
}

function onNicknameInput(val: string | number) {
  setNickname(String(val))
  error.value = ""
}

function onRoomCodeInput(val: string | number) {
  roomCode.value = String(val).toUpperCase()
  error.value = ""
}
</script>

<template>
  <div class="min-h-dvh flex flex-col items-center justify-center p-4">
    <div class="w-full max-w-sm space-y-8">
      <div class="text-center">
        <div class="text-8xl mb-3 inline-block">🎯</div>
        <h1 class="text-5xl font-extrabold mb-1.5">Alias</h1>
        <p class="inline-block rounded-full px-4 py-1.5 text-muted-foreground text-sm bg-secondary border border-border">
          вгадай слово з друзями
        </p>
      </div>

      <Card class="space-y-4">
        <div>
          <div class="flex items-center justify-between mb-1.5">
            <label class="text-xs text-muted-foreground">твій нікнейм</label>
            <span class="text-xs tabular-nums" :class="nickname.length < 2 || nickname.length > 12 ? 'text-destructive' : 'text-muted-foreground'">{{ nickname.length }}/12</span>
          </div>
          <Input
            :model-value="nickname"
            @update:model-value="onNicknameInput"
            placeholder="напиши ім'я..."
            :max-length="12"
          />
        </div>

        <p v-if="error" class="text-xs text-destructive">{{ error }}</p>

        <Button class="w-full" size="lg" @click="handleCreate">
          створити кімнату 🏠
        </Button>

        <div class="h-10">
          <div v-if="showJoin" class="flex gap-2 h-full">
            <Input
              :model-value="roomCode"
              @update:model-value="onRoomCodeInput"
              placeholder="КОД"
              :max-length="5"
              class="!h-full font-mono tracking-widest text-center text-lg"
            />
            <Button class="!h-full" @click="handleJoin">→</Button>
          </div>
          <Button v-else class="w-full !h-full" variant="outline" @click="showJoin = true">
            приєднатися по коду
          </Button>
        </div>
      </Card>

      <p
        class="text-center text-xs text-muted-foreground"
      >
        збери друзів, поділись на команди
        <br />
        і пояснюй слова! 🎯
      </p>
    </div>
  </div>
</template>
