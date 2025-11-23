<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <Icon icon="ph:spinner" class="w-12 h-12 animate-spin mx-auto mb-4 text-python-blue-500" />
        <p class="text-gray-400">Loading shared code...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center min-h-screen">
      <div class="text-center max-w-md">
        <Icon icon="ph:warning-circle" class="w-16 h-16 mx-auto mb-4 text-red-500" />
        <h2 class="text-xl md:text-2xl font-bold mb-2">Share Not Found</h2>
        <p class="text-gray-400 mb-6">{{ error }}</p>
        <NuxtLink 
          to="/"
          class="px-6 py-3 bg-python-blue-600 hover:bg-python-blue-700 rounded-lg text-white font-medium transition-colors inline-flex items-center space-x-2"
        >
          <Icon icon="ph:house" class="w-5 h-5" />
          <span>Go Home</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else class="flex flex-col min-h-screen">
      <!-- Header -->
      <header class="px-4 py-3 bg-gray-800 border-b border-gray-700">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <!-- Left Section: Logo and Info -->
          <div class="flex items-center space-x-3 flex-wrap">
            <NuxtLink to="/" class="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <img src="/logo-light.png" alt="Budibadu Logo" class="w-7 h-7 rounded-lg" />
              <span class="font-semibold text-sm sm:text-base">Budibadu</span>
            </NuxtLink>
            <div class="h-5 w-px bg-gray-600 hidden sm:block"></div>
            <div class="flex items-center space-x-2">
              <Icon icon="ph:share-network" class="w-4 h-4 sm:w-5 sm:h-5 text-python-blue-500" />
              <span class="text-xs sm:text-sm text-gray-300 font-medium">
                Shared <span class="text-python-blue-400">{{ compilerType }}</span> Code
              </span>
            </div>
            <!-- File Name (if single file or show current file) -->
            <div v-if="currentFile" class="flex items-center space-x-1.5 text-xs sm:text-sm text-gray-400">
              <span class="hidden sm:inline">·</span>
              <Icon icon="ph:file-py" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-python-yellow-400" />
              <span class="font-mono">{{ currentFile.name }}</span>
            </div>
          </div>

          <!-- Right Section: Views and Run Button -->
          <div class="flex items-center space-x-3">
            <!-- Views Counter -->
            <div class="flex items-center space-x-1.5 px-3 py-1.5 bg-gray-700/50 rounded-lg">
              <Icon icon="ph:eye" class="w-4 h-4 text-gray-400" />
              <span class="text-xs sm:text-sm text-gray-300 font-medium">{{ shareData?.views || 0 }}</span>
            </div>

            <!-- Run Button -->
            <button
              @click="runCode"
              :disabled="!pyodideReady || isLoading"
              :class="[
                'px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all inline-flex items-center space-x-1.5 sm:space-x-2',
                !pyodideReady || isLoading
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-python-blue-600 hover:bg-python-blue-700 text-white shadow-lg hover:shadow-xl'
              ]"
            >
              <Icon 
                :icon="!pyodideReady || isLoading ? 'ph:spinner' : 'ph:play'" 
                :class="['w-4 h-4', !pyodideReady || isLoading ? 'animate-spin' : '']" 
              />
              <span class="hidden sm:inline">{{ !pyodideReady ? 'Loading...' : isLoading ? 'Running...' : 'Run Code' }}</span>
            </button>
          </div>
        </div>
      </header>

      <!-- Editor and Output -->
      <div class="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <!-- Code Editor -->
        <div class="flex-1 flex flex-col lg:border-r border-gray-700 h-[50vh] lg:h-auto">
          <!-- File Tabs (if multiple files) -->
          <div v-if="files.length > 1" class="flex items-center space-x-1 px-4 py-2 bg-gray-800 border-b border-gray-700 overflow-x-auto">
            <button
              v-for="file in files"
              :key="file.id"
              @click="activeFileId = file.id"
              :class="[
                'flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium whitespace-nowrap transition-colors',
                activeFileId === file.id
                  ? 'bg-gray-700 text-python-yellow-400'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
              ]"
            >
              <Icon icon="ph:file-py" class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>{{ file.name }}</span>
            </button>
          </div>

          <!-- Monaco Editor -->
          <div class="flex-1 relative">
            <MonacoEditor
              v-if="currentFile"
              v-model="currentFile.content"
              language="python"
              theme="vs-dark"
              height="100%"
              :fontSize="14"
            />
          </div>
        </div>

        <!-- Output Panel -->
        <div class="flex-1 flex flex-col bg-gray-900 border-t lg:border-t-0 lg:border-l border-gray-700 h-[50vh] lg:h-auto">
          <div class="px-4 py-3 bg-gray-800 border-b border-gray-700">
            <div class="flex items-center justify-between">
              <h3 class="text-xs sm:text-sm font-semibold text-gray-300">Output</h3>
              <button
                v-if="output.length > 0"
                @click="output = []"
                class="text-xs text-gray-500 hover:text-gray-300 transition-colors flex items-center space-x-1"
              >
                <Icon icon="ph:trash" class="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </div>
          </div>
          <div class="flex-1 overflow-y-auto p-4">
            <div v-if="output.length === 0" class="text-gray-500 text-xs sm:text-sm">
              Run your code to see the output here
            </div>
            <div v-else class="space-y-2">
              <div
                v-for="(item, index) in output"
                :key="index"
                :class="[
                  'p-2 sm:p-3 rounded-lg text-xs sm:text-sm font-mono whitespace-pre-wrap break-all',
                  item.type === 'error'
                    ? 'bg-red-900/20 text-red-400 border border-red-800'
                    : item.type === 'image'
                    ? 'bg-gray-800 border border-gray-700 p-2'
                    : 'bg-gray-800 text-gray-300 border border-gray-700'
                ]"
              >
                <template v-if="item.type === 'image'">
                  <img :src="`data:image/png;base64,${item.data}`" alt="Plot" class="max-w-full h-auto rounded" />
                </template>
                <template v-else>
                  {{ item.data }}
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notifications -->
    <UiToast 
      :toasts="toasts"
      @remove="removeToast"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'

