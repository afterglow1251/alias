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

function handleCreate() {
  if (!nickname.value.trim()) {
    error.value = "Як тебе звати? :)"
    return
  }
  store.createRoom()
  router.push("/lobby")
}

function handleJoin() {
  if (!nickname.value.trim()) {
    error.value = "Як тебе звати? :)"
    return
  }
  if (!roomCode.value.trim()) {
    error.value = "Введи код кімнати"
    return
  }
  const code = roomCode.value.trim().toUpperCase()
  store.joinRoom(code)
  router.push(`/lobby/${code}`)
}

function onNicknameInput(val: string) {
  setNickname(val)
  error.value = ""
}

function onRoomCodeInput(val: string) {
  roomCode.value = val.toUpperCase()
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
          <label class="text-xs text-muted-foreground mb-1.5 block">твій нікнейм</label>
          <Input
            :model-value="nickname"
            @update:model-value="onNicknameInput"
            placeholder="напиши ім'я..."
            :max-length="20"
          />
        </div>

        <p v-if="error" class="text-xs text-destructive">{{ error }}</p>

        <Button class="w-full" size="lg" @click="handleCreate">
          створити кімнату 🏠
        </Button>

        <template v-if="showJoin">
          <div class="flex gap-2">
            <Input
              :model-value="roomCode"
              @update:model-value="onRoomCodeInput"
              placeholder="КОД"
              :max-length="5"
              class="font-mono tracking-widest text-center text-lg"
            />
            <Button @click="handleJoin">→</Button>
          </div>
        </template>
        <template v-else>
          <Button class="w-full" variant="outline" size="lg" @click="showJoin = true">
            приєднатися по коду
          </Button>
        </template>
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
