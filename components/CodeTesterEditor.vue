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
                    <img :src="theme === 'dark' ? '/logo-light.png' : '/logo.png'" alt="Pybadu Logo"
                        class="w-6 h-6 rounded-lg" />
                </NuxtLink>
                <div class="hidden sm:flex items-center space-x-2">
                    <span :class="[
                        'font-semibold',
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                    ]">Python Code Tester</span>
                </div>
            </div>

            <!-- Right: Actions -->
            <div class="flex items-center space-x-2">
                <!-- Run Button -->
                <button @click="runCodeWithValidation" :disabled="isLoading || !pyodideReady" :class="[
                    'flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                    isLoading || !pyodideReady
                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                        : theme === 'dark'
                            ? 'bg-python-blue-600 hover:bg-python-blue-700 text-white'
                            : 'bg-python-blue-600 hover:bg-python-blue-700 text-white'
                ]">
                    <Icon :icon="!pyodideReady || isLoading ? 'ph:spinner' : 'ph:play'"
                        :class="['w-4 h-4', !pyodideReady || isLoading ? 'animate-spin' : '']" />
                    <span class="hidden sm:inline">{{ !pyodideReady ? 'Loading' : isLoading ? 'Running' : 'Run'
                    }}</span>
                </button>

                <!-- Theme Toggle -->
                <button @click="toggleTheme" :class="[
                    'flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                    theme === 'dark'
                        ? 'bg-python-blue-600 hover:bg-python-blue-700 text-white'
                        : 'bg-python-blue-600 hover:bg-python-blue-700 text-white'
                ]">
                    <Icon :icon="theme === 'dark' ? 'ph:sun' : 'ph:moon'" class="w-4 h-4" />
                    <span class="hidden sm:inline">{{ theme === 'dark' ? 'Light' : 'Dark' }}</span>
                </button>
            </div>
        </header>

        <!-- Main Layout -->
        <div class="flex-1 flex overflow-hidden">
            <!-- Code Editor -->
            <section class="w-full lg:w-[40%] h-[calc(100vh-52px)] flex flex-col" :class="[
                'border-r',
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
                        <span>Code Editor</span>
                    </div>

                    <div class="flex items-center space-x-2">
                        <!-- Examples Dropdown -->
                        <select @change="loadExampleFromSelect" :class="[
                            'text-xs px-2 py-1 rounded transition-colors border',
                            theme === 'dark'
                                ? 'bg-gray-700 border-gray-600 text-gray-300'
                                : 'bg-white border-gray-300 text-gray-700'
                        ]">
                            <option value="">Load Example...</option>
                            <option v-for="(example, index) in examples" :key="index" :value="index">
                                {{ example.title }}
                            </option>
                        </select>

                        <button @click="clearCode" :class="[
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
                    <MonacoEditor ref="editorRef" :model-value="currentFileContent"
                        @update:model-value="updateCurrentFile" :language="'python'" :theme="monacoTheme"
                        :options="monacoOptions" height="100%" class="h-full w-full" />
                </div>
            </section>

            <!-- Output Panel -->
            <section :class="[
                'w-full lg:w-[35%] h-[calc(100vh-52px)] flex flex-col border-r',
                theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'
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
                        <span>Testing Result</span>
                        <div v-if="output.length > 0" :class="[
                            'px-1.5 py-0.5 rounded text-xs',
                            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                        ]">
                            {{ output.length }}
                        </div>
                    </div>

                    <button @click="clearOutput" :class="[
                        'text-xs px-2 py-1 rounded transition-colors',
                        theme === 'dark'
                            ? 'hover:bg-gray-700 text-gray-400'
                            : 'hover:bg-gray-200 text-gray-600'
                    ]">
                        Clear
                    </button>
                </div>

                <!-- Output Content -->
                <div class="flex-1 overflow-y-auto p-4 space-y-3">
                    <div v-for="(item, index) in output" :key="index" :class="[
                        'rounded-lg text-sm p-3',
                        item.type === 'error'
                            ? theme === 'dark' ? 'bg-red-900/30 text-red-300 border border-red-800' : 'bg-red-50 text-red-700 border border-red-200'
                            : item.type === 'success'
                                ? theme === 'dark' ? 'bg-green-900/30 text-green-300 border border-green-800' : 'bg-green-50 text-green-700 border border-green-200'
                                : item.type === 'info'
                                    ? theme === 'dark' ? 'bg-blue-900/30 text-blue-300 border border-blue-800' : 'bg-blue-50 text-blue-700 border border-blue-200'
                                    : theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                    ]">
                        <div class="relative">
                            <pre class="whitespace-pre-wrap font-mono text-xs leading-relaxed">{{ item.content }}</pre>
                            <span class="absolute top-0 right-0 text-xs opacity-60 px-2 pb-1 rounded">{{ item.timestamp
                            }}</span>
                        </div>
                    </div>

                    <div v-if="output.length === 0" :class="[
                        'h-full flex items-center justify-center text-center py-8 text-sm',
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    ]">
                        <div class="flex flex-col items-center justify-center">
                            <Icon icon="ph:terminal" class="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p>Run your Python code to see output here</p>
                            <p class="text-xs mt-2">Press <kbd class="px-2 py-1 bg-gray-700 rounded">Shift + Enter</kbd>
                                to run</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Ads Panel -->
            <section :class="[
                'hidden lg:flex flex-col',
                'w-full lg:w-[25%]',
                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
            ]">
                <!-- Ads Content -->
                <div class="flex-1 overflow-y-auto p-2 lg:p-4">
                    <ClientOnly>
                        <!-- Square Ad -->
                        <div class="mb-4 flex justify-center">
                            <Adsense key="code-tester-ad-1" client="ca-pub-1356911639243870" ad-slot="3430238458"
                                kind="square"
                                :style="{ display: 'inline-block', width: '100%', maxWidth: '300px', height: '300px' }" />
                        </div>
                    </ClientOnly>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { Icon } from '@iconify/vue'
