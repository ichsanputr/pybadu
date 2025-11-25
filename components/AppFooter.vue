<template>
  <footer class="bg-gray-900 text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Brand & Ecosystem -->
        <div>
          <div class="flex items-center space-x-3 mb-4">
            <img src="/logo-light.png" alt="Pybadu Logo" class="w-12 h-12 rounded-lg" />
            <div>
              <div class="text-xl font-bold text-white">
                Pybadu
              </div>
              <div class="text-sm text-gray-400">Python Library Playground</div>
            </div>
          </div>
          <p class="text-gray-400 max-w-md mb-6 text-sm">
            Dedicated Python library compilers powered by Pyodide WebAssembly. 
            Part of the BudiBadu ecosystem for developers and learners.
          </p>
          
          <!-- Ecosystem -->
          <h3 class="text-white font-semibold mb-4">Ecosystem</h3>
          <div class="space-y-2">
            <a href="https://budibadu.com" target="_blank" class="block text-gray-400 hover:text-python-yellow-400 text-sm transition-colors">
              BudiBadu ↗
            </a>
            <a href="https://budibadu.com/quizibadu" target="_blank" class="block text-gray-400 hover:text-python-yellow-400 text-sm transition-colors">
              Quizibadu ↗
            </a>
            <a href="https://budibadu.com/toolbadu" target="_blank" class="block text-gray-400 hover:text-python-yellow-400 text-sm transition-colors">
              Toolbadu ↗
            </a>
          </div>
        </div>

        <!-- Default Libraries -->
        <div>
          <h3 class="text-white font-semibold mb-4">Default Libraries</h3>
          <div class="grid grid-cols-2 gap-x-4 gap-y-2">
            <NuxtLink to="/matplotlib" @click="handleSmoothScroll" class="block text-gray-400 hover:text-python-yellow-400 text-sm transition-colors">
              Matplotlib
            </NuxtLink>
            <NuxtLink to="/numpy" @click="handleSmoothScroll" class="block text-gray-400 hover:text-python-yellow-400 text-sm transition-colors">
              NumPy
            </NuxtLink>
            <NuxtLink to="/pandas" @click="handleSmoothScroll" class="block text-gray-400 hover:text-python-yellow-400 text-sm transition-colors">
              Pandas
            </NuxtLink>
            <NuxtLink to="/scikit-learn" @click="handleSmoothScroll" class="block text-gray-400 hover:text-python-yellow-400 text-sm transition-colors">
              Scikit-learn
            </NuxtLink>
            <NuxtLink to="/zfpy" @click="handleSmoothScroll" class="block text-gray-400 hover:text-python-yellow-400 text-sm transition-colors">
              zfpy
            </NuxtLink>
            <NuxtLink to="/pyyaml" @click="handleSmoothScroll" class="block text-gray-400 hover:text-python-yellow-400 text-sm transition-colors">
              PyYAML
            </NuxtLink>
            <NuxtLink to="/mpmath" @click="handleSmoothScroll" class="block text-gray-400 hover:text-python-yellow-400 text-sm transition-colors">
              mpmath
            </NuxtLink>
            <NuxtLink to="/msprime" @click="handleSmoothScroll" class="block text-gray-400 hover:text-python-yellow-400 text-sm transition-colors">
              msprime
            </NuxtLink>
            <NuxtLink to="/markupsafe" @click="handleSmoothScroll" class="block text-gray-400 hover:text-python-yellow-400 text-sm transition-colors">
              MarkupSafe
            </NuxtLink>
            <NuxtLink to="/orjson" @click="handleSmoothScroll" class="block text-gray-400 hover:text-python-yellow-400 text-sm transition-colors">
              orjson
            </NuxtLink>
          </div>
        </div>

        <!-- Additional Libraries -->
        <div>
          <h3 class="text-white font-semibold mb-4">Additional Libraries</h3>
          <div class="grid grid-cols-2 gap-x-4 gap-y-2">
            <NuxtLink to="/snowball" @click="handleSmoothScroll" class="block text-gray-400 hover:text-python-yellow-400 text-sm transition-colors">
              Snowball Stemmer
            </NuxtLink>
            <NuxtLink to="/beautifulsoup4" @click="handleSmoothScroll" class="block text-gray-400 hover:text-python-yellow-400 text-sm transition-colors">
              BeautifulSoup4
            </NuxtLink>
            <NuxtLink to="/pyjokes" @click="handleSmoothScroll" class="block text-gray-400 hover:text-python-yellow-400 text-sm transition-colors">
              Pyjokes
            </NuxtLink>
            <NuxtLink to="/tabulate" @click="handleSmoothScroll" class="block text-gray-400 hover:text-python-yellow-400 text-sm transition-colors">
              Tabulate
            </NuxtLink>
            <NuxtLink to="/shortuuid" @click="handleSmoothScroll" class="block text-gray-400 hover:text-python-yellow-400 text-sm transition-colors">
              ShortUUID
            </NuxtLink>
            <NuxtLink to="/yarl" @click="handleSmoothScroll" class="block text-gray-400 hover:text-python-yellow-400 text-sm transition-colors">
              Yarl
            </NuxtLink>
            <NuxtLink to="/faker" @click="handleSmoothScroll" class="block text-gray-400 hover:text-python-yellow-400 text-sm transition-colors">
              Faker
            </NuxtLink>
            <NuxtLink to="/textwrap3" @click="handleSmoothScroll" class="block text-gray-400 hover:text-python-yellow-400 text-sm transition-colors">
              Textwrap3
            </NuxtLink>
            <NuxtLink to="/jmespath" @click="handleSmoothScroll" class="block text-gray-400 hover:text-python-yellow-400 text-sm transition-colors">
              JMESPath
            </NuxtLink>
            <NuxtLink to="/dateparser" @click="handleSmoothScroll" class="block text-gray-400 hover:text-python-yellow-400 text-sm transition-colors">
              Dateparser
            </NuxtLink>
          </div>
          <div class="mt-4">
            <NuxtLink to="/list" @click="handleSmoothScroll" class="inline-flex items-center text-sm text-gray-200 hover:text-python-yellow-400 transition-colors">
              See all compilers →
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Bottom -->
      <div class="border-t border-gray-800 mt-8 py-6 flex flex-col sm:flex-row justify-center items-center">
        <p class="text-gray-400 text-xs sm:text-sm">
          © {{ new Date().getFullYear() }} Pybadu. Part of BudiBadu ecosystem.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useRouter } from 'vue-router'

defineOptions({
  name: 'AppFooter'
})

const router = useRouter()

// Smooth scroll to top when clicking footer links
function handleSmoothScroll() {
  // Use nextTick to ensure navigation completes first
  setTimeout(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }, 100)
}
</script>