import type { Room } from "./types"
import { broadcastToRoom } from "./rooms"
import { endTurn, enterLastWordPhase } from "./game"

export function startTimer(room: Room) {
  if (room.timer) clearInterval(room.timer)

  room.timeLeft = room.settings.turnDuration

  room.timer = setInterval(() => {
    // Guard against stale callback after phase change
    if (room.phase !== "turn-active") {
      stopTimer(room)
      return
    }

    room.timeLeft--

    broadcastToRoom(room, { type: "timer-tick", timeLeft: room.timeLeft })

    if (room.timeLeft <= 0) {
      stopTimer(room)

      if (room.settings.lastWordInfinite && room.currentTurn?.currentWord) {
        enterLastWordPhase(room)
      } else {
        endTurn(room)
      }
    }
  }, 1000)
}

export function stopTimer(room: Room) {
  if (room.timer) {
    clearInterval(room.timer)
    room.timer = null
  }
}
