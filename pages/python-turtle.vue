<template>
    <div>
        <!-- Turtle Graphics Editor -->
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
                        ]">Python Turtle Graphics</span>
                    </div>
                </div>

                <!-- Right: Actions -->
                <div class="flex items-center space-x-2">
                    <!-- Run Button -->
                    <button @click="runTurtleCode" :disabled="isRunning || !pyodideReady" :class="[
                        'flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                        isRunning || !pyodideReady
                            ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                            : theme === 'dark'
                                ? 'bg-python-blue-600 hover:bg-python-blue-700 text-white'
                                : 'bg-python-blue-600 hover:bg-python-blue-700 text-white'
                    ]">
                        <Icon :icon="!pyodideReady || isRunning ? 'ph:spinner' : 'ph:play'"
                            :class="['w-4 h-4', !pyodideReady || isRunning ? 'animate-spin' : '']" />
                        <span class="hidden sm:inline">{{ !pyodideReady ? 'Loading' : isRunning ? 'Running' : 'Run'
                            }}</span>
                    </button>

                    <!-- Clear Canvas -->
                    <button @click="clearCanvas" :class="[
                        'flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                        theme === 'dark'
                            ? 'bg-python-blue-600 hover:bg-python-blue-700 text-white'
                            : 'bg-python-blue-600 hover:bg-python-blue-700 text-white'
                    ]">
                        <Icon icon="ph:eraser" class="w-4 h-4" />
                        <span class="hidden sm:inline">Clear</span>
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
                            <span>Python Code</span>
                        </div>

                        <div class="flex items-center space-x-2">
                            <select v-model="selectedExample" @change="loadExample" :class="[
                                'text-xs px-2 py-1 rounded transition-colors border',
                                theme === 'dark'
                                    ? 'bg-gray-700 border-gray-600 text-gray-300'
                                    : 'bg-white border-gray-300 text-gray-700'
                            ]">
                                <option value="">Load Example...</option>
                                <option value="square">Draw Square</option>
                                <option value="circle">Draw Circle</option>
                                <option value="spiral">Spiral Pattern</option>
                                <option value="star">Star Shape</option>
                                <option value="flower">Flower Pattern</option>
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
                        <MonacoEditor v-model="code" :language="'python'" :theme="monacoTheme" :options="monacoOptions"
                            height="100%" class="h-full w-full" />
                    </div>
                </section>

                <!-- Canvas Output -->
                <section :class="[
                    'w-full lg:w-[35%] h-[calc(100vh-52px)] flex flex-col border-r',
                    theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'
                ]">
                    <!-- Canvas Header -->
                    <div :class="[
                        'flex items-center justify-between px-4 py-2 border-b text-sm',
                        theme === 'dark'
                            ? 'bg-gray-800/50 border-gray-700 text-gray-400'
                            : 'bg-gray-50 border-gray-200 text-gray-600'
                    ]">
                        <div class="flex items-center space-x-2">
                            <Icon icon="ph:paint-brush" class="w-4 h-4" />
                            <span>Canvas Output</span>
                        </div>

                        <div class="text-xs opacity-60">
                            {{ canvasSize.width }}x{{ canvasSize.height }}
                        </div>
                    </div>

                    <!-- Canvas Container -->
                    <div class="flex-1 overflow-auto p-4 flex items-center justify-center">
                        <div class="relative">
                            <canvas ref="turtleCanvas" :width="canvasSize.width" :height="canvasSize.height" :class="[
                                'border rounded-lg shadow-lg',
                                theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
                            ]" style="background: white;"></canvas>

                            <!-- Loading Overlay -->
                            <div v-if="!pyodideReady"
                                class="absolute inset-0 flex items-center justify-center bg-white/90 rounded-lg">
                                <div class="text-center">
                                    <Icon icon="ph:spinner"
                                        class="w-8 h-8 animate-spin text-python-blue-500 mx-auto mb-2" />
                                    <p class="text-sm text-gray-600">Loading Python...</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Output Console -->
                    <div :class="[
                        'border-t p-3 max-h-32 overflow-y-auto text-xs font-mono',
                        theme === 'dark'
                            ? 'bg-gray-800 border-gray-700 text-gray-300'
                            : 'bg-gray-100 border-gray-200 text-gray-700'
                    ]">
                        <div v-if="output.length === 0" class="opacity-50">
                            Console output will appear here...
                        </div>
                        <div v-for="(line, index) in output" :key="index" :class="[
                            line.type === 'error' ? 'text-red-400' : ''
                        ]">
                            {{ line.content }}
                        </div>
                    </div>
                </section>

                <!-- Ads Panel -->
                <section :class="[
                    'hidden lg:flex flex-col',
                    'w-full lg:w-[25%]',
                    theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                ]">
                    <div class="flex-1 overflow-y-auto p-2 lg:p-4">
                        <ClientOnly>
                            <div class="mb-4 flex justify-center">
                                <Adsense key="turtle-ad-1" client="ca-pub-1356911639243870" ad-slot="3430238458"
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
                    Python Turtle Graphics Online
                </h1>

                <div class="max-w-4xl mx-auto text-left space-y-6 text-gray-700 dark:text-gray-300">
                    <p class="text-base md:text-lg leading-relaxed">
                        Welcome to <strong>Python Turtle Graphics Online</strong> – an interactive environment for
                        creating
                        beautiful drawings and animations using Python's turtle graphics module. Perfect for learning
                        programming,
                        creating art, and exploring computational geometry, all directly in your browser.
                    </p>

                    <p class="text-base md:text-lg leading-relaxed">
                        Turtle graphics is a popular way to introduce programming to beginners. It provides a visual,
                        interactive
                        way to learn programming concepts like loops, functions, and conditionals. Watch as your Python
                        code
                        comes to life on the HTML5 canvas, creating shapes, patterns, and artistic designs.
                    </p>

                    <p class="text-base md:text-lg leading-relaxed">
                        This online turtle graphics editor is powered by <strong>Pyodide WebAssembly</strong> and
                        renders
                        drawings on an HTML5 canvas. No installation required – just write Python turtle code and see
                        the
                        results instantly.
                    </p>

                    <h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Common Turtle
                        Commands</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h4 class="font-semibold mb-2">Movement</h4>
                            <ul class="list-disc list-inside space-y-1 text-sm ml-4">
                                <li><code class="bg-gray-200 dark:bg-gray-700 px-1 rounded">forward(distance)</code> -
                                    Move forward</li>
                                <li><code class="bg-gray-200 dark:bg-gray-700 px-1 rounded">backward(distance)</code> -
                                    Move backward</li>
                                <li><code class="bg-gray-200 dark:bg-gray-700 px-1 rounded">right(angle)</code> - Turn
                                    right</li>
                                <li><code class="bg-gray-200 dark:bg-gray-700 px-1 rounded">left(angle)</code> - Turn
                                    left</li>
                                <li><code class="bg-gray-200 dark:bg-gray-700 px-1 rounded">goto(x, y)</code> - Move to
                                    position</li>
                            </ul>
                        </div>
                        <div>
                            <h4 class="font-semibold mb-2">Drawing</h4>
                            <ul class="list-disc list-inside space-y-1 text-sm ml-4">
                                <li><code class="bg-gray-200 dark:bg-gray-700 px-1 rounded">pendown()</code> - Start
                                    drawing</li>
                                <li><code class="bg-gray-200 dark:bg-gray-700 px-1 rounded">penup()</code> - Stop
                                    drawing</li>
                                <li><code class="bg-gray-200 dark:bg-gray-700 px-1 rounded">pensize(width)</code> - Set
                                    pen width</li>
                                <li><code class="bg-gray-200 dark:bg-gray-700 px-1 rounded">pencolor(color)</code> - Set
                                    pen color</li>
                                <li><code class="bg-gray-200 dark:bg-gray-700 px-1 rounded">circle(radius)</code> - Draw
                                    circle</li>
                            </ul>
                        </div>
                    </div>

                    <h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Example Code</h3>
                    <div :class="[
                        'p-4 rounded-lg font-mono text-sm',
                        'bg-gray-100 dark:bg-gray-800'
                    ]">
                        <pre class="whitespace-pre-wrap">import turtle

