<template>
    <div class="min-h-screen bg-gray-900 text-white">
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center min-h-screen">
        <div class="text-center">
          <Icon icon="ph:spinner" class="w-12 h-12 animate-spin mx-auto mb-4 text-python-blue-500" />
          <p class="text-gray-400">{{ loadingMessage }}</p>
        </div>
      </div>
  
      <!-- Error State -->
      <div v-else-if="error" class="flex items-center justify-center min-h-screen">
        <div class="text-center max-w-md">
          <Icon icon="ph:warning-circle" class="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h2 class="text-xl md:text-2xl font-bold mb-2">Share Not Found</h2>
          <p class="text-gray-400 mb-6">{{ error }}</p>
          <NuxtLink to="/"
            class="px-6 py-3 bg-python-blue-600 hover:bg-python-blue-700 rounded-lg text-white font-medium transition-colors inline-flex items-center space-x-2">
            <Icon icon="ph:house" class="w-5 h-5" />
            <span>Go Home</span>
          </NuxtLink>
        </div>
      </div>
  
      <!-- Main Content -->
      <div v-else class="flex flex-col min-h-screen">
        <!-- Header -->
        <header class="px-4 py-3 bg-gray-800 border-b border-gray-700">
          <div class="flex items-center justify-between gap-3">
            <!-- Left Section: Logo and Info -->
            <div class="flex items-center space-x-3">
              <NuxtLink to="/" class="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <img src="/logo-light.png" alt="Budibadu Logo" class="w-7 h-7 rounded-lg" />
                <span class="font-semibold text-sm sm:text-base">Budibadu</span>
              </NuxtLink>
              <div class="h-5 w-px bg-gray-600 hidden sm:block"></div>
              <div class="hidden sm:flex items-center space-x-2">
                <Icon icon="ph:share-network" class="w-4 h-4 sm:w-5 sm:h-5 text-python-blue-500" />
                <span class="text-xs sm:text-sm text-gray-300 font-medium">
                  Shared <span class="text-python-blue-400">{{ compilerType }}</span> Code
                </span>
              </div>
              <!-- File Name (if single file or show current file) -->
              <div v-if="currentFile" class="hidden sm:flex items-center space-x-1.5 text-xs sm:text-sm text-gray-400">
                <span>·</span>
                <Icon icon="ph:file-py" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-python-yellow-400" />
                <span class="font-mono">{{ currentFile.name }}</span>
              </div>
            </div>
  
            <!-- Right Section: Views and Run Button -->
            <div class="flex items-center space-x-2 sm:space-x-3">
              <!-- Views Counter -->
              <div class="flex items-center space-x-1.5 px-2 sm:px-3 py-1.5 bg-gray-700/50 rounded-lg">
                <Icon icon="ph:eye" class="w-4 h-4 text-gray-400" />
                <span class="text-xs sm:text-sm text-gray-300 font-medium">{{ shareData?.views || 0 }}</span>
              </div>
  
              <!-- Run Button -->
              <button @click="runCode" :disabled="!pyodideReady || isLoading" :class="[
                'px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all inline-flex items-center gap-1.5 sm:gap-2',
                !pyodideReady || isLoading
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-python-blue-600 hover:bg-python-blue-700 text-white shadow-lg hover:shadow-xl'
              ]">
                <Icon :icon="!pyodideReady || isLoading ? 'ph:spinner' : 'ph:play'"
                  :class="['w-4 h-4', !pyodideReady || isLoading ? 'animate-spin' : '']" />
                <span class="hidden sm:inline">{{ !pyodideReady ? 'Loading...' : isLoading ? 'Running...' : 'Run Code'
                }}</span>
              </button>
            </div>
          </div>
        </header>
  
        <!-- Mobile Tabs -->
        <div class="lg:hidden flex border-b border-gray-700 bg-gray-800">
          <button @click="mobileTab = 'code'"
            :class="['flex-1 py-3 text-sm font-medium border-b-2 transition-colors', mobileTab === 'code' ? 'border-python-blue-500 text-python-blue-400' : 'border-transparent text-gray-400 hover:text-gray-300']">
            Code
          </button>
          <button @click="mobileTab = 'output'"
            :class="['flex-1 py-3 text-sm font-medium border-b-2 transition-colors', mobileTab === 'output' ? 'border-python-blue-500 text-python-blue-400' : 'border-transparent text-gray-400 hover:text-gray-300']">
            Output
            <span v-if="output.length > 0" class="ml-2 px-1.5 py-0.5 bg-gray-700 rounded-full text-xs text-gray-300">{{
              output.length }}</span>
          </button>
        </div>
  
        <!-- Editor and Output -->
        <div class="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
          <!-- Code Editor -->
          <div :class="[
            'flex-1 flex-col lg:border-r border-gray-700 h-full lg:h-auto',
            mobileTab === 'code' ? 'flex' : 'hidden lg:flex'
          ]">
            <!-- File Tabs (if multiple files) -->
            <div v-if="files.length > 1"
              class="flex items-center space-x-1 px-4 py-2 bg-gray-800 border-b border-gray-700 overflow-x-auto">
              <button v-for="file in files" :key="file.id" @click="activeFileId = file.id" :class="[
                'flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium whitespace-nowrap transition-colors',
                activeFileId === file.id
                  ? 'bg-gray-700 text-python-yellow-400'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
              ]">
                <Icon icon="ph:file-py" class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{{ file.name }}</span>
              </button>
            </div>
  
            <!-- Monaco Editor -->
            <div class="flex-1 relative h-[calc(100vh-200px)] lg:h-auto">
              <MonacoEditor v-if="currentFile" v-model="currentFile.content" language="python" theme="vs-dark"
                height="100%" :fontSize="14" />
            </div>
          </div>
  
          <!-- Output Panel -->
          <div :class="[
            'flex-1 flex-col bg-gray-900 border-t lg:border-t-0 lg:border-l border-gray-700 h-full lg:h-auto',
            mobileTab === 'output' ? 'flex' : 'hidden lg:flex'
          ]">
            <div class="px-4 py-3 bg-gray-800 border-b border-gray-700">
              <div class="flex items-center justify-between">
                <h3 class="text-xs sm:text-sm font-semibold text-gray-300">Output</h3>
                <button v-if="output.length > 0" @click="output = []"
                  class="text-xs text-gray-500 hover:text-gray-300 transition-colors flex items-center space-x-1">
                  <Icon icon="ph:trash" class="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              </div>
            </div>
            <div class="flex-1 overflow-y-auto p-4">
              <div v-if="output.length === 0" class="text-gray-500 text-xs sm:text-sm">
                Run your code to see the output here
              </div>
              <div v-else class="flex flex-col gap-2 w-full relative">
                <TransitionGroup name="output">
                  <div v-for="(item, index) in output" :key="index" :class="[
                    'w-full rounded-lg text-sm',
                    item.type === 'image' ? 'p-0' : 'p-3',
                    item.type === 'error'
                      ? 'bg-red-900/20 text-red-400 border border-red-800'
                      : item.type === 'image'
                        ? 'bg-gray-800 border border-gray-700 p-0'
                        : 'bg-gray-800 text-gray-300 border border-gray-700'
                  ]">
                    <template v-if="item.type === 'image'">
                      <img :src="`data:image/png;base64,${item.data}`" alt="Plot" class="max-w-full h-auto rounded" />
                    </template>
                    <template v-else>
                      <div
                        v-if="typeof item.data === 'string' && (item.data.trim().startsWith('<svg') || item.data.trim().startsWith('<?xml'))"
                        v-html="item.data" class="bg-white p-4 rounded-lg overflow-x-auto w-full"></div>
                      <pre v-else class="whitespace-pre-wrap font-mono text-xs leading-relaxed">{{ item.data }}</pre>
                    </template>
                  </div>
                </TransitionGroup>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Toast Notifications -->
      <UiToast :toasts="toasts" @remove="removeToast" />
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, onUnmounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { Icon } from '@iconify/vue'
  
  const route = useRoute()
  const config = useRuntimeConfig()
  
  // Page meta
  const shareId = computed(() => route.query.id || 'Unknown')
  
  useHead({
    title: computed(() => `Shared Code (${shareId.value}) - Pybadu`),
    meta: [
      { name: 'description', content: 'View shared Python code on Pybadu' },
      { property: 'og:title', content: computed(() => `Shared Code (${shareId.value}) - Pybadu`) },
      { property: 'og:description', content: 'View shared Python code on Pybadu' },
      { property: 'og:type', content: 'website' },
      { property: 'og:image', content: '/pybadu.png' }
    ],
    script: [
      {
        src: 'https://cdn.jsdelivr.net/pyodide/v0.29.0/full/pyodide.js',
        defer: true
      }
    ]
  })
  
  // State
  const loading = ref(true)
  const loadingMessage = ref('Loading shared code...')
  const error = ref(null)
  const shareData = ref(null)
  const files = ref([])
  const activeFileId = ref(null)
  const compilerType = ref('')
  
  // Pyodide state
  const pyodideReady = ref(false)
  const pyodide = ref(null)
  const isLoading = ref(false)
  const output = ref([])
  const mobileTab = ref('code') // 'code' | 'output'
  
  // Toast state
  const toasts = ref([])
  let toastId = 0
  
  // Computed
  const currentFile = computed(() => {
    return files.value.find(f => f.id === activeFileId.value)
  })
  
  // Toast functions
  function showToast(message, type = 'info', duration = 3000) {
    const id = toastId++
    toasts.value.push({ id, message, type, duration })
  }
  
  function removeToast(id) {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }
  
  // Fetch shared data
  async function fetchShareData() {
    try {
      loading.value = true
      error.value = null
  
      // Get share ID from query params
      const shareId = route.query.id
  
      console.log('Share ID from query:', shareId)
  
      if (!shareId) {
        throw new Error('No share ID provided. Please use a valid share link with ?id=xxxxx')
      }
  
      const apiBaseUrl = config.public.apiBaseUrl || 'http://localhost:8080'
      const apiUrl = `${apiBaseUrl}/pybadu/share/${shareId}`
  
      console.log('Fetching from API:', apiUrl)
  
      const response = await fetch(apiUrl)
  
      console.log('API Response status:', response.status)
  
      if (!response.ok) {
        const errorText = await response.text()
        console.error('API Error response:', errorText)
  
        if (response.status === 404) {
          throw new Error('This share link does not exist or has been removed.')
        } else if (response.status === 410) {
          throw new Error('This share link has expired.')
        } else if (response.status === 0 || !response.status) {
          throw new Error('Cannot connect to API server. Please check if the API is running.')
        } else {
          throw new Error(`Failed to load shared code (Status: ${response.status})`)
        }
      }
  
      const data = await response.json()
      console.log('Share data loaded:', data)
  
      shareData.value = data
      compilerType.value = data.compiler_type
      files.value = data.files.map(f => ({
        id: f.id || Math.random().toString(36).substr(2, 9),
        name: f.name,
        content: f.content
      }))
      activeFileId.value = files.value[0]?.id
  
    } catch (err) {
      console.error('Error fetching share data:', err)
      error.value = err.message || 'An unexpected error occurred'
      loading.value = false
    }
  }
  
  // Initialize Pyodide
  async function initializePyodide() {
    if (typeof window === 'undefined') return
  
    try {
      // Wait for Pyodide script to load
      let retries = 0
      while (!window.loadPyodide && retries < 20) {
        await new Promise(resolve => setTimeout(resolve, 500))
        retries++
      }
  
      if (!window.loadPyodide) {
        throw new Error('Pyodide loader not found')
      }
  
      loadingMessage.value = 'Initializing Python environment...'
      pyodide.value = await window.loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.29.0/full/'
      })
  
      // Load packages based on compiler type
      // Load packages based on compiler type
      loadingMessage.value = 'Loading packages...'
      const packagesToLoad = getPackagesForCompiler(compilerType.value)
  
      // Separate standard packages from those that need micropip
      const micropipPackages = packagesToLoad.filter(p => ['pygal'].includes(p))
      const standardPackages = packagesToLoad.filter(p => !['pygal'].includes(p))
  
      // Load standard packages
      if (standardPackages.length > 0) {
        await pyodide.value.loadPackage(standardPackages)
      }
  
      // Install micropip packages
      if (micropipPackages.length > 0) {
        await pyodide.value.loadPackage("micropip")
        const micropip = pyodide.value.pyimport("micropip")
        await micropip.install(micropipPackages)
      }
  
      pyodideReady.value = true
    } catch (err) {
      console.error('Failed to initialize Pyodide:', err)
      showToast('Failed to initialize Python environment', 'error')
    } finally {
      loading.value = false
    }
  }
  
  // Get packages for compiler type
  function getPackagesForCompiler(type) {
    const packageMap = {
      'matplotlib': ['matplotlib', 'numpy'],
      'numpy': ['numpy'],
      'pandas': ['pandas', 'numpy'],
      'scikit-learn': ['scikit-learn', 'numpy'],
      'scipy': ['scipy', 'numpy'],
      'seaborn': ['seaborn', 'matplotlib', 'numpy'],
      'xarray': ['xarray', 'numpy'],
      'networkx': ['networkx'],
      'sympy': ['sympy'],
      'beautifulsoup4': ['beautifulsoup4'],
      'pillow': ['pillow'],
      'nltk': ['nltk'],
      'regex': ['regex'],
      'pytz': ['pytz'],
      'pygal': ['pygal'],
      'plotly': ['plotly'],
      'bokeh': ['bokeh'],
      'mpmath': ['mpmath'],
      'lxml': ['lxml'],
      'jinja2': ['jinja2'],
      'pyyaml': ['pyyaml'],
      'markupsafe': ['markupsafe'],
      'dateutil': ['dateutil'],
      'snowball': ['snowballstemmer'],
      'tabulate': ['tabulate'],
      'validators': ['validators'],
      'pydantic': ['pydantic'],
      'orjson': ['orjson'],
      'simplejson': ['simplejson'],
      'pyjwt': ['pyjwt'],
      'python-barcode': ['python-barcode'],
      'qrcode': ['qrcode'],
      'shortuuid': ['shortuuid'],
      'faker': ['faker'],
      'phonenumbers': ['phonenumbers'],
      'dateparser': ['dateparser'],
      'pendulum': ['pendulum'],
      'num2words': ['num2words'],
      'html2text': ['html2text'],
      'bleach': ['bleach'],
      'jmespath': ['jmespath'],
      'sqlparse': ['sqlparse'],
      'sortedcontainers': ['sortedcontainers'],
      'bitstring': ['bitstring'],
      'blinker': ['blinker'],
      'textwrap3': ['textwrap3'],
      'pyjokes': ['pyjokes'],
      'msprime': ['msprime']
    }
    return packageMap[type] || []
  }
  
  // Run code
  async function runCode() {
    if (!pyodideReady.value || !currentFile.value?.content.trim()) return
  
    // Show spinner immediately
    isLoading.value = true
  
    // Track execution time
    const startTime = Date.now()
    const minDelay = 1000 // 1 second minimum
  
    // Switch to output tab on mobile
    if (window.innerWidth < 1024) {
      mobileTab.value = 'output'
    }
  
    try {
      output.value = []
  
      // Setup stdout capture using StringIO (same as worker)
      await pyodide.value.runPythonAsync(`
  import sys
  from io import StringIO
  ${compilerType.value === 'matplotlib' || compilerType.value === 'seaborn' ? `
  import matplotlib.pyplot as plt
  plt.close('all')
  ` : ''}
  sys.stdout = StringIO()
      `)
  
      // Run user code
      await pyodide.value.runPythonAsync(currentFile.value.content)
  
      // Capture stdout
      const stdout = await pyodide.value.runPythonAsync(`
  captured_output = sys.stdout.getvalue()
  sys.stdout = sys.__stdout__
  captured_output
      `)
  
      // Handle matplotlib plots (convert to base64 images)
      let images = []
      if (compilerType.value === 'matplotlib' || compilerType.value === 'seaborn') {
        try {
          const canvas = await pyodide.value.runPythonAsync(`
  import matplotlib.pyplot as plt
  import io
  import base64
  
  # Get all figures
  figs = [plt.figure(n) for n in plt.get_fignums()]
  images = []
  
  for fig in figs:
      buf = io.BytesIO()
      fig.savefig(buf, format='png', bbox_inches='tight', dpi=100)
      buf.seek(0)
      img_str = base64.b64encode(buf.read()).decode()
      images.append(img_str)
      buf.close()
  
  ','.join(images) if images else ''
          `)
  
          if (canvas && canvas.trim()) {
            images = canvas.split(',').filter(img => img)
          }
        } catch (plotError) {
          console.warn('No plots generated:', plotError)
        }
      }
  
      // Add images to output first
      if (images.length > 0) {
        images.forEach(imgData => {
          output.value.push({ type: 'image', data: imgData })
        })
      }
  
      // Add stdout output (print statements, pygal SVG, xarray data, etc.)
      if (stdout && stdout.trim()) {
        output.value.push({ type: 'print', data: stdout.trim() })
      }
  
      // If no output at all, show success message
      if (output.value.length === 0) {
        output.value.push({ type: 'print', data: 'Code executed successfully (no output)' })
      }
  
    } catch (err) {
      console.error('Execution error:', err)
      output.value.push({
        type: 'error',
        data: err.message || 'An error occurred during execution'
      })
    } finally {
      // Ensure minimum 1 second execution time
      const elapsed = Date.now() - startTime
      if (elapsed < minDelay) {
        await new Promise(resolve => setTimeout(resolve, minDelay - elapsed))
      }
      isLoading.value = false
    }
  }
  
  // Keyboard shortcuts
  function handleKeyDown(e) {
    // Shift + Enter to run
    if (e.shiftKey && e.key === 'Enter') {
      e.preventDefault()
      runCode()
    }
  }
  
  // Lifecycle
  onMounted(async () => {
    // Ensure dark mode
    if (process.client) {
      document.documentElement.classList.add('dark')
    }
  
    // Fetch share data first
    await fetchShareData()
  
    // If successful, initialize Pyodide
    if (!error.value) {
      await initializePyodide()
    }
  
    // Add keyboard listeners
    window.addEventListener('keydown', handleKeyDown)
  })
  
  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
  })
  </script>
  
  <style scoped>
  /* Ensure full height */
  html,
  body {
    height: 100%;
    overflow: hidden;
  }
  
  /* Output Transition */
  .output-enter-active,
  .output-leave-active {
    transition: all 0.3s ease;
  }
  
  .output-enter-from,
  .output-leave-to {
    opacity: 0;
    transform: translateY(10px);
  }
  </style>