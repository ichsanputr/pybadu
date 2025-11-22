<template>
  <div :class="[
    'h-screen flex flex-col',
    theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
  ]">
    <!-- Top Bar -->
    <header :class="[
      'flex items-center justify-between px-4 py-2 border-b z-10',
      theme === 'dark' 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    ]">
      <!-- Left: Logo & Title -->
      <div class="flex items-center space-x-3">
        <NuxtLink to="/" class="flex items-center">
          <img src="/logo.png" alt="Pybadu Logo" class="w-8 h-8 rounded-md" />
        </NuxtLink>
        <div class="hidden sm:flex items-center space-x-2">
          <Icon icon="simple-icons:matplotlib" :class="[
            'w-5 h-5',
            theme === 'dark' ? 'text-yellow-400' : 'text-blue-600'
          ]" />
          <span :class="[
            'font-semibold',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          ]">Matplotlib Playground</span>
        </div>
      </div>

      <!-- Center: File Tabs (on larger screens) -->
      <div class="hidden lg:flex items-center space-x-1 flex-1 max-w-md mx-4 overflow-x-auto">
        <button
          v-for="file in files"
          :key="file.id"
          @click="$emit('selectFile', file.id)"
          :class="[
            'flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors group',
            activeFileId === file.id
              ? theme === 'dark'
                ? 'bg-gray-700 text-yellow-400'
                : 'bg-gray-100 text-blue-600'
              : theme === 'dark'
                ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          ]"
        >
          <Icon icon="ph:file-py" class="w-4 h-4" />
          <span>{{ file.name }}</span>
          <button
            v-if="files.length > 1"
            @click.stop="$emit('deleteFile', file.id)"
            class="opacity-0 group-hover:opacity-100 hover:bg-red-500/20 rounded p-0.5"
          >
            <Icon icon="ph:x" class="w-3 h-3" />
          </button>
        </button>
        <button
          @click="$emit('newFile')"
          :class="[
            'p-1.5 rounded-md transition-colors',
            theme === 'dark'
              ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          ]"
        >
          <Icon icon="ph:plus" class="w-4 h-4" />
        </button>
      </div>

      <!-- Right: Actions -->
      <div class="flex items-center space-x-2">
        <!-- Mobile File Dropdown -->
        <div class="lg:hidden relative">
          <button
            @click="showFileDropdown = !showFileDropdown"
            :class="[
              'flex items-center space-x-1 px-2 py-1.5 rounded-md text-sm',
              theme === 'dark'
                ? 'bg-gray-700 text-gray-300'
                : 'bg-gray-100 text-gray-700'
            ]"
          >
            <Icon icon="ph:files" class="w-4 h-4" />
            <span>{{ files.find(f => f.id === activeFileId)?.name }}</span>
            <Icon icon="ph:caret-down" class="w-3 h-3" />
          </button>
          
          <div
            v-if="showFileDropdown"
            :class="[
              'absolute top-full right-0 mt-1 w-48 rounded-md shadow-lg z-20 border',
              theme === 'dark'
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-200'
            ]"
          >
            <div class="p-1">
              <button
                v-for="file in files"
                :key="file.id"
                @click="selectFile(file.id)"
                :class="[
                  'w-full flex items-center justify-between px-2 py-1.5 rounded text-sm text-left',
                  activeFileId === file.id
                    ? theme === 'dark'
                      ? 'bg-yellow-900/30 text-yellow-400'
                      : 'bg-blue-100 text-blue-600'
                    : theme === 'dark'
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-700 hover:bg-gray-100'
                ]"
              >
                <div class="flex items-center space-x-2">
                  <Icon icon="ph:file-py" class="w-4 h-4" />
                  <span>{{ file.name }}</span>
                </div>
                <button
                  v-if="files.length > 1"
                  @click.stop="$emit('deleteFile', file.id)"
                  class="opacity-60 hover:opacity-100 p-0.5"
                >
                  <Icon icon="ph:trash" class="w-3 h-3" />
                </button>
              </button>
              <hr :class="theme === 'dark' ? 'border-gray-700' : 'border-gray-200'" class="my-1" />
              <button
                @click="$emit('newFile'); showFileDropdown = false"
                :class="[
                  'w-full flex items-center space-x-2 px-2 py-1.5 rounded text-sm',
                  theme === 'dark'
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-700 hover:bg-gray-100'
                ]"
              >
                <Icon icon="ph:plus" class="w-4 h-4" />
                <span>New File</span>
              </button>
            </div>
          </div>
        </div>

        <button
          @click="$emit('runCode')"
          :disabled="isLoading || !pyodideReady"
          :class="[
            'flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
            isLoading || !pyodideReady
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white'
          ]"
        >
          <Icon 
            :icon="isLoading ? 'ph:spinner' : 'ph:play'" 
            :class="['w-4 h-4', isLoading ? 'animate-spin' : '']" 
          />
          <span class="hidden sm:inline">Run</span>
        </button>

        <button
          @click="$emit('toggleTheme')"
          :class="[
            'p-1.5 rounded-md transition-colors',
            theme === 'dark'
              ? 'text-yellow-400 hover:bg-gray-700'
              : 'text-gray-600 hover:bg-gray-100'
          ]"
        >
          <Icon :icon="theme === 'dark' ? 'ph:sun' : 'ph:moon'" class="w-4 h-4" />
        </button>
      </div>
    </header>

    <!-- Main Layout -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Sidebar (Desktop) -->
      <aside 
        v-if="showSidebar"
        :class="[
          'hidden md:flex flex-col border-r transition-all duration-200',
          sidebarCollapsed ? 'w-12' : 'w-64',
          theme === 'dark' 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        ]"
      >
        <!-- Sidebar Header -->
        <div class="flex items-center justify-between p-3 border-b" :class="theme === 'dark' ? 'border-gray-700' : 'border-gray-200'">
          <h3 v-if="!sidebarCollapsed" :class="['font-medium text-sm', theme === 'dark' ? 'text-white' : 'text-gray-900']">
            Explorer
          </h3>
          <button
            @click="sidebarCollapsed = !sidebarCollapsed"
            :class="[
              'p-1 rounded transition-colors',
              theme === 'dark' ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
            ]"
          >
            <Icon :icon="sidebarCollapsed ? 'ph:sidebar-simple' : 'ph:sidebar-simple'" class="w-4 h-4" />
          </button>
        </div>

        <!-- File Explorer -->
        <div class="flex-1 overflow-y-auto">
          <div v-if="!sidebarCollapsed" class="p-2">
            <!-- Files Section -->
            <div class="mb-4">
              <div class="flex items-center justify-between mb-2 px-1">
                <span :class="['text-xs font-medium uppercase tracking-wide', theme === 'dark' ? 'text-gray-400' : 'text-gray-600']">
                  Files
                </span>
                <button
                  @click="$emit('newFile')"
                  :class="[
                    'p-0.5 rounded transition-colors',
                    theme === 'dark' ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                  ]"
                >
                  <Icon icon="ph:plus" class="w-3 h-3" />
                </button>
              </div>
              <div class="space-y-1">
                <button
                  v-for="file in files"
                  :key="file.id"
                  @click="$emit('selectFile', file.id)"
                  :class="[
                    'w-full flex items-center justify-between p-2 rounded-md text-sm transition-colors group',
                    activeFileId === file.id
                      ? theme === 'dark'
                        ? 'bg-yellow-900/30 text-yellow-400'
                        : 'bg-blue-100 text-blue-600'
                      : theme === 'dark'
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-700 hover:bg-gray-100'
                  ]"
                >
                  <div class="flex items-center space-x-2 min-w-0">
                    <Icon icon="ph:file-py" class="w-4 h-4 flex-shrink-0" />
                    <span class="truncate">{{ file.name }}</span>
                  </div>
                  <button
                    v-if="files.length > 1"
                    @click.stop="$emit('deleteFile', file.id)"
                    class="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-red-500/20 transition-all"
                  >
                    <Icon icon="ph:trash" class="w-3 h-3" />
                  </button>
                </button>
              </div>
            </div>

            <!-- Examples Section -->
            <div>
              <div class="flex items-center justify-between mb-2 px-1">
                <span :class="['text-xs font-medium uppercase tracking-wide', theme === 'dark' ? 'text-gray-400' : 'text-gray-600']">
                  Examples
                </span>
              </div>
              <div class="space-y-1">
                <button
                  v-for="(example, index) in examples.slice(0, 3)"
                  :key="index"
                  @click="$emit('loadExample', example)"
                  :class="[
                    'w-full text-left p-2 rounded-md text-sm transition-colors',
                    theme === 'dark'
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  ]"
                >
                  <div class="flex items-center space-x-2">
                    <Icon icon="ph:code-simple" class="w-4 h-4 flex-shrink-0" />
                    <span class="truncate">{{ example.title }}</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <!-- Collapsed Sidebar Icons -->
          <div v-else class="p-2 space-y-2">
            <button
              v-for="file in files"
              :key="file.id"
              @click="$emit('selectFile', file.id)"
              :class="[
                'w-full p-2 rounded-md transition-colors',
                activeFileId === file.id
                  ? theme === 'dark'
                    ? 'bg-yellow-900/30 text-yellow-400'
                    : 'bg-blue-100 text-blue-600'
                  : theme === 'dark'
                    ? 'text-gray-400 hover:bg-gray-700'
                    : 'text-gray-600 hover:bg-gray-100'
              ]"
              :title="file.name"
            >
              <Icon icon="ph:file-py" class="w-4 h-4 mx-auto" />
            </button>
          </div>
        </div>
      </aside>

      <!-- Editor & Output -->
      <main class="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <!-- Code Editor -->
        <section :class="[
          'flex-1 flex flex-col border-r',
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        ]">
          <!-- Editor Header -->
          <div :class="[
            'flex items-center justify-between px-4 py-2 border-b text-sm',
            theme === 'dark' 
              ? 'bg-gray-800/50 border-gray-700 text-gray-400' 
              : 'bg-gray-50 border-gray-200 text-gray-600'
          ]">
            <div class="flex items-center space-x-2">
              <Icon icon="ph:code" class="w-4 h-4" />
              <span>{{ files.find(f => f.id === activeFileId)?.name || 'Editor' }}</span>
              <div v-if="pyodideReady" class="flex items-center space-x-1">
                <div :class="[
                  'w-2 h-2 rounded-full',
                  'bg-green-500'
                ]"></div>
                <span class="text-xs">Python Ready</span>
              </div>
            </div>
            
            <div class="flex items-center space-x-2">
              <button
                @click="$emit('clearCode')"
                :class="[
                  'text-xs px-2 py-1 rounded transition-colors',
                  theme === 'dark'
                    ? 'hover:bg-gray-700 text-gray-400'
                    : 'hover:bg-gray-200 text-gray-600'
                ]"
              >
                Clear
              </button>
              
              <!-- Mobile Sidebar Toggle -->
              <button
                @click="showSidebar = !showSidebar"
                class="md:hidden p-1 rounded"
                :class="theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'"
              >
                <Icon icon="ph:sidebar-simple" class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Monaco Editor -->
          <div class="flex-1 overflow-hidden">
            <MonacoEditor
              :model-value="code"
              @update:model-value="$emit('update:code', $event)"
              :language="'python'"
              :theme="monacoTheme"
              :options="{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                lineNumbers: 'on',
                folding: true,
                automaticLayout: true,
                tabSize: 4,
                insertSpaces: true
              }"
              class="h-full"
            />
          </div>
        </section>

        <!-- Output Panel -->
        <section :class="[
          'flex flex-col border-t lg:border-t-0 lg:border-l',
          'w-full lg:w-96 xl:w-1/3',
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        ]">
          <!-- Output Header -->
          <div :class="[
            'flex items-center justify-between px-4 py-2 border-b text-sm',
            theme === 'dark' 
              ? 'bg-gray-800/50 border-gray-700 text-gray-400' 
              : 'bg-gray-50 border-gray-200 text-gray-600'
          ]">
            <div class="flex items-center space-x-2">
              <Icon icon="ph:terminal" class="w-4 h-4" />
              <span>Output</span>
              <div v-if="output.length > 0" :class="[
                'px-1.5 py-0.5 rounded text-xs',
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
              ]">
                {{ output.length }}
              </div>
            </div>
            
            <button
              @click="$emit('clearOutput')"
              :class="[
                'text-xs px-2 py-1 rounded transition-colors',
                theme === 'dark'
                  ? 'hover:bg-gray-700 text-gray-400'
                  : 'hover:bg-gray-200 text-gray-600'
              ]"
            >
              Clear
            </button>
          </div>

          <!-- Output Content -->
          <div class="flex-1 overflow-y-auto p-4 space-y-3">
            <div
              v-for="(item, index) in output"
              :key="index"
              :class="[
                'p-3 rounded-lg text-sm',
                item.type === 'error'
                  ? theme === 'dark' ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-700'
                  : item.type === 'success'
                    ? theme === 'dark' ? 'bg-green-900/30 text-green-300' : 'bg-green-50 text-green-700'
                    : theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
              ]"
            >
              <div class="flex items-start justify-between">
                <pre class="whitespace-pre-wrap font-mono text-xs leading-relaxed flex-1">{{ item.content }}</pre>
                <span class="text-xs opacity-60 ml-2 flex-shrink-0">{{ item.timestamp }}</span>
              </div>
            </div>

            <div v-if="output.length === 0" :class="[
              'text-center py-8 text-sm',
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            ]">
              <Icon icon="ph:terminal" class="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Run your Python code to see output here</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import MonacoEditor from '~/components/MonacoEditor.vue'

