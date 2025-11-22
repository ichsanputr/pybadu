<template>
  <footer class="bg-gray-900 text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        <!-- Brand -->
        <div class="col-span-1 md:col-span-2">
          <div class="flex items-center space-x-3 mb-4">
            <img src="/logo-light.png" alt="Pybadu Logo" class="w-12 h-12 rounded-lg" />
            <div>
              <div class="text-xl font-bold text-white">
                Pybadu
              </div>
              <div class="text-sm text-gray-400">Python Library Playground</div>
            </div>
          </div>
          <p class="text-gray-400 max-w-md">
            Dedicated Python library compilers powered by Pyodide WebAssembly. 
            Part of the BudiBadu ecosystem for developers and learners.
          </p>
        </div>

        <!-- Default Libraries -->
        <div>
          <h3 class="text-white font-semibold mb-4">Default Libraries</h3>
          <div class="space-y-2">
            <NuxtLink to="/matplotlib" class="block text-gray-400 hover:text-python-yellow-400 text-sm transition-colors">
              Matplotlib
            </NuxtLink>
            <NuxtLink to="/numpy" class="block text-gray-400 hover:text-python-yellow-400 text-sm transition-colors">
              NumPy
            </NuxtLink>
            <NuxtLink to="/pandas" class="block text-gray-400 hover:text-python-yellow-400 text-sm transition-colors">
              Pandas
            </NuxtLink>
            <NuxtLink to="/scikit-learn" class="block text-gray-400 hover:text-python-yellow-400 text-sm transition-colors">
              Scikit-learn
            </NuxtLink>
          </div>
        </div>

        <!-- Additional Libraries -->
        <div>
          <h3 class="text-white font-semibold mb-4">Additional Libraries</h3>
          <div class="space-y-2">
            <NuxtLink to="/scipy" class="block text-gray-400 hover:text-python-yellow-400 text-sm transition-colors">
              SciPy
            </NuxtLink>
            <NuxtLink to="/beautifulsoup4" class="block text-gray-400 hover:text-python-yellow-400 text-sm transition-colors">
              BeautifulSoup4
            </NuxtLink>
            <NuxtLink to="/pillow" class="block text-gray-400 hover:text-python-yellow-400 text-sm transition-colors">
              Pillow
            </NuxtLink>
            <NuxtLink to="/nltk" class="block text-gray-400 hover:text-python-yellow-400 text-sm transition-colors">
              NLTK
            </NuxtLink>
            <NuxtLink to="/regex" class="block text-gray-400 hover:text-python-yellow-400 text-sm transition-colors">
              Regex
            </NuxtLink>
            <NuxtLink to="/pytz" class="block text-gray-400 hover:text-python-yellow-400 text-sm transition-colors">
              PyTZ
            </NuxtLink>
          </div>
        </div>

        <!-- Ecosystem -->
        <div>
          <h3 class="text-white font-semibold mb-4">Ecosystem</h3>
          <div class="space-y-2">
            <a href="https://budibadu.com" target="_blank" class="block text-gray-400 hover:text-python-yellow-400 text-sm transition-colors">
              BudiBadu ↗
            </a>
            <a href="https://pyodide.org" target="_blank" class="block text-gray-400 hover:text-python-yellow-400 text-sm transition-colors">
              Pyodide ↗
            </a>
            <a href="https://github.com/unovue/inspira-ui" target="_blank" class="block text-gray-400 hover:text-python-yellow-400 text-sm transition-colors">
              Inspira UI ↗
            </a>
          </div>
        </div>
      </div>

      <!-- Bottom -->
      <div class="border-t border-gray-800 mt-8 py-6 flex flex-col sm:flex-row justify-between items-center">
        <p class="text-gray-400 text-sm">
          © {{ new Date().getFullYear() }} Pybadu. Part of BudiBadu ecosystem.
        </p>
        <p class="text-gray-500 text-xs mt-2 sm:mt-0">
          Powered by Pyodide WebAssembly • Built with Nuxt 3
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
defineOptions({
  name: 'AppFooter'
})
</script>