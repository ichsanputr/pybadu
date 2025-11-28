<template>
    <div>
        <!-- Terminal Interface -->
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
                        ]">Python Terminal Online</span>
                    </div>
                </div>

                <!-- Right: Actions -->
                <div class="flex items-center space-x-2">
                    <!-- Clear Button -->
                    <button @click="clearTerminal" :class="[
                        'flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                        theme === 'dark'
                            ? 'bg-python-blue-600 hover:bg-python-blue-700 text-white'
                            : 'bg-python-blue-600 hover:bg-python-blue-700 text-white'
                    ]">
                        <Icon icon="ph:trash" class="w-4 h-4" />
                        <span class="hidden sm:inline">Clear</span>
                    </button>

                    <!-- Reset Button -->
                    <button @click="resetPython" :disabled="!pyodideReady" :class="[
                        'flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                        !pyodideReady
                            ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                            : theme === 'dark'
                                ? 'bg-python-blue-600 hover:bg-python-blue-700 text-white'
                                : 'bg-python-blue-600 hover:bg-python-blue-700 text-white'
                    ]">
                        <Icon icon="ph:arrow-clockwise" class="w-4 h-4" />
                        <span class="hidden sm:inline">Reset</span>
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
                <!-- Terminal Panel -->
                <section class="w-full lg:w-[75%] h-[calc(100vh-52px)] flex flex-col" :class="[
                    'border-r',
                    theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                ]">
                    <!-- Terminal Header -->
                    <div :class="[
                        'flex items-center justify-between px-4 py-2 border-b text-sm',
                        theme === 'dark'
                            ? 'bg-gray-800/50 border-gray-700 text-gray-400'
                            : 'bg-gray-50 border-gray-200 text-gray-600'
                    ]">
                        <div class="flex items-center space-x-2">
                            <Icon icon="ph:terminal-window" class="w-4 h-4" />
                            <span>Python {{ pyodideReady ? '3.11' : 'Loading...' }}</span>
                            <div v-if="!pyodideReady" :class="[
                                'px-2 py-0.5 rounded text-xs',
                                'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                            ]">
                                Initializing...
                            </div>
                        </div>

                        <div class="text-xs opacity-60">
                            Type Python commands and press Enter
                        </div>
                    </div>

                    <!-- Terminal Content -->
                    <div ref="terminalContainer" @click="focusInput" :class="[
                        'flex-1 overflow-y-auto p-4 font-mono text-sm cursor-text',
                        theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'
                    ]">
                        <!-- Welcome Message -->
                        <div v-if="history.length === 0 && pyodideReady" class="mb-4 opacity-60">
                            <div>Python 3.11.3 (main, Nov 2024) [Pyodide WebAssembly]</div>
                            <div>Type "help", "copyright", "credits" or "license" for more information.</div>
                        </div>

                        <!-- Command History -->
                        <div v-for="(item, index) in history" :key="index" class="mb-2">
                            <!-- Input Line -->
                            <div v-if="item.type === 'input'" class="flex">
                                <span class="text-green-500 mr-2">&gt;&gt;&gt;</span>
                                <span>{{ item.content }}</span>
                            </div>

                            <!-- Output Line -->
                            <div v-else-if="item.type === 'output'" :class="[
                                'ml-6',
                                item.isError ? 'text-red-400' : 'text-gray-300'
                            ]">
                                <pre class="whitespace-pre-wrap">{{ item.content }}</pre>
                            </div>
                        </div>

                        <!-- Current Input Line -->
                        <div v-if="pyodideReady" class="flex items-start">
                            <span class="text-green-500 mr-2">&gt;&gt;&gt;</span>
                            <div class="flex-1 relative">
                                <input ref="terminalInput" v-model="currentInput" @keydown.enter="executeCommand"
                                    @keydown.up="navigateHistory('up')" @keydown.down="navigateHistory('down')"
                                    @keydown.tab.prevent="handleTab" :disabled="isExecuting" :class="[
                                        'w-full bg-transparent outline-none border-none',
                                        theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                                    ]" placeholder="Type Python code here..." autocomplete="off" spellcheck="false" />
                                <div v-if="isExecuting" class="absolute right-0 top-0">
                                    <Icon icon="ph:spinner" class="w-4 h-4 animate-spin text-python-blue-500" />
                                </div>
                            </div>
                        </div>

                        <!-- Loading State -->
                        <div v-if="!pyodideReady" class="flex items-center space-x-2 text-python-blue-500">
                            <Icon icon="ph:spinner" class="w-5 h-5 animate-spin" />
                            <span>Loading Python environment...</span>
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
                                <Adsense key="terminal-ad-1" client="ca-pub-1356911639243870" ad-slot="3430238458"
                                    kind="square"
                                    :style="{ display: 'inline-block', width: '100%', maxWidth: '300px', height: '300px' }" />
                            </div>
                        </ClientOnly>
                    </div>
                </section>
            </div>
        </div>

        <!-- Information Section -->
        <LibraryInfoSection>
            <div class="text-center mb-12">
                <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                    Python Terminal Online
                </h1>

                <div class="max-w-4xl mx-auto text-left space-y-6 text-gray-700 dark:text-gray-300">
                    <p class="text-base md:text-lg leading-relaxed">
                        Welcome to the <strong>Python Terminal Online</strong> – an interactive Python REPL
                        (Read-Eval-Print Loop)
                        that runs entirely in your browser. Execute Python commands line by line, just like using the
                        Python
                        interactive shell on your computer, but without any installation required.
                    </p>

                    <p class="text-base md:text-lg leading-relaxed">
                        This online Python terminal is powered by <strong>Pyodide WebAssembly</strong>, bringing the
                        full Python
                        interpreter to your browser. You can define variables, create functions, import modules, and
                        execute any
                        Python code interactively. The terminal maintains state between commands, so variables and
                        functions you
                        define remain available for subsequent commands.
                    </p>

                    <p class="text-base md:text-lg leading-relaxed">
                        Perfect for learning Python, testing code snippets, experimenting with algorithms, or teaching
                        Python
                        programming. The terminal supports command history navigation with arrow keys, tab completion,
                        and
                        multi-line input for complex statements.
                    </p>

                    <h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Features</h3>
                    <ul class="list-disc list-inside space-y-2 text-base md:text-lg ml-4">
                        <li><strong>Interactive REPL:</strong> Execute Python commands one at a time with immediate
                            feedback</li>
                        <li><strong>Persistent State:</strong> Variables and functions persist across commands</li>
                        <li><strong>Command History:</strong> Navigate previous commands with up/down arrow keys</li>
                        <li><strong>Full Python Support:</strong> Access to Python standard library and built-in
                            functions</li>
                        <li><strong>Error Handling:</strong> Clear error messages with traceback information</li>
                        <li><strong>Browser-Based:</strong> No installation, runs entirely in your browser</li>
                        <li><strong>Reset Anytime:</strong> Clear terminal or reset Python environment with one click
                        </li>
                    </ul>

                    <h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Quick Start
                        Examples</h3>
                    <div :class="[
                        'p-4 rounded-lg font-mono text-sm',
                        'bg-gray-100 dark:bg-gray-800'
                    ]">
                        <div class="space-y-2">
                            <div><span class="text-green-500">&gt;&gt;&gt;</span> print("Hello, World!")</div>
                            <div><span class="text-green-500">&gt;&gt;&gt;</span> x = 10</div>
                            <div><span class="text-green-500">&gt;&gt;&gt;</span> y = 20</div>
                            <div><span class="text-green-500">&gt;&gt;&gt;</span> print(f"Sum: {x + y}")</div>
                            <div><span class="text-green-500">&gt;&gt;&gt;</span> import math</div>
                            <div><span class="text-green-500">&gt;&gt;&gt;</span> math.sqrt(16)</div>
                        </div>
                    </div>

                    <h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Keyboard Shortcuts
                    </h3>
                    <ul class="list-disc list-inside space-y-2 text-base md:text-lg ml-4">
                        <li><kbd class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm">Enter</kbd> - Execute
                            command</li>
                        <li><kbd class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm">↑</kbd> - Previous
                            command in history</li>
                        <li><kbd class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm">↓</kbd> - Next command
                            in history</li>
                        <li><kbd class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm">Tab</kbd> -
                            Auto-completion (coming soon)</li>
                    </ul>

                    <h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Use Cases</h3>
                    <ul class="list-disc list-inside space-y-2 text-base md:text-lg ml-4">
                        <li>Learning Python programming interactively</li>
                        <li>Testing code snippets and algorithms quickly</li>
                        <li>Teaching Python in classrooms without setup</li>
                        <li>Debugging and experimenting with Python code</li>
                        <li>Quick calculations and data manipulation</li>
                        <li>Exploring Python libraries and modules</li>
                    </ul>
                </div>
            </div>
        </LibraryInfoSection>

        <AppFooter />
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useHead } from '#app'
import { Icon } from '@iconify/vue'
import LibraryInfoSection from '~/components/LibraryInfoSection.vue'
import Adsense from '~/components/Adsense.vue'
import AppFooter from '~/components/AppFooter.vue'

