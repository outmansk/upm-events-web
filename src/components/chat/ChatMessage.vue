<template>
  <div
    class="flex gap-3 max-w-[85%]"
    :class="isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'"
  >
    <!-- Avatar -->
    <div
      class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
      :class="isUser ? 'bg-primary/10' : 'bg-accent/10'"
    >
      <span v-if="isUser" class="text-primary text-xs font-bold">{{ initials }}</span>
      <svg v-else class="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    </div>

    <!-- Message bubble -->
    <div
      class="px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap"
      :class="isUser
        ? 'bg-primary text-white rounded-br-md'
        : 'bg-white border border-border text-text-dark rounded-bl-md shadow-sm'"
    >
      {{ message.content }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'

const props = defineProps({
  message: {
    type: Object,
    required: true
  }
})

const authStore = useAuthStore()

const isUser = computed(() => props.message.role === 'user')
const initials = computed(() => {
  const name = authStore.userDisplayName || ''
  if (!name) return '?'
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
})
</script>