const route = useRoute()
const config = useRuntimeConfig()

// Page meta
useHead({
  title: 'Shared Code - Pybadu',
  meta: [
    { name: 'description', content: 'View shared Python code on Pybadu' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

// State
const loading = ref(true)
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
  } finally {
    loading.value = false
  }
}

// Initialize Pyodide
async function initializePyodide() {
  if (typeof window === 'undefined') return

  try {
    if (!window.loadPyodide) {
      throw new Error('Pyodide loader not found')
    }

    pyodide.value = await window.loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.29.0/full/'
    })

    // Load packages based on compiler type
    const packagesToLoad = getPackagesForCompiler(compilerType.value)
    if (packagesToLoad.length > 0) {
      await pyodide.value.loadPackage(packagesToLoad)
    }

    pyodideReady.value = true
  } catch (err) {
    console.error('Failed to initialize Pyodide:', err)
    showToast('Failed to initialize Python environment', 'error')
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
    'beautifulsoup4': ['beautifulsoup4'],
    'pillow': ['pillow'],
    'nltk': ['nltk'],
    'regex': ['regex'],
    'pytz': ['pytz']
  }
  return packageMap[type] || []
}

// Run code
async function runCode() {
  if (!pyodideReady.value || !currentFile.value?.content.trim()) return

  // Add minimum 300ms delay before showing spinner
  const minDelay = 300
  let showSpinnerTimeout

  showSpinnerTimeout = setTimeout(() => {
    isLoading.value = true
  }, minDelay)

  try {
    output.value = []

    // Capture stdout
    pyodide.value.setStdout({
      batched: (text) => {
        output.value.push({ type: 'stdout', data: text })
      }
    })

    // Capture stderr
    pyodide.value.setStderr({
      batched: (text) => {
        output.value.push({ type: 'error', data: text })
      }
    })

    // For matplotlib plots
    if (compilerType.value === 'matplotlib') {
      await pyodide.value.runPythonAsync(`
import matplotlib
import matplotlib.pyplot as plt
import io
import base64

matplotlib.use('agg')
plt.clf()
plt.close('all')
      `)
    }

    // Run user code
    await pyodide.value.runPythonAsync(currentFile.value.content)

    // Capture matplotlib plots
    if (compilerType.value === 'matplotlib') {
      const figData = await pyodide.value.runPythonAsync(`
import matplotlib.pyplot as plt
import io
import base64

figures = []
for i in plt.get_fignums():
    fig = plt.figure(i)
    buf = io.BytesIO()
    fig.savefig(buf, format='png', bbox_inches='tight')
    buf.seek(0)
    img_base64 = base64.b64encode(buf.read()).decode('utf-8')
    figures.append(img_base64)
    buf.close()
    plt.close(fig)

figures
      `)

      if (figData && figData.length > 0) {
        figData.toJs().forEach((imgData) => {
          output.value.push({ type: 'image', data: imgData })
        })
      }
    }

    if (output.value.length === 0) {
      output.value.push({ type: 'stdout', data: 'Code executed successfully (no output)' })
    }

  } catch (err) {
    console.error('Execution error:', err)
    output.value.push({ 
      type: 'error', 
      data: err.message || 'An error occurred during execution' 
    })
  } finally {
    clearTimeout(showSpinnerTimeout)
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
html, body {
  height: 100%;
  overflow: hidden;
}
</style>

