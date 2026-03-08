<template>
  <div class="space-y-2">
    <label class="block text-sm font-medium text-slate-700">
      Public cible <span class="text-red-500">*</span>
    </label>

    <!-- All toggle -->
    <label class="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all"
      :class="isAll ? 'border-accent bg-accent/5' : 'border-slate-200 hover:border-slate-300'"
    >
      <input
        type="checkbox"
        :checked="isAll"
        @change="toggleAll"
        class="w-4 h-4 rounded text-accent focus:ring-accent/40"
      />
      <span class="text-sm font-medium" :class="isAll ? 'text-accent' : 'text-slate-600'">
        Toutes les filières
      </span>
    </label>

    <!-- Individual filieres -->
    <div v-if="!isAll" class="grid grid-cols-2 sm:grid-cols-3 gap-2">
      <label
        v-for="f in filieres"
        :key="f"
        class="flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-all text-sm"
        :class="selected.includes(f) ? 'border-accent bg-accent/5 text-accent' : 'border-slate-200 hover:border-slate-300 text-slate-600'"
      >
        <input
          type="checkbox"
          :checked="selected.includes(f)"
          @change="toggleFiliere(f)"
          class="w-3.5 h-3.5 rounded text-accent focus:ring-accent/40"
        />
        {{ f }}
      </label>
    </div>

    <p v-if="error" class="text-xs text-red-500">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Array],
    default: 'all'
  },
  error: String
})

const emit = defineEmits(['update:modelValue'])

const filieres = ['Ingénierie', 'Business', 'Santé', 'Arts', 'Sciences']

const isAll = ref(props.modelValue === 'all')
const selected = ref(Array.isArray(props.modelValue) ? [...props.modelValue] : [])

function toggleAll() {
  isAll.value = !isAll.value
  if (isAll.value) {
    selected.value = []
    emit('update:modelValue', 'all')
  } else {
    emit('update:modelValue', [])
  }
}

function toggleFiliere(f) {
  const idx = selected.value.indexOf(f)
  if (idx > -1) {
    selected.value.splice(idx, 1)
  } else {
    selected.value.push(f)
  }
  emit('update:modelValue', [...selected.value])
}

watch(() => props.modelValue, (val) => {
  if (val === 'all') {
    isAll.value = true
    selected.value = []
  } else if (Array.isArray(val)) {
    isAll.value = false
    selected.value = [...val]
  }
})
</script>
