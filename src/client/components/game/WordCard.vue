<script setup lang="ts">
import { Button } from "../ui/button"

defineProps<{
  word: string | null
}>()

defineEmits<{
  guessed: []
  skip: []
}>()
</script>

<template>
  <div class="flex flex-col items-center gap-4 w-full max-w-sm mx-auto">
    <div
      class="w-full h-44 rounded-lg bg-card border flex items-center justify-center"
      :class="word ? 'animate-scale-in' : ''"
    >
      <span v-if="word" class="text-3xl font-bold text-center px-6 break-words">{{ word }}</span>
      <span v-else class="text-2xl text-muted-foreground">...</span>
    </div>

    <div class="flex gap-3 w-full">
      <Button
        variant="destructive"
        size="lg"
        class="flex-1 text-base cursor-pointer"
        @click="$emit('skip')"
      >
        пропустити
      </Button>
      <Button
        size="lg"
        class="flex-1 text-base cursor-pointer"
        @click="$emit('guessed')"
      >
        вгадали!
      </Button>
    </div>
  </div>
</template>
