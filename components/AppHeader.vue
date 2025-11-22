<template>
  <header class="bg-white border-b border-gray-200 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <NuxtLink to="/" class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-xl">🐍</span>
            </div>
            <div>
              <div class="text-xl font-bold bg-gradient-to-r from-yellow-600 via-orange-500 to-yellow-400 bg-clip-text text-transparent">
                Pybadu
              </div>
              <div class="text-xs text-gray-500">from BudiBadu ecosystem</div>
            </div>
          </NuxtLink>
        </div>

        <!-- Navigation -->
        <nav class="hidden md:flex items-center space-x-8">
          <NuxtLink to="/fiddle" class="text-gray-700 hover:text-yellow-600 font-medium transition-colors">
            Python Fiddle
          </NuxtLink>
          <NuxtLink to="/matplotlib" class="text-gray-700 hover:text-yellow-600 font-medium transition-colors">
            Matplotlib
          </NuxtLink>
          <NuxtLink to="/snowball" class="text-gray-700 hover:text-yellow-600 font-medium transition-colors">
            Stemmer
          </NuxtLink>
          <a href="https://budibadu.com" target="_blank" class="text-gray-700 hover:text-yellow-600 font-medium transition-colors">
            BudiBadu ↗
          </a>
        </nav>

        <!-- CTA Button -->
        <div class="hidden sm:flex items-center space-x-4">
          <NuxtLink to="/fiddle" class="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg">
            Start Coding
          </NuxtLink>
        </div>

        <!-- Mobile Menu Button -->
        <div class="md:hidden">
          <button @click="showMobileMenu = !showMobileMenu" class="text-gray-700 hover:text-yellow-600 transition-colors">
            <Icon icon="ph:list" class="w-6 h-6" />
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="showMobileMenu" class="md:hidden py-4 border-t border-gray-200">
        <div class="space-y-3">
          <NuxtLink to="/fiddle" class="block text-gray-700 hover:text-yellow-600 font-medium transition-colors">
            Python Fiddle
          </NuxtLink>
          <NuxtLink to="/matplotlib" class="block text-gray-700 hover:text-yellow-600 font-medium transition-colors">
            Matplotlib
          </NuxtLink>
          <NuxtLink to="/snowball" class="block text-gray-700 hover:text-yellow-600 font-medium transition-colors">
            Stemmer
          </NuxtLink>
          <a href="https://budibadu.com" target="_blank" class="block text-gray-700 hover:text-yellow-600 font-medium transition-colors">
            BudiBadu ↗
          </a>
          <NuxtLink to="/fiddle" class="block bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-lg font-medium text-center">
            Start Coding
          </NuxtLink>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { Icon } from '@iconify/vue'

defineOptions({
  name: 'AppHeader'
})

const showMobileMenu = ref(false)
</script>