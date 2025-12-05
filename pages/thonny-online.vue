<template>
    <div :class="['min-h-screen flex flex-col', theme === 'light' ? 'bg-gray-100' : 'bg-gray-900']"
        style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">

        <!-- Toolbar with icon buttons (no menu bar) -->
        <div
            :class="['flex items-center px-2 py-2 border-b space-x-1', theme === 'light' ? 'bg-gray-100 border-gray-300' : 'bg-gray-800 border-gray-700']">
            <!-- File operations -->
            <button :class="toolbarButtonClass" title="New file" @click="createNewFile">
                <Icon icon="ph:file-plus" class="w-5 h-5" />
            </button>
            <button :class="toolbarButtonClass" title="Save" @click="saveFile">
                <Icon icon="ph:floppy-disk" class="w-5 h-5" />
            </button>

            <div class="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>

            <!-- Run controls -->
            <button :class="[toolbarButtonClass, 'text-green-600 dark:text-green-400']" title="Run (F5)"
                @click="runCode" :disabled="!pyodideReady || isLoading">
                <Icon :icon="isLoading ? 'ph:spinner' : 'ph:play-fill'"
                    :class="['w-5 h-5', isLoading ? 'animate-spin' : '']" />
            </button>
            <button :class="[toolbarButtonClass, 'text-red-600 dark:text-red-400']" title="Stop" @click="stopExecution"
                :disabled="!isLoading">
                <Icon icon="ph:stop-fill" class="w-5 h-5" />
            </button>

            <div class="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>

            <!-- View controls -->
            <button :class="toolbarButtonClass" title="Toggle Variables" @click="showVariables = !showVariables">
                <Icon icon="ph:list-bullets" class="w-5 h-5" />
            </button>

            <div class="flex-1"></div>

            <!-- Status -->
            <div
                :class="['text-xs px-3 py-1 rounded', pyodideReady ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400']">
                {{ pyodideReady ? 'Python 3.11 Ready' : 'Loading Python...' }}
            </div>
        </div>

        <!-- File tabs -->
        <div
            :class="['flex items-center px-2 border-b', theme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-800 border-gray-700']">
            <div v-for="file in files" :key="file.id" :class="['flex items-center space-x-2 px-3 py-1.5 border-r cursor-pointer text-sm',
                activeFileId === file.id
                    ? theme === 'light' ? 'bg-gray-50 border-gray-300' : 'bg-gray-700 border-gray-600'
                    : theme === 'light' ? 'bg-gray-100 border-gray-200 hover:bg-gray-50' : 'bg-gray-800 border-gray-700 hover:bg-gray-700',
                theme === 'light' ? 'text-gray-800' : 'text-gray-200']" @click="selectFile(file.id)">
                <span>{{ file.name }}</span>
                <button v-if="files.length > 1" @click.stop="deleteFile(file.id)" class="hover:text-red-600">
                    <Icon icon="ph:x" class="w-3 h-3" />
                </button>
            </div>
        </div>

        <!-- Main Content: 2-row layout (Editor on top, Shell on bottom) -->
        <div class="flex-1 flex flex-col overflow-hidden">
            <!-- Top Row: Editor + Variables (if shown) -->
            <div :style="{ height: `${editorHeight}%` }" class="flex border-b"
                :class="theme === 'light' ? 'border-gray-300' : 'border-gray-700'">
                <!-- Code Editor -->
                <div class="flex-1 flex flex-col">
                    <MonacoEditor v-model="currentFileContent" language="python"
                        :theme="theme === 'light' ? 'vs' : 'vs-dark'" :options="editorOptions" height="100%"
                        class="h-full w-full" />
                </div>

                <!-- Variables Panel (right side) -->
                <div v-if="showVariables"
                    :class="['w-80 border-l flex flex-col', theme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-800 border-gray-700']">
                    <div
                        :class="['px-3 py-1.5 border-b text-sm font-medium', theme === 'light' ? 'bg-gray-50 border-gray-300 text-gray-700' : 'bg-gray-800 border-gray-700 text-gray-300']">
                        Variables
                    </div>
                    <div class="flex-1 overflow-y-auto">
                        <div v-if="variables.length === 0"
                            :class="['text-center py-8 px-4 text-sm', theme === 'light' ? 'text-gray-500' : 'text-gray-400']">
                            <Icon icon="ph:list-bullets" class="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p>No variables</p>
                        </div>
                        <table v-else class="w-full text-xs">
                            <thead :class="['sticky top-0', theme === 'light' ? 'bg-gray-50' : 'bg-gray-800']">
                                <tr
                                    :class="theme === 'light' ? 'border-b border-gray-200' : 'border-b border-gray-700'">
                                    <th class="text-left px-2 py-1.5 font-medium">Name</th>
                                    <th class="text-left px-2 py-1.5 font-medium">Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(variable, index) in variables" :key="index"
                                    :class="['border-b', theme === 'light' ? 'border-gray-100' : 'border-gray-700']">
                                    <td
                                        :class="['px-2 py-1.5 font-mono', theme === 'light' ? 'text-blue-600' : 'text-blue-400']">
                                        {{ variable.name }}
                                    </td>
                                    <td :class="['px-2 py-1.5 font-mono truncate max-w-[180px]', theme === 'light' ? 'text-gray-700' : 'text-gray-300']"
                                        :title="variable.value">
                                        {{ variable.value }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Resize Handle -->
            <div :class="['h-1 cursor-row-resize hover:bg-blue-500 transition-colors', theme === 'light' ? 'bg-gray-300' : 'bg-gray-700']"
                @mousedown="startResize"></div>

            <!-- Bottom Row: Shell -->
            <div :style="{ height: `${100 - editorHeight}%` }"
                :class="['flex flex-col', theme === 'light' ? 'bg-white' : 'bg-gray-900']">
                <!-- Shell Header -->
                <div
                    :class="['flex items-center justify-between px-3 py-1.5 border-b text-sm', theme === 'light' ? 'bg-gray-50 border-gray-300 text-gray-700' : 'bg-gray-800 border-gray-700 text-gray-300']">
                    <div class="flex items-center space-x-2">
                        <Icon icon="ph:terminal" class="w-4 h-4" />
                        <span class="font-medium">Shell</span>
                    </div>
                    <button @click="clearOutput"
                        :class="['text-xs px-2 py-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700', theme === 'light' ? 'text-gray-600' : 'text-gray-400']">
                        Clear
                    </button>
                </div>

                <!-- Shell Content -->
                <div
                    :class="['flex-1 overflow-y-auto p-3 font-mono text-sm', theme === 'light' ? 'bg-white text-gray-800' : 'bg-gray-900 text-gray-200']">
                    <div v-if="output.length === 0"
                        :class="['text-center py-8', theme === 'light' ? 'text-gray-400' : 'text-gray-600']">
                        <p class="text-sm">Python 3.11.3</p>
                        <p class="text-xs mt-1">&gt;&gt;&gt; </p>
                    </div>
                    <div v-for="(item, index) in output" :key="index"
                        :class="['mb-1 whitespace-pre-wrap', item.type === 'error' ? 'text-red-600 dark:text-red-400' : theme === 'light' ? 'text-gray-800' : 'text-gray-200']">
                        {{ item.content }}</div>
                </div>
            </div>
        </div>

        <!-- Toast Notifications -->
        <Toast :toasts="toasts" @remove="removeToast" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useHead } from '#app'
