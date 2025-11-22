<template>
  <section class="py-20 bg-white">
    <Container>
      <!-- Section Header -->
      <div class="text-center mb-16">
        <h2 class="text-2xl sm:text-4xl font-bold mb-6">
          <span class="text-gray-800">Why Choose</span>
          <span class="bg-gradient-to-r from-yellow-600 via-orange-500 to-yellow-400 bg-clip-text text-transparent"> Pybadu</span>
          <span class="text-gray-800">?</span>
        </h2>
        <p class="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
          Focused Python library environments designed for learning, experimentation, and rapid prototyping
        </p>
      </div>

      <!-- Features Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <!-- Dedicated Compilers -->
        <div class="text-center group">
          <div class="w-16 h-16 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
            <Icon icon="ph:cpu" class="w-8 h-8 text-yellow-600" />
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-4">Dedicated Compilers</h3>
          <p class="text-gray-600 leading-relaxed">
            Each library gets its own optimized environment. No conflicts, no setup, 
            just the perfect configuration for each Python library you want to use.
          </p>
        </div>

        <!-- Instant Execution -->
        <div class="text-center group">
          <div class="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
            <Icon icon="ph:lightning" class="w-8 h-8 text-blue-600" />
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-4">Instant Execution</h3>
          <p class="text-gray-600 leading-relaxed">
            No waiting for installations or environment setup. Code executes immediately 
            in your browser with full Python speed powered by WebAssembly.
          </p>
        </div>

        <!-- Pre-configured -->
        <div class="text-center group">
          <div class="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
            <Icon icon="ph:check-circle" class="w-8 h-8 text-green-600" />
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-4">Pre-configured</h3>
          <p class="text-gray-600 leading-relaxed">
            Every library comes with its dependencies pre-loaded and ready to use. 
            Focus on coding, not on configuration management.
          </p>
        </div>

        <!-- No Installation -->
        <div class="text-center group">
          <div class="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
            <Icon icon="ph:cloud" class="w-8 h-8 text-purple-600" />
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-4">Zero Installation</h3>
          <p class="text-gray-600 leading-relaxed">
            Run everything in your browser. No Python installation, no pip commands, 
            no virtual environments. Just click and code.
          </p>
        </div>

        <!-- Educational Focus -->
        <div class="text-center group">
          <div class="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
            <Icon icon="ph:graduation-cap" class="w-8 h-8 text-orange-600" />
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-4">Perfect for Learning</h3>
          <p class="text-gray-600 leading-relaxed">
            Ideal for students, educators, and anyone learning Python libraries. 
            Examples and documentation built right into each compiler.
          </p>
        </div>

        <!-- Cross Platform -->
        <div class="text-center group">
          <div class="w-16 h-16 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
            <Icon icon="ph:devices" class="w-8 h-8 text-indigo-600" />
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-4">Cross-Platform</h3>
          <p class="text-gray-600 leading-relaxed">
            Works on any device with a modern browser. Desktop, tablet, or mobile - 
            your Python environment follows you everywhere.
          </p>
        </div>
      </div>

      <!-- Comparison Section -->
      <div class="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8 md:p-12">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 class="text-2xl font-bold text-gray-900 mb-6">
              From the BudiBadu Ecosystem
            </h3>
            <p class="text-gray-600 mb-6 leading-relaxed">
              Pybadu is part of the BudiBadu family, bringing the same quality and attention 
              to developer experience. While BudiBadu focuses on coding challenges and skill development, 
              Pybadu provides specialized Python library environments for learning and experimentation.
            </p>
            <div class="space-y-4">
              <div class="flex items-start space-x-3">
                <Icon icon="ph:check-circle" class="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                <span class="text-gray-700">Same high-quality user experience as BudiBadu</span>
              </div>
              <div class="flex items-start space-x-3">
                <Icon icon="ph:check-circle" class="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                <span class="text-gray-700">Focused on library-specific Python development</span>
              </div>
              <div class="flex items-start space-x-3">
                <Icon icon="ph:check-circle" class="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                <span class="text-gray-700">Perfect complement to coding challenge practice</span>
              </div>
            </div>
            <div class="mt-8">
              <a href="https://budibadu.com" target="_blank" class="inline-flex items-center text-yellow-600 hover:text-yellow-700 font-medium">
                <span>Visit BudiBadu</span>
                <Icon icon="ph:arrow-square-out" class="w-4 h-4 ml-2" />
              </a>
            </div>
          </div>
          
          <div class="relative">
            <div class="bg-white rounded-lg shadow-lg p-6">
              <div class="flex items-center space-x-4 mb-4">
                <div class="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <span class="text-white font-bold">B</span>
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900">BudiBadu</h4>
                  <p class="text-sm text-gray-600">Coding Challenges</p>
                </div>
              </div>
              <div class="flex items-center space-x-4 mb-4">
                <div class="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                  <span class="text-white font-bold">🐍</span>
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900">Pybadu</h4>
                  <p class="text-sm text-gray-600">Python Libraries</p>
                </div>
              </div>
              <div class="text-center pt-4 border-t border-gray-200">
                <p class="text-sm text-gray-600">Powerful ecosystem for developers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  </section>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import Container from '~/components/Container.vue'

defineOptions({
  name: 'FeaturesSection'
})
</script>