<template>
  <div class="space-y-2">
    <label class="block text-sm font-medium text-slate-700">
      Image de l'événement
    </label>

    <!-- Drop zone -->
    <div
      @click="triggerFileInput"
      @drop.prevent="handleDrop"
      @dragover.prevent="dragOver = true"
      @dragleave="dragOver = false"
      class="relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200"
      :class="[
        dragOver ? 'border-accent bg-accent/5' : 'border-slate-200 hover:border-accent/50 hover:bg-slate-50',
        error ? 'border-red-400' : ''
      ]"
    >
      <!-- Preview -->
      <div v-if="previewUrl" class="space-y-3">
        <img :src="previewUrl" alt="Aperçu" class="max-h-48 mx-auto rounded-lg object-cover shadow-md" />
        <button
          type="button"
          @click.stop="removeImage"
          class="text-sm text-red-500 hover:text-red-700 transition-colors"
        >
          Supprimer l'image
        </button>
      </div>

      <!-- Upload prompt -->
      <div v-else class="space-y-2 text-slate-400">
        <svg class="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        <p class="text-sm font-medium">Cliquez ou déposez une image ici</p>
        <p class="text-xs">PNG, JPG, WEBP • Max 5 MB</p>
      </div>

      <input
        ref="fileInput"
        type="file"
        accept="image/png,image/jpeg,image/webp"
        class="hidden"
        @change="handleFileSelect"
      />
    </div>

    <!-- Progress bar -->
    <div v-if="uploading" class="space-y-1">
      <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
        <div
          class="h-full bg-gradient-to-r from-accent to-accent-light rounded-full transition-all duration-300"
          :style="{ width: uploadProgress + '%' }"
        ></div>
      </div>
      <p class="text-xs text-slate-500 text-center">Upload en cours... {{ uploadProgress }}%</p>
    </div>

    <!-- Cloudinary not configured warning -->
    <div v-if="cloudinaryMissing && previewUrl" class="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
      <svg class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
      Image sauvegardée localement. Configurez Cloudinary dans .env pour l'hébergement cloud.
    </div>

    <p v-if="error" class="text-xs text-red-500">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCloudinary } from '@/composables/useCloudinary'
import { useNotifications } from '@/composables/useNotifications'

const props = defineProps({
  modelValue: String,
  error: String
})

const emit = defineEmits(['update:modelValue'])

const { uploadImage, uploadProgress, uploading } = useCloudinary()
const { showError, showInfo } = useNotifications()

const fileInput = ref(null)
const previewUrl = ref(props.modelValue || '')
const dragOver = ref(false)
const cloudinaryMissing = ref(false)

function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileSelect(e) {
  const file = e.target.files?.[0]
  if (file) processFile(file)
}

function handleDrop(e) {
  dragOver.value = false
  const file = e.dataTransfer.files?.[0]
  if (file) processFile(file)
}

async function processFile(file) {
  if (file.size > 5 * 1024 * 1024) {
    showError('L\'image ne doit pas dépasser 5 MB')
    return
  }
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
    showError('Format non supporté. Utilisez PNG, JPG ou WEBP')
    return
  }

  // Create local preview
  const localUrl = URL.createObjectURL(file)
  previewUrl.value = localUrl

  // Try Cloudinary upload
  try {
    const url = await uploadImage(file)
    previewUrl.value = url
    cloudinaryMissing.value = false
    emit('update:modelValue', url)
  } catch (err) {
    // Cloudinary not configured — fallback to data URL for local use
    console.warn('Cloudinary upload failed, using local data URL:', err.message)
    cloudinaryMissing.value = true

    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target.result
      previewUrl.value = dataUrl
      emit('update:modelValue', dataUrl)
      showInfo('Image ajoutée localement (Cloudinary non configuré)')
    }
    reader.readAsDataURL(file)
  }
}

function removeImage() {
  previewUrl.value = ''
  cloudinaryMissing.value = false
  emit('update:modelValue', '')
  if (fileInput.value) fileInput.value.value = ''
}
</script>
