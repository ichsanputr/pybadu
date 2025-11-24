<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Web Worker Demo
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Learn how web workers run code in a separate thread without blocking the UI
        </p>
      </div>

      <!-- Worker Status -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            Worker Status
          </h2>
          <div :class="[
            'px-3 py-1 rounded-full text-sm font-medium',
            workerReady 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
          ]">
            {{ workerReady ? 'Ready' : 'Initializing...' }}
          </div>
        </div>
        <div class="space-y-2">
          <div class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Icon 
              :icon="workerReady ? 'ph:check-circle' : 'ph:spinner'" 
              :class="['w-5 h-5', !workerReady && 'animate-spin']"
            />
            <span>{{ statusMessage }}</span>
          </div>
        </div>
      </div>

      <!-- Demo Sections -->
      <div class="grid md:grid-cols-2 gap-6 mb-6">
        <!-- Calculate Sum -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            1. Calculate Sum
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Sum an array of numbers (simulates heavy computation)
          </p>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Numbers (comma-separated)
              </label>
              <input
                v-model="sumInput"
                type="text"
                placeholder="1,2,3,4,5"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <button
              @click="calculateSum"
              :disabled="!workerReady || isProcessing"
              :class="[
                'w-full px-4 py-2 rounded-lg font-medium transition-all',
                !workerReady || isProcessing
                  ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
              ]"
            >
              <span v-if="isProcessing" class="flex items-center justify-center space-x-2">
                <Icon icon="ph:spinner" class="w-5 h-5 animate-spin" />
                <span>Processing...</span>
              </span>
              <span v-else>Calculate Sum</span>
            </button>
            
            <div v-if="sumResult !== null" class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p class="text-sm text-gray-600 dark:text-gray-400">Result:</p>
              <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ sumResult }}</p>
            </div>
          </div>
        </div>

        <!-- Fibonacci -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            2. Fibonacci Number
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Calculate Fibonacci number (can be slow for large numbers)
          </p>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Number (n)
              </label>
              <input
                v-model.number="fibInput"
                type="number"
                min="0"
                max="50"
                placeholder="10"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <button
              @click="calculateFibonacci"
              :disabled="!workerReady || isProcessing"
              :class="[
                'w-full px-4 py-2 rounded-lg font-medium transition-all',
                !workerReady || isProcessing
                  ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl'
              ]"
            >
              <span v-if="isProcessing" class="flex items-center justify-center space-x-2">
                <Icon icon="ph:spinner" class="w-5 h-5 animate-spin" />
                <span>Processing...</span>
              </span>
              <span v-else>Calculate Fibonacci</span>
            </button>
            
            <div v-if="fibResult !== null" class="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <p class="text-sm text-gray-600 dark:text-gray-400">Result:</p>
              <p class="text-2xl font-bold text-purple-600 dark:text-purple-400">
                Fibonacci({{ fibNumber }}) = {{ fibResult }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Process Array -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          3. Process Array
        </h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Process an array and return transformed data
        </p>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Array (comma-separated numbers)
            </label>
            <input
              v-model="arrayInput"
              type="text"
              placeholder="1,2,3,4,5"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <button
            @click="processArray"
            :disabled="!workerReady || isProcessing"
            :class="[
              'w-full px-4 py-2 rounded-lg font-medium transition-all',
              !workerReady || isProcessing
                ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl'
            ]"
          >
            <span v-if="isProcessing" class="flex items-center justify-center space-x-2">
              <Icon icon="ph:spinner" class="w-5 h-5 animate-spin" />
              <span>Processing...</span>
            </span>
            <span v-else>Process Array</span>
          </button>
          
          <div v-if="arrayResult.length > 0" class="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Processed Results:</p>
            <div class="space-y-2 max-h-60 overflow-y-auto">
              <div
                v-for="(item, index) in arrayResult"
                :key="index"
                class="p-2 bg-white dark:bg-gray-700 rounded text-sm"
              >
                <span class="font-medium">Index {{ item.index }}:</span>
                <span class="ml-2">Original: {{ item.original }}</span>
                <span class="ml-2">Squared: {{ item.squared }}</span>
                <span class="ml-2">Doubled: {{ item.doubled }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- UI Test (to show it doesn't freeze) -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          UI Test (Try clicking while processing!)
        </h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
          This counter should continue running even when the worker is processing.
          This proves the UI thread is not blocked!
        </p>
        
        <div class="flex items-center space-x-4">
          <button
            @click="counter++"
            class="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
          >
            Click Me! ({{ counter }})
          </button>
          <p class="text-gray-600 dark:text-gray-400">
            Counter: <span class="font-bold text-green-600 dark:text-green-400">{{ counter }}</span>
          </p>
        </div>
      </div>

      <!-- Logs -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Worker Messages Log
          </h3>
          <button
            @click="logs = []"
            class="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-gray-700 dark:text-gray-300 transition-colors"
          >
            Clear
          </button>
        </div>
        <div class="space-y-2 max-h-64 overflow-y-auto">
          <div
            v-for="(log, index) in logs"
            :key="index"
            :class="[
              'p-3 rounded text-sm font-mono',
              log.type === 'SENT' 
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300'
                : 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300'
            ]"
          >
            <span class="font-semibold">[{{ log.type }}]</span>
            <span class="ml-2">{{ log.message }}</span>
            <span v-if="log.data" class="ml-2 text-gray-600 dark:text-gray-400">
              ({{ JSON.stringify(log.data) }})
            </span>
          </div>
          <div v-if="logs.length === 0" class="text-center text-gray-500 dark:text-gray-400 py-8">
            No messages yet. Start a task to see communication between main thread and worker.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Icon } from '@iconify/vue'

