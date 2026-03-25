<template>
  <component
    :is="disableLink ? 'div' : 'router-link'"
    :to="!disableLink ? `/events/${event.id}` : undefined"
    @click="handleClick"
    :class="[
      'group block bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] border border-border overflow-hidden transition-all duration-300 hover:-translate-y-0.5',
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
      <div v-else class="w-full h-full bg-surface flex items-center justify-center">
        <svg class="w-12 h-12 text-border" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
      </div>

      <!-- Badges -->
      <div class="absolute top-3 left-3 flex gap-2">
        <span
          class="px-2.5 py-1 rounded-full text-xs font-semibold"
          :class="event.type === 'free'
            ? 'bg-[#DCFCE7] text-[#166534]'
            : 'bg-[#FEF3C7] text-[#92400E]'
          "
        >
          {{ event.type === 'free' ? 'Gratuit' : `${event.price} MAD` }}
        </span>
        <span
          class="px-2.5 py-1 rounded-full text-xs font-semibold"
          :class="event.targetAudience === 'all'
            ? 'bg-[#DBEAFE] text-[#1E40AF]'
            : 'bg-[#F3E8FF] text-[#6B21A8]'
          "
        >
          {{ event.targetAudience === 'all' ? 'Ouvert' : 'Specifique' }}
        </span>
      </div>
    </div>

    <!-- Content -->
    <div class="p-4 space-y-3">
      <div>
        <h3 class="font-semibold text-text-dark text-base leading-tight group-hover:text-primary transition-colors line-clamp-1">
          {{ event.title }}
        </h3>
        <div class="flex items-center gap-2 mt-0.5">
          <p class="text-sm text-accent font-medium">{{ event.clubName }}</p>
        </div>
      </div>

      <p class="text-[13px] text-text-muted line-clamp-2">{{ event.description }}</p>

      <div class="flex items-center justify-between pt-3 border-t border-border">
        <div class="flex items-center gap-1.5 text-text-muted text-[13px]">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          {{ formatDate(event.date) }}
        </div>
        <div class="flex items-center gap-1.5 text-text-muted text-[13px]">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          {{ event.location }}
        </div>
      </div>

      <!-- Vote Action -->
      <div class="pt-3 border-t border-border" @click.stop>
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
