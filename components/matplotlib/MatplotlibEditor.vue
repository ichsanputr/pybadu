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
          <img 
            :src="theme === 'dark' ? '/logo-light.png' : '/logo.png'" 
            alt="Pybadu Logo" 
            class="w-8 h-8 rounded-md" 
          />
        </NuxtLink>
        <div class="hidden sm:flex items-center space-x-2">
          <span :class="[
            'font-semibold',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          ]">Matplotlib Playground</span>
        </div>

        <!-- File Tabs (moved beside logo) -->
        <div class="hidden lg:flex items-center space-x-1 ml-4 overflow-x-auto">
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
              @click.stop="confirmDelete(file.id, file.name)"
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
                  @click.stop="confirmDelete(file.id, file.name)"
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

        <!-- Save Button -->
        <button
          @click="saveFile"
          :class="[
            'flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
            theme === 'dark'
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          ]"
        >
          <Icon icon="ph:download" class="w-4 h-4" />
          <span class="hidden sm:inline">Save</span>
        </button>

        <!-- Share Button -->
        <button
          @click="shareCode"
          :class="[
            'flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
            theme === 'dark'
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          ]"
        >
          <Icon icon="ph:share" class="w-4 h-4" />
          <span class="hidden sm:inline">Share</span>
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
                <div class="flex items-center space-x-1">
                  <button
                    @click="$refs.sidebarFileInput?.click()"
                    :class="[
                      'p-0.5 rounded transition-colors',
                      theme === 'dark' ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                    ]"
                    title="Upload file"
                  >
                    <Icon icon="ph:upload" class="w-3 h-3" />
                  </button>
                  <button
                    @click="$emit('newFile')"
                    :class="[
                      'p-0.5 rounded transition-colors',
                      theme === 'dark' ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                    ]"
                    title="New file"
                  >
                    <Icon icon="ph:plus" class="w-3 h-3" />
                  </button>
                </div>
              </div>
              <input
                ref="sidebarFileInput"
                type="file"
                accept=".py,.txt"
                @change="handleFileUpload"
                class="hidden"
              />
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
            </div>
            
            <div class="flex items-center space-x-2">
              <!-- Upload File -->
              <input
                ref="fileInput"
                type="file"
                accept=".py,.txt"
                @change="handleFileUpload"
                class="hidden"
              />
              <button
                @click="$refs.fileInput?.click()"
                :class="[
                  'text-xs px-2 py-1 rounded transition-colors flex items-center space-x-1',
                  theme === 'dark'
                    ? 'hover:bg-gray-700 text-gray-400'
                    : 'hover:bg-gray-200 text-gray-600'
                ]"
              >
                <Icon icon="ph:upload" class="w-3 h-3" />
                <span>Upload</span>
              </button>

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
          <div class="flex-1 min-h-0">
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
              class="h-full w-full"
            />
          </div>
        </section>

        <!-- Output Panel -->
        <section :class="[
          'flex flex-col border-t lg:border-t-0 lg:border-l',
          'w-full lg:w-2/5 xl:w-1/2',
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

          <div class="flex-1 flex">
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

            <!-- Adsense Slot - Separated Column -->
            <div :class="[
              'w-48 lg:w-56 xl:w-64 border-l flex-shrink-0 hidden lg:block',
              theme === 'dark' ? 'bg-gray-800/30 border-gray-700' : 'bg-gray-50 border-gray-200'
            ]">
              <div class="p-4 h-full flex flex-col">
                <div :class="[
                  'text-xs font-semibold mb-4 pb-2 border-b',
                  theme === 'dark' ? 'text-gray-300 border-gray-600' : 'text-gray-700 border-gray-300'
                ]">
                  <Icon icon="ph:star" class="w-3 h-3 inline mr-1" />
                  Sponsors & Ads
                </div>
                
                <!-- Adsense Placeholder -->
                <div :class="[
                  'flex-1 border-2 border-dashed rounded-lg flex items-center justify-center min-h-[400px] max-h-[600px]',
                  theme === 'dark' ? 'border-gray-600 bg-gray-800/50' : 'border-gray-300 bg-gray-100'
                ]">
                  <div class="text-center p-4">
                    <Icon icon="ph:rectangle-dashed" :class="[
                      'w-10 h-10 mx-auto mb-2',
                      theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                    ]" />
                    <div :class="[
                      'text-xs font-medium mb-1',
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                    ]">
                      Advertisement Space
                    </div>
                    <div :class="[
                      'text-xs',
                      theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                    ]">
                      Support BudiBadu
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>

    <!-- Delete Confirmation Dialog -->
    <Dialog 
      :show="deleteDialog.show"
      @close="deleteDialog.show = false"
      size="sm"
      :title="'Delete File'"
      :description="'This action cannot be undone'"
      :icon="{ name: 'ph:trash', color: 'red' }"
    >
      <p class="text-sm text-gray-700 dark:text-gray-300 mb-6">
        Are you sure you want to delete <strong>{{ deleteDialog.fileName }}</strong>?
      </p>
      
      <template #actions>
        <button
          @click="deleteDialog.show = false"
          class="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          @click="confirmDeleteFile"
          class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Delete File
        </button>
      </template>
    </Dialog>

    <!-- Share Dialog -->
    <Dialog 
      :show="shareDialog.show"
      @close="shareDialog.show = false"
      size="md"
      :title="'Share Code'"
      :description="'Copy link to share your code'"
      :icon="{ name: 'ph:share', color: 'blue' }"
    >
      <div class="mb-4">
        <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Share URL
        </label>
        <div class="flex space-x-2">
          <input
            ref="shareUrlInput"
            v-model="shareDialog.url"
            readonly
            class="flex-1 px-3 py-2 rounded-lg text-sm border bg-gray-50 border-gray-300 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
          />
          <button
            @click="copyShareUrl"
            :class="[
              'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              shareDialog.copied
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
            ]"
          >
            {{ shareDialog.copied ? 'Copied!' : 'Copy' }}
          </button>
        </div>
      </div>
      
      <template #actions>
        <button
          @click="shareDialog.show = false"
          class="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors"
        >
          Close
        </button>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import Dialog from '~/components/ui/Dialog.vue'
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

