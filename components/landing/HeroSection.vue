<template>
  <section class="relative overflow-hidden min-h-screen flex items-center bg-gradient-to-br from-gray-50 via-white to-gray-50">
    <!-- Animated Grid Pattern Background -->
    <div class="absolute inset-0 -z-10 opacity-30">
      <div class="absolute inset-0 bg-[linear-gradient(to_right,rgba(55,118,171,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(55,118,171,0.08)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
    </div>
    
    <!-- Subtle Glow Effects -->
    <div class="absolute top-1/4 left-10 w-72 h-72 bg-python-blue-400/20 rounded-full blur-3xl"></div>
    <div class="absolute bottom-1/4 right-10 w-72 h-72 bg-python-yellow-400/20 rounded-full blur-3xl"></div>

    <!-- Content -->
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <!-- Left: Text -->
        <div>
          <div class="flex items-center space-x-2 mb-4">
            <span class="text-sm font-medium text-python-blue-700 bg-python-blue-100 px-3 py-1 rounded-full">
              From BudiBadu Ecosystem
            </span>
          </div>
          
          <h1 class="mt-3 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900">
            Dedicated Python
            <span class="block bg-gradient-to-r from-python-blue-600 via-python-blue-500 to-python-yellow-500 bg-clip-text text-transparent">
              Library Playground
            </span>
          </h1>

          <p class="mt-5 text-base sm:text-lg md:text-xl text-gray-600 max-w-xl leading-relaxed">
            Experience <span class="font-semibold underline decoration-python-yellow-400">specialized compilers</span> for each Python library. 
            Run <span class="font-semibold">Matplotlib</span>, <span class="font-semibold">NumPy</span>, <span class="font-semibold">Pandas</span>, 
            and more with <span class="font-semibold underline decoration-python-blue-400">dedicated environments</span> 
            powered by Pyodide WebAssembly.
          </p>

          <div class="mt-8">
            <NuxtLink to="/matplotlib" class="group inline-flex gap-2 items-center px-8 py-4 bg-python-blue-600 hover:bg-python-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105">
              <Icon icon="ph:play-circle" class="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Get Started</span>
            </NuxtLink>
          </div>
        </div>

        <!-- Right: Simple Feature List -->
        <div class="relative">
          <div class="space-y-6">
            <div class="flex items-start space-x-4">
              <div class="w-12 h-12 rounded-lg bg-python-blue-100 flex items-center justify-center flex-shrink-0">
                <Icon icon="simple-icons:matplotlib" class="w-6 h-6 text-python-blue-600" />
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 mb-1">Matplotlib</h3>
                <p class="text-gray-600 text-sm">Create stunning visualizations</p>
              </div>
            </div>
            <div class="flex items-start space-x-4">
              <div class="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Icon icon="simple-icons:numpy" class="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 mb-1">NumPy</h3>
                <p class="text-gray-600 text-sm">Scientific computing arrays</p>
              </div>
            </div>
            <div class="flex items-start space-x-4">
              <div class="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                <Icon icon="simple-icons:pandas" class="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 mb-1">Pandas</h3>
                <p class="text-gray-600 text-sm">Data analysis & manipulation</p>
              </div>
            </div>
            <div class="flex items-start space-x-4">
              <div class="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                <Icon icon="simple-icons:scikitlearn" class="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 mb-1">Scikit-learn</h3>
                <p class="text-gray-600 text-sm">Machine learning tools</p>
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

defineOptions({
  name: 'HeroSection'
})
</script>
