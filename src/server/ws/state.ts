import type { ServerWebSocket } from "bun"

export const wsToClientId = new Map<ServerWebSocket<any>, string>()
export const clientToRoom = new Map<string, string>()
export const pendingDisconnects = new Map<string, ReturnType<typeof setTimeout>>()
