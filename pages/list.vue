<template>
  <div class="relative light min-h-screen bg-white">
    <!-- Header Section -->
    <section class="py-12 md:py-16 bg-gradient-to-br from-python-blue-600 via-python-blue-500 to-python-yellow-500 relative overflow-hidden">
      <Container>
        <div class="text-center relative z-10">
          <h1 class="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4">
            All Compilers
          </h1>
          <p class="text-sm md:text-base text-white/90 max-w-2xl mx-auto mb-6 md:mb-8">
            Browse all available Python library compilers. Each compiler provides a dedicated environment optimized for its specific library.
          </p>
          
          <!-- Search Input -->
          <div class="max-w-xl mx-auto">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search compilers..."
                class="w-full px-4 py-3 md:px-5 md:py-4 pl-12 md:pl-14 text-sm md:text-base text-gray-900 bg-white/95 backdrop-blur-sm rounded-xl border-2 border-white/50 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
              />
              <Icon icon="ph:magnifying-glass" class="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 w-5 h-5 md:w-6 md:h-6 text-gray-400" />
              <button
                v-if="searchQuery"
                @click="searchQuery = ''"
                class="absolute right-4 md:right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Icon icon="ph:x" class="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
          </div>
        </div>
      </Container>
    </section>

    <!-- Default Libraries Section -->
    <section v-if="filteredDefaultLibraries.length > 0" class="py-12 md:py-16 bg-white">
      <Container>
        <div class="mb-8 md:mb-12">
          <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Default Libraries
          </h2>
          <p class="text-sm md:text-base text-gray-600">
            Core Python libraries for data science, visualization, and machine learning.
          </p>
        </div>

        <div class="space-y-3 md:space-y-4">
          <NuxtLink
            v-for="compiler in filteredDefaultLibraries"
            :key="compiler.path"
            :to="compiler.path"
            class="group block border-l-4 border-python-blue-500 bg-gray-50 hover:bg-gray-100 transition-all duration-200 p-4 md:p-6 rounded-r-lg"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <h3 class="text-lg md:text-xl font-semibold text-gray-900 mb-1 md:mb-2 group-hover:text-python-blue-600 transition-colors">
                  {{ compiler.name }}
                </h3>
                <p class="text-xs md:text-sm text-gray-600 leading-relaxed">
                  {{ compiler.description }}
                </p>
              </div>
              <div class="ml-4 md:ml-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <span class="text-python-blue-600 font-medium text-xs md:text-sm">Try Now →</span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </Container>
    </section>

    <!-- Additional Libraries Section -->
    <section v-if="filteredAdditionalLibraries.length > 0" class="py-12 md:py-16 bg-gray-50">
      <Container>
        <div class="mb-8 md:mb-12">
          <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Additional Libraries
          </h2>
          <p class="text-sm md:text-base text-gray-600">
            Specialized libraries for text processing, web scraping, and data formatting.
          </p>
        </div>

        <div class="space-y-3 md:space-y-4">
          <NuxtLink
            v-for="compiler in filteredAdditionalLibraries"
            :key="compiler.path"
            :to="compiler.path"
            class="group block border-l-4 border-python-yellow-500 bg-white hover:bg-gray-50 transition-all duration-200 p-4 md:p-6 rounded-r-lg"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <h3 class="text-lg md:text-xl font-semibold text-gray-900 mb-1 md:mb-2 group-hover:text-python-yellow-600 transition-colors">
                  {{ compiler.name }}
                </h3>
                <p class="text-xs md:text-sm text-gray-600 leading-relaxed">
                  {{ compiler.description }}
                </p>
              </div>
              <div class="ml-4 md:ml-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <span class="text-python-yellow-600 font-medium text-xs md:text-sm">Try Now →</span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </Container>
    </section>

    <!-- No Results -->
    <section v-if="searchQuery && filteredDefaultLibraries.length === 0 && filteredAdditionalLibraries.length === 0" class="py-16 bg-white">
      <Container>
        <div class="text-center">
          <p class="text-sm md:text-base text-gray-600">
            No compilers found matching "{{ searchQuery }}"
          </p>
        </div>
      </Container>
    </section>

    <!-- Footer -->
    <AppFooter />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import Container from '~/components/Container.vue'
