<template>
  <div :class="[
    'min-h-screen flex flex-col',
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
            class="w-6 h-6 rounded-lg" 
          />
        </NuxtLink>
        <div class="hidden sm:flex items-center space-x-2">
          <span :class="[
            'font-semibold',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          ]">BudiBadu</span>
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
                  ? 'bg-gray-700 text-python-yellow-400'
                  : 'bg-gray-100 text-python-blue-600'
                : theme === 'dark'
                  ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            ]"
          >
            <Icon icon="ph:file-py" class="w-4 h-4" />
            <span>{{ file.name }}</span>
            <button
              v-if="files.length > 1"
              @click.stop="handleDeleteFile(file.id, file.name)"
              class="opacity-0 group-hover:opacity-100 hover:bg-red-500/20 rounded p-0.5"
            >
              <Icon icon="ph:x" class="w-3 h-3" />
            </button>
          </button>
          <button
            @click="handleNewFile"
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
                      ? 'bg-python-yellow-900/30 text-python-yellow-400'
                      : 'bg-python-blue-100 text-python-blue-600'
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
                @click="handleNewFile(); showFileDropdown = false"
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

        <!-- Info Button -->
        <button
          @click="showInfoDialog = true"
          :class="[
            'flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
            theme === 'dark'
              ? 'bg-python-blue-600 hover:bg-python-blue-700 text-white'
              : 'bg-python-blue-600 hover:bg-python-blue-700 text-white'
          ]"
          title="Information"
        >
          <Icon icon="ph:info" class="w-4 h-4" />
        </button>


        <button
          @click="$emit('runCode')"
          :disabled="isLoading || !pyodideReady"
          :class="[
            'flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
            isLoading || !pyodideReady
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : theme === 'dark'
                ? 'bg-python-blue-600 hover:bg-python-blue-700 text-white'
                : 'bg-python-blue-600 hover:bg-python-blue-700 text-white'
          ]"
        >
          <Icon 
            :icon="isLoading ? 'ph:spinner' : 'ph:play'" 
            :class="['w-4 h-4', isLoading ? 'animate-spin' : '']" 
          />
          <span class="hidden sm:inline">{{ isLoading ? 'Running...' : 'Run' }}</span>
        </button>

        <!-- Save Button -->
        <button
          @click="saveFile"
          :disabled="isSaving"
          :class="[
            'flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
            isSaving
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : theme === 'dark'
                ? 'bg-python-blue-600 hover:bg-python-blue-700 text-white'
                : 'bg-python-blue-600 hover:bg-python-blue-700 text-white'
          ]"
        >
          <Icon 
            :icon="isSaving ? 'ph:spinner' : 'uil:save'" 
            :class="['w-4 h-4', isSaving ? 'animate-spin' : '']"
          />
          <span class="hidden sm:inline">{{ isSaving ? 'Saving...' : 'Save' }}</span>
        </button>

        <!-- Share Button -->
        <button
          @click="shareCode"
          :class="[
            'flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
            theme === 'dark'
              ? 'bg-python-blue-600 hover:bg-python-blue-700 text-white'
              : 'bg-python-blue-600 hover:bg-python-blue-700 text-white'
          ]"
        >
          <Icon icon="ph:share" class="w-4 h-4" />
          <span class="hidden sm:inline">Share</span>
        </button>

        <!-- Theme Toggle - Moved to End -->
        <button
          @click="$emit('toggleTheme')"
          :class="[
            'flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
            theme === 'dark'
              ? 'bg-python-blue-600 hover:bg-python-blue-700 text-white'
              : 'bg-python-blue-600 hover:bg-python-blue-700 text-white'
          ]"
        >
          <Icon :icon="theme === 'dark' ? 'ph:sun' : 'ph:moon'" class="w-4 h-4" />
          <span class="hidden sm:inline">{{ theme === 'dark' ? 'Light' : 'Dark' }}</span>
        </button>
      </div>
    </header>

    <!-- Main Layout -->
    <div class="flex-1 flex overflow-hidden h-[calc(100vh-64px)]">
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
            {{ libraryName }}
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
                    @click="handleNewFile"
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
                <div
                  v-for="file in files"
                  :key="file.id"
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
                  <div 
                    class="flex items-center space-x-2 min-w-0 flex-1 cursor-pointer"
                    @click="$emit('selectFile', file.id)"
                    @dblclick="handleDoubleClick(file.id, file.name)"
                  >
                    <Icon icon="ph:file-py" class="w-4 h-4 flex-shrink-0" />
                    <input
                      v-if="editingFileId === file.id"
                      v-model="editingFileName"
                      @keyup.enter="confirmRename(file.id)"
                      @keyup.esc="cancelRename"
                      @blur="confirmRename(file.id)"
                      @click.stop
                      :class="[
                        'flex-1 bg-transparent border rounded px-1 outline-none',
                        theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
                      ]"
                      autofocus
                    />
                    <span v-else class="truncate">{{ file.name }}</span>
                  </div>
                  <div class="flex items-center space-x-1 opacity-0 group-hover:opacity-100">
                    <button
                      @click.stop="startRenameFile(file.id, file.name)"
                      class="p-0.5 rounded hover:bg-blue-500/20 transition-all"
                      title="Rename file"
                    >
                      <Icon icon="ph:pencil-simple" class="w-3 h-3" />
                    </button>
                    <button
                      v-if="files.length > 1"
                      @click.stop="handleDeleteFile(file.id, file.name)"
                      class="p-0.5 rounded hover:bg-red-500/20 transition-all"
                      title="Delete file"
                    >
                      <Icon icon="ph:trash" class="w-3 h-3" />
                    </button>
                  </div>
                </div>
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

      <!-- Editor & Output & Ads -->
      <main class="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <!-- Code Editor -->
        <section class="w-full lg:w-[35%] xl:w-[40%]" :class="[
          'flex flex-col border-r',
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
              height="100%"
              class="h-full w-full"
            />
          </div>
        </section>

        <!-- Output Panel -->
        <section :class="[
          'flex flex-col border-t lg:border-t-0 lg:border-l',
          'w-full lg:w-[35%] xl:w-[35%]',
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
                  'rounded-lg text-sm',
                  item.type === 'image' ? 'p-0' : 'p-3',
                  item.type === 'error'
                    ? theme === 'dark' ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-700'
                    : item.type === 'success'
                      ? theme === 'dark' ? 'bg-green-900/30 text-green-300' : 'bg-green-50 text-green-700'
                      : item.type === 'image'
                        ? ''
                        : theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                ]"
              >
                <!-- Image output -->
                <div v-if="item.type === 'image'" class="relative group">
                  <img 
                    :src="`data:image/png;base64,${item.content}`" 
                    alt="Plot output" 
                    class="w-full h-auto rounded-lg"
                  />
                  <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      @click="downloadImage(item.content, index)"
                      :class="[
                        'p-2 rounded-lg text-sm font-medium transition-colors',
                        'bg-white/90 hover:bg-white text-gray-700 shadow-lg'
                      ]"
                      title="Download image"
                    >
                      <Icon icon="ph:download" class="w-4 h-4" />
                    </button>
                  </div>
                  <span class="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                    {{ item.timestamp }}
                  </span>
                </div>
                
                <!-- Text output -->
                <div v-else class="flex items-start justify-between">
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

        <!-- Ads Panel -->
        <section :class="[
          'hidden lg:flex flex-col border-l',
          'w-full lg:w-[30%] xl:w-[25%]',
          theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
        ]">
          <!-- Ads Content -->
          <div class="flex-1 overflow-y-auto p-2 lg:p-4">
            <ClientOnly>
              <!-- Square Ad 1 -->
              <div class="mb-4 flex justify-center">
                <Adsense 
                  key="editor-ad-1"
                  client="ca-pub-1356911639243870" 
                  ad-slot="3430238458"
                  kind="square"
                  :style="{ display: 'inline-block', width: '100%', maxWidth: '300px', height: '300px' }" 
                />
              </div>

              <!-- Square Ad 2 -->
              <div class="mb-4 flex justify-center">
                <Adsense 
                  key="editor-ad-2"
                  client="ca-pub-1356911639243870" 
                  ad-slot="4242301831"
                  kind="square"
                  :style="{ display: 'inline-block', width: '100%', maxWidth: '300px', height: '300px' }" 
                />
              </div>
            </ClientOnly>
          </div>
        </section>

      </main>
    </div>

    <!-- Delete Confirmation Dialog -->
    <Dialog 
      v-model="deleteDialog.show"
      size="sm"
      title="Delete File"
      subtitle="This action cannot be undone"
      icon="ph:trash"
      icon-variant="error"
      :theme="theme"
    >
      <p class="text-sm text-gray-700 dark:text-gray-300 mb-6">
        Are you sure you want to delete <strong>{{ deleteDialog.fileName }}</strong>?
      </p>
      
      <template #footer>
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
      v-model="shareDialog.show"
      size="md"
      title="Share Your Code"
      subtitle="Share your Python code with the community"
      icon="ph:share-network"
      icon-variant="info"
      :theme="theme"
    >
      <div class="space-y-4">
        <!-- Social Media Buttons -->
        <div class="grid grid-cols-2 gap-3">
          <button
            @click="shareToTwitter"
            class="flex items-center justify-center space-x-2 px-4 py-3 rounded-lg bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white font-medium transition-colors"
          >
            <Icon icon="simple-icons:x" class="w-4 h-4" />
            <span>Twitter</span>
          </button>
          
          <button
            @click="shareToFacebook"
            class="flex items-center justify-center space-x-2 px-4 py-3 rounded-lg bg-[#1877F2] hover:bg-[#0c63d4] text-white font-medium transition-colors"
          >
            <Icon icon="simple-icons:facebook" class="w-4 h-4" />
            <span>Facebook</span>
          </button>
          
          <button
            @click="shareToLinkedIn"
            class="flex items-center justify-center space-x-2 px-4 py-3 rounded-lg bg-[#0A66C2] hover:bg-[#004182] text-white font-medium transition-colors"
          >
            <Icon icon="simple-icons:linkedin" class="w-4 h-4" />
            <span>LinkedIn</span>
          </button>
          
          <button
            @click="shareToWhatsApp"
            class="flex items-center justify-center space-x-2 px-4 py-3 rounded-lg bg-[#25D366] hover:bg-[#1faa52] text-white font-medium transition-colors"
          >
            <Icon icon="simple-icons:whatsapp" class="w-4 h-4" />
            <span>WhatsApp</span>
          </button>
        </div>

        <!-- Divider -->
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white dark:bg-gray-800 text-gray-500">or copy link</span>
          </div>
        </div>

        <!-- Copy Link -->
        <div>
          <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Share URL
          </label>
          <div class="flex space-x-2">
            <input
              ref="shareUrlInput"
              v-model="shareDialog.url"
              readonly
              class="flex-1 px-3 py-2 rounded-lg text-sm border bg-gray-50 border-gray-300 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 font-mono"
            />
            <button
              @click="copyShareUrl"
              :class="[
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                shareDialog.copied
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-python-blue-600 hover:bg-python-blue-700 text-white'
              ]"
            >
              <Icon :icon="shareDialog.copied ? 'ph:check-circle' : 'ph:copy'" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      <template #footer>
        <button
          @click="shareDialog.show = false"
          class="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors"
        >
          Close
        </button>
      </template>
    </Dialog>

    <!-- Info Dialog -->
    <Dialog 
      v-model="showInfoDialog"
      size="lg"
      title="Pyodide Information"
      subtitle="Notes and tips about code execution"
      icon="ph:info"
      icon-variant="info"
      :theme="theme"
    >
      <div :class="['space-y-4 text-sm', theme === 'dark' ? 'text-gray-300' : 'text-gray-700']">
        <div>
          <p class="leading-relaxed">
            Code is executed with <strong>Pyodide</strong>, a port of CPython to WebAssembly/Emscripten. 
            This allows Python to run directly in your browser without any server-side execution.
          </p>
        </div>

        <div>
          <h4 class="font-semibold mb-2">Known Limitations</h4>
          <ul class="space-y-1 list-disc list-inside pl-2">
            <li><strong>Threading & Multiprocessing:</strong> Not available in WebAssembly</li>
            <li><strong>Network Requests:</strong> Limited to browser APIs, use pyodide.http or fetch</li>
            <li><strong>File System:</strong> Virtual file system, files don't persist</li>
            <li><strong>GUI Libraries:</strong> turtle, tkinter are not supported</li>
            <li><strong>Native Dependencies:</strong> Some C extensions may not work</li>
          </ul>
        </div>

        <div>
          <h4 class="font-semibold mb-2">Tips for Best Results</h4>
          <ul class="space-y-1 list-disc list-inside pl-2">
            <li>Use <strong>Shift + Enter</strong> to quickly run your code</li>
            <li>Keep computations lightweight for faster execution</li>
            <li>Use print() statements to debug your code</li>
            <li>Your files are auto-saved to browser storage</li>
            <li>For matplotlib plots, use plt.show() to display</li>
          </ul>
        </div>

        <div class="text-center pt-2">
          Learn more at <a href="https://pyodide.org" target="_blank" class="text-python-blue-500 hover:underline">pyodide.org</a>
        </div>
      </div>
    </Dialog>

    <!-- Toast Notifications -->
    <Toast :toasts="toasts" @remove="removeToast" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { Icon } from '@iconify/vue'
