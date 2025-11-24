<template>
  <div class="relative light">
    <!-- Hero Section with Aurora Background -->
    <AuroraBackground>
      <Motion
        as="div"
        :initial="{ opacity: 0, y: 40, filter: 'blur(10px)' }"
        :while-in-view="{
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
        }"
        :transition="{
          delay: 0.2,
          duration: 0.8,
          ease: 'easeInOut',
        }"
        class="relative z-10 flex flex-col items-center justify-center gap-6 px-4 py-32"
      >
        <!-- Animated Title with Sparkles -->
        <SparklesText
          text="Pybadu"
          :colors="{ first: '#3776ab', second: '#ffd43b' }"
          :sparkles-count="15"
          class="text-5xl md:text-7xl lg:text-8xl font-extrabold"
        />
        
        <Motion
          as="h2"
          :initial="{ opacity: 0, y: 20 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :transition="{ delay: 0.4, duration: 0.6 }"
          class="text-xl md:text-2xl lg:text-3xl font-bold text-center text-gray-800 dark:text-gray-200"
        >
          Dedicated Python Library Playground
        </Motion>

        <Motion
          as="p"
          :initial="{ opacity: 0, y: 20 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :transition="{ delay: 0.6, duration: 0.6 }"
          class="text-base md:text-lg lg:text-xl text-center max-w-3xl text-gray-600 dark:text-gray-400 px-4"
        >
          Experience specialized compilers for each Python library. Run NumPy, Pandas, Matplotlib, 
          and Scikit-learn with dedicated environments powered by Pyodide WebAssembly.
        </Motion>

        <Motion
          as="div"
          :initial="{ opacity: 0, scale: 0.8 }"
          :while-in-view="{ opacity: 1, scale: 1 }"
          :transition="{ delay: 0.8, duration: 0.5 }"
          class="flex flex-col sm:flex-row gap-4 mt-4"
        >
          <NuxtLink
            to="/matplotlib"
            class="group relative px-4 py-2.5 sm:px-8 sm:py-4 bg-python-blue-600 hover:bg-python-blue-700 text-white text-sm sm:text-base font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 overflow-hidden"
          >
            <span class="relative z-10 flex items-center gap-2">
              <Icon icon="ph:play-circle" class="w-4 h-4 sm:w-5 sm:h-5" />
              Start Coding Now
            </span>
            <div class="absolute inset-0 bg-gradient-to-r from-python-blue-500 to-python-yellow-500 opacity-0 group-hover:opacity-20 transition-opacity" />
          </NuxtLink>
          
          <a
            href="https://budibadu.com"
            target="_blank"
            class="px-4 py-2.5 sm:px-8 sm:py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm sm:text-base font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 border border-gray-200 dark:border-gray-700 flex items-center gap-2"
          >
            Explore BudiBadu
            <Icon icon="ph:arrow-square-out" class="w-4 h-4 sm:w-5 sm:h-5" />
          </a>
        </Motion>

        <!-- Meteor Effect -->
        <Meteor :number="20" />
      </Motion>
    </AuroraBackground>

    <!-- Library Showcase - Moved Up -->
    <section class="py-24 bg-white relative">
      <Container>
        <Motion
          as="div"
          :initial="{ opacity: 0, y: 20 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.6 }"
          class="text-center mb-16"
        >
          <h2 class="text-4xl md:text-5xl font-bold mb-4">
            <span class="bg-gradient-to-r from-python-blue-600 via-python-blue-500 to-python-yellow-500 bg-clip-text text-transparent">
              Specialized Compilers
            </span>
          </h2>
          <p class="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Unlike general Python environments, Pybadu provides focused compilers optimized for specific libraries.
            Each environment is pre-configured with the perfect setup for your chosen library.
          </p>
        </Motion>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-12">
          <Motion
            v-for="(library, index) in libraries"
            :key="library.name"
            as="div"
            :initial="{ opacity: 0, y: 30 }"
            :while-in-view="{ opacity: 1, y: 0 }"
            :transition="{ delay: index * 0.05, duration: 0.5 }"
          >
            <FlipCard class="h-64">
              <!-- Front -->
              <div class="flex h-full w-full flex-col items-center justify-center rounded-xl bg-white border border-gray-200 p-6">
                <div 
                  class="w-16 h-16 rounded-xl flex items-center justify-center mb-4"
                  :class="library.bgClass"
                >
                  <Icon :icon="library.icon" class="w-8 h-8 text-white" />
                </div>
                <h3 class="text-xl font-bold text-gray-900 mb-2 text-center">
                  {{ library.name }}
                </h3>
                <p class="text-sm text-gray-600 text-center">
                  {{ library.description }}
                </p>
              </div>

              <!-- Back -->
              <template #back>
                <NuxtLink
                  :to="library.href"
                  class="flex h-full w-full flex-col items-center justify-center rounded-xl border border-python-blue-500 p-6 text-center"
                  :class="library.bgClass"
                >
                  <Icon :icon="library.icon" class="w-12 h-12 text-white mb-4" />
                  <p class="text-base md:text-lg font-bold text-white mb-3">
                    Ready to explore?
                  </p>
                  <div class="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/30 transition-all">
                    <span>Try {{ library.name }}</span>
                    <Icon icon="ph:arrow-right" class="w-4 h-4" />
                  </div>
                </NuxtLink>
              </template>
            </FlipCard>
          </Motion>
        </div>

        <!-- Additional Compilers Count -->
        <Motion
          as="div"
          :initial="{ opacity: 0, y: 20 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :transition="{ delay: 0.5, duration: 0.5 }"
          class="mt-8 text-center"
        >
        <!-- change to see all libraries -->
          <p class="text-gray-600 text-sm">
            + {{ totalPyodidePackages - libraries.length }} browse all compilers on <NuxtLink to="/list" class="text-python-blue-600 font-semibold underline hover:text-python-blue-700">List Page</NuxtLink>
          </p>
        </Motion>
      </Container>
    </section>

    <!-- Why Choose Section -->
    <section class="py-24 bg-gray-50 relative overflow-hidden">
      <Container>
        <Motion
          as="div"
          :initial="{ opacity: 0, y: 20 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.6 }"
          class="text-center mb-16"
        >
          <h2 class="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Why Choose Pybadu?
          </h2>
          <p class="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Specialized environments, zero setup, instant execution. Everything you need for Python library development.
          </p>
        </Motion>

        <Motion
          as="div"
          :initial="{ opacity: 0, y: 30 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :transition="{ delay: 0.2, duration: 0.6 }"
        >
          <BentoGrid class="mx-auto max-w-7xl">
            <BentoCard
              name="Dedicated Compilers"
              class="col-span-3 lg:col-span-2"
              icon="simple-icons:python"
              icon-bg="from-python-blue-500 to-python-blue-600"
              description="Each library has its own optimized environment. Pre-configured with all dependencies and best practices for seamless development."
              href="/matplotlib"
            />
            
            <BentoCard
              name="Zero Setup Required"
              class="col-span-3 lg:col-span-1"
              icon="ph:lightning"
              icon-bg="from-python-blue-500 to-python-blue-600"
              description="Start coding instantly. No installation, no configuration, just pure Python in your browser."
              href="/numpy"
            />

            <BentoCard
              name="Real-Time Execution"
              class="col-span-3 lg:col-span-1"
              icon="ph:rocket-launch"
              icon-bg="from-python-blue-500 to-python-blue-600"
              description="See your results immediately with our WebAssembly-powered execution engine."
              href="/pandas"
            />

            <BentoCard
              name="Multi-File Projects"
              class="col-span-3 lg:col-span-2"
              icon="ph:files"
              icon-bg="from-python-blue-500 to-python-blue-600"
              description="Create complex projects with up to 5 files. Full IDE-like experience with file management and auto-save to localStorage."
              href="/scikit-learn"
            />

            <BentoCard
              name="Open Source Libraries"
              class="col-span-3 lg:col-span-1"
              icon="ph:git-branch"
              icon-bg="from-python-blue-500 to-python-blue-600"
              description="Built on industry-standard libraries powered by Pyodide WebAssembly."
            />

            <BentoCard
              name="Powered by Pyodide"
              class="col-span-3 lg:col-span-1"
              icon="ph:cpu"
              icon-bg="from-python-blue-500 to-python-blue-600"
              description="WebAssembly technology brings Python's full power to your browser securely."
            />

            <BentoCard
              name="Browser-Based Learning"
              class="col-span-3 lg:col-span-1"
              icon="ph:graduation-cap"
              icon-bg="from-python-blue-500 to-python-blue-600"
              description="Perfect for students and educators. Share code examples instantly without environment setup."
            />
          </BentoGrid>
        </Motion>
      </Container>
    </section>

    <!-- Testimonials Section -->
    <section class="py-24 bg-white relative">
      <Container>
        <Motion
          as="div"
          :initial="{ opacity: 0, y: 20 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.6 }"
          class="text-center mb-16"
        >
          <h2 class="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            What Developers Say
          </h2>
          <p class="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Trusted by developers and educators worldwide for Python library development and learning.
          </p>
        </Motion>

        <Motion
          as="div"
          :initial="{ opacity: 0, y: 30 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :transition="{ delay: 0.2, duration: 0.6 }"
        >
          <TestimonialSlider 
            :testimonials="testimonials"
            :auto-rotate="true"
            :duration="6"
          />
        </Motion>
      </Container>
    </section>

    <!-- CTA Section -->
    <section class="py-24 bg-gradient-to-br from-python-blue-600 via-python-blue-500 to-python-yellow-500 relative overflow-hidden">
      <Meteor :number="15" class-name="text-white" />
      
      <Container>
        <Motion
          as="div"
          :initial="{ opacity: 0, scale: 0.9 }"
          :while-in-view="{ opacity: 1, scale: 1 }"
          :transition="{ duration: 0.6 }"
          class="text-center relative z-10"
        >
          <h2 class="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Coding?
          </h2>
          <p class="text-base md:text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of programmers using Pybadu for Python library development.
            No setup required, start coding in seconds.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink
              to="/matplotlib"
              class="px-4 py-2.5 sm:px-8 sm:py-4 bg-white text-python-blue-600 text-sm sm:text-base font-semibold rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 inline-flex items-center gap-2 justify-center"
            >
              <Icon icon="ph:play-circle-fill" class="w-6 h-6" />
              Start Playground
            </NuxtLink>
            <a
              href="https://github.com/ichsanputr/pybadu"
              target="_blank"
              class="px-4 py-2.5 sm:px-8 sm:py-4 bg-white/10 backdrop-blur-sm text-white text-sm sm:text-base font-semibold rounded-xl hover:bg-white/20 transition-all duration-200 border-2 border-white/50 inline-flex items-center gap-2 justify-center"
            >
              <Icon icon="ph:github-logo" class="w-6 h-6" />
              View on GitHub
            </a>
          </div>
        </Motion>
      </Container>
    </section>

    <!-- Footer -->
    <AppFooter />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { Motion } from 'motion-v'
