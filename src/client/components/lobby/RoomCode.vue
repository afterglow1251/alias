<script setup lang="ts">
import { ref } from "vue"
import { cn } from "../../lib/cn"

const props = defineProps<{
  code: string
}>()

const copied = ref(false)

function getRoomUrl() {
  return `${window.location.origin}/lobby/${props.code}`
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(getRoomUrl())
    copied.value = true
    setTimeout(() => (copied.value = false), 500)
  } catch {
    // Fallback
  }
}
</script>

<template>
  <button
    @click="copyLink"
    :class="
      cn(
        'flex items-center gap-1.5 rounded-lg bg-secondary border px-3 py-2 font-mono text-lg font-bold tracking-widest transition-all cursor-pointer',
        copied
          ? 'border-success/50 text-success'
          : 'hover:bg-accent',
      )
    "
  >
    <span v-for="(letter, i) in code.split('')" :key="i" class="inline-block">{{ letter }}</span>
  </button>
</template>
