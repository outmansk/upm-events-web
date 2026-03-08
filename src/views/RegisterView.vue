<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary-dark to-slate-900 px-4 py-12">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-2xl shadow-lg shadow-accent/30 mb-4">
          <span class="text-white font-bold text-2xl">U</span>
        </div>
        <h1 class="text-3xl font-bold text-white">Créer un compte</h1>
        <p class="text-white/60 mt-1 text-sm">Rejoignez la communauté UPM Events</p>
      </div>

      <!-- Card -->
      <div class="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
        <form @submit.prevent="handleRegister" class="space-y-4">
          <div class="space-y-1">
            <label for="displayName" class="block text-sm font-medium text-white/80">Nom complet</label>
            <input
              id="displayName"
              v-model="form.displayName"
              type="text"
              required
              placeholder="Ahmed Benali"
              class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all text-sm"
            />
            <p v-if="errors.displayName" class="text-xs text-red-400">{{ errors.displayName }}</p>
          </div>

          <div class="space-y-1">
            <label for="reg-email" class="block text-sm font-medium text-white/80">Email</label>
            <input
              id="reg-email"
              v-model="form.email"
              type="email"
              required
              placeholder="votre@email.com"
              class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all text-sm"
            />
          </div>

          <div class="space-y-1">
            <label for="reg-password" class="block text-sm font-medium text-white/80">Mot de passe</label>
            <input
              id="reg-password"
              v-model="form.password"
              type="password"
              required
              placeholder="Min. 6 caractères"
              class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all text-sm"
            />
            <p v-if="errors.password" class="text-xs text-red-400">{{ errors.password }}</p>
          </div>



          <!-- Filiere -->
          <div class="space-y-1">
            <label for="filiere" class="block text-sm font-medium text-white/80">Filière</label>
            <select
              id="filiere"
              v-model="form.filiere"
              required
              class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all text-sm appearance-none cursor-pointer"
            >
              <option value="" disabled class="bg-slate-800 text-white">Choisir une filière</option>
              <option v-for="f in filieres" :key="f" :value="f" class="bg-slate-800 text-white">{{ f }}</option>
            </select>
          </div>



          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 bg-accent hover:bg-accent-light text-white rounded-xl font-semibold text-sm
                   shadow-lg shadow-accent/25 hover:shadow-accent/40 transition-all duration-200
                   disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
          >
            <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 100 8v4a8 8 0 01-8-8z"></path>
            </svg>
            {{ loading ? 'Création...' : 'Créer mon compte' }}
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-white/50 text-sm">
            Déjà un compte ?
            <router-link to="/login" class="text-accent hover:text-accent-light font-semibold transition-colors">
              Se connecter
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { register, loading } = useAuth()

const filieres = ['Ingénierie', 'Business', 'Santé', 'Arts', 'Sciences']

const form = reactive({
  displayName: '',
  email: '',
  password: '',
  role: 'student',
  filiere: ''
})

const errors = reactive({
  displayName: '',
  password: ''
})

function validate() {
  let valid = true
  errors.displayName = ''
  errors.password = ''

  if (form.displayName.trim().length < 2) {
    errors.displayName = 'Le nom doit contenir au moins 2 caractères'
    valid = false
  }
  if (form.password.length < 6) {
    errors.password = 'Le mot de passe doit contenir au moins 6 caractères'
    valid = false
  }
  return valid
}

async function handleRegister() {
  if (!validate()) return

  const success = await register(form.email, form.password, {
    displayName: form.displayName,
    role: 'student',
    filiere: form.filiere,
    clubName: ''
  })
  if (success) {
    router.push('/')
  }
}
</script>