import { Icon } from '@iconify/vue'
import FlipCard from '~/components/FlipCard.vue'

// Use landing layout
definePageMeta({
  layout: false
})

// Ensure light theme on landing page - completely isolated from compiler pages
onMounted(() => {
  if (typeof document !== 'undefined') {
    // Force light theme for homepage
    document.documentElement.classList.remove('dark')
  }
})

// When leaving homepage, don't interfere with compiler page theme
onUnmounted(() => {
  // Compiler pages will set their own theme (dark by default)
})

// Total Pyodide packages count (approximate)
const totalPyodidePackages = 100

// Libraries data - Expanded from Pyodide packages
const libraries = [
  {
    name: 'Matplotlib',
    description: 'Create stunning data visualizations',
    icon: 'ph:chart-line',
    bgClass: 'bg-gradient-to-br from-orange-500 to-red-500',
    href: '/matplotlib'
  },
  {
    name: 'NumPy',
    description: 'Scientific computing arrays',
    icon: 'simple-icons:numpy',
    bgClass: 'bg-gradient-to-br from-purple-500 to-purple-700',
    href: '/numpy'
  },
  {
    name: 'Pandas',
    description: 'Data analysis & manipulation',
    icon: 'simple-icons:pandas',
    bgClass: 'bg-gradient-to-br from-green-500 to-emerald-600',
    href: '/pandas'
  },
  {
    name: 'Scikit-learn',
    description: 'Machine learning tools',
    icon: 'simple-icons:scikitlearn',
    bgClass: 'bg-gradient-to-br from-orange-500 to-red-600',
    href: '/scikit-learn'
  },
  {
    name: 'SciPy',
    description: 'Scientific algorithms & optimization',
    icon: 'simple-icons:scipy',
    bgClass: 'bg-gradient-to-br from-blue-600 to-cyan-600',
    href: '#'
  },
  {
    name: 'SymPy',
    description: 'Symbolic mathematics',
    icon: 'ph:math-operations',
    bgClass: 'bg-gradient-to-br from-teal-500 to-green-600',
    href: '#'
  },
  {
    name: 'NetworkX',
    description: 'Network analysis & graph theory',
    icon: 'ph:graph',
    bgClass: 'bg-gradient-to-br from-indigo-500 to-blue-600',
    href: '#'
  },
  {
    name: 'Bokeh',
    description: 'Interactive visualizations',
    icon: 'ph:chart-line-up',
    bgClass: 'bg-gradient-to-br from-pink-500 to-rose-600',
    href: '#'
  }
]

