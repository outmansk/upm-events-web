<template>
  <div class="flex items-center gap-3">
    <button
      @click.stop.prevent="handleVote"
      :disabled="loading"
      class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border"
      :class="hasVoted
        ? 'bg-primary border-primary text-white hover:bg-primary-light'
        : 'bg-white text-text-muted border-border hover:border-primary hover:text-primary'
      "
    >
      <svg class="w-4 h-4" :class="{ 'animate-bounce': justVoted }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
      </svg>
      {{ hasVoted ? 'Vote' : 'Voter' }}
    </button>

    <div class="flex items-center gap-1.5 text-sm">
      <span class="font-bold text-primary text-lg">{{ votesCount }}</span>
      <span class="text-text-muted">vote{{ votesCount !== 1 ? 's' : '' }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useEvents } from '@/composables/useEvents'

const props = defineProps({
  eventId: {
    type: String,
    required: true
  },
  voterIds: {
    type: Array,
    default: () => []
  },
  votesCount: {
    type: Number,
    default: 0
  }
})

const authStore = useAuthStore()
const { toggleVote } = useEvents()
const loading = ref(false)
const justVoted = ref(false)

const hasVoted = computed(() => {
  return props.voterIds?.includes(authStore.user?.uid)
})

async function handleVote() {
  loading.value = true
  await toggleVote(props.eventId)
  if (!hasVoted.value) {
    justVoted.value = true
    setTimeout(() => { justVoted.value = false }, 600)
  }
  loading.value = false
}
</script>
