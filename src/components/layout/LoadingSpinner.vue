<template>
  <div class="flex items-center justify-center py-12">
    <div class="w-10 h-10 rounded-full border-[3px] border-border border-t-primary animate-spin"></div>
    <span v-if="message" class="ml-4 text-text-muted text-sm font-medium">{{ message }}</span>
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
