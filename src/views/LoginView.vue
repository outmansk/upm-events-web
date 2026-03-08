<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary-dark to-slate-900 px-4 py-12">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-2xl shadow-lg shadow-accent/30 mb-4">
          <span class="text-white font-bold text-2xl">U</span>
        </div>
        <h1 class="text-3xl font-bold text-white">Bienvenue</h1>
        <p class="text-white/60 mt-1 text-sm">Connectez-vous à UPM Events</p>
      </div>

      <!-- Card -->
      <div class="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
        <form @submit.prevent="handleLogin" class="space-y-5">
          <div class="space-y-1">
            <label for="email" class="block text-sm font-medium text-white/80">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              placeholder="votre@email.com"
              class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40
                     focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all text-sm"
            />
          </div>

          <div class="space-y-1">
            <label for="password" class="block text-sm font-medium text-white/80">Mot de passe</label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              placeholder="••••••••"
              class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40
                     focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all text-sm"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 bg-accent hover:bg-accent-light text-white rounded-xl font-semibold text-sm
                   shadow-lg shadow-accent/25 hover:shadow-accent/40 transition-all duration-200
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
          <p class="text-white/50 text-sm">
            Pas encore de compte ?
            <router-link to="/register" class="text-accent hover:text-accent-light font-semibold transition-colors">
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
