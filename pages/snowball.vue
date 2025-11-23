<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <div class="border-b border-gray-200">
      <div class="max-w-4xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <NuxtLink to="/fiddle" class="text-gray-500 hover:text-gray-700">← Back to Fiddle</NuxtLink>
            <div>
              <h1 class="text-xl md:text-2xl font-bold text-gray-900">
                🌱 Snowball Stemmer Demo
              </h1>
              <p class="text-gray-600">Text stemming with Pyodide package loading</p>
            </div>
          </div>
          <button
            @click="runDemo"
            :disabled="isLoading || !pyodideReady"
            class="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-4 py-2 rounded font-medium transition-colors"
          >
            {{ isLoading ? 'Running...' : 'Run Demo' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-4xl mx-auto px-4 py-6">
      <!-- Info Section -->
      <div class="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 class="text-lg font-semibold text-blue-900 mb-2">About Snowball Stemmer</h3>
        <p class="text-blue-800 text-sm">
          The Snowball stemming algorithm reduces words to their root forms. For example, 
          "running", "runs", and "ran" might all be reduced to "run". This is useful for text processing,
          search engines, and natural language processing tasks.
        </p>
      </div>

      <!-- Input Section -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Enter words to stem (space-separated):
        </label>
        <div class="flex space-x-2">
          <input
            v-model="inputText"
            type="text"
            class="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="running runs ran easily fairly programming"
            @keyup.enter="runDemo"
          >
          <button
            @click="runDemo"
            :disabled="isLoading || !pyodideReady"
            class="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-4 py-2 rounded transition-colors"
          >
            Stem Words
          </button>
        </div>
      </div>

      <!-- Language Selection -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Stemming Language:
        </label>
        <select
          v-model="selectedLanguage"
          class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="english">English</option>
          <option value="spanish">Spanish</option>
          <option value="french">French</option>
          <option value="german">German</option>
          <option value="italian">Italian</option>
          <option value="portuguese">Portuguese</option>
          <option value="russian">Russian</option>
        </select>
      </div>

      <!-- Output Section -->
      <div class="bg-gray-50 rounded-lg p-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-3">Output:</h3>
        
        <!-- Loading State -->
        <div v-if="!pyodideReady" class="flex items-center text-blue-600">
          <svg class="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading Pyodide and Snowball Stemmer...</span>
        </div>

        <!-- Results -->
        <div v-if="pyodideReady && results.length > 0" class="space-y-2">
          <div v-for="(result, index) in results" :key="index" class="flex items-center space-x-4">
            <span class="text-gray-700 font-mono bg-white px-2 py-1 rounded border">{{ result.original }}</span>
            <span class="text-gray-400">→</span>
            <span class="text-green-700 font-mono bg-green-50 px-2 py-1 rounded border border-green-200">{{ result.stemmed }}</span>
          </div>
        </div>

        <!-- Status Messages -->
        <div v-if="pyodideReady && statusMessage" class="text-sm text-gray-600 mt-2">
          {{ statusMessage }}
        </div>

        <!-- Ready State -->
        <div v-if="pyodideReady && results.length === 0 && !statusMessage" class="text-gray-500 text-sm">
          Enter some words above and click "Stem Words" to see the results.
        </div>
      </div>

      <!-- Examples Section -->
      <div class="mt-8">
        <h3 class="text-lg font-semibold text-gray-900 mb-3">Try These Examples:</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            v-for="example in examples"
            :key="example.title"
            @click="loadExample(example)"
            class="text-left p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div class="font-medium text-gray-900">{{ example.title }}</div>
            <div class="text-sm text-gray-600">{{ example.words }}</div>
          </button>
        </div>
      </div>

      <!-- Technical Details -->
      <div class="mt-8 bg-gray-50 rounded-lg p-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-3">Technical Implementation</h3>
        <div class="text-sm text-gray-700 space-y-2">
          <p><strong>Pyodide:</strong> Python running in WebAssembly in your browser</p>
          <p><strong>Package Loading:</strong> <code class="bg-white px-1 rounded">pyodide.loadPackage("micropip")</code></p>
          <p><strong>Installation:</strong> <code class="bg-white px-1 rounded">micropip.install("snowballstemmer")</code></p>
          <p><strong>Usage:</strong> <code class="bg-white px-1 rounded">snowballstemmer.stemmer('english')</code></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// SEO Meta
useHead({
  title: 'Snowball Stemmer - Pybadu',
  meta: [
    { name: 'description', content: 'Interactive Snowball stemming algorithm demonstration using Pyodide WebAssembly' }
  ]
})

// Reactive state
const inputText = ref('running runs ran easily fairly programming programs')
const selectedLanguage = ref('english')
const results = ref([])
const statusMessage = ref('')
const isLoading = ref(false)
const pyodideReady = ref(false)
const pyodide = ref(null)

// Example datasets
const examples = [
  {
    title: 'Common Verbs',
    words: 'running runs ran walk walked walking jump jumped jumping',
    language: 'english'
  },
  {
    title: 'Programming Terms',
    words: 'programming programs programmer development developing developer',
    language: 'english'
  },
  {
    title: 'Adjectives',
    words: 'beautiful beautifully easily easy wonderful wonderfully',
    language: 'english'
  },
  {
    title: 'Spanish Words',
    words: 'corriendo correr programación programar desarrollo desarrollar',
    language: 'spanish'
  }
]

// Initialize Pyodide and Snowball Stemmer
onMounted(async () => {
  if (process.client) {
    try {
      statusMessage.value = 'Loading Pyodide...'
      
      // Wait for Pyodide to be available
      await waitForPyodide()
      
      // Load Pyodide
      pyodide.value = await loadPyodide()
      statusMessage.value = 'Loading micropip...'
      
      // Load micropip package
      await pyodide.value.loadPackage("micropip")
      
      // Get micropip reference (JavaScript way as in documentation)
      const micropip = pyodide.value.pyimport("micropip")
      statusMessage.value = 'Installing snowballstemmer...'
      
      // Install snowballstemmer package
      await micropip.install("snowballstemmer")
      
      // Import and setup stemmer in Python
      pyodide.value.runPython(`
import snowballstemmer

def stem_words(words_text, language='english'):
    stemmer = snowballstemmer.stemmer(language)
    words = words_text.strip().split()
    stemmed = stemmer.stemWords(words)
    return list(zip(words, stemmed))
      `)
      
      pyodideReady.value = true
      statusMessage.value = 'Ready! Enter words to stem.'
      
      // Run initial demo
      await runDemo()
      
    } catch (error) {
      console.error('Failed to load Pyodide or snowballstemmer:', error)
      statusMessage.value = `Error: ${error.message}`
    }
  }
})

// Wait for Pyodide to be available globally
function waitForPyodide() {
  return new Promise((resolve) => {
    if (window.loadPyodide) {
      resolve()
    } else {
      const checkPyodide = () => {
        if (window.loadPyodide) {
          resolve()
        } else {
          setTimeout(checkPyodide, 100)
        }
      }
      checkPyodide()
    }
  })
}

// Run stemming demo
async function runDemo() {
  if (!pyodideReady.value || !inputText.value.trim()) return
  
  isLoading.value = true
  statusMessage.value = 'Processing words...'
  
  try {
    // Run Python function to stem words
    const result = pyodide.value.runPython(`
stem_words("${inputText.value}", "${selectedLanguage.value}")
    `)
    
    // Convert Python result to JavaScript array
    results.value = result.toJs().map(pair => ({
      original: pair[0],
      stemmed: pair[1]
    }))
    
    statusMessage.value = `Stemmed ${results.value.length} words using ${selectedLanguage.value} algorithm.`
    
  } catch (error) {
    console.error('Error stemming words:', error)
    statusMessage.value = `Error: ${error.message}`
  } finally {
    isLoading.value = false
  }
}

// Load example data
function loadExample(example) {
  inputText.value = example.words
  selectedLanguage.value = example.language || 'english'
  runDemo()
}
</script>