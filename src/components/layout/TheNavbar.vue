<template>
  <nav class="bg-white border-b border-border sticky top-0 z-50 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <router-link to="/" class="flex items-center gap-3 group">
          <img
            src="https://upm.ac.ma/wp-content/themes/upm2017/img/upm.svg"
            alt="UPM"
            class="h-9 w-auto"
          />
          <span class="text-primary font-bold text-lg tracking-tight hidden sm:block">
            UPM <span class="text-accent font-extrabold">Events</span>
          </span>
        </router-link>

        <!-- Desktop Nav -->
        <div class="hidden md:flex items-center gap-1">
          <router-link
            to="/"
            class="relative flex items-center gap-1.5 text-text-muted hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
            active-class="!text-primary after:absolute after:bottom-[-17px] after:left-0 after:right-0 after:h-[2px] after:bg-accent"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" /></svg>
            Accueil
          </router-link>

          <router-link
            v-if="isClub"
            to="/admin"
            class="relative flex items-center gap-1.5 text-text-muted hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
            active-class="!text-primary after:absolute after:bottom-[-17px] after:left-0 after:right-0 after:h-[2px] after:bg-accent"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37 1.066.426 2.573-.82 2.573-1.066z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            Mon Club
          </router-link>
          <router-link
            v-if="isSuperAdmin"
            to="/validation"
            class="relative flex items-center gap-1.5 text-text-muted hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
            active-class="!text-primary after:absolute after:bottom-[-17px] after:left-0 after:right-0 after:h-[2px] after:bg-accent"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Validation
          </router-link>
          <router-link
            v-if="isSuperAdmin"
            to="/superadmin/panel"
            class="relative flex items-center gap-1.5 text-text-muted hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
            active-class="!text-primary after:absolute after:bottom-[-17px] after:left-0 after:right-0 after:h-[2px] after:bg-accent"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            Panel Admin
          </router-link>
        </div>

        <!-- User Info + Logout -->
        <div class="flex items-center gap-3">
          <div class="hidden sm:flex items-center gap-2.5 text-sm">
            <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span class="text-primary font-semibold text-xs">{{ userInitials }}</span>
            </div>
            <span class="text-text-dark max-w-[120px] truncate font-medium">{{ displayName }}</span>
          </div>
          <button
            @click="handleLogout"
            class="text-text-muted hover:text-primary hover:bg-surface px-2.5 py-2 rounded-lg text-sm transition-colors"
            title="Déconnexion"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          </button>

          <!-- Mobile menu button -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden text-text-muted hover:text-primary p-2"
          >
            <svg v-if="!mobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </div>

      <!-- Mobile Nav -->
      <transition name="slide">
        <div v-if="mobileMenuOpen" class="md:hidden pb-4 border-t border-border pt-3 space-y-1">
          <router-link to="/" class="block text-text-muted hover:text-primary hover:bg-surface px-4 py-2.5 rounded-lg text-sm font-medium transition-colors" @click="mobileMenuOpen = false">Accueil</router-link>
          <router-link v-if="isClub" to="/admin" class="block text-text-muted hover:text-primary hover:bg-surface px-4 py-2.5 rounded-lg text-sm font-medium transition-colors" @click="mobileMenuOpen = false">Mon Club</router-link>
          <router-link v-if="isSuperAdmin" to="/validation" class="block text-text-muted hover:text-primary hover:bg-surface px-4 py-2.5 rounded-lg text-sm font-medium transition-colors" @click="mobileMenuOpen = false">Validation</router-link>
          <router-link v-if="isSuperAdmin" to="/superadmin/panel" class="block text-text-muted hover:text-primary hover:bg-surface px-4 py-2.5 rounded-lg text-sm font-medium transition-colors" @click="mobileMenuOpen = false">Panel Admin</router-link>
        </div>
      </transition>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const authStore = useAuthStore()
const { logout } = useAuth()
const mobileMenuOpen = ref(false)

const isClub = computed(() => authStore.isClub)
const isSuperAdmin = computed(() => authStore.isSuperAdmin)
const displayName = computed(() => authStore.userDisplayName)
const userInitials = computed(() => {
  const name = displayName.value
  if (!name) return '?'
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
})

async function handleLogout() {
  await logout()
  router.push('/login')
}
</script>
