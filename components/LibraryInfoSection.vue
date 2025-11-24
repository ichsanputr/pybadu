<template>
  <section class="bg-white dark:bg-zinc-950 border-t border-gray-200 dark:border-gray-800 relative overflow-hidden">
    <!-- Subtle background effect -->
    <div class="absolute inset-0 bg-gradient-to-b from-transparent via-python-blue-50/20 to-transparent dark:via-python-blue-950/10 pointer-events-none" />
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
      <div class="max-w-5xl mx-auto">
        <!-- Slot for custom content -->
        <slot />

        <!-- Default Branding Section with Meteor Effect -->
        <slot name="branding">
          <div class="mt-16 relative">
            <div class="text-center bg-gradient-to-br from-python-blue-600 via-python-blue-500 to-python-yellow-500 rounded-3xl p-12 relative overflow-hidden">
              <!-- Meteor effect -->
              <Meteor :number="10" class-name="text-white/50" />
              
              <div class="relative z-10">
                <h3 class="text-3xl md:text-4xl font-bold text-white mb-4">
                  Part of the BudiBadu Ecosystem
                </h3>
                
                <p class="text-base md:text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                  Specialized Online Python compiler powered by Pyodide WebAssembly.
                  Run Python directly in your browser with zero setup.
                </p>
                
                <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a 
                    href="https://budibadu.com" 
                    target="_blank" 
                    class="text-sm md:text-base group inline-flex items-center gap-2 px-6 py-3 bg-white text-python-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <Icon icon="ph:rocket-launch" class="w-5 h-5" />
                    <span>Explore BudiBadu</span>
                    <Icon icon="ph:arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                  
                  <a 
                    href="https://pyodide.org" 
                    target="_blank" 
                    class="text-sm md:text-base group inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-200 border-2 border-white/50"
                  >
                    <Icon icon="simple-icons:python" class="w-5 h-5" />
                    <span>Learn Pyodide</span>
                    <Icon icon="ph:arrow-square-out" class="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </slot>

        <!-- Technology Stack Badges -->
        <div class="mt-12 flex flex-wrap items-center justify-center gap-4">
          <div
            v-for="tech in techStack"
            :key="tech.name"
            class="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-zinc-800 rounded-full border border-gray-200 dark:border-gray-700"
          >
            <Icon :icon="tech.icon" class="w-5 h-5" :class="tech.color" />
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ tech.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { useColorMode } from '@vueuse/core'

defineOptions({
  name: 'LibraryInfoSection'
})

const theme = useColorMode()

// Technology stack
const techStack = [
  { name: 'Pyodide', icon: 'simple-icons:python', color: 'text-python-blue-600' },
  { name: 'WebAssembly', icon: 'simple-icons:webassembly', color: 'text-purple-600' },
  { name: 'Monaco Editor', icon: 'simple-icons:visualstudiocode', color: 'text-blue-600' },
  { name: 'Nuxt 3', icon: 'simple-icons:nuxtdotjs', color: 'text-green-500' }
]
</script>