defineOptions({
    name: 'PythonTerminal'
})

definePageMeta({
    layout: 'library'
})

useHead({
    title: 'Python Terminal Online - Interactive Python REPL',
    meta: [
        { name: 'description', content: 'Free online Python terminal (REPL). Execute Python commands interactively in your browser. No installation required. Powered by Pyodide WebAssembly.' },
        { name: 'keywords', content: 'python terminal, python repl, online python, interactive python, python shell, python console, pyodide' },
        { name: 'author', content: 'Pybadu' },
        { property: 'og:title', content: 'Python Terminal Online - Interactive Python REPL' },
        { property: 'og:description', content: 'Execute Python commands interactively in your browser' },
        { property: 'og:type', content: 'website' },
        { property: 'og:image', content: '/pybadu.png' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Python Terminal Online' },
        { name: 'twitter:description', content: 'Interactive Python REPL in your browser' },
        { name: 'twitter:image', content: '/pybadu.png' }
    ]
})

const theme = ref('dark')
const currentInput = ref('')
const history = ref([])
const commandHistory = ref([])
const historyIndex = ref(-1)
const isExecuting = ref(false)
const pyodideReady = ref(false)
const terminalInput = ref(null)
const terminalContainer = ref(null)

let pyodideWorker = null
let messageId = 0
const pendingMessages = new Map()

function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    if (typeof document !== 'undefined') {
        if (theme.value === 'dark') {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }
}

function focusInput() {
    terminalInput.value?.focus()
}

function scrollToBottom() {
    nextTick(() => {
        if (terminalContainer.value) {
            terminalContainer.value.scrollTop = terminalContainer.value.scrollHeight
        }
    })
}

function clearTerminal() {
    history.value = []
}

async function resetPython() {
    if (!pyodideWorker) return

    history.value = []
    commandHistory.value = []
    historyIndex.value = -1

    // Reinitialize Pyodide
    try {
        await requestResponse(pyodideWorker, {
            type: 'INIT_PYODIDE'
        })

        history.value.push({
            type: 'output',
            content: 'Python environment reset successfully.',
            isError: false
        })
    } catch (error) {
        history.value.push({
            type: 'output',
            content: `Error resetting Python: ${error.message}`,
            isError: true
        })
    }

    scrollToBottom()
}

function navigateHistory(direction) {
    if (commandHistory.value.length === 0) return

    if (direction === 'up') {
        if (historyIndex.value < commandHistory.value.length - 1) {
            historyIndex.value++
            currentInput.value = commandHistory.value[commandHistory.value.length - 1 - historyIndex.value]
        }
    } else if (direction === 'down') {
        if (historyIndex.value > 0) {
            historyIndex.value--
            currentInput.value = commandHistory.value[commandHistory.value.length - 1 - historyIndex.value]
        } else if (historyIndex.value === 0) {
            historyIndex.value = -1
            currentInput.value = ''
        }
    }
}

function handleTab() {
    // Tab completion - placeholder for future implementation
    console.log('Tab completion not yet implemented')
}

async function executeCommand() {
    if (!currentInput.value.trim() || isExecuting.value || !pyodideReady.value) return

    const command = currentInput.value

    // Add to history
    history.value.push({
        type: 'input',
        content: command
    })

    // Add to command history
    commandHistory.value.push(command)
    historyIndex.value = -1

    // Clear input
    currentInput.value = ''
    isExecuting.value = true

    scrollToBottom()

    try {
        // Execute in worker
        const response = await requestResponse(pyodideWorker, {
            type: 'RUN_PYTHON',
            data: {
                code: command,
                packageName: '',
                additionalPackages: []
            }
        })

        // Add output
        if (response.result?.stdout && response.result.stdout.trim()) {
            history.value.push({
                type: 'output',
                content: response.result.stdout.trim(),
                isError: false
            })
        }

    } catch (error) {
        history.value.push({
            type: 'output',
            content: error.message,
            isError: true
        })
    } finally {
        isExecuting.value = false
        scrollToBottom()
        focusInput()
    }
}

// Worker communication
function requestResponse(worker, msg) {
    return new Promise((resolve, reject) => {
        const id = ++messageId

        const listener = (event) => {
            if (!event.data?.id || event.data.id !== id) return
            if (event.data.type === 'PACKAGE_PROGRESS') return

            worker.removeEventListener('message', listener)
            pendingMessages.delete(id)

            const { id: _, ...rest } = event.data

            if (rest.error) {
                reject(new Error(rest.error))
            } else {
                resolve(rest)
            }
        }

        worker.addEventListener('message', listener)
        pendingMessages.set(id, { resolve, reject, listener })

        worker.postMessage({ id, ...msg })
    })
}

async function initializePyodide() {
    if (typeof Worker === 'undefined') {
        console.error('Web Workers not supported')
        return
    }

    try {
        // Get baseURL for subpath support
        let baseURL = ''
        if (process.client) {
            const pathParts = window.location.pathname.split('/').filter(p => p)
            if (pathParts.length > 0 && pathParts[0] === 'pybadu') {
                baseURL = '/pybadu'
            }
        }

        const workerPath = `${baseURL}/workers/pyodide-worker.js`
        pyodideWorker = new Worker(workerPath, { type: 'module' })

        pyodideWorker.addEventListener('message', (e) => {
            const { type, id } = e.data

            if (!id) {
                if (type === 'WORKER_READY' || type === 'PYODIDE_READY') {
                    console.log('Worker ready:', e.data.message)
                }
                return
            }

            const pending = pendingMessages.get(id)
            if (pending) {
                pending.listener(e)
            }
        })

        // Initialize Pyodide
        await requestResponse(pyodideWorker, {
            type: 'INIT_PYODIDE'
        })

        pyodideReady.value = true
        focusInput()

    } catch (error) {
        console.error('Failed to initialize Pyodide:', error)
        history.value.push({
            type: 'output',
            content: `Failed to initialize Python: ${error.message}`,
            isError: true
        })
    }
}

onMounted(async () => {
    // Apply dark theme
    if (process.client) {
        document.documentElement.classList.add('dark')
    }

    await initializePyodide()
})

onBeforeUnmount(() => {
    if (pyodideWorker) {
        pyodideWorker.terminate()
    }
})
</script>