definePageMeta({
  layout: 'default'
})

// Worker instance
let worker = null

// State
const workerReady = ref(false)
const statusMessage = ref('Initializing worker...')
const isProcessing = ref(false)
const counter = ref(0)

// Results
const sumResult = ref(null)
const sumInput = ref('1,2,3,4,5,6,7,8,9,10')

const fibResult = ref(null)
const fibNumber = ref(null)
const fibInput = ref(10)

const arrayResult = ref([])
const arrayInput = ref('1,2,3,4,5')

// Logs
const logs = ref([])

function addLog(type, message, data = null) {
  logs.value.unshift({
    type,
    message,
    data,
    timestamp: new Date().toLocaleTimeString()
  })
  // Keep only last 50 logs
  if (logs.value.length > 50) {
    logs.value = logs.value.slice(0, 50)
  }
}

// Initialize worker
onMounted(() => {
  try {
    // Create new web worker
    worker = new Worker('/workers/simple-worker.js')
    
    // Listen for messages from worker
    worker.addEventListener('message', (e) => {
      const { type, result, message, number } = e.data
      
      addLog('RECEIVED', message || type, e.data)
      
      switch (type) {
        case 'WORKER_READY':
          workerReady.value = true
          statusMessage.value = message || 'Worker is ready!'
          break
          
        case 'SUM_RESULT':
          sumResult.value = result
          isProcessing.value = false
          break
          
        case 'FIBONACCI_RESULT':
          fibResult.value = result
          fibNumber.value = number
          isProcessing.value = false
          break
          
        case 'ARRAY_PROCESSED':
          arrayResult.value = result
          isProcessing.value = false
          break
          
        case 'ERROR':
          console.error('Worker error:', message)
          isProcessing.value = false
          break
      }
    })
    
    // Handle worker errors
    worker.addEventListener('error', (error) => {
      console.error('Worker error:', error)
      statusMessage.value = 'Worker error occurred'
      workerReady.value = false
      isProcessing.value = false
      addLog('ERROR', error.message || 'Worker error')
    })
    
  } catch (error) {
    console.error('Failed to create worker:', error)
    statusMessage.value = 'Failed to initialize worker'
  }
})

// Cleanup worker on unmount
onBeforeUnmount(() => {
  if (worker) {
    worker.terminate()
    worker = null
  }
})

// Functions to send messages to worker
function calculateSum() {
  if (!workerReady.value || isProcessing.value) return
  
  const numbers = sumInput.value
    .split(',')
    .map(n => parseInt(n.trim()))
    .filter(n => !isNaN(n))
  
  if (numbers.length === 0) {
    alert('Please enter valid numbers')
    return
  }
  
  isProcessing.value = true
  sumResult.value = null
  
  addLog('SENT', 'Calculate sum', { numbers })
  
  worker.postMessage({
    type: 'CALCULATE_SUM',
    data: { numbers }
  })
}

function calculateFibonacci() {
  if (!workerReady.value || isProcessing.value) return
  
  const number = parseInt(fibInput.value)
  
  if (isNaN(number) || number < 0 || number > 50) {
    alert('Please enter a valid number between 0 and 50')
    return
  }
  
  isProcessing.value = true
  fibResult.value = null
  fibNumber.value = null
  
  addLog('SENT', 'Calculate Fibonacci', { number })
  
  worker.postMessage({
    type: 'FIBONACCI',
    data: { number }
  })
}

function processArray() {
  if (!workerReady.value || isProcessing.value) return
  
  const array = arrayInput.value
    .split(',')
    .map(n => parseInt(n.trim()))
    .filter(n => !isNaN(n))
  
  if (array.length === 0) {
    alert('Please enter valid numbers')
    return
  }
  
  isProcessing.value = true
  arrayResult.value = []
  
  addLog('SENT', 'Process array', { array })
  
  worker.postMessage({
    type: 'PROCESS_ARRAY',
    data: { array }
  })
}
</script>

