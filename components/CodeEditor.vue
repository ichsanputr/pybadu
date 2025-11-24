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
          <img :src="theme === 'dark' ? '/logo-light.png' : '/logo.png'" alt="Pybadu Logo" class="w-6 h-6 rounded-lg" />
        </NuxtLink>
        <div class="hidden sm:flex items-center space-x-2">
          <span :class="[
            'font-semibold',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          ]">BudiBadu</span>
        </div>

        <!-- File Tabs (moved beside logo) -->
        <div class="hidden lg:flex items-center space-x-1 ml-4 overflow-x-auto">
          <button v-for="file in files" :key="file.id" @click="$emit('selectFile', file.id)" :class="[
            'flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors group',
            activeFileId === file.id
              ? theme === 'dark'
                ? 'bg-gray-700 text-python-yellow-400'
                : 'bg-gray-100 text-python-blue-600'
              : theme === 'dark'
                ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          ]">
            <Icon icon="ph:file-py" class="w-4 h-4" />
            <span>{{ file.name }}</span>
            <button v-if="files.length > 1" @click.stop="handleDeleteFile(file.id, file.name)"
              class="opacity-0 group-hover:opacity-100 hover:bg-red-500/20 rounded p-0.5">
              <Icon icon="ph:x" class="w-3 h-3" />
            </button>
          </button>
          <button @click="handleNewFile" :class="[
            'p-1.5 rounded-md transition-colors',
            theme === 'dark'
              ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          ]">
            <Icon icon="ph:plus" class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Right: Actions -->
      <div class="flex items-center space-x-2">
        <!-- Mobile File Dropdown -->
        <div class="lg:hidden relative">
          <button @click="showFileDropdown = !showFileDropdown" :class="[
            'flex items-center space-x-1 px-2 py-1.5 rounded-md text-sm',
            theme === 'dark'
              ? 'bg-gray-700 text-gray-300'
              : 'bg-gray-100 text-gray-700'
          ]">
            <Icon icon="ph:files" class="w-4 h-4" />
            <span>{{files.find(f => f.id === activeFileId)?.name}}</span>
            <Icon icon="ph:caret-down" class="w-3 h-3" />
          </button>

          <div v-if="showFileDropdown" :class="[
            'absolute top-full right-0 mt-1 w-48 rounded-md shadow-lg z-20 border',
            theme === 'dark'
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          ]">
            <div class="p-1">
              <button v-for="file in files" :key="file.id" @click="selectFile(file.id)" :class="[
                'w-full flex items-center justify-between px-2 py-1.5 rounded text-sm text-left',
                activeFileId === file.id
                  ? theme === 'dark'
                    ? 'bg-python-yellow-900/30 text-python-yellow-400'
                    : 'bg-python-blue-100 text-python-blue-600'
                  : theme === 'dark'
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-700 hover:bg-gray-100'
              ]">
                <div class="flex items-center space-x-2">
                  <Icon icon="ph:file-py" class="w-4 h-4" />
                  <span>{{ file.name }}</span>
                </div>
                <button v-if="files.length > 1" @click.stop="confirmDelete(file.id, file.name)"
                  class="opacity-60 hover:opacity-100 p-0.5">
                  <Icon icon="ph:trash" class="w-3 h-3" />
                </button>
              </button>
              <hr :class="theme === 'dark' ? 'border-gray-700' : 'border-gray-200'" class="my-1" />
              <button @click="handleNewFile(); showFileDropdown = false" :class="[
                'w-full flex items-center space-x-2 px-2 py-1.5 rounded text-sm',
                theme === 'dark'
                  ? 'text-gray-300 hover:bg-gray-700'
                  : 'text-gray-700 hover:bg-gray-100'
              ]">
                <Icon icon="ph:plus" class="w-4 h-4" />
                <span>New File</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Info Button -->
        <button @click="showInfoDialog = true" :class="[
          'hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
          theme === 'dark'
            ? 'bg-python-blue-600 hover:bg-python-blue-700 text-white'
            : 'bg-python-blue-600 hover:bg-python-blue-700 text-white'
        ]" title="Information">
          <Icon icon="ph:info" class="w-4 h-4" />
        </button>

        <!-- Run Button (Always Visible) -->
        <button @click="$emit('runCode')" :disabled="isLoading || !pyodideReady" :class="[
          'flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
          isLoading || !pyodideReady
            ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
            : theme === 'dark'
              ? 'bg-python-blue-600 hover:bg-python-blue-700 text-white'
              : 'bg-python-blue-600 hover:bg-python-blue-700 text-white'
        ]">
          <Icon :icon="!pyodideReady || isLoading ? 'ph:spinner' : 'ph:play'"
            :class="['w-4 h-4', !pyodideReady || isLoading ? 'animate-spin' : '']" />
          <span class="hidden sm:inline">{{ !pyodideReady ? 'Loading...' : isLoading ? 'Running...' : 'Run' }}</span>
        </button>

        <!-- Desktop Buttons (Hidden on Mobile) -->
        <div class="hidden sm:flex items-center space-x-2">
          <!-- Save Button -->
          <button @click="saveFile" :disabled="isSaving" :class="[
            'flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
            isSaving
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : theme === 'dark'
                ? 'bg-python-blue-600 hover:bg-python-blue-700 text-white'
                : 'bg-python-blue-600 hover:bg-python-blue-700 text-white'
          ]">
            <Icon :icon="isSaving ? 'ph:spinner' : 'uil:save'" :class="['w-4 h-4', isSaving ? 'animate-spin' : '']" />
            <span>{{ isSaving ? 'Saving...' : 'Save' }}</span>
          </button>

          <!-- Share Button -->
          <button @click="openShareDialog" :class="[
            'flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
            theme === 'dark'
              ? 'bg-python-blue-600 hover:bg-python-blue-700 text-white'
              : 'bg-python-blue-600 hover:bg-python-blue-700 text-white'
          ]">
            <Icon icon="ph:share" class="w-4 h-4" />
            <span>Share</span>
          </button>

          <!-- Theme Toggle -->
          <button @click="$emit('toggleTheme')" :class="[
            'flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
            theme === 'dark'
              ? 'bg-python-blue-600 hover:bg-python-blue-700 text-white'
              : 'bg-python-blue-600 hover:bg-python-blue-700 text-white'
          ]">
            <Icon :icon="theme === 'dark' ? 'ph:sun' : 'ph:moon'" class="w-4 h-4" />
            <span>{{ theme === 'dark' ? 'Light' : 'Dark' }}</span>
          </button>
        </div>

        <!-- Mobile Menu Button -->
        <div class="sm:hidden relative">
          <button @click="showMobileMenu = !showMobileMenu" :class="[
            'flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
            theme === 'dark'
              ? 'bg-python-blue-600 hover:bg-python-blue-700 text-white'
              : 'bg-python-blue-600 hover:bg-python-blue-700 text-white'
          ]">
            <Icon icon="ph:list" class="w-4 h-4" />
          </button>

          <!-- Mobile Dropdown Menu -->
          <div v-if="showMobileMenu" @click="showMobileMenu = false" :class="[
            'absolute right-0 top-full mt-2 w-48 rounded-lg shadow-lg border z-50',
            theme === 'dark'
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          ]">
            <button @click="showInfoDialog = true" :class="[
              'w-full flex items-center space-x-2 px-4 py-3 text-sm transition-colors',
              theme === 'dark'
                ? 'text-gray-300 hover:bg-gray-700'
                : 'text-gray-700 hover:bg-gray-50'
            ]">
              <Icon icon="ph:info" class="w-4 h-4" />
              <span>Information</span>
            </button>

            <button @click="saveFile" :disabled="isSaving" :class="[
              'w-full flex items-center space-x-2 px-4 py-3 text-sm transition-colors',
              isSaving
                ? 'opacity-50 cursor-not-allowed'
                : '',
              theme === 'dark'
                ? 'text-gray-300 hover:bg-gray-700'
                : 'text-gray-700 hover:bg-gray-50'
            ]">
              <Icon :icon="isSaving ? 'ph:spinner' : 'uil:save'" :class="['w-4 h-4', isSaving ? 'animate-spin' : '']" />
              <span>{{ isSaving ? 'Saving...' : 'Save' }}</span>
            </button>

            <button @click="openShareDialog" :class="[
              'w-full flex items-center space-x-2 px-4 py-3 text-sm transition-colors',
              theme === 'dark'
                ? 'text-gray-300 hover:bg-gray-700'
                : 'text-gray-700 hover:bg-gray-50'
            ]">
              <Icon icon="ph:share" class="w-4 h-4" />
              <span>Share</span>
            </button>

            <button @click="$emit('toggleTheme')" :class="[
              'w-full flex items-center space-x-2 px-4 py-3 text-sm transition-colors rounded-b-lg',
              theme === 'dark'
                ? 'text-gray-300 hover:bg-gray-700'
                : 'text-gray-700 hover:bg-gray-50'
            ]">
              <Icon :icon="theme === 'dark' ? 'ph:sun' : 'ph:moon'" class="w-4 h-4" />
              <span>{{ theme === 'dark' ? 'Light Mode' : 'Dark Mode' }}</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Layout -->
    <div class="flex-none flex overflow-hidden h-full sm:h-[calc(100vh-52px)]">
      <!-- Sidebar (Desktop) -->
      <aside v-if="showSidebar" :class="[
        'hidden md:flex flex-col border-r transition-all duration-200',
        sidebarCollapsed ? 'w-12' : 'w-64',
        theme === 'dark'
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-200'
      ]">
        <!-- Sidebar Header -->
        <div class="flex items-center justify-between p-3 border-b"
          :class="theme === 'dark' ? 'border-gray-700' : 'border-gray-200'">
          <h3 v-if="!sidebarCollapsed"
            :class="['font-medium text-sm', theme === 'dark' ? 'text-white' : 'text-gray-900']">
            {{ libraryName }}
          </h3>
          <button @click="sidebarCollapsed = !sidebarCollapsed" :class="[
            'p-1 rounded transition-colors',
            theme === 'dark' ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
          ]">
            <Icon :icon="sidebarCollapsed ? 'ph:sidebar-simple' : 'ph:sidebar-simple'" class="w-4 h-4" />
          </button>
        </div>

        <!-- File Explorer -->
        <div class="flex-1 overflow-y-auto">
          <div v-if="!sidebarCollapsed" class="p-2">
            <!-- Files Section -->
            <div class="mb-4">
              <div class="flex items-center justify-between mb-2 px-1">
                <span
                  :class="['text-xs font-medium uppercase tracking-wide', theme === 'dark' ? 'text-gray-400' : 'text-gray-600']">
                  Files
                </span>
                <div class="flex items-center space-x-1">
                  <button @click="$refs.sidebarFileInput?.click()" :class="[
                    'p-0.5 rounded transition-colors',
                    theme === 'dark' ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                  ]" title="Upload file">
                    <Icon icon="ph:upload" class="w-3 h-3" />
                  </button>
                  <button @click="handleNewFile" :class="[
                    'p-0.5 rounded transition-colors',
                    theme === 'dark' ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                  ]" title="New file">
                    <Icon icon="ph:plus" class="w-3 h-3" />
                  </button>
                </div>
              </div>
              <input ref="sidebarFileInput" type="file" accept=".py,.txt" @change="handleFileUpload" class="hidden" />
              <div class="space-y-1">
                <div v-for="file in files" :key="file.id" :class="[
                  'w-full flex items-center justify-between p-2 rounded-md text-sm transition-colors group',
                  activeFileId === file.id
                    ? theme === 'dark'
                      ? 'bg-yellow-900/30 text-yellow-400'
                      : 'bg-blue-100 text-blue-600'
                    : theme === 'dark'
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-700 hover:bg-gray-100'
                ]">
                  <div class="flex items-center space-x-2 min-w-0 flex-1 cursor-pointer"
                    @click="$emit('selectFile', file.id)" @dblclick="handleDoubleClick(file.id, file.name)">
                    <Icon icon="ph:file-py" class="w-4 h-4 flex-shrink-0" />
                    <input v-if="editingFileId === file.id" v-model="editingFileName"
                      @keyup.enter="confirmRename(file.id)" @keyup.esc="cancelRename" @blur="confirmRename(file.id)"
                      @click.stop :class="[
                        'flex-1 bg-transparent border rounded px-1 outline-none',
                        theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
                      ]" maxlength="8" autofocus />
                    <span v-else class="truncate">{{ file.name }}</span>
                  </div>
                  <div class="flex items-center space-x-1 opacity-0 group-hover:opacity-100">
                    <button @click.stop="startRenameFile(file.id, file.name)"
                      class="p-0.5 rounded hover:bg-blue-500/20 transition-all" title="Rename file">
                      <Icon icon="ph:pencil-simple" class="w-3 h-3" />
                    </button>
                    <button v-if="files.length > 1" @click.stop="handleDeleteFile(file.id, file.name)"
                      class="p-0.5 rounded hover:bg-red-500/20 transition-all" title="Delete file">
                      <Icon icon="ph:trash" class="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Examples Section -->
            <div>
              <div class="flex items-center justify-between mb-2 px-1">
                <span
                  :class="['text-xs font-medium uppercase tracking-wide', theme === 'dark' ? 'text-gray-400' : 'text-gray-600']">
                  Examples
                </span>
              </div>
              <div class="space-y-1">
                <button v-for="(example, index) in examples.slice(0, 3)" :key="index"
                  @click="$emit('loadExample', example)" :class="[
                    'w-full text-left p-2 rounded-md text-sm transition-colors',
                    theme === 'dark'
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  ]">
                  <div class="flex items-center space-x-2">
                    <Icon icon="ph:code-simple" class="w-4 h-4 flex-shrink-0" />
                    <span class="truncate">{{ example.title }}</span>
                  </div>
                </button>
              </div>
            </div>

            <!-- Settings Section -->
            <div class="mt-auto pt-4 border-t" :class="theme === 'dark' ? 'border-gray-700' : 'border-gray-200'">
              <button @click="showSettingsDialog = true" :class="[
                'w-full text-left p-2 rounded-md text-sm transition-colors',
                theme === 'dark'
                  ? 'text-gray-300 hover:bg-gray-700'
                  : 'text-gray-700 hover:bg-gray-100'
              ]">
                <div class="flex items-center space-x-2">
                  <Icon icon="ph:gear" class="w-4 h-4 flex-shrink-0" />
                  <span>Settings</span>
                </div>
              </button>
            </div>
          </div>

          <!-- Collapsed Sidebar Icons -->
          <div v-else class="p-2 space-y-2">
            <button v-for="file in files" :key="file.id" @click="$emit('selectFile', file.id)" :class="[
              'w-full p-2 rounded-md transition-colors',
              activeFileId === file.id
                ? theme === 'dark'
                  ? 'bg-yellow-900/30 text-yellow-400'
                  : 'bg-blue-100 text-blue-600'
                : theme === 'dark'
                  ? 'text-gray-400 hover:bg-gray-700'
                  : 'text-gray-600 hover:bg-gray-100'
            ]" :title="file.name">
              <Icon icon="ph:file-py" class="w-4 h-4 mx-auto" />
            </button>
          </div>
        </div>
      </aside>

      <!-- Editor & Output & Ads -->
      <main class="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <!-- Code Editor -->
        <section class="w-full lg:w-[35%] xl:w-[40%] h-[500px] lg:h-full" :class="[
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
              <span>{{files.find(f => f.id === activeFileId)?.name || 'Editor'}}</span>
            </div>

            <div class="flex items-center space-x-2">
              <button @click="$emit('clearCode')" :class="[
                'text-xs px-2 py-1 rounded transition-colors',
                theme === 'dark'
                  ? 'hover:bg-gray-700 text-gray-400'
                  : 'hover:bg-gray-200 text-gray-600'
              ]">
                Clear
              </button>
            </div>
          </div>

          <!-- Monaco Editor -->
          <div class="flex-1 overflow-hidden">
            <MonacoEditor :model-value="code" @update:model-value="$emit('update:code', $event)" :language="'python'"
              :theme="monacoTheme" :options="monacoOptions" height="100%" class="h-full w-full" />
          </div>
        </section>

        <!-- Output Panel -->
        <section :class="[
          'flex flex-col border-t lg:border-t-0 lg:border-l',
          'w-full lg:w-[35%] xl:w-[35%]',
          'h-[60vh] lg:h-[calc(100vh-64px)]',
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        ]">
          <!-- Output Header -->
          <div :class="[
            'flex items-center justify-between px-4 py-2 border-b text-sm flex-shrink-0',
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

            <button @click="$emit('clearOutput')" :class="[
              'text-xs px-2 py-1 rounded transition-colors',
              theme === 'dark'
                ? 'hover:bg-gray-700 text-gray-400'
                : 'hover:bg-gray-200 text-gray-600'
            ]">
              Clear
            </button>
          </div>

          <!-- Output Content -->
          <div :class="[
            'overflow-y-auto p-4 space-y-3',
            '!h-[500px] lg:h-[calc(100vh-112px)]'
          ]">
            <div v-for="(item, index) in output" :key="index" :class="[
              'rounded-lg text-sm',
              item.type === 'image' ? 'p-0' : 'p-3',
              item.type === 'error'
                ? theme === 'dark' ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-700'
                : item.type === 'success'
                  ? theme === 'dark' ? 'bg-green-900/30 text-green-300' : 'bg-green-50 text-green-700'
                  : item.type === 'image'
                    ? ''
                    : theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
            ]">
              <!-- Image output -->
              <div v-if="item.type === 'image'" class="relative group">
                <img :src="`data:image/png;base64,${item.content}`" alt="Plot output"
                  class="w-full h-auto rounded-lg" />
                <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button @click="downloadImage(item.content, index)" :class="[
                    'p-2 rounded-lg text-sm font-medium transition-colors',
                    'bg-white/90 hover:bg-white text-gray-700 shadow-lg'
                  ]" title="Download image">
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

            <div class=" h-full flex items-center justify-center" v-if="output.length === 0" :class="[
              'text-center py-8 text-sm',
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            ]">
              <div class="flex flex-col items-center justify-center">
                <Icon icon="ph:terminal" class="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Run your Python code to see output here</p>
              </div>
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
                <Adsense key="editor-ad-1" client="ca-pub-1356911639243870" ad-slot="3430238458" kind="square"
                  :style="{ display: 'inline-block', width: '100%', maxWidth: '300px', height: '300px' }" />
              </div>
            </ClientOnly>
          </div>
        </section>

      </main>
    </div>

    <!-- Delete Confirmation Dialog -->
    <Dialog v-model="deleteDialog.show" size="sm" title="Delete File" subtitle="This action cannot be undone"
      icon="ph:trash" icon-variant="error" :theme="theme">
      <p class="text-sm text-gray-700 dark:text-gray-300 mb-6">
        Are you sure you want to delete <strong>{{ deleteDialog.fileName }}</strong>?
      </p>

      <template #footer>
        <button @click="deleteDialog.show = false"
          class="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors">
          Cancel
        </button>
        <button @click="confirmDeleteFile"
          class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors">
          Delete File
        </button>
      </template>
    </Dialog>

    <!-- Share Dialog -->
    <Dialog v-model="shareDialog.show" size="md" title="Share Your Code"
      subtitle="Select a file to share and create a link" icon="ph:share-network" icon-variant="info" :theme="theme">
      <div class="space-y-4">
        <!-- Expiration Info -->
        <div v-if="!shareDialog.shareUrl" :class="[
          'p-3 rounded-lg text-sm flex items-start space-x-2',
          theme === 'dark' ? 'bg-yellow-900/20 text-yellow-300' : 'bg-yellow-50 text-yellow-800'
        ]">
          <Icon icon="ph:clock" class="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>Share links expire after 1 hour for security.</span>
        </div>

        <!-- File Selection (Radio buttons for single selection) -->
        <div v-if="!shareDialog.shareUrl">
          <label :class="['block text-sm font-medium mb-3', theme === 'dark' ? 'text-gray-300' : 'text-gray-700']">
            Select a File to Share
          </label>
          <div class="space-y-2 max-h-60 overflow-y-auto">
            <label v-for="file in files" :key="file.id" :class="[
              'flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors',
              shareDialog.selectedFile === file.id
                ? theme === 'dark'
                  ? 'bg-python-blue-900/30 border-2 border-python-blue-600'
                  : 'bg-python-blue-50 border-2 border-python-blue-500'
                : theme === 'dark'
                  ? 'bg-gray-800 border-2 border-gray-700 hover:border-gray-600'
                  : 'bg-gray-50 border-2 border-gray-200 hover:border-gray-300'
            ]">
              <input type="radio" :checked="shareDialog.selectedFile === file.id"
                @change="shareDialog.selectedFile = file.id" class="w-4 h-4 text-python-blue-600" name="share-file" />
              <span :class="['flex-1 text-sm font-medium', theme === 'dark' ? 'text-gray-200' : 'text-gray-800']">
                {{ file.name }}
              </span>
            </label>
          </div>
        </div>

        <!-- Share URL Display -->
        <div v-if="shareDialog.shareUrl" class="space-y-3">
          <div :class="[
            'p-4 rounded-lg border',
            theme === 'dark' ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'
          ]">
            <div class="flex items-center space-x-2 mb-2">
              <Icon icon="ph:check-circle-fill" :class="[
                'w-5 h-5',
                theme === 'dark' ? 'text-green-400' : 'text-green-600'
              ]" />
              <span :class="[
                'font-semibold',
                theme === 'dark' ? 'text-green-300' : 'text-green-800'
              ]">
                Share link created!
              </span>
            </div>
            <p :class="['text-sm', theme === 'dark' ? 'text-green-200' : 'text-green-700']">
              Anyone with this link can view and run your code. Link expires in 1 hour.
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2" :class="theme === 'dark' ? 'text-gray-300' : 'text-gray-700'">
              Share URL
            </label>
            <div class="flex space-x-2">
              <input :value="shareDialog.shareUrl" readonly :class="[
                'flex-1 px-3 py-2 rounded-lg text-sm border font-mono',
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-gray-300'
                  : 'bg-gray-50 border-gray-300 text-gray-700'
              ]" />
              <button @click="copyShareUrl" :class="[
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                shareDialog.copied
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-python-blue-600 hover:bg-python-blue-700',
                'text-white'
              ]">
                <Icon :icon="shareDialog.copied ? 'ph:check' : 'ph:copy'" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <button v-if="!shareDialog.shareUrl" @click="shareDialog.show = false"
          class="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors">
          Cancel
        </button>
        <button v-if="!shareDialog.shareUrl" @click="createShareLink"
          :disabled="!shareDialog.selectedFile || shareDialog.isCreating" :class="[
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            !shareDialog.selectedFile || shareDialog.isCreating
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : 'bg-python-blue-600 hover:bg-python-blue-700 text-white'
          ]">
          <Icon v-if="shareDialog.isCreating" icon="ph:spinner" class="w-4 h-4 inline animate-spin mr-2" />
          {{ shareDialog.isCreating ? 'Creating...' : 'Create Link' }}
        </button>
        <button v-if="shareDialog.shareUrl" @click="shareDialog.show = false"
          class="px-4 py-2 bg-python-blue-600 hover:bg-python-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
          Done
        </button>
      </template>
    </Dialog>

    <!-- Settings Dialog -->
    <Dialog v-model="showSettingsDialog" size="lg" title="Editor Settings" subtitle="Configure Monaco editor options"
      icon="ph:gear" icon-variant="info" :theme="theme">
      <div class="space-y-4">
        <!-- Font Size -->
        <div>
          <label :class="['block text-sm font-medium mb-2', theme === 'dark' ? 'text-gray-300' : 'text-gray-700']">
            Font Size: {{ editorSettings.fontSize }}px
          </label>
          <input v-model.number="editorSettings.fontSize" type="range" min="10" max="24" step="1"
            class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer" />
        </div>

        <!-- Line Numbers -->
        <div>
          <label :class="['block text-sm font-medium mb-2', theme === 'dark' ? 'text-gray-300' : 'text-gray-700']">
            Line Numbers
          </label>
          <select v-model="editorSettings.lineNumbers" :class="[
            'w-full px-3 py-2 rounded-lg border',
            theme === 'dark'
              ? 'bg-gray-800 border-gray-700 text-gray-300'
              : 'bg-white border-gray-300 text-gray-700'
          ]">
            <option value="on">On</option>
            <option value="off">Off</option>
            <option value="relative">Relative</option>
          </select>
        </div>

        <!-- Word Wrap -->
        <div>
          <label :class="['block text-sm font-medium mb-2', theme === 'dark' ? 'text-gray-300' : 'text-gray-700']">
            Word Wrap
          </label>
          <select v-model="editorSettings.wordWrap" :class="[
            'w-full px-3 py-2 rounded-lg border',
            theme === 'dark'
              ? 'bg-gray-800 border-gray-700 text-gray-300'
              : 'bg-white border-gray-300 text-gray-700'
          ]">
            <option value="on">On</option>
            <option value="off">Off</option>
          </select>
        </div>

        <!-- Minimap -->
        <div class="flex items-center justify-between">
          <label :class="['text-sm font-medium', theme === 'dark' ? 'text-gray-300' : 'text-gray-700']">
            Show Minimap
          </label>
          <button @click="editorSettings.minimap = !editorSettings.minimap" :class="[
            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
            editorSettings.minimap ? 'bg-python-blue-600' : 'bg-gray-300 dark:bg-gray-700'
          ]">
            <span :class="[
              'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
              editorSettings.minimap ? 'translate-x-6' : 'translate-x-1'
            ]" />
          </button>
        </div>

        <!-- Tab Size -->
        <div>
          <label :class="['block text-sm font-medium mb-2', theme === 'dark' ? 'text-gray-300' : 'text-gray-700']">
            Tab Size: {{ editorSettings.tabSize }}
          </label>
          <input v-model.number="editorSettings.tabSize" type="range" min="2" max="8" step="1"
            class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer" />
        </div>

        <!-- Insert Spaces -->
        <div class="flex items-center justify-between">
          <label :class="['text-sm font-medium', theme === 'dark' ? 'text-gray-300' : 'text-gray-700']">
            Insert Spaces (instead of tabs)
          </label>
          <button @click="editorSettings.insertSpaces = !editorSettings.insertSpaces" :class="[
            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
            editorSettings.insertSpaces ? 'bg-python-blue-600' : 'bg-gray-300 dark:bg-gray-700'
          ]">
            <span :class="[
              'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
              editorSettings.insertSpaces ? 'translate-x-6' : 'translate-x-1'
            ]" />
          </button>
        </div>

        <!-- Render Whitespace -->
        <div>
          <label :class="['block text-sm font-medium mb-2', theme === 'dark' ? 'text-gray-300' : 'text-gray-700']">
            Show Whitespace
          </label>
          <select v-model="editorSettings.renderWhitespace" :class="[
            'w-full px-3 py-2 rounded-lg border',
            theme === 'dark'
              ? 'bg-gray-800 border-gray-700 text-gray-300'
              : 'bg-white border-gray-300 text-gray-700'
          ]">
            <option value="none">None</option>
            <option value="all">All</option>
            <option value="boundary">Boundary</option>
            <option value="selection">Selection</option>
          </select>
        </div>

        <!-- Cursor Style -->
        <div>
          <label :class="['block text-sm font-medium mb-2', theme === 'dark' ? 'text-gray-300' : 'text-gray-700']">
            Cursor Style
          </label>
          <select v-model="editorSettings.cursorStyle" :class="[
            'w-full px-3 py-2 rounded-lg border',
            theme === 'dark'
              ? 'bg-gray-800 border-gray-700 text-gray-300'
              : 'bg-white border-gray-300 text-gray-700'
          ]">
            <option value="line">Line</option>
            <option value="block">Block</option>
            <option value="underline">Underline</option>
            <option value="line-thin">Line Thin</option>
            <option value="block-outline">Block Outline</option>
            <option value="underline-thin">Underline Thin</option>
          </select>
        </div>
      </div>

      <template #footer>
        <button @click="applyEditorSettings"
          class="w-full px-4 py-3 bg-python-blue-600 hover:bg-python-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2">
          <Icon icon="ph:check" class="w-4 h-4" />
          <span>Apply Settings</span>
        </button>
      </template>
    </Dialog>

    <!-- Info Dialog (Custom, not using Dialog component) -->
    <div v-show="showInfoDialog"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
      @click="showInfoDialog = false">
      <div @click.stop :class="[
        'relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border transition-all duration-300 transform',
        'animate-in fade-in-0 zoom-in-95 duration-300',
        'max-w-xl w-full mx-4',
        theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
      ]" style="animation-fill-mode: both;">
        <!-- Header -->
        <div :class="[
          'flex items-center justify-between p-6 border-b',
          theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
        ]">
          <div class="flex items-center space-x-3">
            <div :class="[
              'w-10 h-10 rounded-full flex items-center justify-center',
              'bg-blue-100 dark:bg-blue-900/30'
            ]">
              <Icon icon="ph:info" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 :class="[
                'text-lg font-semibold',
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              ]">
                PyBadu Information
              </h3>
              <p :class="[
                'text-sm',
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              ]">
                Notes and tips about code execution
              </p>
            </div>
          </div>

          <button @click="showInfoDialog = false" :class="[
            'p-2 rounded-lg transition-colors',
            theme === 'dark'
              ? 'hover:bg-gray-800 text-gray-400 hover:text-gray-200'
              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
          ]">
            <Icon icon="ph:x" class="w-5 h-5" />
          </button>
        </div>

        <!-- Content -->
        <div class="p-6">
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
                <li><strong>Native Dependencies:</strong> Some C extensions may not work</li>
              </ul>
            </div>

            <div>
              <h4 class="font-semibold mb-2">How Code Execution Works</h4>

              <p class="text-sm leading-relaxed mb-2">
                Each compiler page automatically imports the main library and common submodules in the background.
                However,
                if you encounter import errors for specific submodules (e.g., <code
                  :class="[theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-gray-200 text-gray-800', 'px-1 rounded']">NameError:
              name 'LinearRegression' is not defined</code>), you can manually import them at the beginning of your
                code. For example, add <code
                  :class="[theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-gray-200 text-gray-800', 'px-1 rounded']">from
              sklearn.linear_model import LinearRegression</code> to import specific classes or functions.
              </p>
              <h4 class="font-semibold mb-2 mt-4">Tips for Best Results</h4>
              <p class="text-sm leading-relaxed mb-2">
                Use <strong>Shift + Enter</strong> to quickly run your code. Keep computations lightweight for faster
                execution and use print() statements to debug your code.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notifications -->
    <Toast :toasts="toasts" @remove="removeToast" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue'
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
const showMobileMenu = ref(false)
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

