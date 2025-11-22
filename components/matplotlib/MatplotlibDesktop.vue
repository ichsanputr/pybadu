<template>
  <div class="matplotlib-page-container">
    <!-- Fixed Header -->
    <header class="matplotlib-header" :class="{
      'bg-gray-800 border-b border-gray-700': theme === 'dark',
      'bg-gradient-to-r from-gray-50 to-white border-b border-gray-200': theme === 'light'
    }">
      <div class="h-full flex items-center justify-between px-4 sm:px-6 gap-4">
        <!-- Left Section: Logo + Navigation -->
        <div class="flex items-center space-x-4 min-w-0 flex-1">
          <!-- App Logo -->
          <NuxtLink to="/" class="flex items-center justify-center w-12 h-12 transition-all duration-200 transform hover:scale-110 flex-none">
            <img src="/logo-light.png" alt="Pybadu Logo" class="w-10 h-10 object-contain" />
          </NuxtLink>

          <!-- Navigation Links -->
          <div class="flex items-center space-x-2">
            <NuxtLink to="/fiddle" :class="[
              'px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm border flex items-center',
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
            ]">
              <Icon icon="pajamas:list-indent" class="w-4 h-4 mr-1.5" />
              <span class="hidden sm:inline">Python Fiddle</span>
            </NuxtLink>
            
            <NuxtLink to="/snowball" :class="[
              'px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm border flex items-center',
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
            ]">
              <Icon icon="material-symbols:scatter-plot" class="w-4 h-4 mr-1.5" />
              <span class="hidden sm:inline">Stemmer</span>
            </NuxtLink>
          </div>

          <!-- Page Title -->
          <div class="hidden md:flex items-center space-x-2">
            <Icon icon="simple-icons:matplotlib" :class="[
              'w-6 h-6',
              theme === 'dark' ? 'text-yellow-400' : 'text-blue-600'
            ]" />
            <h1 :class="[
              'text-xl font-bold',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            ]">
              Matplotlib Playground
            </h1>
          </div>
        </div>

        <!-- Right Section: Controls -->
        <div class="flex items-center space-x-2 flex-shrink-0">
          <!-- Theme Toggle -->
          <button @click="$emit('toggleTheme')" :class="[
            'flex items-center justify-center w-10 h-10 rounded-lg border transition-all duration-200 shadow-sm',
            theme === 'dark'
              ? 'bg-gray-700 border-gray-600 hover:bg-gray-600 text-yellow-300'
              : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-600'
          ]">
            <Icon :icon="theme === 'dark' ? 'ph:sun' : 'ph:moon'" class="w-5 h-5" />
          </button>

          <!-- Run Button -->
          <button @click="$emit('runCode')" :disabled="isLoading || !pyodideReady" :class="[
            'px-4 py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center space-x-2',
            'focus:outline-none focus:ring-2 focus:ring-blue-500',
            isLoading || !pyodideReady
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white'
          ]">
            <Icon v-if="isLoading" icon="ph:spinner" class="w-4 h-4 animate-spin" />
            <Icon v-else icon="ph:play" class="w-4 h-4" />
            <span>{{ isLoading ? 'Running...' : 'Run' }}</span>
          </button>

          <!-- Clear Button -->
          <button @click="$emit('clearCode')" :class="[
            'px-4 py-2 rounded-lg font-medium transition-colors shadow-sm',
            theme === 'dark'
              ? 'bg-gray-700 border border-gray-600 text-gray-300 hover:bg-gray-600'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          ]">
            Clear
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="flex h-[calc(100vh-80px)]" :class="{
      'bg-gray-900': theme === 'dark',
      'bg-gray-50': theme === 'light'
    }">
      <!-- Code Editor Panel -->
      <div class="flex-1 border-r" :class="{
        'border-gray-700': theme === 'dark',
        'border-gray-200': theme === 'light'
      }">
        <!-- Editor Header -->
        <div :class="[
          'px-4 py-3 text-sm font-medium border-b flex justify-between items-center',
          theme === 'dark'
            ? 'bg-gray-800 border-gray-700 text-gray-300'
            : 'bg-gray-100 border-gray-200 text-gray-700'
        ]">
          <div class="flex items-center space-x-2">
            <Icon icon="ph:code" class="w-4 h-4" />
            <span>Python Editor - Matplotlib</span>
          </div>
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
        
        <!-- Monaco Editor -->
        <div class="h-[calc(100vh-140px)]">
          <MonacoEditor
            :model-value="code"
            language="python"
            :theme="monacoTheme"
            height="100%"
            :font-size="14"
            @update:model-value="$emit('update:code', $event)"
          />
        </div>
      </div>

      <!-- Output Panel -->
      <div class="w-1/2 flex flex-col">
        <!-- Output Header -->
        <div :class="[
          'px-4 py-3 text-sm font-medium border-b flex justify-between items-center',
          theme === 'dark'
            ? 'bg-gray-800 border-gray-700 text-gray-300'
            : 'bg-gray-100 border-gray-200 text-gray-700'
        ]">
          <div class="flex items-center space-x-2">
            <Icon icon="ph:terminal" class="w-4 h-4" />
            <span>Output & Plots</span>
          </div>
          <button @click="$emit('clearOutput')" :class="[
            'text-xs px-2 py-1 rounded transition-colors',
            theme === 'dark'
              ? 'bg-gray-600 hover:bg-gray-500 text-gray-300'
              : 'bg-gray-400 hover:bg-gray-500 text-white'
          ]">
            Clear
          </button>
        </div>
        
        <!-- Output Content -->
        <div class="flex-1 overflow-y-auto" :class="{
          'bg-gray-900': theme === 'dark',
          'bg-white': theme === 'light'
        }">
          <!-- Loading State -->
          <div v-if="!pyodideReady" class="p-6">
            <div :class="[
              'border rounded p-4',
              theme === 'dark' ? 'border-blue-600 bg-blue-900/20' : 'border-blue-200 bg-blue-50'
            ]">
              <div class="flex items-center">
                <Icon icon="ph:spinner" class="animate-spin h-5 w-5 mr-3" :class="{
                  'text-blue-400': theme === 'dark',
                  'text-blue-500': theme === 'light'
                }" />
                <div>
                  <h3 :class="[
                    'font-medium',
                    theme === 'dark' ? 'text-blue-400' : 'text-blue-800'
                  ]">Loading Matplotlib Environment...</h3>
                  <p :class="[
                    'text-sm',
                    theme === 'dark' ? 'text-blue-300' : 'text-blue-600'
                  ]">Initializing Pyodide and matplotlib packages</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Output Messages -->
          <div v-if="pyodideReady" class="p-4">
            <!-- Empty State -->
            <div v-if="output.length === 0" class="text-center py-8">
              <Icon icon="simple-icons:matplotlib" :class="[
                'w-12 h-12 mx-auto mb-4',
                theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
              ]" />
              <p :class="[
                'text-sm mb-2',
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              ]">
                Ready to create amazing plots!<br>
                Write matplotlib code and click "Run"
              </p>
            </div>
            
            <!-- Output Items -->
            <div v-for="(item, index) in output" :key="index" class="mb-3">
              <div :class="[
                'p-3 rounded-r border-l-4',
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
                    'text-xs font-medium',
                    item.type === 'error'
                      ? theme === 'dark' ? 'text-red-400' : 'text-red-600'
                      : item.type === 'success'
                        ? theme === 'dark' ? 'text-green-400' : 'text-green-600'
                        : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  ]">
                    {{ item.type === 'error' ? 'ERROR' : item.type === 'success' ? 'SUCCESS' : 'OUTPUT' }}
                  </span>
                  <span :class="[
                    'text-xs',
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                  ]">
                    {{ item.timestamp }}
                  </span>
                </div>
                <pre class="font-mono text-sm whitespace-pre-wrap break-words">{{ item.content }}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Examples Bar -->
    <div :class="[
      'border-t px-4 py-3',
      theme === 'dark'
        ? 'border-gray-700 bg-gray-800'
        : 'border-gray-200 bg-gray-50'
    ]">
      <div class="flex items-center space-x-3 overflow-x-auto">
        <span :class="[
          'text-sm font-medium whitespace-nowrap',
          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
        ]">Examples:</span>
        <button
          v-for="(example, index) in examples"
          :key="index"
          @click="$emit('loadExample', example)"
          :class="[
            'text-sm px-3 py-1 rounded whitespace-nowrap transition-colors',
            theme === 'dark'
              ? 'bg-blue-900 hover:bg-blue-800 text-blue-300'
              : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
          ]"
        >
          {{ example.title }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
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
</script>

<style scoped>
.matplotlib-page-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.matplotlib-header {
  height: 80px;
  flex-shrink: 0;
}

/* Scrollbar styling for dark theme */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
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