<template>
  <div class="matplotlib-mobile-container">
    <!-- Mobile Header -->
    <header :class="[
      'flex items-center justify-between px-4 py-3 border-b',
      theme === 'dark'
        ? 'bg-gray-800 border-gray-700'
        : 'bg-white border-gray-200'
    ]">
      <div class="flex items-center space-x-3">
        <NuxtLink to="/" class="flex items-center">
          <img src="/logo-light.png" alt="Pybadu Logo" class="w-8 h-8" />
        </NuxtLink>
        <div class="flex items-center space-x-2">
          <Icon icon="simple-icons:matplotlib" :class="[
            'w-5 h-5',
            theme === 'dark' ? 'text-yellow-400' : 'text-blue-600'
          ]" />
          <h1 :class="[
            'font-bold text-lg',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          ]">
            Matplotlib
          </h1>
        </div>
      </div>
      
      <div class="flex items-center space-x-2">
        <button @click="$emit('toggleTheme')" :class="[
          'w-8 h-8 rounded-lg flex items-center justify-center',
          theme === 'dark'
            ? 'bg-gray-700 text-yellow-300'
            : 'bg-gray-100 text-gray-600'
        ]">
          <Icon :icon="theme === 'dark' ? 'ph:sun' : 'ph:moon'" class="w-4 h-4" />
        </button>
        
        <button @click="showRunDialog = true" :disabled="isLoading || !pyodideReady" :class="[
          'px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-1',
          isLoading || !pyodideReady
            ? 'bg-gray-400 text-gray-200'
            : 'bg-green-600 text-white'
        ]">
          <Icon v-if="isLoading" icon="ph:spinner" class="w-4 h-4 animate-spin" />
          <Icon v-else icon="ph:play" class="w-4 h-4" />
          <span>Run</span>
        </button>
      </div>
    </header>

    <!-- Tab Navigation -->
    <div :class="[
      'flex border-b',
      theme === 'dark'
        ? 'bg-gray-800 border-gray-700'
        : 'bg-gray-100 border-gray-200'
    ]">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="[
          'flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center space-x-2',
          activeTab === tab.id
            ? theme === 'dark'
              ? 'text-yellow-300 border-b-2 border-yellow-400 bg-gray-900'
              : 'text-blue-600 border-b-2 border-blue-500 bg-white'
            : theme === 'dark'
              ? 'text-gray-400 hover:text-gray-300'
              : 'text-gray-600 hover:text-gray-700'
        ]"
      >
        <Icon :icon="tab.icon" class="w-4 h-4" />
        <span>{{ tab.label }}</span>
      </button>
    </div>

    <!-- Tab Content -->
    <div class="flex-1 overflow-hidden">
      <!-- Code Editor Tab -->
      <div v-show="activeTab === 'code'" class="h-full flex flex-col">
        <!-- Editor Status -->
        <div :class="[
          'px-4 py-2 text-xs flex justify-between items-center border-b',
          theme === 'dark'
            ? 'bg-gray-800 border-gray-700 text-gray-400'
            : 'bg-gray-50 border-gray-200 text-gray-600'
        ]">
          <span>Python Editor</span>
          <div :class="[
            'flex items-center space-x-1 px-2 py-1 rounded',
            pyodideReady 
              ? theme === 'dark' ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700'
              : theme === 'dark' ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-700'
          ]">
            <Icon :icon="pyodideReady ? 'ph:check-circle' : 'ph:spinner'" 
                  :class="pyodideReady ? '' : 'animate-spin'" class="w-3 h-3" />
            <span>{{ pyodideReady ? 'Ready' : 'Loading...' }}</span>
          </div>
        </div>
        
        <!-- Monaco Editor -->
        <div class="flex-1">
          <MonacoEditor
            :model-value="code"
            language="python"
            :theme="monacoTheme"
            height="100%"
            :font-size="12"
            @update:model-value="$emit('update:code', $event)"
          />
        </div>
        
        <!-- Mobile Action Buttons -->
        <div :class="[
          'px-4 py-3 border-t flex space-x-2',
          theme === 'dark'
            ? 'bg-gray-800 border-gray-700'
            : 'bg-gray-50 border-gray-200'
        ]">
          <button @click="$emit('runCode')" :disabled="isLoading || !pyodideReady" :class="[
            'flex-1 py-2 px-4 rounded-lg font-medium flex items-center justify-center space-x-2',
            isLoading || !pyodideReady
              ? 'bg-gray-400 text-gray-200'
              : 'bg-green-600 hover:bg-green-700 text-white'
          ]">
            <Icon v-if="isLoading" icon="ph:spinner" class="w-4 h-4 animate-spin" />
            <Icon v-else icon="ph:play" class="w-4 h-4" />
            <span>{{ isLoading ? 'Running...' : 'Run Code' }}</span>
          </button>
          
          <button @click="$emit('clearCode')" :class="[
            'px-4 py-2 rounded-lg border',
            theme === 'dark'
              ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          ]">
            Clear
          </button>
        </div>
      </div>

      <!-- Output Tab -->
      <div v-show="activeTab === 'output'" class="h-full flex flex-col">
        <!-- Output Header -->
        <div :class="[
          'px-4 py-2 text-sm font-medium border-b flex justify-between items-center',
          theme === 'dark'
            ? 'bg-gray-800 border-gray-700 text-gray-300'
            : 'bg-gray-50 border-gray-200 text-gray-700'
        ]">
          <div class="flex items-center space-x-2">
            <Icon icon="ph:terminal" class="w-4 h-4" />
            <span>Output & Plots</span>
          </div>
          <button @click="$emit('clearOutput')" :class="[
            'text-xs px-2 py-1 rounded',
            theme === 'dark'
              ? 'bg-gray-600 hover:bg-gray-500 text-gray-300'
              : 'bg-gray-400 hover:bg-gray-500 text-white'
          ]">
            Clear
          </button>
        </div>
        
        <!-- Output Content -->
        <div class="flex-1 overflow-y-auto p-4" :class="{
          'bg-gray-900': theme === 'dark',
          'bg-white': theme === 'light'
        }">
          <!-- Loading State -->
          <div v-if="!pyodideReady" class="text-center py-8">
            <Icon icon="ph:spinner" class="animate-spin w-8 h-8 mx-auto mb-4" :class="{
              'text-blue-400': theme === 'dark',
              'text-blue-500': theme === 'light'
            }" />
            <p :class="[
              'text-sm',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            ]">Loading matplotlib environment...</p>
          </div>

          <!-- Empty State -->
          <div v-else-if="output.length === 0" class="text-center py-8">
            <Icon icon="simple-icons:matplotlib" :class="[
              'w-12 h-12 mx-auto mb-4',
              theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
            ]" />
            <p :class="[
              'text-sm',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            ]">
              No output yet. Run your code to see results!
            </p>
          </div>
          
          <!-- Output Items -->
          <div v-for="(item, index) in output" :key="index" class="mb-3">
            <div :class="[
              'p-3 rounded border-l-4 text-sm',
              item.type === 'error'
                ? theme === 'dark'
                  ? 'border-red-400 bg-red-900/20 text-red-300'
                  : 'border-red-400 bg-red-50 text-red-700'
                : item.type === 'success'
                  ? theme === 'dark'
                    ? 'border-green-400 bg-green-900/20 text-green-300'
                    : 'border-green-400 bg-green-50 text-green-700'
                  : theme === 'dark'
                    ? 'border-gray-600 bg-gray-800 text-gray-300'
                    : 'border-gray-300 bg-gray-50 text-gray-800'
            ]">
              <div class="flex justify-between items-start mb-1">
                <span :class="[
                  'text-xs font-medium uppercase',
                  item.type === 'error'
                    ? theme === 'dark' ? 'text-red-400' : 'text-red-600'
                    : item.type === 'success'
                      ? theme === 'dark' ? 'text-green-400' : 'text-green-600'
                      : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                ]">
                  {{ item.type }}
                </span>
                <span :class="[
                  'text-xs',
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                ]">
                  {{ item.timestamp }}
                </span>
              </div>
              <pre class="font-mono text-xs whitespace-pre-wrap break-words">{{ item.content }}</pre>
            </div>
          </div>
        </div>
      </div>

      <!-- Examples Tab -->
      <div v-show="activeTab === 'examples'" class="h-full overflow-y-auto">
        <div class="p-4 space-y-3">
          <div
            v-for="(example, index) in examples"
            :key="index"
            @click="loadAndSwitchExample(example)"
            :class="[
              'p-4 rounded-lg border cursor-pointer transition-colors',
              theme === 'dark'
                ? 'border-gray-600 bg-gray-800 hover:bg-gray-700'
                : 'border-gray-200 bg-white hover:bg-gray-50'
            ]"
          >
            <h3 :class="[
              'font-medium mb-2',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            ]">
              {{ example.title }}
            </h3>
            <p :class="[
              'text-sm',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            ]">
              {{ getExampleDescription(example.title) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Navigation -->
    <div :class="[
      'px-4 py-2 border-t flex items-center justify-between',
      theme === 'dark'
        ? 'bg-gray-800 border-gray-700'
        : 'bg-gray-50 border-gray-200'
    ]">
      <div class="flex items-center space-x-2">
        <div :class="[
          'flex items-center space-x-1 px-2 py-1 rounded text-xs',
          pyodideReady 
            ? theme === 'dark' ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700'
            : theme === 'dark' ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-700'
        ]">
          <Icon :icon="pyodideReady ? 'ph:check-circle' : 'ph:spinner'" 
                :class="pyodideReady ? '' : 'animate-spin'" class="w-3 h-3" />
          <span>{{ pyodideReady ? 'Ready' : 'Loading...' }}</span>
        </div>
      </div>

      <div class="flex items-center space-x-2">
        <NuxtLink to="/fiddle" :class="[
          'text-xs px-2 py-1 rounded',
          theme === 'dark'
            ? 'bg-gray-700 text-gray-300'
            : 'bg-gray-200 text-gray-600'
        ]">
          Fiddle
        </NuxtLink>
        <NuxtLink to="/snowball" :class="[
          'text-xs px-2 py-1 rounded',
          theme === 'dark'
            ? 'bg-gray-700 text-gray-300'
            : 'bg-gray-200 text-gray-600'
        ]">
          Stemmer
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import MonacoEditor from '~/components/MonacoEditor.vue'