// Share dialog - new version with file selection
const shareDialog = ref({
  show: false,
  selectedFile: null, // Changed to single file selection
  isCreating: false,
  shareUrl: '',
  shareId: '',
  copied: false // Track if URL was copied
})

// Rename state
const editingFileId = ref(null)
const editingFileName = ref('')

// Info dialog
const showInfoDialog = ref(false)

// Settings dialog and Monaco editor options
const showSettingsDialog = ref(false)
const editorSettings = ref({
  fontSize: 14,
  lineNumbers: 'on',
  minimap: false,
  wordWrap: 'on',
  tabSize: 4,
  insertSpaces: true,
  renderWhitespace: 'none',
  fontFamily: 'Consolas, "Courier New", monospace',
  cursorStyle: 'line'
})

// Computed Monaco options for reactivity
const monacoOptions = computed(() => ({
  fontSize: editorSettings.value.fontSize,
  minimap: { enabled: editorSettings.value.minimap },
  scrollBeyondLastLine: false,
  wordWrap: editorSettings.value.wordWrap,
  lineNumbers: editorSettings.value.lineNumbers,
  folding: true,
  automaticLayout: true,
  tabSize: editorSettings.value.tabSize,
  insertSpaces: editorSettings.value.insertSpaces,
  renderWhitespace: editorSettings.value.renderWhitespace,
  fontFamily: editorSettings.value.fontFamily,
  cursorStyle: editorSettings.value.cursorStyle
}))

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
  // Get original file first
  const originalFile = props.files.find(f => f.id === fileId)
  if (!originalFile) {
    cancelRename()
    return
  }

  // Extract and preserve the original extension
  const originalName = originalFile.name
  const dotIndex = originalName.lastIndexOf('.')
  const extension = dotIndex > 0 ? originalName.substring(dotIndex) : '.py'

  // Get the current input value
  const trimmedName = editingFileName.value?.trim() || ''

  // If input is empty, use the original name without extension
  let newNameWithoutExt = trimmedName
  if (!newNameWithoutExt) {
    // If user cleared the input, restore original name
    const originalNameWithoutExt = dotIndex > 0 ? originalName.substring(0, dotIndex) : originalName.replace(extension, '')
    newNameWithoutExt = originalNameWithoutExt
  }

  // Remove extension if user included it in the input
  if (newNameWithoutExt.includes('.')) {
    newNameWithoutExt = newNameWithoutExt.substring(0, newNameWithoutExt.lastIndexOf('.'))
  }

  // Validate file name is not empty after processing
  if (!newNameWithoutExt || newNameWithoutExt.length === 0) {
    showToast('File name cannot be empty', 'error')
    cancelRename()
    return
  }

  // Validate file name length (max 8 characters, excluding extension)
  if (newNameWithoutExt.length > 8) {
    showToast('File name must be 8 characters or less', 'error')
    cancelRename()
    return
  }

  const newName = newNameWithoutExt + extension

  // Only emit if name actually changed
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

