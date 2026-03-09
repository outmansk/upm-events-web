<template>
  <div>
    <!-- Hero -->
    <div class="bg-gradient-to-r from-primary to-primary-light text-white py-10 px-4">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-3xl sm:text-4xl font-bold">
          Découvrez les <span class="text-accent">événements</span>
        </h1>
        <p class="text-white/70 mt-2 text-sm sm:text-base max-w-xl">
          Découvrez les événements confirmés ou les sondages ouverts de votre université.
        </p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <!-- Filters -->
      <EventFilter
        v-model:search="search"
        v-model:active-filter="activeFilter"
        :filters="filterOptions"
      />

      <!-- Loading -->
      <LoadingSpinner v-if="loading" message="Chargement des événements..." />

      <!-- Events Grid -->
      <div v-else-if="filteredEvents.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <EventCard
          v-for="evt in filteredEvents"
          :key="evt.id"
          :event="evt"
          :disable-link="authStore.isStudent"
          @card-click="handleEventClick"
        />
      </div>

      <!-- Empty -->
      <div v-else class="text-center py-16">
        <svg class="w-16 h-16 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        <p class="text-slate-500 font-medium">Aucun événement trouvé</p>
        <p class="text-slate-400 text-sm mt-1">Essayez de modifier vos filtres</p>
      </div>
    </div>

    <!-- Event Detail Modal -->
    <EventModal
      v-model:show="showModal"
      :event="selectedEvent"
      @registered="() => { fetchConfirmedEvents({ type: activeFilter !== 'all' ? activeFilter : undefined }) }"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import EventCard from '@/components/events/EventCard.vue'
import EventFilter from '@/components/events/EventFilter.vue'
import EventModal from '@/components/events/EventModal.vue'
import LoadingSpinner from '@/components/layout/LoadingSpinner.vue'
import { useEvents } from '@/composables/useEvents'
import { useAuthStore } from '@/stores/authStore'

const { events, loading, fetchConfirmedEvents } = useEvents()
const authStore = useAuthStore()

const showModal = ref(false)
const selectedEvent = ref(null)

function handleEventClick(evt) {
  if (authStore.isStudent) {
    selectedEvent.value = evt
    showModal.value = true
  }
}

const search = ref('')
const activeFilter = ref('all')

const filterOptions = [
  { label: 'Tous', value: 'all' },
  { label: 'Gratuits', value: 'free' },
  { label: 'Payants', value: 'paid' }
]

const filteredEvents = computed(() => {
  let result = events.value

  // Type filter
  if (activeFilter.value !== 'all') {
    result = result.filter((e) => e.type === activeFilter.value)
  }

  // Search
  if (search.value.trim()) {
    const term = search.value.toLowerCase()
    result = result.filter((e) =>
      e.title.toLowerCase().includes(term) ||
      e.clubName?.toLowerCase().includes(term)
    )
  }

  return result
})

onMounted(() => {
  fetchConfirmedEvents()
})

watch(activeFilter, () => {
  fetchConfirmedEvents({ type: activeFilter.value !== 'all' ? activeFilter.value : undefined })
})
</script>
