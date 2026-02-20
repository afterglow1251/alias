import { For, Show } from "solid-js"
import type { GameSettings as GameSettingsType } from "../../../shared/types"
import { Button } from "../ui/button"
import { cn } from "../../lib/cn"

interface GameSettingsProps {
  settings: GameSettingsType
  availableCategories: string[]
  isHost: boolean
  onUpdate: (settings: Partial<GameSettingsType>) => void
}

const TIMER_OPTIONS = [30, 45, 60, 90]
const SCORE_OPTIONS = [20, 30, 40, 50]

export function GameSettings(props: GameSettingsProps) {
  function toggleCategory(cat: string) {
    const current = props.settings.categories
    const updated = current.includes(cat)
      ? current.filter((c) => c !== cat)
      : [...current, cat]

    if (updated.length > 0) {
      props.onUpdate({ categories: updated })
    }
  }

  return (
    <div class="space-y-4">
      <h3 class="text-lg font-semibold">Налаштування</h3>

      <div>
        <label class="text-sm text-text-muted mb-2 block">Час на раунд (сек)</label>
        <div class="flex gap-2">
          <For each={TIMER_OPTIONS}>
            {(opt) => (
              <Button
                variant={props.settings.turnDuration === opt ? "default" : "outline"}
                size="sm"
                onClick={() => props.isHost && props.onUpdate({ turnDuration: opt })}
                disabled={!props.isHost}
              >
                {opt}с
              </Button>
            )}
          </For>
        </div>
      </div>

      <div>
        <label class="text-sm text-text-muted mb-2 block">Очки для перемоги</label>
        <div class="flex gap-2">
          <For each={SCORE_OPTIONS}>
            {(opt) => (
              <Button
                variant={props.settings.scoreToWin === opt ? "default" : "outline"}
                size="sm"
                onClick={() => props.isHost && props.onUpdate({ scoreToWin: opt })}
                disabled={!props.isHost}
              >
                {opt}
              </Button>
            )}
          </For>
        </div>
      </div>

      <div>
        <label class="text-sm text-text-muted mb-2 block">
          Категорії ({props.settings.categories.length}/{props.availableCategories.length})
        </label>
        <div class="flex flex-wrap gap-2">
          <For each={props.availableCategories}>
            {(cat) => (
              <button
                class={cn(
                  "rounded-full px-3 py-1 text-sm border transition-all cursor-pointer",
                  props.settings.categories.includes(cat)
                    ? "bg-accent/20 border-accent/50 text-accent"
                    : "bg-surface-light border-border text-text-muted",
                  !props.isHost && "cursor-not-allowed opacity-60",
                )}
                onClick={() => props.isHost && toggleCategory(cat)}
                disabled={!props.isHost}
              >
                {cat}
              </button>
            )}
          </For>
        </div>
      </div>

      <Show when={!props.isHost}>
        <p class="text-xs text-text-muted italic">Тільки хост може змінювати налаштування</p>
      </Show>
    </div>
  )
}
