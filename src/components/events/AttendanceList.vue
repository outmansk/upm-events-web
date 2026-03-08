<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <h4 class="text-sm font-semibold text-slate-700">
        Inscrits ({{ attendees.length }})
      </h4>
      <button
        v-if="attendees.length > 0"
        @click="expanded = !expanded"
        class="text-xs text-accent hover:text-accent-dark transition-colors font-medium"
      >
        {{ expanded ? 'Masquer' : 'Voir tout' }}
      </button>
    </div>

    <div v-if="loading" class="text-sm text-slate-400">Chargement...</div>

    <div v-else-if="attendees.length === 0" class="text-sm text-slate-400 italic">
      Aucun inscrit pour le moment
    </div>

    <transition name="slide">
      <div v-if="expanded && attendeeProfiles.length > 0" class="space-y-2">
        <div
          v-for="profile in attendeeProfiles"
          :key="profile.uid"
          class="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl"
        >
          <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span class="text-primary text-xs font-bold">{{ getInitials(profile.displayName) }}</span>
          </div>
          <div class="min-w-0">
            <p class="text-sm font-medium text-slate-700 truncate">{{ profile.displayName }}</p>
            <p class="text-xs text-slate-400">{{ profile.filiere }}</p>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase/config'

const props = defineProps({
  attendees: {
    type: Array,
    default: () => []
  }
})

const attendeeProfiles = ref([])
const loading = ref(false)
const expanded = ref(false)

async function fetchProfiles() {
  if (props.attendees.length === 0) return
  loading.value = true
  try {
    const profiles = await Promise.all(
      props.attendees.map(async (uid) => {
        const snap = await getDoc(doc(db, 'users', uid))
        return snap.exists() ? { uid, ...snap.data() } : { uid, displayName: 'Utilisateur', filiere: '' }
      })
    )
    attendeeProfiles.value = profiles
  } catch (err) {
    console.error('Error fetching attendee profiles:', err)
  } finally {
    loading.value = false
  }
}

function getInitials(name) {
  if (!name) return '?'
  return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
}

onMounted(fetchProfiles)
watch(() => props.attendees, fetchProfiles, { deep: true })
</script>
