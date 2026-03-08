<template>
  <div class="flex flex-col items-start gap-1">
    <div class="flex items-center gap-1 group/rating">
      <button
        v-for="star in 5"
        :key="star"
        type="button"
        @click="rate(star)"
        @mouseenter="hoverState = star"
        @mouseleave="hoverState = 0"
        :disabled="loading || disabled"
        class="p-0.5 transition-transform"
        :class="{
          'hover:scale-110': !disabled && !loading,
          'cursor-not-allowed opacity-50': disabled || loading
        }"
      >
        <svg
          class="w-6 h-6 transition-colors duration-200"
          :class="{
            'text-amber-400 fill-amber-400': isFilled(star),
            'text-slate-200 fill-transparent': !isFilled(star),
            'group-hover/rating:text-amber-300': !disabled && star <= hoverState
          }"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      </button>

      <span class="ml-2 text-sm font-bold text-slate-700" v-if="averageRating > 0">
        {{ averageRating.toFixed(1) }}
      </span>
      <span class="text-xs text-slate-400" v-if="ratingsCount > 0">
        ({{ ratingsCount }} avis)
      </span>
      <span class="ml-2 text-sm text-slate-400 italic" v-else>
        Aucun avis
      </span>
    </div>

    <!-- Feedback message -->
    <span v-if="userHasRated" class="text-xs text-emerald-600 font-medium">
      Merci pour votre note !
    </span>
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
  ratings: {
    type: Object,
    default: () => ({})
  },
  averageRating: {
    type: Number,
    default: 0
  },
  ratingsCount: {
    type: Number,
    default: 0
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const authStore = useAuthStore()
const { rateEvent } = useEvents()
const loading = ref(false)
const hoverState = ref(0)

const userHasRated = computed(() => {
  const uid = authStore.user?.uid
  return uid ? !!props.ratings[uid] : false
})

const currentUserRating = computed(() => {
  const uid = authStore.user?.uid
  return uid ? props.ratings[uid] : 0
})

function isFilled(star) {
  if (hoverState.value > 0) return star <= hoverState.value
  return star <= currentUserRating.value || (star <= props.averageRating && !currentUserRating.value)
}

async function rate(stars) {
  if (loading.value || props.disabled) return
  
  loading.value = true
  await rateEvent(props.eventId, stars)
  loading.value = false
}
</script>
