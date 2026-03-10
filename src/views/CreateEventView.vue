<template>
  <div>
    <!-- Hero -->
    <div class="bg-gradient-to-r from-primary to-primary-light text-white py-10 px-4">
      <div class="max-w-3xl mx-auto">
        <h1 class="text-3xl font-bold">Créer un <span class="text-accent">événement</span></h1>
        <p class="text-white/70 mt-1 text-sm">Remplissez le formulaire pour proposer un nouvel événement</p>
      </div>
    </div>

    <div class="max-w-3xl mx-auto px-4 py-8">
      <form @submit.prevent="handleSubmit" class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-6">

        <BaseInput
          id="title"
          label="Titre de l'événement"
          v-model="form.title"
          placeholder="Ex: Hackathon IA 2026"
          :required="true"
          :error="errors.title"
        />

        <div class="space-y-1">
          <label for="description" class="block text-sm font-medium text-slate-700">
            Description <span class="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            v-model="form.description"
            rows="4"
            required
            placeholder="Décrivez votre événement en détail..."
            class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 text-sm
                   focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all resize-none"
            :class="{ 'border-red-400': errors.description }"
          ></textarea>
          <p v-if="errors.description" class="text-xs text-red-500">{{ errors.description }}</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <BaseInput
            id="date"
            label="Date et heure"
            type="datetime-local"
            v-model="form.date"
            :required="true"
            :error="errors.date"
          />
          <BaseInput
            id="location"
            label="Lieu"
            v-model="form.location"
            placeholder="Ex: Amphi A"
            :required="true"
            :error="errors.location"
          />
        </div>

        <!-- Type -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-slate-700">Type <span class="text-red-500">*</span></label>
          <div class="grid grid-cols-2 gap-3">
            <button
              type="button"
              @click="form.type = 'free'"
              class="py-3 rounded-xl text-sm font-semibold border transition-all"
              :class="form.type === 'free'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
              "
            >
              🎉 Gratuit
            </button>
            <button
              type="button"
              @click="form.type = 'paid'"
              class="py-3 rounded-xl text-sm font-semibold border transition-all"
              :class="form.type === 'paid'
                ? 'bg-amber-50 border-amber-300 text-amber-700'
                : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
              "
            >
              💰 Payant
            </button>
          </div>
        </div>

        <!-- Price (conditional) -->
        <transition name="slide">
          <BaseInput
            v-if="form.type === 'paid'"
            id="price"
            label="Prix (MAD)"
            type="number"
            v-model="form.price"
            placeholder="Ex: 50"
            :required="true"
            :error="errors.price"
          />
        </transition>

        <!-- Info: pending status -->
        <div class="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          <svg class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
          Votre événement sera soumis à validation par un administrateur avant publication.
        </div>

        <!-- Target Audience -->
        <TargetAudiencePicker
          v-model="form.targetAudience"
          :error="errors.targetAudience"
        />

        <!-- Image -->
        <ImageUploader
          v-model="form.imageUrl"
          :error="errors.imageUrl"
        />

        <!-- Submit -->
        <button
          type="submit"
          :disabled="submitting"
          class="w-full py-3 bg-accent hover:bg-accent-light text-white rounded-xl font-bold text-sm
                 shadow-lg shadow-accent/25 hover:shadow-accent/40 transition-all duration-200
                 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <svg v-if="submitting" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 100 8v4a8 8 0 01-8-8z"></path>
          </svg>
          {{ submitting ? 'Création...' : 'Créer l\'événement' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Timestamp } from 'firebase/firestore'
import BaseInput from '@/components/forms/BaseInput.vue'
import ImageUploader from '@/components/forms/ImageUploader.vue'
import TargetAudiencePicker from '@/components/forms/TargetAudiencePicker.vue'
import { useEvents } from '@/composables/useEvents'
import { useNotifications } from '@/composables/useNotifications'

const router = useRouter()
const { addEvent } = useEvents()
const { showError } = useNotifications()
const submitting = ref(false)

const form = reactive({
  title: '',
  description: '',
  date: '',
  location: '',
  type: 'free',
  price: '',
  targetAudience: 'all',
  imageUrl: ''
})

const errors = reactive({
  title: '',
  description: '',
  date: '',
  location: '',
  price: '',
  targetAudience: '',
  imageUrl: ''
})

function validate() {
  let valid = true
  Object.keys(errors).forEach((k) => (errors[k] = ''))

  if (!form.title.trim()) { errors.title = 'Le titre est requis'; valid = false }
  if (!form.description.trim()) { errors.description = 'La description est requise'; valid = false }
  if (!form.date) { errors.date = 'La date est requise'; valid = false }
  if (!form.location.trim()) { errors.location = 'Le lieu est requis'; valid = false }

  if (form.type === 'paid') {
    const price = Number(form.price)
    if (!form.price || price <= 0) {
      errors.price = 'Le prix doit être supérieur à 0'
      valid = false
    }
  }

  if (form.targetAudience !== 'all' && Array.isArray(form.targetAudience) && form.targetAudience.length === 0) {
    errors.targetAudience = 'Sélectionnez au moins une filière'
    valid = false
  }

  return valid
}

async function handleSubmit() {
  if (!validate()) {
    showError('Veuillez corriger les erreurs du formulaire')
    return
  }

  submitting.value = true

  const eventData = {
    title: form.title.trim(),
    description: form.description.trim(),
    date: Timestamp.fromDate(new Date(form.date)),
    location: form.location.trim(),
    type: form.type,
    price: form.type === 'paid' ? Number(form.price) : 0,
    status: 'pending',
    targetAudience: form.targetAudience,
    imageUrl: form.imageUrl
  }

  const id = await addEvent(eventData)
  submitting.value = false

  if (id) {
    router.push('/admin')
  }
}
</script>
