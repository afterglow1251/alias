import { createSignal, Show } from "solid-js"
import { useNavigate } from "@solidjs/router"
import { Card } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { nickname, setNickname } from "../stores/auth"
import { createRoom, joinRoom } from "../stores/game"

export function HomePage() {
  const navigate = useNavigate()
  const [roomCode, setRoomCode] = createSignal("")
  const [showJoin, setShowJoin] = createSignal(false)
  const [error, setError] = createSignal("")

  function handleCreate() {
    if (!nickname().trim()) {
      setError("Як тебе звати? :)")
      return
    }
    createRoom()
    navigate("/lobby")
  }

  function handleJoin() {
    if (!nickname().trim()) {
      setError("Як тебе звати? :)")
      return
    }
    if (!roomCode().trim()) {
      setError("Введи код кімнати")
      return
    }
    joinRoom(roomCode().trim().toUpperCase())
    navigate("/lobby")
  }

  return (
    <div class="min-h-dvh flex flex-col items-center justify-center p-4">
      <div class="w-full max-w-sm space-y-8">
        <div class="text-center animate-fade-in">
          <div class="relative inline-block">
            <div
              class="absolute inset-0 rounded-full blur-2xl"
              style={{
                background: "radial-gradient(circle, rgba(125, 211, 252, 0.15), transparent 70%)",
                transform: "scale(2.5)",
              }}
            />
            <div class="text-8xl mb-3 animate-waddle inline-block relative">🐧</div>
          </div>
          <h1 class="text-5xl font-extrabold text-gradient mb-1.5">Alias</h1>
          <p class="glass-light inline-block rounded-full px-4 py-1.5 text-text-muted text-sm border border-white/[0.04]">
            вгадай слово з друзями
          </p>
        </div>

        <Card class="space-y-4" style={{ "animation": "fade-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s both" }}>
          <div>
            <label class="text-xs text-text-muted mb-1.5 block">твій нікнейм</label>
            <Input
              value={nickname()}
              onInput={(e) => {
                setNickname(e.currentTarget.value)
                setError("")
              }}
              placeholder="напиши ім'я..."
              maxLength={20}
            />
          </div>

          <Show when={error()}>
            <p class="text-xs text-danger">{error()}</p>
          </Show>

          <Button class="w-full" size="lg" onClick={handleCreate}>
            створити кімнату 🏠
          </Button>

          <Show
            when={showJoin()}
            fallback={
              <Button class="w-full" variant="outline" size="lg" onClick={() => setShowJoin(true)}>
                приєднатися по коду
              </Button>
            }
          >
            <div class="flex gap-2">
              <Input
                value={roomCode()}
                onInput={(e) => {
                  setRoomCode(e.currentTarget.value.toUpperCase())
                  setError("")
                }}
                placeholder="КОД"
                maxLength={5}
                class="font-mono tracking-widest text-center text-lg"
              />
              <Button onClick={handleJoin}>🐧</Button>
            </div>
          </Show>
        </Card>

        <p
          class="text-center text-xs text-text-muted"
          style={{ "animation": "fade-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both" }}
        >
          збери друзів, поділись на команди
          <br />
          і пояснюй слова! 🎯
        </p>
      </div>
    </div>
  )
}
