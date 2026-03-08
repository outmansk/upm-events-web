<template>
  <div class="min-h-screen flex flex-col">
    <!-- Navbar (only when authenticated) -->
    <TheNavbar v-if="isAuthenticated && !authLoading" />

    <!-- Toast Notifications -->
    <div class="fixed top-4 right-4 z-[100] space-y-2 max-w-sm w-full pointer-events-none">
      <transition-group name="slide">
        <div
          v-for="n in notifications"
          :key="n.id"
          class="pointer-events-auto px-4 py-3 rounded-xl shadow-lg border backdrop-blur-md text-sm font-medium flex items-center gap-2 cursor-pointer"
          :class="{
            'bg-emerald-50/95 border-emerald-200 text-emerald-800': n.type === 'success',
            'bg-red-50/95 border-red-200 text-red-800': n.type === 'error',
            'bg-blue-50/95 border-blue-200 text-blue-800': n.type === 'info'
          }"
          @click="removeNotification(n.id)"
        >
          <span v-if="n.type === 'success'">✅</span>
          <span v-else-if="n.type === 'error'">❌</span>
          <span v-else>ℹ️</span>
          {{ n.message }}
        </div>
      </transition-group>
    </div>

    <!-- Loading state -->
    <div v-if="authLoading" class="flex-1 flex items-center justify-center">
      <LoadingSpinner message="Chargement de l'application..." />
    </div>

    <!-- Main content -->
    <main v-else class="flex-1">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Footer (only when authenticated) -->
    <TheFooter v-if="isAuthenticated && !authLoading" />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import TheNavbar from '@/components/layout/TheNavbar.vue'
import TheFooter from '@/components/layout/TheFooter.vue'
import LoadingSpinner from '@/components/layout/LoadingSpinner.vue'
import { useAuthStore } from '@/stores/authStore'
import { useAuth } from '@/composables/useAuth'
import { useNotifications } from '@/composables/useNotifications'

const authStore = useAuthStore()
const { initAuth } = useAuth()
const { notifications, removeNotification } = useNotifications()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const authLoading = computed(() => authStore.loading)

onMounted(() => {
  initAuth()
})
</script>
