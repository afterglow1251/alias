<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog"

interface Props {
  displayName: string
  username: string
  avatarUrl?: string
  bannerUrl?: string
  bannerColor?: string
  bannerGradient?: string
  status?: "online" | "idle" | "dnd" | "offline"
  aboutMe?: string
  roles?: { name: string; color: string }[]
}

withDefaults(defineProps<Props>(), {
  status: "online",
  bannerColor: "#5865f2",
})

const open = defineModel<boolean>("open", { default: false })

const STATUS_MAP = {
  online: { color: "#23a55a", label: "Online" },
  idle: { color: "#f0b232", label: "Idle" },
  dnd: { color: "#f23f43", label: "Do Not Disturb" },
  offline: { color: "#80848e", label: "Offline" },
}
</script>

<template>
  <Dialog v-model:open="open">
    <button
      class="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
      @click="open = true"
    >
      <slot>
        by <span class="underline underline-offset-2">{{ displayName }}</span>
      </slot>
    </button>

    <DialogContent class="!p-0 overflow-hidden !max-w-[340px] !gap-0 !rounded-xl" :show-close-button="false">
      <DialogTitle class="sr-only">{{ displayName }}</DialogTitle>
      <DialogDescription class="sr-only">Discord profile card</DialogDescription>

      <!-- Banner -->
      <div
        class="h-[60px] w-full"
        :style="{
          background: bannerUrl ? `url(${bannerUrl}) center/cover no-repeat` : (bannerGradient || bannerColor),
        }"
      />

      <!-- Avatar area -->
      <div class="relative px-4 pb-0">
        <div class="absolute -top-[38px] left-4">
          <div class="size-[76px] rounded-full bg-card p-[3px]">
            <div
              v-if="avatarUrl"
              class="size-full rounded-full bg-secondary overflow-hidden"
            >
              <img :src="avatarUrl" :alt="displayName" class="size-full object-cover" />
            </div>
            <div
              v-else
              class="size-full rounded-full flex items-center justify-center text-xl font-bold"
              :style="{ backgroundColor: bannerColor }"
            >
              {{ displayName.slice(0, 2).toUpperCase() }}
            </div>
            <!-- Status dot -->
            <div class="absolute bottom-0 right-0 size-[22px] rounded-full bg-card flex items-center justify-center">
              <div
                class="size-[14px] rounded-full"
                :style="{ backgroundColor: STATUS_MAP[status].color }"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Body -->
      <div class="px-4 pt-[42px] pb-4">
        <div class="rounded-lg bg-background border border-border p-3 space-y-2.5">
          <div>
            <p class="text-base font-semibold leading-tight">{{ displayName }}</p>
            <p class="text-xs text-muted-foreground">{{ username }}</p>
          </div>

          <div class="h-px bg-border" />

          <div v-if="aboutMe">
            <p class="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1">
              About me
            </p>
            <p class="text-xs text-foreground/80 leading-relaxed whitespace-pre-line">{{ aboutMe }}</p>
          </div>

          <div v-if="aboutMe && roles?.length" class="h-px bg-border" />

          <div v-if="roles?.length">
            <p class="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1.5">
              Roles
            </p>
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="role in roles"
                :key="role.name"
                class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium bg-secondary border border-border"
              >
                <span class="size-2.5 rounded-full shrink-0" :style="{ backgroundColor: role.color }" />
                {{ role.name }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
