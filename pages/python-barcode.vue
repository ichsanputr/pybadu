<template>
    <div>
        <!-- Barcode Generator Interface -->
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
                        ]">Python Barcode Generator</span>
                    </div>
                </div>

                <!-- Right: Actions -->
                <div class="flex items-center space-x-2">
                    <!-- Run Button -->
                    <button @click="runBarcode" :disabled="isRunning || !pyodideReady" :class="[
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

                    <!-- Clear Button -->
                    <button @click="clearOutput" :class="[
                        'flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                        theme === 'dark'
                            ? 'bg-python-blue-600 hover:bg-python-blue-700 text-white'
                            : 'bg-python-blue-600 hover:bg-python-blue-700 text-white'
                    ]">
                        <Icon icon="ph:trash" class="w-4 h-4" />
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
                                <option value="ean13">EAN-13 Barcode</option>
                                <option value="code128">Code128 Barcode</option>
                                <option value="code39">Code39 Barcode</option>
                                <option value="upca">UPC-A Barcode</option>
                                <option value="isbn">ISBN Barcode</option>
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
                        <MonacoEditor :key="editorKey" v-model="code" :language="'python'" :theme="monacoTheme"
                            :options="monacoOptions" height="100%" class="h-full w-full" />
                    </div>
                </section>

                <!-- Output & Barcode Preview -->
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
                            <Icon icon="ph:barcode" class="w-4 h-4" />
                            <span>Barcode Output</span>
                        </div>

                        <button v-if="barcodeImages.length > 0" @click="downloadAllBarcodes" :class="[
                            'p-1.5 rounded-md transition-colors',
                            theme === 'dark'
                                ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                                : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                        ]" title="Download All Barcodes">
                            <Icon icon="ph:download-simple" class="w-4 h-4" />
                        </button>
                    </div>

                    <!-- Barcode Preview -->
                    <div class="flex-1 overflow-auto p-4 bg-gray-100 dark:bg-gray-800">
                        <div v-if="!pyodideReady" class="flex items-center justify-center h-full">
                            <div class="text-center">
                                <Icon icon="ph:spinner"
                                    class="w-8 h-8 animate-spin text-python-blue-500 mx-auto mb-2" />
                                <div class="text-sm text-gray-600 dark:text-gray-400">Loading python-barcode library...
                                </div>
                            </div>
                        </div>

                        <div v-else-if="barcodeImages.length === 0" class="flex items-center justify-center h-full">
                            <div class="text-center text-gray-500 dark:text-gray-400">
                                <Icon icon="ph:barcode" class="w-16 h-16 mx-auto mb-4 opacity-30" />
                                <p class="text-sm">No barcodes generated yet</p>
                                <p class="text-xs mt-2">Click Run to generate barcodes</p>
                            </div>
                        </div>

                        <div v-else class="space-y-4">
                            <div v-for="(img, index) in barcodeImages" :key="index"
                                class="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                                <div class="flex items-start justify-between mb-2">
                                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ img.name
                                        }}</span>
                                    <button @click="downloadBarcode(img, index)" :class="[
                                        'p-1 rounded transition-colors',
                                        theme === 'dark'
                                            ? 'hover:bg-gray-800 text-gray-400'
                                            : 'hover:bg-gray-100 text-gray-600'
                                    ]" title="Download">
                                        <Icon icon="ph:download" class="w-4 h-4" />
                                    </button>
                                </div>
                                <img :src="'data:image/svg+xml;base64,' + img.data" :alt="img.name"
                                    class="w-full max-w-md mx-auto border rounded bg-white p-2" />
                            </div>
                        </div>
                    </div>

                    <!-- Console Output -->
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
                            line.type === 'error' ? 'text-red-400' : line.type === 'success' ? 'text-green-400' : ''
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
                                <Adsense key="barcode-ad-1" client="ca-pub-1356911639243870" ad-slot="3430238458"
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
                    Python Generate Barcode Online
                </h1>

                <div class="max-w-4xl mx-auto text-left space-y-6 text-gray-700 dark:text-gray-300">
                    <p class="text-base md:text-lg leading-relaxed">
                        Welcome to <strong>Python Generate Barcode Online</strong> – your free, browser-based tool for
                        creating barcodes using Python. This online compiler uses <strong>python-barcode</strong>, a
                        pure Python library that generates various barcode formats including EAN-13, Code128, Code39,
                        UPC-A, and ISBN without any installation required.
                    </p>

                    <p class="text-base md:text-lg leading-relaxed">
                        This <strong>python generate barcode</strong> tool is powered by Pyodide WebAssembly technology.
                        The python-barcode library is 100% pure Python and works perfectly in the browser environment.
                        Generate professional barcodes for retail products, inventory management, shipping labels, and
                        more.
                    </p>

                    <h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Supported Barcode
                        Formats</h3>
                    <ul class="list-disc list-inside space-y-2 text-base md:text-lg ml-4">
                        <li><strong>EAN-13</strong> - European Article Number (retail products)</li>
                        <li><strong>Code128</strong> - High-density alphanumeric (shipping, logistics)</li>
                        <li><strong>Code39</strong> - Alphanumeric (automotive, defense)</li>
                        <li><strong>UPC-A</strong> - Universal Product Code (North America retail)</li>
                        <li><strong>ISBN</strong> - International Standard Book Number (books)</li>
                        <li><strong>EAN-8, JAN, ISSN</strong> and more formats supported</li>
                    </ul>

                    <h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Use Cases</h3>
                    <ul class="list-disc list-inside space-y-2 text-base md:text-lg ml-4">
                        <li>Generate barcodes for retail product labels</li>
                        <li>Create inventory tracking barcodes</li>
                        <li>Generate ISBN barcodes for books and publications</li>
                        <li>Create shipping and logistics barcodes</li>
                        <li>Learn barcode technology and standards</li>
                        <li>Prototype barcode systems before deployment</li>
                    </ul>
                </div>
            </div>
        </LibraryInfoSection>

        <AppFooter />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useHead } from '#app'
