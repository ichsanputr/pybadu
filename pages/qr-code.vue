<template>
    <div>
        <!-- QR Code Generator Interface -->
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
                        ]">Python QR Code Generator</span>
                    </div>
                </div>

                <!-- Right: Actions -->
                <div class="flex items-center space-x-2">
                    <!-- Run Button -->
                    <button @click="runQRCode" :disabled="isRunning || !pyodideReady" :class="[
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
                                <option value="basic">Basic QR Code</option>
                                <option value="custom_colors">Custom Colors</option>
                                <option value="vcard">vCard Contact</option>
                                <option value="wifi">WiFi QR Code</option>
                                <option value="error_correction">Error Correction</option>
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

                <!-- Output & QR Preview -->
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
                            <Icon icon="ph:qr-code" class="w-4 h-4" />
                            <span>QR Code Output</span>
                        </div>

                        <button v-if="qrImages.length > 0" @click="downloadAllQRCodes" :class="[
                            'p-1.5 rounded-md transition-colors',
                            theme === 'dark'
                                ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                                : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                        ]" title="Download All QR Codes">
                            <Icon icon="ph:download-simple" class="w-4 h-4" />
                        </button>
                    </div>

                    <!-- QR Code Preview -->
                    <div class="flex-1 overflow-auto p-4 bg-gray-100 dark:bg-gray-800">
                        <div v-if="!pyodideReady" class="flex items-center justify-center h-full">
                            <div class="text-center">
                                <Icon icon="ph:spinner"
                                    class="w-8 h-8 animate-spin text-python-blue-500 mx-auto mb-2" />
                                <div class="text-sm text-gray-600 dark:text-gray-400">Loading Segno library...</div>
                            </div>
                        </div>

                        <div v-else-if="qrImages.length === 0" class="flex items-center justify-center h-full">
                            <div class="text-center text-gray-500 dark:text-gray-400">
                                <Icon icon="ph:qr-code" class="w-16 h-16 mx-auto mb-4 opacity-30" />
                                <p class="text-sm">No QR codes generated yet</p>
                                <p class="text-xs mt-2">Click Run to generate QR codes</p>
                            </div>
                        </div>

                        <div v-else class="space-y-4">
                            <div v-for="(img, index) in qrImages" :key="index"
                                class="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                                <div class="flex items-start justify-between mb-2">
                                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ img.name
                                        }}</span>
                                    <button @click="downloadQRCode(img, index)" :class="[
                                        'p-1 rounded transition-colors',
                                        theme === 'dark'
                                            ? 'hover:bg-gray-800 text-gray-400'
                                            : 'hover:bg-gray-100 text-gray-600'
                                    ]" title="Download">
                                        <Icon icon="ph:download" class="w-4 h-4" />
                                    </button>
                                </div>
                                <img :src="'data:image/png;base64,' + img.data" :alt="img.name"
                                    class="w-full max-w-xs mx-auto border rounded" />
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
                                <Adsense key="qr-ad-1" client="ca-pub-1356911639243870" ad-slot="3430238458"
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
                    Python QR Code Generator Online
                </h1>

                <div class="max-w-4xl mx-auto text-left space-y-6 text-gray-700 dark:text-gray-300">
                    <p class="text-base md:text-lg leading-relaxed">
                        Welcome to the <strong>Python QR Code Generator Online</strong> – your free, browser-based tool
                        for creating QR codes using Python. This online compiler uses <strong>Segno</strong>, a pure
                        Python QR code library that works perfectly with Pyodide WebAssembly. Generate QR codes for
                        URLs, text, contact
                        information, WiFi credentials, and more without any installation required.
                    </p>

                    <p class="text-base md:text-lg leading-relaxed">
                        This <strong>python qr code generator</strong> comes pre-configured with <strong>Segno</strong>,
                        powered by Pyodide WebAssembly technology. Segno is ideal for browser-based Python because it
                        has a pure Python PNG renderer that works without external dependencies like Pillow.
                    </p>

                    <h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Use Cases</h3>
                    <ul class="list-disc list-inside space-y-2 text-base md:text-lg ml-4">
                        <li>Generate QR codes for website URLs and landing pages</li>
                        <li>Create vCard QR codes for contact information</li>
                        <li>Make WiFi QR codes for easy network sharing</li>
                        <li>Build payment QR codes for cryptocurrency or payment systems</li>
                        <li>Learn QR code technology through interactive examples</li>
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
    name: 'QRCodeGenerator'
})

definePageMeta({
    layout: 'library'
})

useHead({
    title: 'Python QR Code Generator Online - Free QR Code Maker',
    meta: [
        { name: 'description', content: 'Create QR codes online with Python using Segno library. Free python qr code generator for URLs, text, vCards, WiFi, and more.' },
        { name: 'keywords', content: 'python qr code generator, qr code generator python, online qr code, python qr, segno, qr code maker' },
        { name: 'author', content: 'Pybadu' },
        { property: 'og:title', content: 'Python QR Code Generator Online' },
        { property: 'og:description', content: 'Create QR codes with Python using Segno library' },
        { property: 'og:type', content: 'website' },
        { property: 'og:image', content: '/pybadu.png' }
    ]
})

