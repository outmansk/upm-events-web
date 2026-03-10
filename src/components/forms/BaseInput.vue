<template>
  <div class="space-y-1.5">
    <label v-if="label" :for="id" class="block text-sm font-medium text-[#374151]">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>
    <div class="relative">
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        @input="$emit('update:modelValue', $event.target.value)"
        class="w-full h-11 px-4 rounded-lg border border-[#D1D5DB] bg-white text-text-dark placeholder-[#9CA3AF] text-sm
               focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10
               disabled:bg-surface disabled:text-text-muted
               transition-all duration-200"
        :class="{ 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/10': error }"
      />
    </div>
    <p v-if="error" class="text-xs text-red-500 mt-1 flex items-center gap-1">
      <svg class="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
      {{ error }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  id: String,
  label: String,
  type: { type: String, default: 'text' },
  modelValue: [String, Number],
  placeholder: String,
  disabled: Boolean,
  required: Boolean,
  error: String
})

defineEmits(['update:modelValue'])
</script>
