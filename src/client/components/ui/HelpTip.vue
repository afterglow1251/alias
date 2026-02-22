<script setup lang="ts">
import { CircleHelp } from "lucide-vue-next"
import { TooltipRoot, TooltipProvider, TooltipTrigger, TooltipContent, TooltipPortal } from "reka-ui"

defineProps<{ text: string }>()
</script>

<template>
  <TooltipProvider :delay-duration="0">
    <TooltipRoot>
      <TooltipTrigger as-child>
        <CircleHelp class="size-3.5 text-muted-foreground/60 cursor-help" />
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent side="top" :side-offset="4" class="z-50 rounded-md bg-foreground px-3 py-1.5 text-xs text-background">
          {{ text }}
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
</template>
