<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm sm:p-6" @click.self="close">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
      
      <!-- Close button -->
      <button @click="close" class="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 text-white backdrop-blur-md transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>

      <!-- Header Image -->
      <div class="relative h-48 sm:h-64 shrink-0">
        <img v-if="event.imageUrl" :src="event.imageUrl" :alt="event.title" class="w-full h-full object-cover" />
        <div v-else class="w-full h-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
          <svg class="w-16 h-16 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        </div>
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        
        <div class="absolute bottom-0 left-0 right-0 p-5">
          <div class="flex flex-wrap gap-2 mb-2">
            <span class="px-2.5 py-1 rounded-full text-xs font-bold shadow-sm" :class="event.type === 'free' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'">
              {{ event.type === 'free' ? 'Gratuit' : `${event.price} MAD` }}
            </span>
            <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-sm">
              {{ event.status === 'poll' ? 'Sondage' : 'Confirme' }}
            </span>
          </div>
          <h2 class="text-xl sm:text-2xl font-bold text-white leading-tight">{{ event.title }}</h2>
          <p class="text-white/80 text-sm mt-1 font-medium">Organisé par {{ event.clubName }}</p>
        </div>
      </div>

      <!-- Scrollable Content -->
      <div class="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
        
        <!-- Info Grid -->
        <div class="grid grid-cols-2 gap-4">
          <div class="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div class="mt-0.5 text-primary">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <div>
              <p class="text-xs font-medium text-slate-500">Date et heure</p>
              <p class="text-sm font-semibold text-slate-800">{{ formatDate(event.date) }}</p>
            </div>
          </div>
          
          <div class="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div class="mt-0.5 text-accent">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
            <div>
              <p class="text-xs font-medium text-slate-500">Lieu</p>
              <p class="text-sm font-semibold text-slate-800">{{ event.location }}</p>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div>
          <h3 class="text-sm font-bold text-slate-800 mb-2">Description complète</h3>
          <p class="text-slate-600 text-sm leading-relaxed whitespace-pre-line bg-white">{{ event.description }}</p>
        </div>

        <!-- Target Audience -->
        <div>
          <h3 class="text-sm font-bold text-slate-800 mb-2">Public cible</h3>
          <div v-if="event.targetAudience === 'all'" class="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium border border-blue-100">
            Cible toutes les filières
          </div>
          <div v-else class="flex flex-wrap gap-2">
            <span v-for="f in event.targetAudience" :key="f" class="px-2.5 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium border border-purple-100">
              {{ f }}
            </span>
          </div>
        </div>

      </div>

      <!-- Footer Action -->
      <div v-if="isStudent" class="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 shrink-0">
        <button
          v-if="canRegister && !isRegistered"
          @click="handleRegister"
          :disabled="registering"
          class="w-full py-2.5 bg-accent hover:bg-accent-light text-white rounded-xl font-bold text-sm shadow-md shadow-accent/20 transition-all disabled:opacity-50 flex justify-center items-center gap-2"
        >
          <svg v-if="registering" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 100 8v4a8 8 0 01-8-8z"></path></svg>
          S'inscrire à l'événement
        </button>

        <div v-else-if="isRegistered" class="w-full py-2.5 bg-emerald-100 text-emerald-700 rounded-xl font-semibold text-sm text-center border border-emerald-200">
          Vous etes inscrit(e)
        </div>

        <div v-else-if="isPastEvent" class="w-full py-2.5 bg-slate-200 text-slate-500 rounded-xl text-sm text-center border border-slate-300">
          Cet événement est déjà passé
        </div>

        <div v-else-if="isWrongFiliere" class="w-full py-2.5 bg-slate-200 text-slate-500 rounded-xl text-sm text-center border border-slate-300">
          Cet événement n'est pas ouvert à votre filière
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useEvents } from '@/composables/useEvents'

const props = defineProps({
  show: Boolean,
  event: Object
})

const emit = defineEmits(['update:show', 'registered'])

const authStore = useAuthStore()
const { registerToEvent } = useEvents()

const registering = ref(false)
const localEventItem = ref(null)

watch(() => props.event, (newVal) => {
  if (newVal) {
    localEventItem.value = { ...newVal }
  }
}, { immediate: true })

const event = computed(() => localEventItem.value || props.event || {})

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

function close() {
  emit('update:show', false)
}

async function handleRegister() {
  registering.value = true
  await registerToEvent(event.value.id)
  
  // Make pessimistic update locally so UI updates right away
  if (localEventItem.value) {
      const attendees = localEventItem.value.attendees || []
      if (!attendees.includes(authStore.user?.uid)) {
          localEventItem.value.attendees = [...attendees, authStore.user?.uid]
      }
  }
  
  registering.value = false
  emit('registered', event.value.id)
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
</script>
