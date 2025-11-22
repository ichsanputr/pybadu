<template>
  <header :class="[
    transparent ? 'bg-transparent absolute top-0 left-0 right-0 z-50' : 'bg-white border-b border-gray-200',
    sticky && !transparent ? 'sticky top-0 z-50' : ''
  ]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-20">
        <!-- Logo -->
        <div class="flex items-center">
          <NuxtLink to="/" class="flex items-center space-x-3">
            <img :src="transparent ? '/logo.png' : '/logo.png'" alt="Pybadu Logo" class="w-10 h-10 rounded-lg">
            <div>
              <div class="text-xl font-bold text-python-blue-600">
                Pybadu
              </div>
              <div :class="['text-xs', transparent ? 'text-gray-600' : 'text-gray-500']">from BudiBadu ecosystem</div>
            </div>
          </NuxtLink>
        </div>

        <!-- Navigation -->
        <nav class="hidden md:flex items-center space-x-8">
          <NuxtLink to="/matplotlib" :class="['font-medium transition-colors', transparent ? 'text-gray-700 hover:text-python-blue-600' : 'text-gray-700 hover:text-python-blue-600']">
            Matplotlib
          </NuxtLink>
          <NuxtLink to="/numpy" :class="['font-medium transition-colors', transparent ? 'text-gray-700 hover:text-python-blue-600' : 'text-gray-700 hover:text-python-blue-600']">
            NumPy
          </NuxtLink>
          <NuxtLink to="/pandas" :class="['font-medium transition-colors', transparent ? 'text-gray-700 hover:text-python-blue-600' : 'text-gray-700 hover:text-python-blue-600']">
            Pandas
          </NuxtLink>
          <NuxtLink to="/scikit-learn" :class="['font-medium transition-colors', transparent ? 'text-gray-700 hover:text-python-blue-600' : 'text-gray-700 hover:text-python-blue-600']">
            Scikit-learn
          </NuxtLink>
          <a href="https://budibadu.com" target="_blank" :class="['font-medium transition-colors', transparent ? 'text-gray-700 hover:text-python-yellow-600' : 'text-gray-700 hover:text-python-yellow-600']">
            BudiBadu ↗
          </a>
        </nav>

        <!-- CTA Button -->
        <div class="hidden sm:flex items-center space-x-4">
          <NuxtLink to="/matplotlib" class="bg-python-blue-600 hover:bg-python-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105">
            Start Coding
          </NuxtLink>
        </div>

        <!-- Mobile Menu Button -->
        <div class="md:hidden">
          <button @click="showMobileMenu = !showMobileMenu" :class="['transition-colors', transparent ? 'text-gray-700 hover:text-python-blue-600' : 'text-gray-700 hover:text-python-blue-600']">
            <Icon icon="ph:list" class="w-6 h-6" />
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="showMobileMenu" :class="['md:hidden py-4 border-t', transparent ? 'bg-white/95 backdrop-blur-sm border-gray-200' : 'border-gray-200']">
        <div class="space-y-3">
          <NuxtLink to="/matplotlib" class="block text-gray-700 hover:text-python-blue-600 font-medium transition-colors">
            Matplotlib
          </NuxtLink>
          <NuxtLink to="/numpy" class="block text-gray-700 hover:text-python-blue-600 font-medium transition-colors">
            NumPy
          </NuxtLink>
          <NuxtLink to="/pandas" class="block text-gray-700 hover:text-python-blue-600 font-medium transition-colors">
            Pandas
          </NuxtLink>
          <NuxtLink to="/scikit-learn" class="block text-gray-700 hover:text-python-blue-600 font-medium transition-colors">
            Scikit-learn
          </NuxtLink>
          <a href="https://budibadu.com" target="_blank" class="block text-gray-700 hover:text-python-yellow-600 font-medium transition-colors">
            BudiBadu ↗
          </a>
          <NuxtLink to="/matplotlib" class="block bg-python-blue-600 hover:bg-python-blue-700 text-white px-4 py-2 rounded-xl font-semibold text-center transition-colors">
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

defineProps({
  sticky: {
    type: Boolean,
    default: true
  },
  transparent: {
    type: Boolean,
    default: false
  }
})

const showMobileMenu = ref(false)
</script>