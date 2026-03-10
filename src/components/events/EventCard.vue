<template>
  <component
    :is="disableLink ? 'div' : 'router-link'"
    :to="!disableLink ? `/events/${event.id}` : undefined"
    @click="handleClick"
    :class="[
      'group block bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-100 overflow-hidden transition-all duration-300 hover:-translate-y-1',
      disableLink ? 'cursor-pointer' : ''
    ]"
  >
    <!-- Image -->
    <div class="relative h-48 overflow-hidden">
      <img
        v-if="event.imageUrl"
        :src="event.imageUrl"
        :alt="event.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div v-else class="w-full h-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
        <svg class="w-12 h-12 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
      </div>

      <!-- Badges -->
      <div class="absolute top-3 left-3 flex gap-2">
        <span
          class="px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md shadow-sm"
          :class="event.type === 'free'
            ? 'bg-emerald-500/90 text-white'
            : 'bg-amber-500/90 text-white'
          "
        >
          {{ event.type === 'free' ? 'Gratuit' : `${event.price} MAD` }}
        </span>
        <span
          class="px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md shadow-sm"
          :class="event.targetAudience === 'all'
            ? 'bg-blue-500/90 text-white'
            : 'bg-purple-500/90 text-white'
          "
        >
          {{ event.targetAudience === 'all' ? 'Ouvert' : 'Spécifique' }}
        </span>
      </div>
    </div>

    <!-- Content -->
    <div class="p-4 space-y-3">
      <div>
        <h3 class="font-bold text-slate-800 text-lg leading-tight group-hover:text-primary transition-colors line-clamp-1">
          {{ event.title }}
        </h3>
        <div class="flex items-center gap-2 mt-0.5">
          <p class="text-sm text-accent font-medium">{{ event.clubName }}</p>
          <div v-if="event.averageRating > 0" class="flex items-center gap-1 text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded text-xs font-bold">
            <svg class="w-3 h-3 fill-amber-500" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            {{ event.averageRating.toFixed(1) }}
          </div>
        </div>
      </div>

      <p class="text-sm text-slate-500 line-clamp-2">{{ event.description }}</p>

      <div class="flex items-center justify-between pt-2 border-t border-slate-50">
        <div class="flex items-center gap-1.5 text-slate-400 text-xs">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          {{ formatDate(event.date) }}
        </div>
        <div class="flex items-center gap-1.5 text-slate-400 text-xs">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          {{ event.location }}
        </div>
      </div>

      <!-- Vote Action -->
      <div class="pt-3 border-t border-slate-50" @click.stop>
        <VoteAction
          :event-id="event.id"
          :voter-ids="event.voterIds || []"
          :votes-count="event.votesCount || 0"
        />
      </div>
    </div>
  </component>
</template>

<script setup>
import VoteAction from '@/components/events/VoteAction.vue'

const props = defineProps({
  event: {
    type: Object,
    required: true
  },
  disableLink: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['card-click'])

function handleClick() {
  if (props.disableLink) {
    emit('card-click', props.event)
  }
}

function formatDate(date) {
  if (!date) return ''
  const d = date.toDate ? date.toDate() : new Date(date)
  return d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}
</script>