import AppFooter from '~/components/AppFooter.vue'

// Use landing layout (no layout)
definePageMeta({
  layout: false
})

// Ensure light theme - isolated from compiler pages
onMounted(() => {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.remove('dark')
  }
})

onUnmounted(() => {
  // Don't interfere with compiler page theme
})

// Search query
const searchQuery = ref('')

// Filter function
const filterCompilers = (compilers, query) => {
  if (!query.trim()) {
    return compilers
  }
  const lowerQuery = query.toLowerCase()
  return compilers.filter(compiler => 
    compiler.name.toLowerCase().includes(lowerQuery) ||
    compiler.description.toLowerCase().includes(lowerQuery)
  )
}

// Default Libraries
const defaultLibraries = [
  {
    name: 'Matplotlib',
    description: 'Create stunning data visualizations and plots. Perfect for data analysis, scientific research, and creating publication-quality graphics.',
    path: '/matplotlib'
  },
  {
    name: 'NumPy',
    description: 'Scientific computing with arrays. Essential for numerical operations, linear algebra, and mathematical computations.',
    path: '/numpy'
  },
  {
    name: 'Pandas',
    description: 'Data analysis and manipulation. Work with structured data, perform data cleaning, transformation, and analysis operations.',
    path: '/pandas'
  },
  {
    name: 'Scikit-learn',
    description: 'Machine learning tools and algorithms. Build predictive models, perform classification, regression, and clustering tasks.',
    path: '/scikit-learn'
  }
]

// Additional Libraries
const additionalLibraries = [
  {
    name: 'Snowball Stemmer',
    description: 'Text processing library that reduces words to their root forms through stemming algorithms. Supports multiple languages for natural language processing.',
    path: '/snowball'
  },
  {
    name: 'BeautifulSoup4',
    description: 'Parse and extract data from HTML strings. Perfect for web scraping, data extraction, and HTML content processing.',
    path: '/beautifulsoup4'
  },
  {
    name: 'Pyjokes',
    description: 'Generate random programming jokes. Add humor to your applications or simply enjoy a quick laugh during coding sessions.',
    path: '/pyjokes'
  },
  {
    name: 'Tabulate',
    description: 'Pretty print tables from Python lists. Create beautifully formatted tables for displaying structured data in a readable format.',
    path: '/tabulate'
  },
  {
    name: 'ShortUUID',
    description: 'Generate shorter, URL-safe UUIDs. Create compact unique identifiers perfect for URLs, database keys, and unique resource IDs.',
    path: '/shortuuid'
  },
  {
    name: 'Yarl',
    description: 'Parse and build URLs with immutable URL objects. Handle URL components, query parameters, and path manipulation safely and conveniently.',
    path: '/yarl'
  },
  {
    name: 'Faker',
    description: 'Generate fake data for testing and demos. Create realistic names, emails, addresses, phone numbers, and more with localization support.',
    path: '/faker'
  }
]

// Filtered libraries based on search query
const filteredDefaultLibraries = computed(() => {
  return filterCompilers(defaultLibraries, searchQuery.value)
})

const filteredAdditionalLibraries = computed(() => {
  return filterCompilers(additionalLibraries, searchQuery.value)
})

// SEO Meta
useHead({
  title: 'All Compilers - Pybadu',
  meta: [
    {
      name: 'description',
      content: 'Browse all available Python library compilers on Pybadu. Explore dedicated environments for Matplotlib, NumPy, Pandas, Scikit-learn, and more specialized libraries.'
    },
    {
      name: 'keywords',
      content: 'python compilers, online python, pyodide, numpy, pandas, matplotlib, scikit-learn, python libraries, browser python'
    },
    {
      property: 'og:title',
      content: 'All Compilers - Pybadu'
    },
    {
      property: 'og:type',
      content: 'website'
    },
    {
      property: 'og:description',
      content: 'Browse all available Python library compilers on Pybadu'
    }
  ]
})
</script>

<style scoped>
.light {
  color-scheme: light;
}
</style>

