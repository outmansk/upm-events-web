<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" @click.self="close">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">

      <!-- Header -->
      <div class="p-5 sm:p-6 border-b border-slate-100 shrink-0">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-bold text-slate-800">Liste des inscrits</h2>
            <p class="text-sm text-slate-500 mt-0.5">{{ eventTitle }}</p>
          </div>
          <button @click="close" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <!-- Counter + Search -->
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-4">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg shrink-0">
            <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <span class="text-sm font-bold text-primary">{{ attendeeProfiles.length }}</span>
            <span class="text-xs text-primary/70">étudiant(s) inscrit(s)</span>
          </div>
          <div class="relative flex-1">
            <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input
              v-model="search"
              type="text"
              placeholder="Rechercher par nom..."
              class="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
            />
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-5 sm:p-6">
        <!-- Loading -->
        <div v-if="loading" class="flex items-center justify-center py-12">
          <svg class="w-6 h-6 animate-spin text-accent" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 100 8v4a8 8 0 01-8-8z"></path>
          </svg>
          <span class="ml-2 text-sm text-slate-500">Chargement...</span>
        </div>

        <!-- Empty -->
        <div v-else-if="filteredProfiles.length === 0 && !search" class="text-center py-12">
          <svg class="w-12 h-12 mx-auto text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          <p class="text-slate-400 font-medium">Aucun inscrit pour le moment</p>
        </div>

        <!-- No search results -->
        <div v-else-if="filteredProfiles.length === 0 && search" class="text-center py-12">
          <p class="text-slate-400">Aucun résultat pour "<span class="font-medium">{{ search }}</span>"</p>
        </div>

        <!-- Attendees List -->
        <div v-else class="space-y-2">
          <div
            v-for="(profile, index) in filteredProfiles"
            :key="profile.uid"
            class="flex items-center gap-4 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100"
          >
            <!-- Avatar -->
            <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span class="text-primary text-sm font-bold">{{ getInitials(profile.displayName) }}</span>
            </div>

            <!-- Info -->
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-slate-800 truncate">{{ profile.displayName || 'Étudiant' }}</p>
              <p class="text-xs text-slate-500 truncate">{{ profile.email || '—' }}</p>
            </div>

            <!-- Filière -->
            <div class="hidden sm:block text-right shrink-0">
              <span v-if="profile.filiere" class="inline-block px-2 py-0.5 bg-purple-50 text-purple-600 rounded-full text-xs font-medium">
                {{ profile.filiere }}
              </span>
              <span v-else class="text-xs text-slate-400">—</span>
            </div>

            <!-- Number -->
            <div class="text-xs text-slate-400 font-mono shrink-0">#{{ index + 1 }}</div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 shrink-0 flex flex-col sm:flex-row gap-3">
        <button
          @click="exportCSV"
          :disabled="attendeeProfiles.length === 0"
          class="flex-1 inline-flex items-center justify-center gap-2 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold text-sm
                 shadow-md shadow-emerald-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          Exporter CSV
        </button>
        <button
          @click="close"
          class="flex-1 py-2.5 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-xl font-semibold text-sm transition-all"
        >
          Fermer
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase/config'

const props = defineProps({
  show: Boolean,
  eventTitle: { type: String, default: '' },
  attendees: { type: Array, default: () => [] }
})

const emit = defineEmits(['update:show'])

const search = ref('')
const loading = ref(false)
const attendeeProfiles = ref([])

// Fetch all attendee profiles when modal opens
watch(() => props.show, async (isOpen) => {
  if (isOpen && props.attendees.length > 0) {
    await fetchProfiles()
  }
  if (!isOpen) {
    search.value = ''
  }
})

// Re-fetch if attendees list changes while open
watch(() => props.attendees, async () => {
  if (props.show && props.attendees.length > 0) {
    await fetchProfiles()
  }
}, { deep: true })

async function fetchProfiles() {
  loading.value = true
  try {
    const profiles = await Promise.all(
      props.attendees.map(async (uid) => {
        const snap = await getDoc(doc(db, 'users', uid))
        return snap.exists()
          ? { uid, ...snap.data() }
          : { uid, displayName: 'Utilisateur inconnu', email: '', filiere: '' }
      })
    )
    attendeeProfiles.value = profiles
  } catch (err) {
    console.error('Error fetching attendee profiles:', err)
  } finally {
    loading.value = false
  }
}

const filteredProfiles = computed(() => {
  if (!search.value.trim()) return attendeeProfiles.value
  const term = search.value.toLowerCase()
  return attendeeProfiles.value.filter((p) =>
    p.displayName?.toLowerCase().includes(term) ||
    p.email?.toLowerCase().includes(term) ||
    p.filiere?.toLowerCase().includes(term)
  )
})

function getInitials(name) {
  if (!name) return '?'
  return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
}

function exportCSV() {
  const headers = ['Nom', 'Email', 'Filière']
  const rows = attendeeProfiles.value.map((p) => [
    p.displayName || '',
    p.email || '',
    p.filiere || ''
  ])
  const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `inscrits_${props.eventTitle.replace(/[^a-zA-Z0-9]/g, '_')}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

function close() {
  emit('update:show', false)
}
</script>
