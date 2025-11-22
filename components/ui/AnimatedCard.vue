<template>
  <div 
    class="group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]"
    :class="[
      theme === 'dark' 
        ? 'bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50' 
        : 'bg-gray-50 hover:bg-white border border-gray-200 hover:shadow-lg'
    ]"
  >
    <!-- Animated Border Beam Effect -->
    <div class="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      <div class="absolute inset-[-2px] rounded-2xl bg-gradient-to-r from-python-blue-500 to-python-yellow-500 opacity-20 blur-sm"></div>
    </div>
    
    <!-- Content -->
    <div class="relative z-10">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { useColorMode } from '@vueuse/core'

defineOptions({
  name: 'AnimatedCard'
})

const theme = useColorMode()
</script>