defineOptions({
  name: 'MatplotlibEditor'
})

const props = defineProps({
  theme: String,
  files: Array,
  activeFileId: Number,
  code: String,
  output: Array,
  isLoading: Boolean,
  pyodideReady: Boolean,
  monacoTheme: String,
  examples: Array
})

const emit = defineEmits([
  'update:code',
  'toggleTheme',
  'runCode',
  'clearCode',
  'clearOutput',
  'loadExample',
  'newFile',
  'selectFile',
  'deleteFile'
])

// UI State
const showFileDropdown = ref(false)
const showSidebar = ref(true)
const sidebarCollapsed = ref(false)

function selectFile(fileId) {
  emit('selectFile', fileId)
  showFileDropdown.value = false
}
</script>

<style scoped>
/* Custom scrollbar for dark theme */
:deep(.overflow-y-auto::-webkit-scrollbar) {
  width: 6px;
}

:deep(.overflow-y-auto::-webkit-scrollbar-track) {
  @apply bg-transparent;
}

:deep(.overflow-y-auto::-webkit-scrollbar-thumb) {
  @apply bg-gray-400 dark:bg-gray-600 rounded-full;
}

:deep(.overflow-y-auto::-webkit-scrollbar-thumb:hover) {
  @apply bg-gray-500 dark:bg-gray-500;
}
</style>