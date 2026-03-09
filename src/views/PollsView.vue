<template>
  <div>
    <!-- Hero -->
    <div class="bg-gradient-to-r from-primary-dark to-primary text-white py-10 px-4">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-3xl sm:text-4xl font-bold">
          Sondages <span class="text-accent">en cours</span>
        </h1>
        <p class="text-white/70 mt-2 text-sm sm:text-base max-w-xl">
          Votez pour les événements que vous aimeriez voir se concrétiser
        </p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-8">
      <LoadingSpinner v-if="loading" message="Chargement des sondages..." />

      <div v-else-if="events.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="evt in events"
          :key="evt.id"
          @click="handleEventClick(evt)"
          class="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
        >
          <!-- Image -->
          <div class="relative h-44">
            <img
              v-if="evt.imageUrl"
              :src="evt.imageUrl"
              :alt="evt.title"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
              <svg class="w-10 h-10 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </div>
            <div class="absolute top-3 left-3">
              <span class="px-3 py-1 rounded-full text-xs font-bold bg-primary/80 text-white backdrop-blur-sm">
                📊 Sondage
              </span>
            </div>
          </div>

          <!-- Content -->
          <div class="p-5 space-y-4">
            <div>
              <h3 class="font-bold text-slate-800 text-lg">{{ evt.title }}</h3>
              <p class="text-sm text-accent font-medium">{{ evt.clubName }}</p>
            </div>
            <p class="text-sm text-slate-500 line-clamp-2">{{ evt.description }}</p>

            <div class="flex items-center gap-3 text-xs text-slate-400">
              <span class="flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                {{ formatDate(evt.date) }}
              </span>
              <span class="flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {{ evt.location }}
              </span>
            </div>

            <!-- Vote -->
            <!-- Vote -->
            <div class="pt-3 border-t border-slate-100" @click.stop>
              <VoteAction
                :event-id="evt.id"
                :voter-ids="evt.voterIds || []"
                :votes-count="evt.votesCount || 0"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Empty -->
      <div v-else class="text-center py-16">
        <svg class="w-16 h-16 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
        <p class="text-slate-500 font-medium">Aucun sondage en cours</p>
        <p class="text-slate-400 text-sm mt-1">Revenez plus tard pour de nouveaux sondages</p>
      </div>
    </div>
    
    <!-- Event Detail Modal -->
    <EventModal
      v-model:show="showModal"
      :event="selectedEvent"
      @registered="() => { fetchPollEvents() }"
    />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import VoteAction from '@/components/events/VoteAction.vue'
import EventModal from '@/components/events/EventModal.vue'
import LoadingSpinner from '@/components/layout/LoadingSpinner.vue'
import { useEvents } from '@/composables/useEvents'
import { useAuthStore } from '@/stores/authStore'

const { events, loading, fetchPollEvents } = useEvents()
const authStore = useAuthStore()

const showModal = ref(false)
const selectedEvent = ref(null)

function handleEventClick(evt) {
  if (authStore.isStudent) {
    selectedEvent.value = evt
    showModal.value = true
  }
}

let unsubscribe = null

onMounted(() => {
  unsubscribe = fetchPollEvents()
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})

function formatDate(date) {
  if (!date) return ''
  const d = date.toDate ? date.toDate() : new Date(date)
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>
