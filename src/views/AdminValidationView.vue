<template>
  <div>
    <!-- Hero -->
    <div class="bg-white border-b border-border">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 class="text-2xl font-bold text-text-dark">
          Validation des <span class="text-accent">evenements</span>
        </h1>
        <p class="text-text-muted mt-1 text-sm">Approuvez ou rejetez les evenements soumis par les clubs</p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-8">
      <LoadingSpinner v-if="loading" message="Chargement des événements en attente..." />

      <!-- Pending Events List -->
      <div v-else-if="events.length > 0" class="space-y-6">
        <!-- Counter -->
        <div class="flex items-center gap-3">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl">
            <span class="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold">{{ events.length }}</span>
            <span class="text-sm font-medium text-amber-700">événement(s) en attente</span>
          </div>
        </div>

        <!-- Cards -->
        <div class="space-y-4">
          <div
            v-for="evt in events"
            :key="evt.id"
            class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            <div class="flex flex-col sm:flex-row">
              <!-- Image -->
              <div class="sm:w-56 h-44 sm:h-auto shrink-0">
                <img
                  v-if="evt.imageUrl"
                  :src="evt.imageUrl"
                  :alt="evt.title"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                  <svg class="w-10 h-10 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
              </div>

              <!-- Content -->
              <div class="flex-1 p-5 space-y-3">
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <h3 class="font-bold text-slate-800 text-lg">{{ evt.title }}</h3>
                    <p class="text-sm text-accent font-medium">{{ evt.clubName }}</p>
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <span class="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                      En attente
                    </span>
                  </div>
                </div>

                <p class="text-sm text-slate-500 line-clamp-2">{{ evt.description }}</p>

                <!-- Info -->
                <div class="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                  <span class="flex items-center gap-1">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    {{ formatDate(evt.date) }}
                  </span>
                  <span class="flex items-center gap-1">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {{ evt.location }}
                  </span>
                  <span
                    class="flex items-center gap-1"
                    :class="evt.type === 'free' ? 'text-emerald-500' : 'text-amber-500'"
                  >
                    {{ evt.type === 'free' ? 'Gratuit' : `${evt.price} MAD` }}
                  </span>
                </div>

                <!-- Target audience -->
                <div class="flex flex-wrap gap-1">
                  <span v-if="evt.targetAudience === 'all'" class="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">Toutes filieres</span>
                  <template v-else-if="Array.isArray(evt.targetAudience)">
                    <span
                      v-for="f in evt.targetAudience"
                      :key="f"
                      class="px-2 py-0.5 bg-purple-50 text-purple-600 rounded-full text-xs font-medium"
                    >{{ f }}</span>
                  </template>
                </div>

                <!-- Action buttons -->
                <div class="flex gap-3 pt-2 border-t border-slate-100">
                  <button
                    @click="handleApprove(evt.id)"
                    :disabled="processing === evt.id"
                    class="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold text-sm
                           shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all
                           disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                    Approuver
                  </button>
                  <button
                    @click="handleReject(evt.id)"
                    :disabled="processing === evt.id"
                    class="flex-1 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl font-semibold text-sm
                           transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    Rejeter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="text-center py-16">
        <svg class="w-16 h-16 mx-auto text-emerald-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <p class="text-slate-500 font-medium">Aucun événement en attente</p>
        <p class="text-slate-400 text-sm mt-1">Tous les evenements ont ete traites</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import LoadingSpinner from '@/components/layout/LoadingSpinner.vue'
import { useEvents } from '@/composables/useEvents'

const { events, loading, fetchPendingEvents, approveEvent, rejectEvent } = useEvents()
const processing = ref(null)

onMounted(() => {
  fetchPendingEvents()
})

async function handleApprove(eventId) {
  processing.value = eventId
  await approveEvent(eventId, 'confirmed')
  processing.value = null
}

async function handleReject(eventId) {
  if (!confirm('Êtes-vous sûr de vouloir rejeter et supprimer cet événement ?')) return
  processing.value = eventId
  await rejectEvent(eventId)
  processing.value = null
}

function formatDate(date) {
  if (!date) return ''
  const d = date.toDate ? date.toDate() : new Date(date)
  return d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
