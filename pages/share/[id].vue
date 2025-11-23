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
        <h2 class="text-2xl font-bold mb-2">Share Not Found</h2>
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
    <div v-else class="flex flex-col h-screen">
      <!-- Header -->
      <header class="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
        <div class="flex items-center space-x-3">
          <NuxtLink to="/" class="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <img src="/logo-light.png" alt="Pybadu Logo" class="w-7 h-7 rounded-lg" />
            <span class="font-semibold">Pybadu</span>
          </NuxtLink>
          <div class="h-5 w-px bg-gray-600"></div>
          <div class="flex items-center space-x-2">
            <Icon icon="ph:share-network" class="w-5 h-5 text-python-blue-500" />
            <span class="text-sm text-gray-400">Shared {{ compilerType }} Code</span>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <span class="text-xs text-gray-500">{{ shareData?.views || 0 }} views</span>
        </div>
      </header>

      <!-- Editor and Output -->
      <div class="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <!-- Code Editor -->
        <div class="flex-1 flex flex-col border-r border-gray-700">
          <!-- File Tabs (if multiple files) -->
          <div v-if="files.length > 1" class="flex items-center space-x-1 px-4 py-2 bg-gray-800 border-b border-gray-700 overflow-x-auto">
            <button
              v-for="file in files"
              :key="file.id"
              @click="activeFileId = file.id"
              :class="[
                'flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors',
                activeFileId === file.id
                  ? 'bg-gray-700 text-python-yellow-400'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
              ]"
            >
              <Icon icon="ph:file-py" class="w-4 h-4" />
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

          <!-- Run Button -->
          <div class="px-4 py-3 bg-gray-800 border-t border-gray-700">
            <button
              @click="runCode"
              :disabled="!pyodideReady || isLoading"
              :class="[
                'w-full sm:w-auto px-6 py-2.5 rounded-lg text-sm font-medium transition-all inline-flex items-center justify-center space-x-2',
                !pyodideReady || isLoading
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-python-blue-600 hover:bg-python-blue-700 text-white shadow-lg hover:shadow-xl'
              ]"
            >
              <Icon 
                :icon="isLoading ? 'ph:spinner' : 'ph:play'" 
                :class="['w-5 h-5', isLoading ? 'animate-spin' : '']" 
              />
              <span>{{ isLoading ? 'Running...' : pyodideReady ? 'Run Code' : 'Loading Pyodide...' }}</span>
            </button>
          </div>
        </div>

        <!-- Output Panel -->
        <div class="flex-1 flex flex-col bg-gray-900">
          <div class="px-4 py-3 bg-gray-800 border-b border-gray-700">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-semibold text-gray-300">Output</h3>
              <button
                v-if="output.length > 0"
                @click="output = []"
                class="text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
          <div class="flex-1 overflow-y-auto p-4">
            <div v-if="output.length === 0" class="text-gray-500 text-sm">
              Run your code to see the output here
            </div>
            <div v-else class="space-y-2">
              <div
                v-for="(item, index) in output"
                :key="index"
                :class="[
                  'p-3 rounded-lg text-sm font-mono whitespace-pre-wrap break-all',
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
import { ref, computed, onMounted } from 'vue'
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

    const shareId = route.params.id
    const apiBaseUrl = config.public.apiBaseUrl || 'http://localhost:8080'

    const response = await fetch(`${apiBaseUrl}/pybadu/share/${shareId}`)

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('This share link does not exist or has been removed.')
      } else if (response.status === 410) {
        throw new Error('This share link has expired.')
      } else {
        throw new Error('Failed to load shared code.')
      }
    }

    const data = await response.json()
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
    error.value = err.message
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