import { Icon } from '@iconify/vue'
import MonacoEditor from '~/components/MonacoEditor.vue'
import LibraryInfoSection from '~/components/LibraryInfoSection.vue'
import Adsense from '~/components/Adsense.vue'
import AppFooter from '~/components/AppFooter.vue'

defineOptions({
    name: 'BarcodeGenerator'
})

definePageMeta({
    layout: 'library'
})

useHead({
    title: 'Python Generate Barcode Online - Free Barcode Generator',
    meta: [
        { name: 'description', content: 'Generate barcodes online with Python using python-barcode library. Free tool for EAN-13, Code128, Code39, UPC-A, ISBN barcodes. No installation required.' },
        { name: 'keywords', content: 'python generate barcode, python barcode generator, barcode python, EAN13, Code128, Code39, UPC-A, ISBN barcode' },
        { name: 'author', content: 'Pybadu' },
        { property: 'og:title', content: 'Python Generate Barcode Online' },
        { property: 'og:description', content: 'Generate barcodes with Python using python-barcode library' },
        { property: 'og:type', content: 'website' },
        { property: 'og:image', content: '/pybadu.png' }
    ]
})

const theme = ref('dark')
const code = ref(`import barcode
from barcode.writer import SVGWriter
import io
import base64

# Create EAN-13 barcode with SVG writer (pure Python)
ean = barcode.get("ean13", "123456789012", writer=SVGWriter())

# Write to BytesIO buffer
buffer = io.BytesIO()
ean.write(buffer)

# SVG output (convert to base64 for embedding)
buffer.seek(0)
svg_data = buffer.read().decode('utf-8')

print(svg_data)
print("✓ EAN-13 barcode generated!")
`)

const selectedExample = ref('')
const isRunning = ref(false)
const pyodideReady = ref(false)
const output = ref([])
const barcodeImages = ref([])
const editorKey = ref(0)

