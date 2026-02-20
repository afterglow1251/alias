import { For, Show } from "solid-js"
import type { GameSettings as GameSettingsType } from "../../../shared/types"
import { Button } from "../ui/button"

interface GameSettingsProps {
  settings: GameSettingsType
  isHost: boolean
  onUpdate: (settings: Partial<GameSettingsType>) => void
}

const TIMER_OPTIONS = [30, 45, 60, 90]
const SCORE_OPTIONS = [20, 30, 40, 50]

export function GameSettings(props: GameSettingsProps) {
  return (
    <div class="space-y-4">
      <div>
        <label class="text-[10px] uppercase tracking-widest text-text-dim mb-2 block font-medium">
          час на раунд
        </label>
        <div class="flex gap-2">
          <For each={TIMER_OPTIONS}>
            {(opt) => (
              <Button
                variant={props.settings.turnDuration === opt ? "default" : "outline"}
                size="sm"
                onClick={() => props.isHost && props.onUpdate({ turnDuration: opt })}
                disabled={!props.isHost}
                class={
                  props.settings.turnDuration === opt
                    ? "flex-1 shadow-[0_0_12px_rgba(125,211,252,0.12)]"
                    : "flex-1"
                }
              >
                {opt}с
              </Button>
            )}
          </For>
        </div>
      </div>

      <div class="border-t border-white/[0.04]" />

      <div>
        <label class="text-[10px] uppercase tracking-widest text-text-dim mb-2 block font-medium">
          очки для перемоги
        </label>
        <div class="flex gap-2">
          <For each={SCORE_OPTIONS}>
            {(opt) => (
              <Button
                variant={props.settings.scoreToWin === opt ? "default" : "outline"}
                size="sm"
                onClick={() => props.isHost && props.onUpdate({ scoreToWin: opt })}
                disabled={!props.isHost}
                class={
                  props.settings.scoreToWin === opt
                    ? "flex-1 shadow-[0_0_12px_rgba(125,211,252,0.12)]"
                    : "flex-1"
                }
              >
                {opt}
              </Button>
            )}
          </For>
        </div>
      </div>

      <Show when={!props.isHost}>
        <p class="text-xs text-text-muted text-center">тільки хост може змінювати</p>
      </Show>
    </div>
  )
}