import Dialog from '~/components/ui/Dialog.vue'
import MonacoEditor from '~/components/MonacoEditor.vue'
import Adsense from '~/components/Adsense.vue'
import Toast from '~/components/ui/Toast.vue'

defineOptions({
  name: 'CodeEditor'
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
  examples: Array,
  libraryName: {
    type: String,
    default: 'Python'
  }
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
  'deleteFile',
  'renameFile',
  'saveToStorage'
])

// Keyboard shortcuts
onMounted(() => {
  const handleKeyDown = (e) => {
    // Shift + Enter to run code
    if (e.shiftKey && e.key === 'Enter' && !props.isLoading && props.pyodideReady) {
      e.preventDefault()
      emit('runCode')
    }
  }
  
  window.addEventListener('keydown', handleKeyDown)
  
  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeyDown)
  })
})

// UI State
const showFileDropdown = ref(false)
const showSidebar = ref(true)
const sidebarCollapsed = ref(false)

// Toast notifications
const toasts = ref([])
let toastId = 0

// Save loading state
const isSaving = ref(false)

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

// Rename state
const editingFileId = ref(null)
const editingFileName = ref('')

// Info dialog
const showInfoDialog = ref(false)

// Toast functions
function showToast(message, type = 'info') {
  const id = toastId++
  toasts.value.push({ id, message, type })
  
  setTimeout(() => {
    removeToast(id)
  }, 3000)
}

