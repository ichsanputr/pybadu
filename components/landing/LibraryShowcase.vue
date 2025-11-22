<template>
  <section class="py-20 bg-white relative overflow-hidden border-t border-gray-100">
    
    <Container>
      <!-- Section Header -->
      <div class="text-center mb-16">
        <h2 class="text-2xl sm:text-4xl font-bold mb-6">
          <span class="bg-gradient-to-r from-python-blue-600 via-python-blue-500 to-python-yellow-500 bg-clip-text text-transparent">
            Specialized Libraries
          </span><br>
          <span class="text-gray-800">dedicated compiler for each Python library</span>
        </h2>
        <p class="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Unlike general Python environments, Pybadu provides focused compilers optimized for specific libraries.
          Each environment is pre-configured with the perfect setup for your chosen library.
        </p>
      </div>

      <!-- Library Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <!-- Matplotlib -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-blue-200 transition-colors">
              <Icon icon="simple-icons:matplotlib" class="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Matplotlib</h3>
              <p class="text-sm text-gray-600">Data Visualization</p>
            </div>
          </div>
          <p class="text-gray-600 mb-4">
            Create stunning static, animated, and interactive visualizations in Python. 
            Pre-loaded with NumPy for seamless data plotting.
          </p>
          <NuxtLink to="/matplotlib" class="text-python-blue-600 hover:text-python-blue-700 font-medium flex items-center">
            <span>Try Matplotlib</span>
            <Icon icon="ph:arrow-right" class="w-4 h-4 ml-1" />
          </NuxtLink>
        </div>

        <!-- Snowball Stemmer -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-green-200 transition-colors">
              <Icon icon="material-symbols:psychology" class="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Snowball Stemmer</h3>
              <p class="text-sm text-gray-600">Text Processing</p>
            </div>
          </div>
          <p class="text-gray-600 mb-4">
            Advanced text stemming algorithm supporting multiple languages. 
            Perfect for natural language processing and text analysis tasks.
          </p>
          <NuxtLink to="/snowball" class="text-python-blue-600 hover:text-python-blue-700 font-medium flex items-center">
            <span>Try Stemmer</span>
            <Icon icon="ph:arrow-right" class="w-4 h-4 ml-1" />
          </NuxtLink>
        </div>

        <!-- NumPy -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-purple-200 transition-colors">
              <Icon icon="simple-icons:numpy" class="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">NumPy</h3>
              <p class="text-sm text-gray-600">Scientific Computing</p>
            </div>
          </div>
          <p class="text-gray-600 mb-4">
            Fundamental package for scientific computing with Python. 
            Powerful N-dimensional array object and linear algebra functions.
          </p>
          <NuxtLink to="/numpy" class="text-python-blue-600 hover:text-python-blue-700 font-medium flex items-center">
            <span>Try NumPy</span>
            <Icon icon="ph:arrow-right" class="w-4 h-4 ml-1" />
          </NuxtLink>
        </div>

        <!-- Pandas -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-green-200 transition-colors">
              <Icon icon="simple-icons:pandas" class="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Pandas</h3>
              <p class="text-sm text-gray-600">Data Analysis</p>
            </div>
          </div>
          <p class="text-gray-600 mb-4">
            Powerful data structures and data analysis tools for Python. 
            Perfect for data manipulation and analysis tasks.
          </p>
          <NuxtLink to="/pandas" class="text-python-blue-600 hover:text-python-blue-700 font-medium flex items-center">
            <span>Try Pandas</span>
            <Icon icon="ph:arrow-right" class="w-4 h-4 ml-1" />
          </NuxtLink>
        </div>

        <!-- Scikit-learn -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-orange-200 transition-colors">
              <Icon icon="simple-icons:scikitlearn" class="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Scikit-learn</h3>
              <p class="text-sm text-gray-600">Machine Learning</p>
            </div>
          </div>
          <p class="text-gray-600 mb-4">
            Simple and efficient tools for predictive data analysis. 
            Built on NumPy, SciPy, and matplotlib.
          </p>
          <NuxtLink to="/scikit-learn" class="text-python-blue-600 hover:text-python-blue-700 font-medium flex items-center">
            <span>Try Scikit-learn</span>
            <Icon icon="ph:arrow-right" class="w-4 h-4 ml-1" />
          </NuxtLink>
        </div>

        <!-- More Libraries Coming -->
        <div class="bg-gradient-to-br from-python-blue-100 to-python-yellow-100 rounded-lg shadow-sm border border-python-blue-200 p-6 hover:shadow-md transition-shadow group">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-python-yellow-200 rounded-lg flex items-center justify-center mr-4 group-hover:bg-python-yellow-300 transition-colors">
              <Icon icon="ph:plus-circle" class="w-6 h-6 text-python-blue-700" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">More Libraries</h3>
              <p class="text-sm text-gray-600">Coming Soon</p>
            </div>
          </div>
          <p class="text-gray-600 mb-4">
            More specialized Python library environments on the way. 
            SciPy, NetworkX, SymPy, and many more packages available in Pyodide.
          </p>
          <a href="https://pyodide.org/en/stable/usage/packages-in-pyodide.html" target="_blank" class="text-python-blue-700 hover:text-python-blue-800 font-medium flex items-center">
            <span>View All Packages</span>
            <Icon icon="ph:arrow-square-out" class="w-4 h-4 ml-1" />
          </a>
        </div>
      </div>

      <!-- Call to Action -->
      <div class="text-center">
        <a href="https://pyodide.org/en/stable/usage/packages-in-pyodide.html" target="_blank" class="inline-flex items-center text-gray-600 hover:text-python-blue-600 transition-colors">
          <span>View all available packages in Pyodide</span>
          <Icon icon="ph:arrow-square-out" class="w-4 h-4 ml-2" />
        </a>
      </div>
    </Container>
  </section>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import Container from '~/components/Container.vue'

defineOptions({
  name: 'LibraryShowcase'
})
</script>