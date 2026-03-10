<template>
  <footer class="bg-primary text-white mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- About -->
        <div>
          <div class="flex items-center gap-3 mb-4">
            <img src="https://upm.ac.ma/wp-content/themes/upm2017/img/upm.svg" alt="UPM" class="h-8 w-auto brightness-0 invert" />
            <span class="font-bold text-lg">UPM <span class="text-accent">Events</span></span>
          </div>
          <p class="text-white/60 text-sm leading-relaxed">
            Plateforme officielle de gestion des événements de l'Université Privée de Marrakech.
          </p>
        </div>
        <!-- Quick Links -->
        <div>
          <h4 class="font-semibold text-sm uppercase tracking-wider mb-4 text-white/80">Liens rapides</h4>
          <ul class="space-y-2 text-sm text-white/60">
            <li><router-link to="/" class="hover:text-accent transition-colors">Accueil</router-link></li>
            <li><a href="https://upm.ac.ma" target="_blank" rel="noopener" class="hover:text-accent transition-colors">Site UPM</a></li>
          </ul>
        </div>
        <!-- Contact -->
        <div>
          <h4 class="font-semibold text-sm uppercase tracking-wider mb-4 text-white/80">Contact</h4>
          <ul class="space-y-2 text-sm text-white/60">
            <li>Km 13, Route d'Amizmiz, Marrakech</li>
            <li>contact@upm.ac.ma</li>
            <li>+212 5 24 49 80 00</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="border-t border-white/10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <p class="text-center text-white/40 text-xs">
          &copy; {{ currentYear }} Universite Privee de Marrakech. Tous droits reserves.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear()
</script>