function removeToast(id) {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}

function selectFile(fileId) {
  emit('selectFile', fileId)
  showFileDropdown.value = false
}

function handleDeleteFile(fileId, fileName) {
  if (props.files.length <= 1) {
    showToast('Cannot delete the last file', 'warning')
    return
  }
  
  deleteDialog.value = {
    show: true,
    fileId,
    fileName
  }
}

function confirmDeleteFile() {
  if (deleteDialog.value.fileId) {
    emit('deleteFile', deleteDialog.value.fileId)
    showToast('File deleted successfully', 'success')
  }
  deleteDialog.value.show = false
}

function handleNewFile() {
  if (props.files.length >= 5) {
    showToast('Maximum 5 files allowed', 'warning')
    return
  }
  emit('newFile')
}

function handleFileUpload(event) {
  const file = event.target.files?.[0]
  if (!file) return

  if (props.files.length >= 5) {
    showToast('Maximum 5 files allowed', 'warning')
    event.target.value = ''
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    const content = e.target?.result
    emit('newFile', {
      name: file.name,
      content: content
    })
    showToast('File uploaded successfully', 'success')
  }
  reader.readAsText(file)
  
  // Reset file input
  event.target.value = ''
}

function startRenameFile(fileId, fileName) {
  editingFileId.value = fileId
  // Extract filename without extension for editing
  const dotIndex = fileName.lastIndexOf('.')
  editingFileName.value = dotIndex > 0 ? fileName.substring(0, dotIndex) : fileName
}

