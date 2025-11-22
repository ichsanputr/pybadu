<template>
  <footer class="bg-gray-900 text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Brand -->
        <div class="col-span-1 md:col-span-2">
          <div class="flex items-center space-x-3 mb-4">
            <div class="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-xl">🐍</span>
            </div>
            <div>
              <div class="text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Pybadu
              </div>
              <div class="text-sm text-gray-400">Python Library Playground</div>
            </div>
          </div>
          <p class="text-gray-400 text-sm max-w-md">
            Dedicated Python library compilers powered by Pyodide WebAssembly. 
            Part of the BudiBadu ecosystem for developers and learners.
          </p>
        </div>

        <!-- Libraries -->
        <div>
          <h3 class="text-white font-semibold mb-4">Libraries</h3>
          <div class="space-y-2">
            <NuxtLink to="/matplotlib" class="block text-gray-400 hover:text-yellow-400 text-sm transition-colors">
              Matplotlib
            </NuxtLink>
            <NuxtLink to="/snowball" class="block text-gray-400 hover:text-yellow-400 text-sm transition-colors">
              Snowball Stemmer
            </NuxtLink>
            <NuxtLink to="/fiddle" class="block text-gray-400 hover:text-yellow-400 text-sm transition-colors">
              Python Fiddle
            </NuxtLink>
          </div>
        </div>

        <!-- Ecosystem -->
        <div>
          <h3 class="text-white font-semibold mb-4">Ecosystem</h3>
          <div class="space-y-2">
            <a href="https://budibadu.com" target="_blank" class="block text-gray-400 hover:text-yellow-400 text-sm transition-colors">
              BudiBadu ↗
            </a>
            <a href="https://pyodide.org" target="_blank" class="block text-gray-400 hover:text-yellow-400 text-sm transition-colors">
              Pyodide ↗
            </a>
          </div>
        </div>
      </div>

      <!-- Bottom -->
      <div class="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
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