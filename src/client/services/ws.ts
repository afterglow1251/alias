import type { WSClientMessage, WSServerMessage } from "../../shared/ws-types"

type MessageHandler = (msg: WSServerMessage) => void

let socket: WebSocket | null = null
let shouldReconnect = false
let reconnectTimeout: ReturnType<typeof setTimeout> | null = null
const messageHandlers = new Set<MessageHandler>()

let reconnectInfo: { roomCode: string; clientId: string; nickname: string } | null = null

export function connect(onOpen?: () => void) {
  if (socket?.readyState === WebSocket.OPEN) {
    onOpen?.()
    return
  }

  if (socket) {
    socket.onclose = null
    socket.close()
  }

  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:"
  const url = `${protocol}//${window.location.host}/ws`
  socket = new WebSocket(url)

  socket.onopen = () => {
    onOpen?.()
  }

  socket.onmessage = (event) => {
    try {
      const msg: WSServerMessage = JSON.parse(event.data)
      for (const handler of messageHandlers) {
        handler(msg)
      }
    } catch {
      // Invalid message
    }
  }

  socket.onclose = () => {
    socket = null
    if (shouldReconnect && reconnectInfo) {
      reconnectTimeout = setTimeout(() => {
        connect(() => {
          if (reconnectInfo) {
            send({
              type: "join",
              clientId: reconnectInfo.clientId,
              nickname: reconnectInfo.nickname,
              roomCode: reconnectInfo.roomCode,
            })
          }
        })
      }, 2000)
    }
  }
}

export function send(msg: WSClientMessage) {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(msg))
  }
}

export function addMessageHandler(handler: MessageHandler) {
  messageHandlers.add(handler)
  return () => messageHandlers.delete(handler)
}

export function setReconnectInfo(info: { roomCode: string; clientId: string; nickname: string }) {
  reconnectInfo = info
  shouldReconnect = true
}

export function disconnect() {
  shouldReconnect = false
  reconnectInfo = null
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout)
    reconnectTimeout = null
  }
  if (socket) {
    socket.onclose = null
    socket.close()
    socket = null
  }
}

export function isConnected(): boolean {
  return socket?.readyState === WebSocket.OPEN
}
