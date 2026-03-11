<template>
  <!-- Floating Chat Button -->
  <button
    v-if="!isOpen"
    @click="toggleChat"
    class="fixed bottom-6 right-6 z-50 w-14 h-14 bg-accent hover:bg-accent-light text-white rounded-full shadow-lg
           flex items-center justify-center transition-all duration-300 hover:scale-110
           hover:shadow-accent/30 hover:shadow-xl group"
    title="Assistant UPM"
  >
    <svg class="w-6 h-6 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
    <!-- Notification dot -->
    <span class="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
  </button>

  <!-- Chat Window -->
  <transition name="chatbox">
    <div
      v-if="isOpen"
      class="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-6rem)]
             bg-surface rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden"
    >
      <!-- Header -->
      <div class="bg-primary px-4 py-3.5 flex items-center justify-between shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 bg-white/15 rounded-full flex items-center justify-center">
            <svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
            </svg>
          </div>
          <div>
            <h3 class="text-white font-semibold text-sm">Assistant UPM</h3>
            <div class="flex items-center gap-1.5">
              <span class="w-2 h-2 bg-emerald-400 rounded-full"></span>
              <span class="text-white/60 text-xs">En ligne</span>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-1">
          <!-- Clear chat -->
          <button
            @click="clearChat"
            class="text-white/50 hover:text-white/90 p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            title="Nouveau chat"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <!-- Close -->
          <button
            @click="toggleChat"
            class="text-white/50 hover:text-white/90 p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            title="Fermer"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Messages area -->
      <div
        ref="messagesContainer"
        class="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth"
      >
        <ChatMessage
          v-for="(msg, index) in messages"
          :key="index"
          :message="msg"
        />

        <!-- Typing indicator -->
        <div v-if="isLoading" class="flex gap-3 mr-auto max-w-[85%]">
          <div class="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
            <svg class="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
            </svg>
          </div>
          <div class="bg-white border border-border rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
            <div class="flex gap-1.5">
              <span class="w-2 h-2 bg-text-muted/40 rounded-full animate-bounce" style="animation-delay: 0ms"></span>
              <span class="w-2 h-2 bg-text-muted/40 rounded-full animate-bounce" style="animation-delay: 150ms"></span>
              <span class="w-2 h-2 bg-text-muted/40 rounded-full animate-bounce" style="animation-delay: 300ms"></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick suggestions (when few messages) -->
      <div v-if="messages.length <= 1 && !isLoading" class="px-4 pb-2 flex flex-wrap gap-2">
        <button
          v-for="suggestion in suggestions"
          :key="suggestion"
          @click="sendMessage(suggestion)"
          class="text-xs bg-white border border-border hover:border-accent hover:text-accent px-3 py-1.5 rounded-full
                 transition-colors text-text-muted"
        >
          {{ suggestion }}
        </button>
      </div>

      <!-- Input area -->
      <div class="border-t border-border bg-white px-3 py-3 shrink-0">
        <form @submit.prevent="handleSend" class="flex items-center gap-2">
          <input
            v-model="inputMessage"
            type="text"
            placeholder="Posez votre question..."
            class="flex-1 h-10 px-4 rounded-xl bg-surface border border-border text-sm text-text-dark
                   placeholder-text-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10
                   transition-all"
            :disabled="isLoading"
          />
          <button
            type="submit"
            :disabled="!inputMessage.trim() || isLoading"
            class="w-10 h-10 bg-accent hover:bg-accent-light disabled:bg-border text-white rounded-xl
                   flex items-center justify-center transition-all disabled:cursor-not-allowed shrink-0"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 19V5m0 0l-7 7m7-7l7 7" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, nextTick, watch } from 'vue'
import ChatMessage from './ChatMessage.vue'
import { useChatbot } from '@/composables/useChatbot'

const { messages, isLoading, isOpen, sendMessage, toggleChat, clearChat, initChat } = useChatbot()

const inputMessage = ref('')
const messagesContainer = ref(null)

const suggestions = [
  '📅 Événements cette semaine ?',
  '🏫 Infos sur l\'UPM',
  '⭐ Comment voter ?',
  '🎯 Clubs disponibles'
]

function handleSend() {
  if (!inputMessage.value.trim()) return
  sendMessage(inputMessage.value)
  inputMessage.value = ''
}

// Auto-scroll to bottom when new messages arrive
watch(
  () => messages.value.length,
  async () => {
    await nextTick()
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  }
)

// Initialize chat when opened for the first time
watch(isOpen, (val) => {
  if (val && messages.value.length === 0) {
    initChat()
  }
})
</script>

<style scoped>
.chatbox-enter-active {
  animation: chatbox-in 0.3s ease-out;
}
.chatbox-leave-active {
  animation: chatbox-out 0.2s ease-in;
}

@keyframes chatbox-in {
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes chatbox-out {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
}
</style>