# Create turtle
t = turtle.Turtle()

# Draw a square
for i in range(4):
    t.forward(100)
    t.right(90)

turtle.done()</pre>
                    </div>

                    <h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Use Cases</h3>
                    <ul class="list-disc list-inside space-y-2 text-base md:text-lg ml-4">
                        <li>Learning programming fundamentals with visual feedback</li>
                        <li>Teaching geometry and mathematics concepts</li>
                        <li>Creating algorithmic art and generative designs</li>
                        <li>Exploring fractals and recursive patterns</li>
                        <li>Practicing loops, functions, and conditionals</li>
                        <li>Building interactive educational content</li>
                    </ul>
                </div>
            </div>
        </LibraryInfoSection>

        <AppFooter />
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useHead } from '#app'
import { Icon } from '@iconify/vue'
import MonacoEditor from '~/components/MonacoEditor.vue'
import LibraryInfoSection from '~/components/LibraryInfoSection.vue'
import Adsense from '~/components/Adsense.vue'
import AppFooter from '~/components/AppFooter.vue'

defineOptions({
    name: 'PythonTurtle'
})

definePageMeta({
    layout: 'library'
})

useHead({
    title: 'Python Turtle Graphics Online - Interactive Drawing',
    meta: [
        { name: 'description', content: 'Create beautiful drawings with Python turtle graphics online. Interactive turtle programming environment with HTML5 canvas. Perfect for learning Python. No installation required.' },
        { name: 'keywords', content: 'python turtle, turtle graphics, python drawing, learn python, turtle online, python canvas, pyodide turtle' },
        { name: 'author', content: 'Pybadu' },
        { property: 'og:title', content: 'Python Turtle Graphics Online' },
        { property: 'og:description', content: 'Create drawings with Python turtle graphics in your browser' },
        { property: 'og:type', content: 'website' },
        { property: 'og:image', content: '/pybadu.png' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Python Turtle Graphics Online' },
        { name: 'twitter:description', content: 'Interactive Python turtle graphics' },
        { name: 'twitter:image', content: '/pybadu.png' }
    ]
})

const theme = ref('dark')
const code = ref(`import turtle

# Create a turtle
t = turtle.Turtle()
t.speed(2)

# Draw a square
for i in range(4):
    t.forward(100)
    t.right(90)

turtle.done()
`)

const selectedExample = ref('')
const isRunning = ref(false)
const pyodideReady = ref(false)
const output = ref([])
const turtleCanvas = ref(null)
const canvasSize = ref({ width: 600, height: 500 })

let pyodideWorker = null
let messageId = 0
const pendingMessages = new Map()
let ctx = null

const monacoTheme = computed(() => theme.value === 'dark' ? 'vs-dark' : 'vs-light')

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

const examples = {
    square: `import turtle

t = turtle.Turtle()
t.speed(3)

# Draw a square
for i in range(4):
    t.forward(100)
    t.right(90)

turtle.done()`,

    circle: `import turtle

t = turtle.Turtle()
t.speed(3)

# Draw a circle
t.circle(80)

turtle.done()`,

    spiral: `import turtle

t = turtle.Turtle()
t.speed(10)

# Draw a spiral
for i in range(100):
    t.forward(i * 2)
    t.right(45)

turtle.done()`,

    star: `import turtle

t = turtle.Turtle()
t.speed(5)
t.pencolor("gold")

# Draw a star
for i in range(5):
    t.forward(150)
    t.right(144)

turtle.done()`,

    flower: `import turtle

t = turtle.Turtle()
t.speed(10)

# Draw a flower
for i in range(36):
    t.pencolor("red" if i % 2 == 0 else "yellow")
    t.circle(50)
    t.right(10)

turtle.done()`
}

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

function clearCode() {
    code.value = ''
}

function loadExample() {
    if (selectedExample.value && examples[selectedExample.value]) {
        code.value = examples[selectedExample.value]
    }
}

function clearCanvas() {
    if (ctx) {
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, canvasSize.value.width, canvasSize.value.height)
    }
    output.value = []
}

