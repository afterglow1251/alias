import { createSignal } from "solid-js"

const NICKNAME_KEY = "alias_nickname"
const CLIENT_ID_KEY = "alias_clientId"

let counter = 0
function generateClientId(): string {
  return `c_${++counter}_${Date.now().toString(36)}`
}

const [nickname, setNicknameSignal] = createSignal(localStorage.getItem(NICKNAME_KEY) || "")

let storedClientId = sessionStorage.getItem(CLIENT_ID_KEY)
if (!storedClientId) {
  storedClientId = generateClientId()
  sessionStorage.setItem(CLIENT_ID_KEY, storedClientId)
}
const [clientId] = createSignal(storedClientId)

export function setNickname(name: string) {
  const trimmed = name.trim()
  setNicknameSignal(trimmed)
  localStorage.setItem(NICKNAME_KEY, trimmed)
}

export { nickname, clientId }
