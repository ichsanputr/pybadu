<template>
  <section class="relative overflow-hidden">
    <!-- Background -->
    <div class="absolute inset-0 -z-10">
      <!-- Falling Stars Background -->
      <FallingStarsBg 
        color="#FFC832" 
        :count="100"
        class="opacity-20"
      />
      
      <div class="absolute inset-0 bg-gradient-to-br from-yellow-50 via-white to-orange-50"></div>
      <div class="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-yellow-200/40 blur-3xl"></div>
      <div class="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl"></div>
      <div class="absolute inset-0 [mask-image:radial-gradient(50%_50%_at_50%_50%,black,transparent_70%)]">
        <div class="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,200,50,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,200,50,0.06)_1px,transparent_1px)] bg-[size:36px_36px]"></div>
      </div>
    </div>

    <!-- Content -->
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <!-- Left: Text -->
        <div>
          <div class="flex items-center space-x-2 mb-4">
            <span class="text-sm font-medium text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full">
              From BudiBadu Ecosystem
            </span>
          </div>
          
          <h1 class="mt-3 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900">
            Dedicated Python
            <span class="block bg-gradient-to-r from-yellow-600 via-orange-500 to-yellow-400 bg-clip-text text-transparent">
              Library Playground
            </span>
          </h1>

          <p class="mt-5 text-base sm:text-lg md:text-xl text-gray-600 max-w-xl leading-relaxed">
            Experience <span class="font-semibold underline decoration-yellow-400">specialized compilers</span> for each Python library. 
            Run <span class="font-semibold">Matplotlib</span>, <span class="font-semibold">NumPy</span>, <span class="font-semibold">Pandas</span>, 
            and more with <span class="font-semibold underline decoration-orange-400">dedicated environments</span> 
            powered by Pyodide WebAssembly.
          </p>

          <div class="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <NuxtLink to="/matplotlib" class="btn-primary flex gap-2 items-center px-6 py-2.5 sm:px-7 sm:py-3 justify-center text-sm sm:text-base">
              <Icon icon="simple-icons:matplotlib" class="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Try Matplotlib</span>
            </NuxtLink>
            <NuxtLink to="/fiddle" class="btn-secondary flex gap-2 items-center px-6 py-2.5 sm:px-7 sm:py-3 justify-center text-sm sm:text-base">
              <Icon icon="ph:code" class="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Python Fiddle</span>
            </NuxtLink>
          </div>

          <!-- Stats -->
          <div class="mt-12 grid grid-cols-3 gap-8">
            <div>
              <div class="text-2xl sm:text-3xl font-bold text-yellow-600">15+</div>
              <div class="text-sm text-gray-600">Python Libraries</div>
            </div>
            <div>
              <div class="text-2xl sm:text-3xl font-bold text-orange-600">0</div>
              <div class="text-sm text-gray-600">Installation Required</div>
            </div>
            <div>
              <div class="text-2xl sm:text-3xl font-bold text-yellow-600">100%</div>
              <div class="text-sm text-gray-600">Browser-based</div>
            </div>
          </div>
        </div>

        <!-- Right: Visual -->
        <div class="relative">
          <div class="absolute -top-6 -left-6 h-24 w-24 rounded-2xl blur-2xl bg-yellow-200"></div>
          <div class="relative bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
            <!-- Mock Terminal Header -->
            <div class="bg-gray-900 px-4 py-3 flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="flex space-x-1.5">
                  <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span class="text-gray-300 text-sm font-medium">🐍 Pybadu • Matplotlib Compiler</span>
              </div>
            </div>
            
            <!-- Mock Code -->
            <div class="bg-gray-900 text-green-400 p-4 text-sm font-mono">
              <div class="space-y-1">
                <div><span class="text-blue-400">import</span> <span class="text-yellow-400">matplotlib.pyplot</span> <span class="text-blue-400">as</span> <span class="text-white">plt</span></div>
                <div><span class="text-blue-400">import</span> <span class="text-yellow-400">numpy</span> <span class="text-blue-400">as</span> <span class="text-white">np</span></div>
                <div class="h-2"></div>
                <div><span class="text-gray-500"># Create beautiful plots instantly</span></div>
                <div><span class="text-white">x</span> = <span class="text-white">np</span>.<span class="text-yellow-400">linspace</span>(<span class="text-green-300">0</span>, <span class="text-green-300">10</span>, <span class="text-green-300">100</span>)</div>
                <div><span class="text-white">y</span> = <span class="text-white">np</span>.<span class="text-yellow-400">sin</span>(<span class="text-white">x</span>)</div>
                <div class="h-2"></div>
                <div><span class="text-white">plt</span>.<span class="text-yellow-400">plot</span>(<span class="text-white">x</span>, <span class="text-white">y</span>)</div>
                <div><span class="text-white">plt</span>.<span class="text-yellow-400">show</span>()</div>
              </div>
            </div>
            
            <!-- Mock Plot Output -->
            <div class="bg-white p-4">
              <div class="bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg p-4 text-center">
                <Icon icon="simple-icons:matplotlib" class="w-12 h-12 mx-auto mb-2 text-blue-600" />
                <div class="text-sm text-gray-600">📊 Interactive Plot Generated</div>
                <div class="text-xs text-gray-500 mt-1">Ready in 0.8s</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import FallingStarsBg from '~/components/ui/FallingStarsBg.vue'

defineOptions({
  name: 'HeroSection'
})
</script>

<style scoped>
.btn-primary {
  @apply bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105;
}

.btn-secondary {
  @apply bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-lg shadow-md border border-gray-200 transition-all duration-200;
}
</style>