// Delete confirmation dialog
const deleteDialog = ref({
  show: false,
  fileId: null,
  fileName: ''
})

// Share dialog
const shareDialog = ref({
  show: false,
  url: '',
  copied: false
})

function selectFile(fileId) {
  emit('selectFile', fileId)
  showFileDropdown.value = false
}

function confirmDelete(fileId, fileName) {
  deleteDialog.value = {
    show: true,
    fileId,
    fileName
  }
}

function confirmDeleteFile() {
  if (deleteDialog.value.fileId) {
    emit('deleteFile', deleteDialog.value.fileId)
  }
  deleteDialog.value.show = false
}

function handleFileUpload(event) {
  const file = event.target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    const content = e.target?.result
    emit('newFile', {
      name: file.name,
      content: content
    })
  }
  reader.readAsText(file)
  
  // Reset file input
  event.target.value = ''
}

function saveFile() {
  const activeFile = props.files.find(f => f.id === props.activeFileId)
  if (!activeFile) return

  const blob = new Blob([props.code], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = activeFile.name
  a.click()
  URL.revokeObjectURL(url)
}

function shareCode() {
  const url = window.location.href
  shareDialog.value = {
    show: true,
    url: url,
    copied: false
  }
}

function copyShareUrl() {
  if (shareDialog.value.url) {
    navigator.clipboard.writeText(shareDialog.value.url)
    shareDialog.value.copied = true
    setTimeout(() => {
      shareDialog.value.copied = false
    }, 2000)
  }
}
</script>

<style scoped>
/* Custom scrollbar for dark theme */
:deep(.overflow-y-auto::-webkit-scrollbar) {
  width: 6px;
}

:deep(.overflow-y-auto::-webkit-scrollbar-track) {
  background: transparent;
}

:deep(.overflow-y-auto::-webkit-scrollbar-thumb) {
  background: #9ca3af;
  border-radius: 9999px;
}

.dark :deep(.overflow-y-auto::-webkit-scrollbar-thumb) {
  background: #6b7280;
}

:deep(.overflow-y-auto::-webkit-scrollbar-thumb:hover) {
  background: #6b7280;
}

.dark :deep(.overflow-y-auto::-webkit-scrollbar-thumb:hover) {
  background: #6b7280;
}
</style>