let pyodideWorker = null
let messageId = 0
const pendingMessages = new Map()

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
    ean13: `import barcode
from barcode.writer import SVGWriter
import io

# EAN-13: 12 digits (13th is checksum)
ean = barcode.get("ean13", "123456789012", writer=SVGWriter())
buffer = io.BytesIO()
ean.write(buffer)
buffer.seek(0)
svg_data = buffer.read().decode('utf-8')
print(svg_data)
print("✓ EAN-13 for retail products")`,

    code128: `import barcode
from barcode.writer import SVGWriter
import io

# Code128: Alphanumeric, variable length
code = barcode.get("code128", "PYBADU2024", writer=SVGWriter())
buffer = io.BytesIO()
code.write(buffer)
buffer.seek(0)
svg_data = buffer.read().decode('utf-8')
print(svg_data)
print("✓ Code128 for shipping/logistics")`,

    code39: `import barcode
from barcode.writer import SVGWriter
import io

# Code39: Uppercase letters, numbers, special chars
code = barcode.get("code39", "PYTHON-BARCODE", writer=SVGWriter())
buffer = io.BytesIO()
code.write(buffer)
buffer.seek(0)
svg_data = buffer.read().decode('utf-8')
print(svg_data)
print("✓ Code39 for inventory tracking")`,

    upca: `import barcode
from barcode.writer import SVGWriter
import io

# UPC-A: 11 digits (12th is checksum)
upc = barcode.get("upca", "12345678901", writer=SVGWriter())
buffer = io.BytesIO()
upc.write(buffer)
buffer.seek(0)
svg_data = buffer.read().decode('utf-8')
print(svg_data)
print("✓ UPC-A for North American retail")`,

    isbn: `import barcode
from barcode.writer import SVGWriter
import io

# ISBN-13 for books (13 digits)
isbn = barcode.get("isbn13", "9781234567897", writer=SVGWriter())
buffer = io.BytesIO()
isbn.write(buffer)
buffer.seek(0)
svg_data = buffer.read().decode('utf-8')
print(svg_data)
print("✓ ISBN-13 for book publishing")`
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

function clearOutput() {
    output.value = []
    barcodeImages.value = []
}

function loadExample() {
    if (selectedExample.value && examples[selectedExample.value]) {
        code.value = examples[selectedExample.value]
        editorKey.value++
    }
}

function downloadBarcode(img, index) {
    const link = document.createElement('a')
    link.href = `data:image/png;base64,${img.data}`
    link.download = img.name || `barcode-${index + 1}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

function downloadAllBarcodes() {
    barcodeImages.value.forEach((img, index) => {
        setTimeout(() => downloadBarcode(img, index), index * 100)
    })
}

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

async function runBarcode() {
    if (!code.value.trim() || isRunning.value || !pyodideReady.value) return
    isRunning.value = true
    output.value = []
    barcodeImages.value = []

    try {
        const response = await requestResponse(pyodideWorker, {
            type: 'RUN_PYTHON',
            data: {
                code: code.value,
                packageName: 'python-barcode',
                additionalPackages: []
            }
        })

        // Parse stdout for SVG content
        if (response.result?.stdout && response.result.stdout.trim()) {
            const lines = response.result.stdout.trim().split('\n')
            let svgContent = ''
            let collectingSVG = false

            for (const line of lines) {
                // Check if line starts SVG content
                if (line.trim().startsWith('<?xml') || line.trim().startsWith('<svg')) {
                    collectingSVG = true
                    svgContent = line
                } else if (collectingSVG) {
                    svgContent += '\n' + line
                    // Check if SVG is complete
                    if (line.includes('</svg>')) {
                        // Convert SVG to base64 for img src
                        const svgBase64 = btoa(unescape(encodeURIComponent(svgContent)))
                        barcodeImages.value.push({
                            data: svgBase64,
                            name: `barcode-${barcodeImages.value.length + 1}.svg`,
                            isSvg: true
                        })
                        collectingSVG = false
                        svgContent = ''
                    }
                } else if (line.trim() && !line.startsWith('<?xml') && !line.startsWith('<')) {
                    // Regular print output
                    output.value.push({ type: 'print', content: line })
                }
            }
        }

        if (barcodeImages.value.length > 0) {
            output.value.push({
                type: 'success',
                content: `✓ Generated ${barcodeImages.value.length} barcode(s)!`
            })
        } else {
            output.value.push({ type: 'success', content: '✓ Code executed' })
        }
    } catch (error) {
        console.error('Error:', error)
        output.value.push({ type: 'error', content: `Error: ${error.message}` })
    } finally {
        isRunning.value = false
    }
}

async function initializePyodide() {
    if (typeof Worker === 'undefined') return

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
                    console.log('Worker ready')
                }
                return
            }
            const pending = pendingMessages.get(id)
            if (pending) pending.listener(e)
        })

        await requestResponse(pyodideWorker, { type: 'INIT_PYODIDE' })
        await requestResponse(pyodideWorker, {
            type: 'LOAD_PACKAGES',
            data: {
                packageName: 'python-barcode',
                additionalPackages: [],
                setupCode: ''
            }
        })

        pyodideReady.value = true
    } catch (error) {
        console.error('Failed to initialize:', error)
        output.value.push({ type: 'error', content: `Failed: ${error.message}` })
    }
}

onMounted(async () => {
    if (process.client) {
        document.documentElement.classList.add('dark')
    }
    await initializePyodide()
})
</script>

<style scoped>
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
</style>
