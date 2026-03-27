<template>
  <div>
    <LoadingSpinner v-if="loading" message="Chargement de l'événement..." />

    <div v-else-if="event">
      <!-- Hero Image -->
      <div class="relative h-64 sm:h-80 md:h-96">
        <img
          v-if="event.imageUrl"
          :src="event.imageUrl"
          :alt="event.title"
          class="w-full h-full object-cover"
        />
        <div v-else class="w-full h-full bg-gradient-to-br from-primary to-primary-light"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

        <!-- Back button -->
        <button
          @click="$router.back()"
          class="absolute top-4 left-4 p-2 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
        </button>

        <!-- Title overlay -->
        <div class="absolute bottom-0 left-0 right-0 p-6">
          <div class="max-w-4xl mx-auto">
            <div class="flex flex-wrap gap-2 mb-3">
              <span
                class="px-3 py-1 rounded-full text-xs font-bold shadow-sm"
                :class="event.type === 'free' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'"
              >
                {{ event.type === 'free' ? 'Gratuit' : `${event.price} MAD` }}
              </span>
              <span class="px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-sm">
                {{ event.status === 'poll' ? 'Sondage' : 'Confirme' }}
              </span>
            </div>
            <h1 class="text-2xl sm:text-4xl font-bold text-white leading-tight">{{ event.title }}</h1>
            <p class="text-white/70 mt-1 font-medium">Par {{ event.clubName }}</p>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="max-w-4xl mx-auto px-4 py-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Main -->
          <div class="md:col-span-2 space-y-6">
            <div>
              <h2 class="text-lg font-bold text-slate-800 mb-3">À propos</h2>
              <p class="text-slate-600 leading-relaxed whitespace-pre-line">{{ event.description }}</p>
            </div>

            <!-- Target Audience -->
            <div>
              <h2 class="text-lg font-bold text-slate-800 mb-3">Public cible</h2>
              <div v-if="event.targetAudience === 'all'" class="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-medium">
                Toutes les filieres
              </div>
              <div v-else class="flex flex-wrap gap-2">
                <span
                  v-for="f in event.targetAudience"
                  :key="f"
                  class="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm font-medium"
                >
                  {{ f }}
                </span>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="space-y-4">
            <!-- Info card -->
            <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <p class="text-xs text-slate-400">Date</p>
                  <p class="text-sm font-semibold text-slate-700">{{ formatDate(event.date) }}</p>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <div>
                  <p class="text-xs text-slate-400">Lieu</p>
                  <p class="text-sm font-semibold text-slate-700">{{ event.location }}</p>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <div>
                  <p class="text-xs text-slate-400">Inscrits</p>
                  <p class="text-sm font-semibold text-slate-700">{{ event.attendees?.length || 0 }} participant(s)</p>
                </div>
              </div>


            </div>

            <!-- STUDENT: Register Button -->
            <template v-if="isStudent">
              <button
                v-if="canRegister && !isRegistered"
                @click="handleRegister"
                :disabled="registering"
                class="w-full py-3 bg-accent hover:bg-accent-light text-white rounded-xl font-bold text-sm
                       shadow-lg shadow-accent/25 hover:shadow-accent/40 transition-all duration-200
                       disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <svg v-if="registering" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 100 8v4a8 8 0 01-8-8z"></path>
                </svg>
                S'inscrire à l'événement
              </button>

              <div
                v-else-if="isRegistered"
                class="w-full py-3 bg-emerald-50 text-emerald-700 rounded-xl font-semibold text-sm text-center border border-emerald-200"
              >
                Vous etes inscrit(e)
              </div>

              <div
                v-else-if="isPastEvent"
                class="w-full py-3 bg-slate-50 text-slate-400 rounded-xl text-sm text-center border border-slate-200"
              >
                Cet événement est déjà passé
              </div>

              <div
                v-else-if="isWrongFiliere"
                class="w-full py-3 bg-slate-50 text-slate-400 rounded-xl text-sm text-center border border-slate-200"
              >
                Cet événement n'est pas ouvert à votre filière
              </div>
            </template>

            <!-- CLUB / SUPERADMIN: View Attendees Button -->
            <button
              v-if="isClub || isSuperAdmin"
              @click="showAttendeesModal = true"
              class="w-full py-3 bg-primary hover:bg-primary-light text-white rounded-xl font-bold text-sm
                     shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-200
                     flex items-center justify-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Voir les inscrits ({{ event.attendees?.length || 0 }})
            </button>
          </div>
        </div>
      </div>

      <!-- Attendees Modal -->
      <AttendeesModal
        v-model:show="showAttendeesModal"
        :event-title="event.title"
        :attendees="event.attendees || []"
      />
    </div>

    <!-- Not found -->
    <div v-else class="text-center py-20">
      <p class="text-slate-500 text-lg font-medium">Événement introuvable</p>
      <router-link to="/" class="text-accent hover:text-accent-light text-sm font-medium mt-2 inline-block">
        ← Retour à l'accueil
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import LoadingSpinner from '@/components/layout/LoadingSpinner.vue'
import AttendeesModal from '@/components/events/AttendeesModal.vue'
import { useEvents } from '@/composables/useEvents'
import { useAuthStore } from '@/stores/authStore'

const route = useRoute()
const authStore = useAuthStore()
const { event, loading, getEventById, registerToEvent } = useEvents()
const registering = ref(false)
const showAttendeesModal = ref(false)

const isClub = computed(() => authStore.isClub)
const isSuperAdmin = computed(() => authStore.isSuperAdmin)
const isStudent = computed(() => authStore.isStudent)

const isRegistered = computed(() => {
  return event.value?.attendees?.includes(authStore.user?.uid)
})

const isPastEvent = computed(() => {
  if (!event.value) return false
  const eventDate = new Date(event.value.date?.toDate ? event.value.date.toDate() : event.value.date)
  return eventDate < new Date()
})

const isWrongFiliere = computed(() => {
  if (!event.value) return false
  const audience = event.value.targetAudience
  if (audience === 'all') return false
  if (Array.isArray(audience)) return !audience.includes(authStore.userFiliere)
  return false
})

const canRegister = computed(() => {
  return !isPastEvent.value && !isWrongFiliere.value
})

async function handleRegister() {
  registering.value = true
  await registerToEvent(event.value.id)
  await getEventById(route.params.id)
  registering.value = false
}

function formatDate(date) {
  if (!date) return ''
  const d = date.toDate ? date.toDate() : new Date(date)
  return d.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  getEventById(route.params.id)
})
</script>
