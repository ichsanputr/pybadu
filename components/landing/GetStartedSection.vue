<template>
  <section class="py-20 bg-gradient-to-br from-python-blue-50 via-white to-python-yellow-50">
    <Container>
      <div class="text-center">
        <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
          Ready to Start Coding?
        </h2>
        <p class="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-12">
          Choose your Python library and start experimenting immediately. 
          No installation, no configuration - just pure coding focus.
        </p>

        <!-- Quick Start Options -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          <!-- Matplotlib -->
          <NuxtLink to="/matplotlib" class="group bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover:scale-105">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
              <Icon icon="simple-icons:matplotlib" class="w-6 h-6 text-blue-600" />
            </div>
            <h3 class="font-semibold text-gray-900 mb-2">Start with Matplotlib</h3>
            <p class="text-sm text-gray-600 mb-4">Create beautiful visualizations</p>
            <div class="text-python-blue-600 font-medium text-sm">Try Now →</div>
          </NuxtLink>

          <!-- NumPy -->
          <NuxtLink to="/numpy" class="group bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover:scale-105">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
              <Icon icon="simple-icons:numpy" class="w-6 h-6 text-purple-600" />
            </div>
            <h3 class="font-semibold text-gray-900 mb-2">NumPy Computing</h3>
            <p class="text-sm text-gray-600 mb-4">Scientific computing arrays</p>
            <div class="text-python-blue-600 font-medium text-sm">Try Now →</div>
          </NuxtLink>

          <!-- Pandas -->
          <NuxtLink to="/pandas" class="group bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover:scale-105">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
              <Icon icon="simple-icons:pandas" class="w-6 h-6 text-green-600" />
            </div>
            <h3 class="font-semibold text-gray-900 mb-2">Pandas Analysis</h3>
            <p class="text-sm text-gray-600 mb-4">Data manipulation & analysis</p>
            <div class="text-python-blue-600 font-medium text-sm">Try Now →</div>
          </NuxtLink>
        </div>

        <!-- Main CTA -->
        <div class="space-y-6">
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <NuxtLink to="/matplotlib" class="btn-primary px-8 py-4 text-lg flex items-center space-x-3">
              <Icon icon="simple-icons:matplotlib" class="w-5 h-5" />
              <span>Start with Matplotlib</span>
            </NuxtLink>
            <NuxtLink to="/numpy" class="btn-secondary px-8 py-4 text-lg flex items-center space-x-3">
              <Icon icon="simple-icons:numpy" class="w-5 h-5" />
              <span>Try NumPy</span>
            </NuxtLink>
          </div>

          <!-- Sub CTA -->
          <p class="text-sm text-gray-500">
            Part of the 
            <a href="https://budibadu.com" target="_blank" class="text-python-blue-600 hover:text-python-blue-700 font-medium">
              BudiBadu ecosystem
            </a>
            • Powered by 
            <a href="https://pyodide.org" target="_blank" class="text-python-blue-600 hover:text-python-blue-700 font-medium">
              Pyodide WebAssembly
            </a>
          </p>
        </div>
      </div>
    </Container>
  </section>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import Container from '~/components/Container.vue'

defineOptions({
  name: 'GetStartedSection'
})
</script>

<style scoped>
.btn-primary {
  @apply bg-gradient-to-r from-python-blue-600 to-python-yellow-500 hover:from-python-blue-700 hover:to-python-yellow-600 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105;
}

.btn-secondary {
  @apply bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-lg shadow-md border border-gray-200 transition-all duration-200;
}
</style>