<script setup lang="ts">
import type { PrimitiveProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import type { ButtonVariants } from "."
import { computed } from "vue"
import { Primitive } from "reka-ui"
import { cn } from '~/client/lib/utils'
import { buttonVariants } from "."
import { TEAM_COLORS } from "~/shared/teams"

interface Props extends PrimitiveProps {
  variant?: ButtonVariants["variant"]
  size?: ButtonVariants["size"]
  class?: HTMLAttributes["class"]
  teamIndex?: number
}

const props = withDefaults(defineProps<Props>(), {
  as: "button",
})

const teamStyle = computed(() => {
  if (props.teamIndex == null) return undefined
  const color = TEAM_COLORS[props.teamIndex]
  if (!color) return undefined
  return {
    backgroundColor: `${color}26`,
    borderColor: `${color}4d`,
    color: color,
  }
})
</script>

<template>
  <Primitive
    data-slot="button"
    :data-variant="variant"
    :data-size="size"
    :as="as"
    :as-child="asChild"
    :class="cn(
      buttonVariants({ variant: teamIndex != null ? undefined : variant, size }),
      teamIndex != null && 'hover:brightness-125 border',
      props.class,
    )"
    :style="teamStyle"
  >
    <slot />
  </Primitive>
</template>
