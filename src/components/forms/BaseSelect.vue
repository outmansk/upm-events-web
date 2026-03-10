<template>
  <div class="space-y-1">
    <label v-if="label" :for="id" class="block text-sm font-medium text-[#374151]">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>
    <select
      :id="id"
      :value="modelValue"
      :disabled="disabled"
      :required="required"
      @change="$emit('update:modelValue', $event.target.value)"
      class="w-full h-11 px-4 rounded-lg border border-[#D1D5DB] bg-white text-text-dark text-sm
             focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10
             disabled:bg-surface disabled:text-text-muted
             transition-all duration-200 appearance-none cursor-pointer"
      :class="{ 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/10': error }"
    >
      <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
      <option v-for="opt in options" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>
    <p v-if="error" class="text-xs text-red-500 mt-1">{{ error }}</p>
  </div>
</template>

<script setup>
defineProps({
  id: String,
  label: String,
  modelValue: [String, Number],
  options: {
    type: Array,
    default: () => []
  },
  placeholder: String,
  disabled: Boolean,
  required: Boolean,
  error: String
})

defineEmits(['update:modelValue'])
</script>
