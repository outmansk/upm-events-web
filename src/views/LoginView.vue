<template>
  <div class="min-h-screen flex">
    <!-- Left: Brand Panel (desktop only) -->
    <div class="hidden lg:flex lg:w-1/2 bg-primary flex-col items-center justify-center p-12 relative">
      <img src="https://upm.ac.ma/wp-content/themes/upm2017/img/upm.svg" alt="UPM" class="h-16 w-auto brightness-0 invert mb-8" />
      <h2 class="text-white text-3xl font-bold text-center leading-tight mb-3">UPM Events</h2>
      <p class="text-white/60 text-center max-w-sm">
        Votre portail pour decouvrir et participer aux evenements de l'Universite Privee de Marrakech.
      </p>
    </div>

    <!-- Right: Form -->
    <div class="flex-1 flex items-center justify-center bg-surface px-4 py-12">
      <div class="w-full max-w-[440px]">
        <!-- Mobile logo -->
        <div class="lg:hidden text-center mb-8">
          <img src="https://upm.ac.ma/wp-content/themes/upm2017/img/upm.svg" alt="UPM" class="h-12 w-auto mx-auto mb-4" />
        </div>

        <h1 class="text-2xl font-bold text-text-dark mb-1">Bienvenue</h1>
        <p class="text-text-muted text-sm mb-8">Connectez-vous a votre compte UPM Events</p>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <div class="space-y-1.5">
            <label for="email" class="block text-sm font-medium text-[#374151]">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              placeholder="votre@email.com"
              class="w-full h-11 px-4 rounded-lg border border-[#D1D5DB] bg-white text-text-dark placeholder-[#9CA3AF] text-sm
                     focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 transition-all"
            />
          </div>

          <div class="space-y-1.5">
            <label for="password" class="block text-sm font-medium text-[#374151]">Mot de passe</label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              placeholder="Votre mot de passe"
              class="w-full h-11 px-4 rounded-lg border border-[#D1D5DB] bg-white text-text-dark placeholder-[#9CA3AF] text-sm
                     focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 transition-all"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full h-11 bg-primary hover:bg-primary-light text-white rounded-lg font-semibold text-sm
                   transition-all duration-200
                   disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 100 8v4a8 8 0 01-8-8z"></path>
            </svg>
            {{ loading ? 'Connexion...' : 'Se connecter' }}
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-text-muted text-sm">
            Pas encore de compte ?
            <router-link to="/register" class="text-accent hover:text-accent-dark font-semibold transition-colors">
              S'inscrire
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { login, loading } = useAuth()

const email = ref('')
const password = ref('')

async function handleLogin() {
  const success = await login(email.value, password.value)
  if (success) {
    router.push('/')
  }
}
</script>
