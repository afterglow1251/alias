<script setup lang="ts">
import type { PrimitiveProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import type { BadgeVariants } from "."
import { computed } from "vue"
import { reactiveOmit } from "@vueuse/core"
import { Primitive } from "reka-ui"
import { cn } from '~/client/lib/utils'
import { badgeVariants } from "."
import { TEAM_COLORS } from "~/shared/teams"

const props = defineProps<PrimitiveProps & {
  variant?: BadgeVariants["variant"]
  class?: HTMLAttributes["class"]
  teamIndex?: number
}>()

const delegatedProps = reactiveOmit(props, "class", "teamIndex")

const teamStyle = computed(() => {
  if (props.teamIndex == null) return undefined
  const color = TEAM_COLORS[props.teamIndex]
  if (!color) return undefined
  return {
    backgroundColor: `${color}26`,
    color: color,
    borderColor: `${color}40`,
  }
})
</script>

<template>
  <Primitive
    data-slot="badge"
    :class="cn(badgeVariants({ variant: teamIndex != null ? undefined : variant }), props.class)"
    :style="teamStyle"
    v-bind="delegatedProps"
  >
    <slot />
  </Primitive>
</template>
