import { ref } from "vue"

const NICKNAME_KEY = "alias_nickname"
const CLIENT_ID_KEY = "alias_clientId"

let counter = 0
function generateClientId(): string {
  return `c_${++counter}_${Date.now().toString(36)}`
}

export const nickname = ref(localStorage.getItem(NICKNAME_KEY) || "")

let storedClientId = sessionStorage.getItem(CLIENT_ID_KEY)
if (!storedClientId) {
  storedClientId = generateClientId()
  sessionStorage.setItem(CLIENT_ID_KEY, storedClientId)
}
export const clientId = ref(storedClientId)

export function setNickname(name: string) {
  const trimmed = name.trim()
  nickname.value = trimmed
  localStorage.setItem(NICKNAME_KEY, trimmed)
}
