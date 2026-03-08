<template>
  <div>
    <!-- Hero -->
    <div class="bg-gradient-to-r from-primary-dark to-primary text-white py-10 px-4">
      <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold">
            Panel <span class="text-accent">Super Admin</span>
          </h1>
          <p class="text-white/70 mt-1 text-sm">Gérez les comptes clubs de la plateforme</p>
        </div>
        <button
          @click="showCreateModal = true"
          class="inline-flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-light text-white rounded-xl font-semibold text-sm
                 shadow-lg shadow-accent/25 hover:shadow-accent/40 transition-all"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
          Nouveau Club
        </button>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-8">
      <LoadingSpinner v-if="loading" message="Chargement des clubs..." />

      <div v-else-if="clubs.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="club in clubs"
          :key="club.id"
          class="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4"
        >
          <div class="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-bold text-slate-800 truncate">{{ club.displayName }}</h3>
            <p class="text-sm text-slate-500 truncate mt-0.5">{{ club.email }}</p>
            <p class="text-xs text-slate-400 mt-2">Créé le {{ formatDate(club.createdAt) }}</p>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="text-center py-16">
        <svg class="w-16 h-16 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
        <p class="text-slate-500 font-medium">Aucun club créé</p>
        <p class="text-slate-400 text-sm mt-1">Cliquez sur "Nouveau Club" pour commencer</p>
      </div>
    </div>

    <!-- Create Club Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/50 backdrop-blur-sm">
      <div class="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl relative">
        <button
          @click="showCreateModal = false"
          class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <h2 class="text-2xl font-bold text-slate-800 mb-1">Créer un club</h2>
        <p class="text-slate-500 text-sm mb-6">Ajouter un nouveau compte club à la plateforme</p>

        <form @submit.prevent="handleCreateClub" class="space-y-4">
          <div class="space-y-1">
            <label class="block text-sm font-medium text-slate-700">Nom du club</label>
            <input
              v-model="form.clubName"
              type="text"
              required
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm"
              placeholder="Ex: Club Informatique"
            />
          </div>

          <div class="space-y-1">
             <label class="block text-sm font-medium text-slate-700">Adresse Email</label>
             <input
               v-model="form.email"
               type="email"
               required
               class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm"
               placeholder="contact@club.upm.ac.ma"
             />
           </div>

           <div class="space-y-1">
             <label class="block text-sm font-medium text-slate-700">Mot de passe</label>
             <input
               v-model="form.password"
               type="password"
               required
               minlength="6"
               class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm"
               placeholder="Min. 6 caractères"
             />
           </div>

           <button
             type="submit"
             :disabled="creating"
             class="w-full py-3 bg-primary hover:bg-primary-light text-white rounded-xl font-semibold text-sm shadow-md transition-all mt-6 flex justify-center items-center gap-2 disabled:opacity-50"
           >
             <svg v-if="creating" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
               <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
               <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 100 8v4a8 8 0 01-8-8z"></path>
             </svg>
             {{ creating ? 'Création en cours...' : 'Créer le compte' }}
           </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import LoadingSpinner from '@/components/layout/LoadingSpinner.vue'
import { useAuth } from '@/composables/useAuth'

const { fetchClubAccounts, createClubAccount } = useAuth()

const loading = ref(true)
const creating = ref(false)
const clubs = ref([])
const showCreateModal = ref(false)

const form = reactive({
  clubName: '',
  email: '',
  password: ''
})

onMounted(async () => {
  await loadClubs()
})

async function loadClubs() {
  loading.value = true
  clubs.value = await fetchClubAccounts()
  loading.value = false
}

async function handleCreateClub() {
  creating.value = true
  const success = await createClubAccount(form.email, form.password, form.clubName)
  creating.value = false
  
  if (success) {
    showCreateModal.value = false
    form.clubName = ''
    form.email = ''
    form.password = ''
    await loadClubs() // refresh list
  }
}

function formatDate(date) {
  if (!date) return 'Récent'
  const d = date.toDate ? date.toDate() : new Date(date)
  return d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}
</script>