import { Icon } from '@iconify/vue'
import MonacoEditor from '~/components/MonacoEditor.vue'
import Toast from '~/components/ui/Toast.vue'

defineOptions({
    name: 'ThonnyOnline'
})

definePageMeta({
    layout: 'default'
})

useHead({
    title: 'Thonny Online - Python IDE for Beginners',
    meta: [
        { name: 'description', content: 'Learn Python with Thonny Online - a beginner-friendly Python IDE that runs in your browser.' },
        { name: 'keywords', content: 'thonny, python ide, learn python, python for beginners, online python editor' }
    ]
})

// State
const theme = ref('light')
const pyodideReady = ref(false)
const isLoading = ref(false)
const activeFileId = ref(1)
const output = ref([])
const variables = ref([])
const toasts = ref([])
const showVariables = ref(true)
const editorHeight = ref(65) // 65% for editor, 35% for shell
let toastId = 0

// Files
const files = ref([
    {
        id: 1,
        name: '<untitled>',
        content: `def celsius_to_fahrenheit(celsius):
    """Convert Celsius to Fahrenheit."""
    return (celsius * 9/5) + 32

# Ask the user for input
temp_c = float(input("Enter temperature in Celsius: "))

# Process
temp_f = celsius_to_fahrenheit(temp_c)

# Output the result
print(f"{temp_c}°C is equal to {temp_f}°F")
`
    }
])

