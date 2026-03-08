<template>
  <div class="flex items-center gap-3">
    <button
      @click="handleVote"
      :disabled="loading"
      class="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200"
      :class="hasVoted
        ? 'bg-accent text-white shadow-md shadow-accent/25 hover:bg-accent-dark'
        : 'bg-white text-slate-600 border border-slate-200 hover:border-accent hover:text-accent'
      "
    >
      <svg class="w-4 h-4" :class="{ 'animate-bounce': justVoted }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
      </svg>
      {{ hasVoted ? 'Voté' : 'Voter' }}
    </button>

    <div class="flex items-center gap-1.5 text-sm">
      <span class="font-bold text-primary text-lg">{{ votesCount }}</span>
      <span class="text-slate-400">vote{{ votesCount !== 1 ? 's' : '' }}</span>
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
