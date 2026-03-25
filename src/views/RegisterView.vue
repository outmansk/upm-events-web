<template>
  <div class="min-h-screen flex">
    <!-- Left: Brand Panel (desktop only) -->
    <div class="hidden lg:flex lg:w-1/2 bg-primary flex-col items-center justify-center p-12 relative">
      <div class="flex items-center justify-center gap-3 mb-8">
        <img src="/upm-icon.svg" alt="UPM" class="h-14 w-auto brightness-0 invert" />
        <span class="text-accent font-extrabold text-5xl tracking-tight">Events</span>
      </div>
      <h2 class="text-white text-3xl font-bold text-center leading-tight mb-3">Rejoignez-nous</h2>
      <p class="text-white/60 text-center max-w-sm">
        Creez votre compte etudiant et restez informe des evenements du campus.
      </p>
    </div>

    <!-- Right: Form -->
    <div class="flex-1 flex items-center justify-center bg-surface px-4 py-12">
      <div class="w-full max-w-[440px]">
        <!-- Mobile logo -->
        <div class="lg:hidden flex items-center justify-center gap-2 mb-8">
          <img src="/upm-icon.svg" alt="UPM" class="h-10 w-auto" />
          <span class="text-accent font-extrabold text-3xl tracking-tight">Events</span>
        </div>

        <h1 class="text-2xl font-bold text-text-dark mb-1">Creer un compte</h1>
        <p class="text-text-muted text-sm mb-8">Inscrivez-vous pour acceder a UPM Events</p>

        <form @submit.prevent="handleRegister" class="space-y-4">
          <div class="space-y-1.5">
            <label for="displayName" class="block text-sm font-medium text-[#374151]">Nom complet</label>
            <input
              id="displayName"
              v-model="form.displayName"
              type="text"
              required
              placeholder="Ahmed Benali"
              class="w-full h-11 px-4 rounded-lg border border-[#D1D5DB] bg-white text-text-dark placeholder-[#9CA3AF] text-sm
                     focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 transition-all"
            />
            <p v-if="errors.displayName" class="text-xs text-red-500">{{ errors.displayName }}</p>
          </div>

          <div class="space-y-1.5">
            <label for="reg-email" class="block text-sm font-medium text-[#374151]">Email</label>
            <input
              id="reg-email"
              v-model="form.email"
              type="email"
              required
              placeholder="votre@email.com"
              class="w-full h-11 px-4 rounded-lg border border-[#D1D5DB] bg-white text-text-dark placeholder-[#9CA3AF] text-sm
                     focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 transition-all"
            />
          </div>

          <div class="space-y-1.5">
            <label for="reg-password" class="block text-sm font-medium text-[#374151]">Mot de passe</label>
            <input
              id="reg-password"
              v-model="form.password"
              type="password"
              required
              placeholder="Min. 6 caracteres"
              class="w-full h-11 px-4 rounded-lg border border-[#D1D5DB] bg-white text-text-dark placeholder-[#9CA3AF] text-sm
                     focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 transition-all"
            />
            <p v-if="errors.password" class="text-xs text-red-500">{{ errors.password }}</p>
          </div>

          <!-- Filiere -->
          <div class="space-y-1.5">
            <label for="filiere" class="block text-sm font-medium text-[#374151]">Filiere</label>
            <select
              id="filiere"
              v-model="form.filiere"
              required
              class="w-full h-11 px-4 rounded-lg border border-[#D1D5DB] bg-white text-text-dark text-sm
                     focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 transition-all appearance-none cursor-pointer"
            >
              <option value="" disabled>Choisir une filiere</option>
              <option v-for="f in filieres" :key="f" :value="f">{{ f }}</option>
            </select>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full h-11 bg-primary hover:bg-primary-light text-white rounded-lg font-semibold text-sm
                   transition-all duration-200
                   disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
          >
            <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 100 8v4a8 8 0 01-8-8z"></path>
            </svg>
            {{ loading ? 'Creation...' : 'Creer mon compte' }}
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-text-muted text-sm">
            Deja un compte ?
            <router-link to="/login" class="text-accent hover:text-accent-dark font-semibold transition-colors">
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
    router.push('/login')
  }
}
</script>
