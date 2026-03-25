<template>
  <div>
    <!-- Hero -->
    <div class="bg-white border-b border-border">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-text-dark">
            Mon <span class="text-accent">Club</span>
          </h1>
          <p class="text-text-muted mt-1 text-sm">Gerez vos evenements et suivez les inscriptions</p>
        </div>
        <router-link
          to="/admin/create"
          class="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-light text-white rounded-lg font-semibold text-sm transition-all"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
          Nouvel evenement
        </router-link>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <LoadingSpinner v-if="loading" message="Chargement de vos événements..." />

      <!-- Stats -->
      <div v-else-if="events.length > 0" class="space-y-6">
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div class="bg-white rounded-2xl border border-border p-4 text-center shadow-sm">
            <p class="text-2xl font-bold text-primary">{{ events.length }}</p>
            <p class="text-xs text-slate-400 mt-1">Événements</p>
          </div>
          <div class="bg-white rounded-2xl border border-border p-4 text-center shadow-sm">
            <p class="text-2xl font-bold text-emerald-600">{{ confirmedCount }}</p>
            <p class="text-xs text-slate-400 mt-1">Confirmés</p>
          </div>
          <div class="bg-white rounded-2xl border border-border p-4 text-center shadow-sm">
            <p class="text-2xl font-bold text-blue-600">{{ totalVotes }}</p>
            <p class="text-xs text-slate-400 mt-1">J'aime</p>
          </div>
          <div class="bg-white rounded-2xl border border-border p-4 text-center shadow-sm">
            <p class="text-2xl font-bold text-accent">{{ totalAttendees }}</p>
            <p class="text-xs text-slate-400 mt-1">Inscrits total</p>
          </div>
        </div>

        <!-- Events List -->
        <div class="space-y-4">
          <div
            v-for="evt in events"
            :key="evt.id"
            class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
          >
            <div class="flex flex-col sm:flex-row">
              <!-- Image -->
              <div class="sm:w-48 h-40 sm:h-auto shrink-0">
                <img
                  v-if="evt.imageUrl"
                  :src="evt.imageUrl"
                  :alt="evt.title"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full bg-surface"></div>
              </div>

              <!-- Content -->
              <div class="flex-1 p-5 space-y-3">
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <h3 class="font-bold text-slate-800 text-lg">{{ evt.title }}</h3>
                    <div class="flex flex-wrap gap-2 mt-1">
                      <span
                        class="px-2 py-0.5 rounded-full text-xs font-semibold"
                        :class="{
                          'bg-emerald-100 text-emerald-700': evt.status === 'confirmed',
                          'bg-blue-100 text-blue-700': evt.status === 'poll',
                          'bg-amber-100 text-amber-700': evt.status === 'pending'
                        }"
                      >
                        {{ evt.status === 'confirmed' ? 'Confirme' : evt.status === 'poll' ? 'Sondage' : 'En attente' }}
                      </span>
                      <span
                        class="px-2 py-0.5 rounded-full text-xs font-semibold"
                        :class="evt.type === 'free' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'"
                      >
                        {{ evt.type === 'free' ? 'Gratuit' : `${evt.price} MAD` }}
                      </span>
                    </div>
                  </div>
                  <router-link
                    :to="`/events/${evt.id}`"
                    class="text-xs text-accent hover:text-accent-dark font-medium whitespace-nowrap"
                  >
                    Voir →
                  </router-link>
                </div>

                <div class="flex items-center gap-6 text-sm text-slate-500">
                  <span class="flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" /></svg>
                    {{ evt.votesCount || 0 }} votes
                  </span>
                  <span class="flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {{ evt.attendees?.length || 0 }} inscrits
                  </span>
                </div>

                <!-- View Attendees Button -->
                <button
                  @click="openAttendees(evt)"
                  class="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-sm font-semibold transition-all"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  Voir les inscrits
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty -->
      <div v-else class="text-center py-16">
        <svg class="w-16 h-16 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4" /></svg>
        <p class="text-slate-500 font-medium">Aucun événement créé</p>
        <p class="text-slate-400 text-sm mt-1">Commencez par créer votre premier événement</p>
        <router-link
          to="/admin/create"
          class="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-accent hover:bg-accent-light text-white rounded-xl font-semibold text-sm
                 shadow-md transition-all"
        >
          Créer un événement
        </router-link>
      </div>
    </div>

    <!-- Attendees Modal -->
    <AttendeesModal
      v-model:show="showAttendeesModal"
      :event-title="selectedEvent?.title || ''"
      :attendees="selectedEvent?.attendees || []"
    />
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import LoadingSpinner from '@/components/layout/LoadingSpinner.vue'
import AttendeesModal from '@/components/events/AttendeesModal.vue'
import { useEvents } from '@/composables/useEvents'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const { events, loading, fetchClubEvents } = useEvents()

const showAttendeesModal = ref(false)
const selectedEvent = ref(null)

function openAttendees(evt) {
  selectedEvent.value = evt
  showAttendeesModal.value = true
}

const confirmedCount = computed(() => events.value.filter((e) => e.status === 'confirmed').length)
const totalVotes = computed(() => events.value.reduce((sum, e) => sum + (e.votesCount || 0), 0))
const totalAttendees = computed(() => events.value.reduce((sum, e) => sum + (e.attendees?.length || 0), 0))

onMounted(() => {
  if (authStore.user?.uid) {
    fetchClubEvents(authStore.user.uid)
  }
})
</script>
