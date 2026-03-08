<template>
  <footer class="bg-primary-dark text-white/60 mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-sm">U</span>
          </div>
          <span class="font-semibold text-white/80">
            UPM <span class="text-accent">Events</span>
          </span>
        </div>
        <p class="text-sm text-center">
          © {{ currentYear }} Université Internationale de Marrakech. Tous droits réservés.
        </p>
        <div class="flex items-center gap-4 text-sm">
          <a href="#" class="hover:text-accent transition-colors">Contact</a>
          <a href="#" class="hover:text-accent transition-colors">Aide</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear()
</script>
