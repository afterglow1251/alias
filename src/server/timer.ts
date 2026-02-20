import type { Room } from "./types"
import { broadcastToRoom } from "./rooms"
import { endTurn } from "./game"

export function startTimer(room: Room) {
  if (room.timer) clearInterval(room.timer)

  room.timeLeft = room.settings.turnDuration

  room.timer = setInterval(() => {
    room.timeLeft--

    broadcastToRoom(room, { type: "timer-tick", timeLeft: room.timeLeft })

    if (room.timeLeft <= 0) {
      stopTimer(room)
      endTurn(room)
    }
  }, 1000)
}

export function stopTimer(room: Room) {
  if (room.timer) {
    clearInterval(room.timer)
    room.timer = null
  }
}