const theme = ref('dark')
const code = ref(`import segno
import io
import base64

# Create a QR code
qr = segno.make("https://pybadu.com")

# Save to BytesIO buffer
buffer = io.BytesIO()
qr.save(buffer, kind='png', scale=10)

# Convert to base64
buffer.seek(0)
img_base64 = base64.b64encode(buffer.read()).decode('utf-8')

# Print data URI (will be captured and displayed)
print(f"data:image/png;base64,{img_base64}")
print("✓ QR code generated!")
`)

const selectedExample = ref('')
const isRunning = ref(false)
const pyodideReady = ref(false)
const output = ref([])
const qrImages = ref([])
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
    basic: `import segno
import io
import base64

qr = segno.make("https://pybadu.com")
buffer = io.BytesIO()
qr.save(buffer, kind='png', scale=10)
buffer.seek(0)
img_data = base64.b64encode(buffer.read()).decode('utf-8')
print(f"data:image/png;base64,{img_data}")
print("✓ Basic QR code generated!")`,

    custom_colors: `import segno
import io
import base64

qr = segno.make("https://github.com/ichsanputr/pybadu")
buffer = io.BytesIO()
qr.save(buffer, kind='png', scale=10,
        dark="#1A1A2E", light="#FFD700", border=2)
buffer.seek(0)
img_data = base64.b64encode(buffer.read()).decode('utf-8')
print(f"data:image/png;base64,{img_data}")
print("✓ Colored QR code!")`,

    vcard: `import segno
from segno import helpers
import io
import base64

# Use helpers to create vCard QR code
qr = helpers.make_vcard(
    name='Doe;John',
    displayname='John Doe',
    email='john@pybadu.com',
    phone='+1234567890',
    org='Pybadu'
)
buffer = io.BytesIO()
qr.save(buffer, kind='png', scale=8)
buffer.seek(0)
img_data = base64.b64encode(buffer.read()).decode('utf-8')
print(f"data:image/png;base64,{img_data}")
print("✓ vCard QR generated!")`,

    wifi: `import segno
from segno import helpers
import io
import base64

# Use the helpers module for WiFi
qr = helpers.make_wifi(
    ssid='MyWiFi',
    password='password123',
    security='WPA'
)
buffer = io.BytesIO()
qr.save(buffer, kind='png', scale=10)
buffer.seek(0)
img_data = base64.b64encode(buffer.read()).decode('utf-8')
print(f"data:image/png;base64,{img_data}")
print("✓ WiFi QR code!")`,

    error_correction: `import segno
import io
import base64

url = "https://pybadu.com"

# High error correction (H ~30%)
qr_h = segno.make(url, error='h')
buf_h = io.BytesIO()
qr_h.save(buf_h, kind='png', scale=8)
buf_h.seek(0)
print(f"data:image/png;base64,{base64.b64encode(buf_h.read()).decode('utf-8')}")
print("High error correction (H)")

# Low error correction (L ~7%)
qr_l = segno.make(url, error='l')
buf_l = io.BytesIO()
qr_l.save(buf_l, kind='png', scale=8)
buf_l.seek(0)
print(f"data:image/png;base64,{base64.b64encode(buf_l.read()).decode('utf-8')}")
print("Low error correction (L)")`
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
    qrImages.value = []
}

function loadExample() {
    if (selectedExample.value && examples[selectedExample.value]) {
        code.value = examples[selectedExample.value]
        editorKey.value++
    }
}

function downloadQRCode(img, index) {
    const link = document.createElement('a')
    link.href = `data:image/png;base64,${img.data}`
    link.download = img.name || `qr-code-${index + 1}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

function downloadAllQRCodes() {
    qrImages.value.forEach((img, index) => {
        setTimeout(() => downloadQRCode(img, index), index * 100)
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

async function runQRCode() {
    if (!code.value.trim() || isRunning.value || !pyodideReady.value) return
    isRunning.value = true
    output.value = []
    qrImages.value = []

    try {
        const response = await requestResponse(pyodideWorker, {
            type: 'RUN_PYTHON',
            data: {
                code: code.value,
                packageName: 'segno',
                additionalPackages: []
            }
        })

        // Parse stdout for data URI images
        if (response.result?.stdout && response.result.stdout.trim()) {
            const lines = response.result.stdout.trim().split('\n')
            for (const line of lines) {
                if (line.includes('data:image/png;base64,')) {
                    const match = line.match(/data:image\/png;base64,([A-Za-z0-9+/=]+)/)
                    if (match && match[1]) {
                        qrImages.value.push({
                            data: match[1],
                            name: `qr-code-${qrImages.value.length + 1}.png`
                        })
                    }
                } else if (line.trim() && !line.startsWith('data:')) {
                    output.value.push({ type: 'print', content: line })
                }
            }
        }

        if (qrImages.value.length > 0) {
            output.value.push({
                type: 'success',
                content: `✓ Generated ${qrImages.value.length} QR code(s)!`
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
                packageName: 'segno',
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
