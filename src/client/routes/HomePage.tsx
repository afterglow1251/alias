import { createSignal, Show } from "solid-js"
import { useNavigate } from "@solidjs/router"
import { Card } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { nickname, setNickname, clientId } from "../stores/auth"
import { createRoom, joinRoom } from "../stores/game"

export function HomePage() {
  const navigate = useNavigate()
  const [roomCode, setRoomCode] = createSignal("")
  const [showJoin, setShowJoin] = createSignal(false)
  const [error, setError] = createSignal("")

  function handleCreate() {
    if (!nickname().trim()) {
      setError("Введіть нікнейм")
      return
    }
    createRoom()
    navigate("/lobby")
  }

  function handleJoin() {
    if (!nickname().trim()) {
      setError("Введіть нікнейм")
      return
    }
    if (!roomCode().trim()) {
      setError("Введіть код кімнати")
      return
    }
    joinRoom(roomCode().trim().toUpperCase())
    navigate("/lobby")
  }

  return (
    <div class="min-h-dvh flex flex-col items-center justify-center p-4">
      <div class="w-full max-w-md space-y-8 animate-fade-in">
        <div class="text-center">
          <h1 class="text-5xl font-bold text-gradient mb-2">Alias</h1>
          <p class="text-text-muted text-lg">Вгадай слово — онлайн</p>
        </div>

        <Card class="space-y-4">
          <div>
            <label class="text-sm text-text-muted mb-1.5 block">Ваш нікнейм</label>
            <Input
              value={nickname()}
              onInput={(e) => {
                setNickname(e.currentTarget.value)
                setError("")
              }}
              placeholder="Введіть нікнейм..."
              maxLength={20}
            />
          </div>

          <Show when={error()}>
            <p class="text-sm text-danger">{error()}</p>
          </Show>

          <div class="space-y-3">
            <Button class="w-full" size="lg" onClick={handleCreate}>
              Створити кімнату
            </Button>

            <Show
              when={showJoin()}
              fallback={
                <Button class="w-full" variant="outline" size="lg" onClick={() => setShowJoin(true)}>
                  Приєднатися по коду
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
                  placeholder="Код кімнати"
                  maxLength={5}
                  class="font-mono tracking-widest text-center text-lg"
                />
                <Button onClick={handleJoin}>Вхід</Button>
              </div>
            </Show>
          </div>
        </Card>

        <p class="text-center text-xs text-text-muted">
          Зберіть друзів, розділіться на команди і пояснюйте слова!
        </p>
      </div>
    </div>
  )
}