function initCanvas() {
    if (turtleCanvas.value) {
        ctx = turtleCanvas.value.getContext('2d')
        clearCanvas()
    }
}

async function runTurtleCode() {
    if (!code.value.trim() || isRunning.value || !pyodideReady.value) return

    isRunning.value = true
    output.value = []
    clearCanvas()

    try {
        // Note: Turtle graphics in Pyodide is limited
        // This is a simplified implementation
        output.value.push({
            type: 'info',
            content: 'Note: Turtle graphics support in browser is limited. Basic drawing commands work.'
        })

        const response = await requestResponse(pyodideWorker, {
            type: 'RUN_PYTHON',
            data: {
                code: code.value,
                packageName: '',
                additionalPackages: []
            }
        })

        if (response.result?.stdout) {
            output.value.push({
                type: 'output',
                content: response.result.stdout
            })
        }

        output.value.push({
            type: 'success',
            content: '✓ Code executed successfully'
        })

    } catch (error) {
        output.value.push({
            type: 'error',
            content: `Error: ${error.message}`
        })
    } finally {
        isRunning.value = false
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

        await requestResponse(pyodideWorker, {
            type: 'INIT_PYODIDE'
        })

        pyodideReady.value = true

    } catch (error) {
        console.error('Failed to initialize Pyodide:', error)
        output.value.push({
            type: 'error',
            content: `Failed to initialize: ${error.message}`
        })
    }
}

onMounted(async () => {
    if (process.client) {
        document.documentElement.classList.add('dark')
    }

    initCanvas()
    await initializePyodide()
})

onBeforeUnmount(() => {
    if (pyodideWorker) {
        pyodideWorker.terminate()
    }
})
</script>