// Computed
const currentFile = computed(() => files.value.find(f => f.id === activeFileId.value))
const currentFileContent = computed({
    get: () => currentFile.value?.content || '',
    set: (value) => {
        if (currentFile.value) {
            currentFile.value.content = value
        }
    }
})

const toolbarButtonClass = computed(() => [
    'p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
    theme.value === 'light' ? 'text-gray-700' : 'text-gray-300'
])

// Editor options
const editorOptions = {
    fontSize: 13,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    wordWrap: 'off',
    lineNumbers: 'on',
    folding: true,
    automaticLayout: true,
    tabSize: 4,
    insertSpaces: true,
    renderWhitespace: 'none',
    fontFamily: '"Courier New", Courier, monospace',
    cursorStyle: 'line',
    lineHeight: 18
}

// Pyodide worker
let pyodideWorker = null
let messageId = 0
const pendingMessages = new Map()

// Resize functionality
let isResizing = false

function startResize(e) {
    isResizing = true
    document.addEventListener('mousemove', handleResize)
    document.addEventListener('mouseup', stopResize)
    e.preventDefault()
}

function handleResize(e) {
    if (!isResizing) return
    const container = e.currentTarget
    const containerRect = document.querySelector('.flex-1.flex.flex-col.overflow-hidden').getBoundingClientRect()
    const newHeight = ((e.clientY - containerRect.top) / containerRect.height) * 100
    editorHeight.value = Math.min(Math.max(newHeight, 20), 80) // Limit between 20% and 80%
}

function stopResize() {
    isResizing = false
    document.removeEventListener('mousemove', handleResize)
    document.removeEventListener('mouseup', stopResize)
}

// Worker message handling
function requestResponse(msg) {
    const id = messageId++
    const promise = new Promise((resolve, reject) => {
        const listener = (event) => {
            if (!event.data?.id || event.data.id !== id) return

            pyodideWorker.removeEventListener('message', listener)
            pendingMessages.delete(id)

            const { id: _, ...rest } = event.data

            if (rest.error) {
                reject(new Error(rest.error))
            } else {
                resolve(rest)
            }
        }

        pyodideWorker.addEventListener('message', listener)
        pendingMessages.set(id, { resolve, reject, listener })
    })

    pyodideWorker.postMessage({ id, ...msg })
    return promise
}

// Functions
function selectFile(fileId) {
    activeFileId.value = fileId
}

function createNewFile() {
    const newId = Math.max(...files.value.map(f => f.id)) + 1
    files.value.push({
        id: newId,
        name: `<untitled-${newId}>`,
        content: '# New Python file\n\n'
    })
    activeFileId.value = newId
    showToast('New file created', 'success')
}

function deleteFile(fileId) {
    if (files.value.length <= 1) {
        showToast('Cannot delete the last file', 'warning')
        return
    }
    files.value = files.value.filter(f => f.id !== fileId)
    if (activeFileId.value === fileId) {
        activeFileId.value = files.value[0].id
    }
}

function clearOutput() {
    output.value = []
    variables.value = []
}

