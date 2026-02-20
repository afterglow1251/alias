import { For, Show } from "solid-js"
import type { TeamState } from "../../../shared/types"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { cn } from "../../lib/cn"
import { clientId } from "../../stores/auth"

interface TeamPanelProps {
  team: "A" | "B"
  state: TeamState
  myTeam: "A" | "B" | null
  isHost?: boolean
  onJoin: () => void
  onLeave: () => void
  onKick?: (clientId: string) => void
  disabled?: boolean
}

export function TeamPanel(props: TeamPanelProps) {
  const isMyTeam = () => props.myTeam === props.team
  const teamEmoji = () => (props.team === "A" ? "🧊" : "🌟")
  const teamName = () => (props.team === "A" ? "крижані" : "зоряні")

  return (
    <div
      class={cn(
        "flex flex-col rounded-2xl p-4 transition-all glass inner-glow",
        props.team === "A" ? "team-a-top-accent" : "team-b-top-accent",
        isMyTeam() &&
          (props.team === "A"
            ? "shadow-[0_0_24px_rgba(96,165,250,0.12)]"
            : "shadow-[0_0_24px_rgba(251,191,36,0.12)]"),
      )}
    >
      <div class="flex items-center justify-between mb-3">
        <h3 class={cn("font-semibold flex items-center gap-1.5", props.team === "A" ? "text-team-a" : "text-team-b")}>
          {teamEmoji()} {teamName()}
        </h3>
        <Badge variant={props.team === "A" ? "team-a" : "team-b"}>{props.state.players.length}</Badge>
      </div>

      <div class="flex-1 space-y-1.5 mb-3 min-h-[72px]">
        <For each={props.state.players}>
          {(player) => (
            <div
              class={cn(
                "flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm",
                player.clientId === clientId() ? "glass-light font-medium border border-white/[0.06]" : "bg-white/[0.03]",
                !player.connected && "opacity-40",
              )}
            >
              <span
                class={cn(
                  "w-1.5 h-1.5 rounded-full",
                  player.connected
                    ? "bg-success shadow-[0_0_6px_rgba(52,211,153,0.5)]"
                    : "bg-text-muted",
                )}
              />
              <span class="truncate">{player.nickname}</span>
              <Show when={player.isHost}>
                <span class="text-xs ml-auto">👑</span>
              </Show>
              <Show when={props.isHost && !player.isHost && player.clientId !== clientId()}>
                <button
                  class="ml-auto text-xs text-text-muted hover:text-danger transition-colors px-1"
                  onClick={() => props.onKick?.(player.clientId)}
                  title="вигнати"
                >
                  ✕
                </button>
              </Show>
            </div>
          )}
        </For>
        <Show when={props.state.players.length === 0}>
          <div class="text-xs text-text-muted text-center py-4">тут поки порожньо 🐧</div>
        </Show>
      </div>

      <Show when={!props.disabled}>
        <Show
          when={isMyTeam()}
          fallback={
            <Button
              variant={props.team === "A" ? "team-a" : "team-b"}
              size="sm"
              class="w-full"
              onClick={props.onJoin}
              disabled={props.myTeam !== null && props.myTeam !== props.team}
            >
              приєднатись
            </Button>
          }
        >
          <Button variant="ghost" size="sm" class="w-full" onClick={props.onLeave}>
            вийти
          </Button>
        </Show>
      </Show>
    </div>
  )
}