function openShareDialog() {
  // Reset dialog state
  shareDialog.value = {
    show: true,
    selectedFile: props.files[0]?.id || null, // Select first file by default
    isCreating: false,
    shareUrl: '',
    shareId: '',
    copied: false
  }
}

// No longer needed - radio buttons handle selection directly
// function toggleFileSelection is removed

async function createShareLink() {
  if (!shareDialog.value.selectedFile) {
    showToast('Please select a file to share', 'warning')
    return
  }

  shareDialog.value.isCreating = true

  try {
    // Get selected file
    const fileToShare = props.files.find(f => f.id === shareDialog.value.selectedFile)

    if (!fileToShare) {
      throw new Error('Selected file not found')
    }

    // Get library name from props or current route
    const libraryName = props.libraryName || 'python'

    // Create share payload matching the Go API
    // Convert ID to string to match Go struct expectations
    const shareData = {
      compiler_type: libraryName.toLowerCase(),
      files: [{
        id: String(fileToShare.id), // Convert to string
        name: fileToShare.name,
        content: fileToShare.content
      }]
    }

    // Get API base URL from runtime config
    const config = useRuntimeConfig()
    const apiBaseUrl = config.public.apiBaseUrl || 'http://localhost:8080'

    // Call Golang API to create share
    const response = await fetch(`${apiBaseUrl}/pybadu/share`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(shareData)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to create share link')
    }

    const result = await response.json()

    // Set share URL with query params
    const baseUrl = window.location.origin
    shareDialog.value.shareUrl = `${baseUrl}/pybadu/share?id=${result.id}`
    shareDialog.value.shareId = result.id

    showToast('Share link created successfully!', 'success')
  } catch (error) {
    console.error('Error creating share link:', error)
    showToast(error.message || 'Failed to create share link', 'error')
  } finally {
    shareDialog.value.isCreating = false
  }
}

function copyShareUrl() {
  if (shareDialog.value.shareUrl) {
    navigator.clipboard.writeText(shareDialog.value.shareUrl)
    shareDialog.value.copied = true
    showToast('Link copied to clipboard', 'success')

    // Reset copied state after 2 seconds
    setTimeout(() => {
      shareDialog.value.copied = false
    }, 2000)
  }
}

function applyEditorSettings() {
  // Settings are already reactive via computed property
  // Just close the dialog and show confirmation
  showSettingsDialog.value = false
  showToast('Editor settings applied successfully', 'success')
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