function handleDoubleClick(fileId, fileName) {
  startRenameFile(fileId, fileName)
}

function confirmRename(fileId) {
  const trimmedName = editingFileName.value.trim()
  
  if (!trimmedName) {
    showToast('File name cannot be empty', 'error')
    cancelRename()
    return
  }
  
  // Get original file
  const originalFile = props.files.find(f => f.id === fileId)
  if (!originalFile) {
    cancelRename()
    return
  }
  
  // Extract and preserve the original extension
  const originalName = originalFile.name
  const dotIndex = originalName.lastIndexOf('.')
  const extension = dotIndex > 0 ? originalName.substring(dotIndex) : '.py'
  
  // Ensure new name doesn't include extension
  let newNameWithoutExt = trimmedName
  if (newNameWithoutExt.includes('.')) {
    newNameWithoutExt = newNameWithoutExt.substring(0, newNameWithoutExt.lastIndexOf('.'))
  }
  
  const newName = newNameWithoutExt + extension
  
  if (newName !== originalName) {
    emit('renameFile', { fileId, newName })
    showToast('File renamed successfully', 'success')
  }
  
  editingFileId.value = null
  editingFileName.value = ''
}

function cancelRename() {
  editingFileId.value = null
  editingFileName.value = ''
}

async function saveFile() {
  isSaving.value = true
  
  // Add a small delay for better UX
  await new Promise(resolve => setTimeout(resolve, 300))
  
  emit('saveToStorage')
  showToast('Progress saved successfully', 'success')
  
  isSaving.value = false
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
    showToast('Link copied to clipboard', 'success')
    setTimeout(() => {
      shareDialog.value.copied = false
    }, 2000)
  }
}

function shareToTwitter() {
  const url = encodeURIComponent(shareDialog.value.url)
  const text = encodeURIComponent('Check out my Python code on Pybadu!')
  window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'width=550,height=420')
}

function shareToFacebook() {
  const url = encodeURIComponent(shareDialog.value.url)
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=550,height=420')
}

function shareToLinkedIn() {
  const url = encodeURIComponent(shareDialog.value.url)
  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'width=550,height=420')
}

function shareToWhatsApp() {
  const url = encodeURIComponent(shareDialog.value.url)
  const text = encodeURIComponent('Check out my Python code on Pybadu!')
  window.open(`https://wa.me/?text=${text}%20${url}`, '_blank')
}

function downloadImage(base64Data, index) {
  const link = document.createElement('a')
  link.href = `data:image/png;base64,${base64Data}`
  link.download = `plot_${index + 1}_${Date.now()}.png`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  showToast('Image downloaded successfully', 'success')
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