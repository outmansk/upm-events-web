<template>
  <Teleport to="body">
    <transition name="popup-overlay">
      <div 
        v-if="isOpen" 
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/50 backdrop-blur-md"
        @click.self="close"
      >
        <transition name="popup-content">
          <div 
            v-if="isOpen"
            class="bg-white/95 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl ring-1 ring-white/60 w-full max-w-md overflow-hidden flex flex-col relative"
          >
            <!-- Bouton Fermer -->
            <button 
              @click="close" 
              class="absolute top-6 right-6 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/30 text-white shadow-sm transition-all duration-200 backdrop-blur-md"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <!-- Decorative Header Gradient -->
            <div class="h-32 bg-gradient-to-br from-primary-dark via-primary to-accent relative overflow-hidden">
              <div class="absolute inset-0 bg-white/5 backdrop-blur-[2px]"></div>
              <div class="absolute -bottom-24 -left-24 w-64 h-64 bg-accent/20 blur-[50px] rounded-full pointer-events-none"></div>
              <div class="absolute -top-12 -right-12 w-48 h-48 bg-black/10 blur-[40px] rounded-full pointer-events-none"></div>
            </div>

            <!-- Avatar -->
            <div class="relative px-8 pt-0 pb-8 flex flex-col items-center">
              <div class="relative -mt-16 group z-10 block">
                <div class="absolute inset-0 bg-white rounded-3xl rotate-3 opacity-40 shadow-lg group-hover:rotate-6 transition-transform duration-300"></div>
                <div class="relative w-32 h-32 rounded-3xl border-[4px] border-white shadow-xl bg-white overflow-hidden flex items-center justify-center transform group-hover:-translate-y-2 transition-transform duration-300">
                  <img 
                     v-if="user?.photoURL" 
                     :src="user.photoURL" 
                     alt="Profile" 
                     class="w-full h-full object-cover"
                  />
                  <div 
                     v-else 
                     class="w-full h-full bg-slate-50 flex items-center justify-center"
                  >
                     <span class="text-primary text-4xl font-extrabold tracking-tighter">{{ userInitials }}</span>
                  </div>
                </div>
              </div>

              <div class="text-center mt-4 mb-2">
                <h3 class="text-2xl font-extrabold text-slate-900">{{ user?.displayName || 'Utilisateur inconnu' }}</h3>
                <p class="text-sm font-medium text-slate-500 mt-0.5">Fiche d'identité numérique</p>
              </div>

              <!-- Information Details List -->
              <div class="w-full mt-6 bg-slate-50/50 rounded-2xl p-2 border border-slate-100 shadow-inner">
                <div class="flex flex-col gap-1">
                  
                  <!-- Construct Information Rows -->
                  <div class="flex items-center justify-between px-4 py-3 bg-white rounded-xl shadow-sm border border-slate-100/50 transition-shadow">
                    <div class="flex items-center gap-3 text-slate-500">
                      <div class="p-2 bg-primary/5 text-primary rounded-lg">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      </div>
                      <span class="text-sm font-semibold">Nom complet</span>
                    </div>
                    <span class="text-sm font-bold text-slate-800 text-right">{{ user?.displayName || '—' }}</span>
                  </div>

                  <div class="flex items-center justify-between px-4 py-3 bg-white rounded-xl shadow-sm border border-slate-100/50 transition-shadow">
                    <div class="flex items-center gap-3 text-slate-500">
                      <div class="p-2 bg-primary/5 text-primary rounded-lg">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      </div>
                      <span class="text-sm font-semibold">Email</span>
                    </div>
                    <span class="text-sm font-bold text-slate-800 text-right truncate max-w-[180px]" :title="user?.email">{{ user?.email || '—' }}</span>
                  </div>

                  <div class="flex items-center justify-between px-4 py-3 bg-white rounded-xl shadow-sm border border-slate-100/50 transition-shadow">
                    <div class="flex items-center gap-3 text-slate-500">
                      <div class="p-2 bg-primary/5 text-primary rounded-lg">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                      </div>
                      <span class="text-sm font-semibold">Rôle</span>
                    </div>
                    <div 
                      class="px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wide uppercase"
                      :class="roleBadgeClasses"
                    >
                      {{ roleLabel }}
                    </div>
                  </div>

                  <div v-if="user?.filiere" class="flex items-center justify-between px-4 py-3 bg-white rounded-xl shadow-sm border border-slate-100/50 transition-shadow">
                    <div class="flex items-center gap-3 text-slate-500">
                      <div class="p-2 bg-primary/5 text-primary rounded-lg">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                      </div>
                      <span class="text-sm font-semibold">Filière</span>
                    </div>
                    <span class="text-sm font-bold text-slate-800 text-right">{{ user.filiere }}</span>
                  </div>

                  <div v-if="formattedDate" class="flex items-center justify-between px-4 py-3 bg-white rounded-xl shadow-sm border border-slate-100/50 transition-shadow">
                    <div class="flex items-center gap-3 text-slate-500">
                      <div class="p-2 bg-primary/5 text-primary rounded-lg">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                      <span class="text-sm font-semibold">Inscrit le</span>
                    </div>
                    <span class="text-sm font-bold text-slate-800 text-right">{{ formattedDate }}</span>
                  </div>

                </div>
              </div>
            </div>
            
          </div>
        </transition>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  user: {
    type: Object,
    default: null
  },
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const userInitials = computed(() => {
  if (!props.user?.displayName) return '?'
  return props.user.displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
})

const roleBadgeClasses = computed(() => {
  const role = props.user?.role
  if (role === 'superadmin') return 'bg-accent/10 border border-accent/20 text-accent'
  if (role === 'club') return 'bg-primary/10 border border-primary/20 text-primary'
  return 'bg-slate-100 border border-slate-200 text-slate-600' // student default
})

const roleLabel = computed(() => {
  const role = props.user?.role
  if (role === 'superadmin') return 'Admin IT'
  if (role === 'club') return 'Club'
  return 'Étudiant'
})

const formattedDate = computed(() => {
  if (!props.user?.createdAt) return null
  
  let d;
  if (props.user.createdAt.toDate) {
    d = props.user.createdAt.toDate();
  } else {
    d = new Date(props.user.createdAt);
  }
  
  if (isNaN(d.getTime())) return null;

  return d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
})

function close() {
  emit('close')
}

// Handle Escape key to close
function handleKeydown(e) {
  if (e.key === 'Escape' && props.isOpen) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

// Prevent body scroll when popup is open
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
/* Overlay animation */
.popup-overlay-enter-active,
.popup-overlay-leave-active {
  transition: opacity 0.3s ease;
}
.popup-overlay-enter-from,
.popup-overlay-leave-to {
  opacity: 0;
}

/* Modal content animation */
.popup-content-enter-active {
  animation: modal-enter 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.popup-content-leave-active {
  animation: modal-leave 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes modal-enter {
  0% {
    opacity: 0;
    transform: scale(0.95) translateY(30px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes modal-leave {
  0% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  100% {
    opacity: 0;
    transform: scale(0.95) translateY(20px);
  }
}
</style>
