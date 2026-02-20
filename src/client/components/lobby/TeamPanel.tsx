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
  onJoin: () => void
  onLeave: () => void
  disabled?: boolean
}

export function TeamPanel(props: TeamPanelProps) {
  const isMyTeam = () => props.myTeam === props.team
  const teamName = () => (props.team === "A" ? "Сині" : "Жовті")
  const teamColor = () => (props.team === "A" ? "team-a" : "team-b")

  return (
    <div
      class={cn(
        "flex flex-col rounded-xl border-2 p-4 transition-all",
        props.team === "A" ? "border-team-a/30 team-a-gradient" : "border-team-b/30 team-b-gradient",
        isMyTeam() && (props.team === "A" ? "border-team-a" : "border-team-b"),
      )}
    >
      <div class="flex items-center justify-between mb-3">
        <h3 class={cn("text-lg font-bold", props.team === "A" ? "text-team-a" : "text-team-b")}>
          {teamName()}
        </h3>
        <Badge variant={teamColor()}>{props.state.players.length} гравців</Badge>
      </div>

      <div class="flex-1 space-y-2 mb-4 min-h-[80px]">
        <For each={props.state.players}>
          {(player) => (
            <div
              class={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm",
                player.clientId === clientId() ? "bg-white/10 font-medium" : "bg-white/5",
                !player.connected && "opacity-50",
              )}
            >
              <span class={cn("w-2 h-2 rounded-full", player.connected ? "bg-success" : "bg-text-muted")} />
              <span>{player.nickname}</span>
              <Show when={player.isHost}>
                <Badge variant="default">хост</Badge>
              </Show>
            </div>
          )}
        </For>
        <Show when={props.state.players.length === 0}>
          <div class="text-sm text-text-muted text-center py-4">Поки нікого...</div>
        </Show>
      </div>

      <Show when={!props.disabled}>
        <Show
          when={isMyTeam()}
          fallback={
            <Button
              variant={props.team === "A" ? "team-a" : "team-b"}
              size="sm"
              onClick={props.onJoin}
              disabled={props.myTeam !== null && props.myTeam !== props.team}
            >
              Приєднатись
            </Button>
          }
        >
          <Button variant="outline" size="sm" onClick={props.onLeave}>
            Вийти з команди
          </Button>
        </Show>
      </Show>
    </div>
  )
}
