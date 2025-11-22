<template>
  <section class="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="max-w-4xl mx-auto">
        <!-- Slot for custom content -->
        <slot />

        <!-- Default Branding Section (can be overridden) -->
        <slot name="branding">
          <div class="mt-12 text-center bg-gradient-to-br from-python-blue-50/50 to-python-yellow-50/50 dark:from-python-blue-900/10 dark:to-python-yellow-900/10 rounded-2xl p-8 border border-gray-200 dark:border-gray-800">
            <img :src="theme === 'dark' ? '/logo-light.png' : '/logo.png'" alt="Pybadu Logo" class="w-20 h-20 mx-auto mb-4 rounded-xl" />
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Part of Pybadu</h3>
            <p class="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Specialized Python library playground, part of the BudiBadu ecosystem. Powered by Pyodide WebAssembly to run Python directly in your browser.
            </p>
            <div class="flex items-center justify-center gap-4">
              <a href="https://budibadu.com" target="_blank" class="inline-flex items-center gap-2 text-python-blue-600 hover:text-python-blue-700 dark:text-python-blue-400 dark:hover:text-python-blue-300 font-semibold transition-colors group">
                <span>Explore BudiBadu</span>
                <Icon icon="ph:arrow-square-out" class="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
              <span class="text-gray-300 dark:text-gray-700">•</span>
              <a href="https://pyodide.org" target="_blank" class="inline-flex items-center gap-2 text-python-blue-600 hover:text-python-blue-700 dark:text-python-blue-400 dark:hover:text-python-blue-300 font-semibold transition-colors group">
                <span>Learn about Pyodide</span>
                <Icon icon="ph:arrow-square-out" class="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>
        </slot>
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
</script>

