<template>
  <div class="space-y-1">
    <label v-if="label" :for="id" class="block text-sm font-medium text-slate-700">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>
    <select
      :id="id"
      :value="modelValue"
      :disabled="disabled"
      :required="required"
      @change="$emit('update:modelValue', $event.target.value)"
      class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm
             focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent
             disabled:bg-slate-50 disabled:text-slate-400
             transition-all duration-200 appearance-none cursor-pointer"
      :class="{ 'border-red-400 focus:ring-red-300': error }"
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