// Testimonials - Using real GitHub user profile images
const testimonials = [
  {
    img: 'https://avatars.githubusercontent.com/u/152264274?v=4',
    quote: 'As a data analyst, I use Pybadu for quick prototyping and sharing visualizations with my team. The Matplotlib compiler is incredibly smooth and the multi-file support is perfect for complex projects.',
    name: 'Hamardikan',
    role: 'Full Stack Developer'
  },
  {
    img: 'https://avatars.githubusercontent.com/u/78834298?v=4',
    quote: 'Pybadu has transformed how I teach Python data science. Students can experiment with NumPy and Pandas instantly without installation hassles. It\'s a game-changer for online education.',
    name: 'Angger Raka Sanjaya',
    role: 'Python Developer'
  },
  {
    img: 'https://avatars.githubusercontent.com/u/69036480?v=4',
    quote: 'The dedicated environment for each library is brilliant. I can test Scikit-learn models without setting up virtual environments. Perfect for research and experimentation.',
    name: 'Muhammad Ichsanul Fadhil',
    role: 'Full Stack Developer'
  },
  {
    img: 'https://avatars.githubusercontent.com/u/47033578?v=4',
    quote: 'Pybadu made learning Python libraries so much easier. The examples are helpful and being able to code directly in the browser without any setup is amazing!',
    name: 'Dmitry Vyukov',
    role: 'Software Engineer'
  }
]

// SEO Meta
useHead({
  title: 'Pybadu – Dedicated Python Library Playground',
  meta: [
    {
      name: 'description',
      content: 'Pybadu is a specialized Python library playground powered by Pyodide WebAssembly. Experience dedicated compilers for NumPy, Pandas, Matplotlib, SciPy, Scikit-learn, and more directly in your browser. Part of the BudiBadu ecosystem.'
    },
    {
      name: 'keywords', 
      content: 'python, pyodide, numpy, pandas, matplotlib, scipy, scikit-learn, online python, browser python, budibadu, pybadu'
    },
    {
      property: 'og:title',
      content: 'Pybadu – Dedicated Python Library Playground'
    },
    {
      property: 'og:type',
      content: 'website'
    },
    {
      property: 'og:description',
      content: 'Specialized Python library playground with dedicated compilers for each library. Run NumPy, Pandas, Matplotlib and more in your browser.'
    },
    {
      property: 'og:url',
      content: 'https://pybadu.com'
    }
  ]
})
</script>