const props = defineProps({
  theme: String,
  code: String,
  output: Array,
  isLoading: Boolean,
  pyodideReady: Boolean,
  elapsedTime: Object,
  monacoTheme: String,
  examples: Array
})

const emit = defineEmits([
  'update:code',
  'toggleTheme',
  'runCode',
  'clearCode',
  'clearOutput',
  'loadExample'
])

// Tab management
const activeTab = ref('code')
const showRunDialog = ref(false)

const tabs = [
  { id: 'code', label: 'Code', icon: 'ph:code' },
  { id: 'output', label: 'Output', icon: 'ph:terminal' },
  { id: 'examples', label: 'Examples', icon: 'ph:books' }
]

// Load example and switch to code tab
function loadAndSwitchExample(example) {
  emit('loadExample', example)
  activeTab.value = 'code'
}

// Get example descriptions
function getExampleDescription(title) {
  const descriptions = {
    'Basic Line Plot': 'Simple sine wave plot with customization',
    'Multiple Functions': 'Subplots with trigonometric functions',
    'Scatter Plot': 'Data visualization with color mapping and trends',
    'Bar Chart': 'Programming language popularity with styling',
    'Histogram': 'Statistical distribution with mean and standard deviation',
    '3D Surface Plot': '3D visualization of mathematical functions'
  }
  return descriptions[title] || 'Interactive matplotlib example'
}
</script>

<style scoped>
.matplotlib-mobile-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Scrollbar styling */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  @apply bg-gray-100 dark:bg-gray-800;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  @apply bg-gray-300 dark:bg-gray-600 rounded-full;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400 dark:bg-gray-500;
}
</style>