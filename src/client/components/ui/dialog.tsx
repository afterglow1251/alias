import { type JSX, Show, splitProps } from "solid-js"
import { Portal } from "solid-js/web"
import { cn } from "../../lib/cn"

interface DialogProps {
  open: boolean
  onClose: () => void
  children: JSX.Element
  class?: string
}

export function Dialog(props: DialogProps) {
  return (
    <Show when={props.open}>
      <Portal>
        <div class="fixed inset-0 z-50 flex items-center justify-center">
          <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={props.onClose} />
          <div
            class={cn(
              "relative z-10 w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-2xl animate-fade-in",
              props.class,
            )}
          >
            {props.children}
          </div>
        </div>
      </Portal>
    </Show>
  )
}
