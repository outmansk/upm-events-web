<template>
  <div class="flex items-center justify-center py-12">
    <div class="relative">
      <div class="w-12 h-12 rounded-full border-4 border-primary/20 border-t-accent animate-spin"></div>
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="w-5 h-5 rounded-full bg-accent/30 animate-pulse"></div>
      </div>
    </div>
    <span v-if="message" class="ml-4 text-slate-500 text-sm font-medium">{{ message }}</span>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: ''
  }
})
</script>