function saveFile() {
    localStorage.setItem('thonny-files', JSON.stringify(files.value))
    showToast('File saved', 'success')
}

async function runCode() {
    if (!pyodideReady.value || isLoading.value || !currentFileContent.value.trim()) return

    isLoading.value = true
    output.value = []
    variables.value = []

    try {
        // Initialize Pyodide if needed
        await requestResponse({ type: 'INIT_PYODIDE' })

        // Run Python code
        const response = await requestResponse({
            type: 'RUN_PYTHON',
            data: {
                code: currentFileContent.value
            }
        })

        // Handle stdout
        if (response.result?.stdout) {
            addOutput(response.result.stdout.trim(), 'print')
        }

        // Extract variables from globals
        if (response.result?.globals) {
            updateVariables(response.result.globals)
        }

        addOutput('✓ Code executed successfully', 'success')
    } catch (error) {
        console.error('Error running Python code:', error)
        addOutput(`Error: ${error.message}`, 'error')
    } finally {
        isLoading.value = false
    }
}

function stopExecution() {
    if (pyodideWorker) {
        pyodideWorker.terminate()
        initializePyodide()
        isLoading.value = false
        addOutput('Execution stopped', 'error')
    }
}

function addOutput(content, type = 'print') {
    if (content) {
        output.value.push({ content, type })
    }
}

function updateVariables(globals) {
    if (!globals) return

    variables.value = Object.entries(globals)
        .filter(([name]) => !name.startsWith('_') && !name.startsWith('__'))
        .map(([name, value]) => ({
            name,
            value: String(value).substring(0, 100) // Limit length
        }))
}

function showToast(message, type = 'info') {
    const id = toastId++
    toasts.value.push({ id, message, type })
    setTimeout(() => removeToast(id), 3000)
}

function removeToast(id) {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
        toasts.value.splice(index, 1)
    }
}

async function initializePyodide() {
    try {
        // Get baseURL for subpath support
        let baseURL = ''
        if (typeof window !== 'undefined') {
            const pathParts = window.location.pathname.split('/').filter(p => p)
            if (pathParts.length > 0 && pathParts[0] === 'pybadu') {
                baseURL = '/pybadu'
            }
        }

        const workerPath = `${baseURL}/workers/pyodide-worker.js`
        console.log('Loading Pyodide worker from:', workerPath)

        pyodideWorker = new Worker(workerPath, { type: 'module' })

        pyodideWorker.addEventListener('message', (event) => {
            const { type, id } = event.data

            // Handle messages without ID (like PYODIDE_READY)
            if (!id) {
                if (type === 'PYODIDE_READY') {
                    pyodideReady.value = true
                    console.log('Pyodide ready!')
                }
                return
            }

            // Handle messages with ID (request/response)
            const pending = pendingMessages.get(id)
            if (pending) {
                pending.listener(event)
            }
        })

        pyodideWorker.addEventListener('error', (error) => {
            console.error('Pyodide worker error:', error)
            showToast('Worker error', 'error')
        })

        // Initialize Pyodide
        await requestResponse({ type: 'INIT_PYODIDE' })
    } catch (error) {
        console.error('Failed to initialize Pyodide:', error)
        showToast('Failed to load Python', 'error')
    }
}

// Lifecycle
onMounted(() => {
    const savedFiles = localStorage.getItem('thonny-files')
    if (savedFiles) {
        try {
            files.value = JSON.parse(savedFiles)
        } catch (e) {
            console.error('Failed to load saved files:', e)
        }
    }

    initializePyodide()

    const handleKeyDown = (e) => {
        if (e.key === 'F5') {
            e.preventDefault()
            runCode()
        }
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault()
            saveFile()
        }
    }

    window.addEventListener('keydown', handleKeyDown)

    onBeforeUnmount(() => {
        window.removeEventListener('keydown', handleKeyDown)
        if (pyodideWorker) {
            pyodideWorker.terminate()
        }
    })
})
</script>

<style scoped>
/* Match desktop app styling */
</style>
