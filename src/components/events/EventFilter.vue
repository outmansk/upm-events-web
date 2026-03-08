<template>
  <div class="space-y-4">
    <!-- Search -->
    <div class="relative">
      <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
      <input
        :value="search"
        @input="$emit('update:search', $event.target.value)"
        placeholder="Rechercher un événement..."
        class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder-slate-400
               focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
      />
    </div>

    <!-- Filter buttons -->
    <div class="flex flex-wrap gap-2">
      <button
        v-for="filter in filters"
        :key="filter.value"
        @click="$emit('update:activeFilter', filter.value)"
        class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
        :class="activeFilter === filter.value
          ? 'bg-primary text-white shadow-md shadow-primary/25'
          : 'bg-white text-slate-600 border border-slate-200 hover:border-primary/30 hover:text-primary'
        "
      >
        {{ filter.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  search: {
    type: String,
    default: ''
  },
  activeFilter: {
    type: String,
    default: 'all'
  },
  filters: {
    type: Array,
    default: () => [
      { label: 'Tous', value: 'all' },
      { label: 'Gratuits', value: 'free' },
      { label: 'Payants', value: 'paid' }
    ]
  }
})

defineEmits(['update:search', 'update:activeFilter'])
</script>