import MonacoEditor from '~/components/MonacoEditor.vue'
import Adsense from '~/components/Adsense.vue'

defineOptions({
    name: 'CodeTesterEditor'
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
    'loadExample'
])

const editorRef = ref(null)

const currentFileContent = computed({
    get: () => props.code,
    set: (value) => emit('update:code', value)
})

const monacoOptions = computed(() => ({
    fontSize: 14,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    wordWrap: 'on',
    lineNumbers: 'on',
    folding: true,
    automaticLayout: true,
    tabSize: 4,
    insertSpaces: true
}))

function updateCurrentFile(content) {
    emit('update:code', content)
}

function clearCode() {
    emit('clearCode')
}

function clearOutput() {
    emit('clearOutput')
}

function toggleTheme() {
    emit('toggleTheme')
}

function loadExampleFromSelect(event) {
    const index = parseInt(event.target.value)
    if (!isNaN(index) && props.examples[index]) {
        emit('loadExample', props.examples[index])
        event.target.value = '' // Reset select
    }
}

// Parse Python error messages to extract line numbers
function parseErrorLineNumber(errorMessage) {
    // Match patterns like: File "<exec>", line 5
    const lineMatch = errorMessage.match(/line (\d+)/i)
    if (lineMatch) {
        return parseInt(lineMatch[1])
    }
    return null
}

// Highlight error line in Monaco editor
function highlightErrorLine(lineNumber) {
    if (!editorRef.value) return

    // Access the Monaco editor instance through the ref
    nextTick(() => {
        try {
            const monacoInstance = editorRef.value.$refs?.editorRef
            if (monacoInstance && monacoInstance.editor) {
                const editor = monacoInstance.editor
                const monaco = monacoInstance.monaco

                if (editor && monaco) {
                    const model = editor.getModel()
                    if (model) {
                        // Set error marker
                        monaco.editor.setModelMarkers(model, 'python-error', [{
                            startLineNumber: lineNumber,
                            startColumn: 1,
                            endLineNumber: lineNumber,
                            endColumn: model.getLineMaxColumn(lineNumber),
                            message: 'Error occurred on this line',
                            severity: monaco.MarkerSeverity.Error
                        }])

                        // Scroll to error line
                        editor.revealLineInCenter(lineNumber)
                    }
                }
            }
        } catch (error) {
            console.error('Error highlighting line:', error)
        }
    })
}

// Watch for error output and highlight the line
watch(() => props.output, (newOutput) => {
    if (!newOutput || newOutput.length === 0) return

    // Find the last error in output
    const lastError = [...newOutput].reverse().find(item => item.type === 'error')
    if (lastError) {
        const lineNumber = parseErrorLineNumber(lastError.content)
        if (lineNumber) {
            highlightErrorLine(lineNumber)
        }
    }
}, { deep: true })

async function runCodeWithValidation() {
    // Clear any previous error markers before running
    if (editorRef.value) {
        try {
            const monacoInstance = editorRef.value.$refs?.editorRef
            if (monacoInstance && monacoInstance.editor && monacoInstance.monaco) {
                const model = monacoInstance.editor.getModel()
                if (model) {
                    monacoInstance.monaco.editor.setModelMarkers(model, 'python-error', [])
                }
            }
        } catch (error) {
            // Ignore errors
        }
    }

    emit('runCode')
}

// Keyboard shortcuts
onMounted(() => {
    const handleKeyDown = (e) => {
        if (e.shiftKey && e.key === 'Enter' && !props.isLoading && props.pyodideReady) {
            e.preventDefault()
            runCodeWithValidation()
        }
    }

    window.addEventListener('keydown', handleKeyDown)

    onBeforeUnmount(() => {
        window.removeEventListener('keydown', handleKeyDown)
    })
})
</script>
