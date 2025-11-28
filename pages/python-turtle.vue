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
                    <button @click="runTurtleCode" :disabled="isRunning || !skulptReady" :class="[
                        'flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                        isRunning || !skulptReady
                            ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                            : theme === 'dark'
                                ? 'bg-python-blue-600 hover:bg-python-blue-700 text-white'
                                : 'bg-python-blue-600 hover:bg-python-blue-700 text-white'
                    ]">
                        <Icon :icon="!skulptReady || isRunning ? 'ph:spinner' : 'ph:play'"
                            :class="['w-4 h-4', !skulptReady || isRunning ? 'animate-spin' : '']" />
                        <span class="hidden sm:inline">{{ !skulptReady ? 'Loading Libs' : isRunning ? 'Running' : 'Run'
                        }}</span>
                    </button>

                    <!-- Stop Button -->
                    <button v-if="isRunning" @click="stopTurtleCode" :class="[
                        'flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                        'bg-red-600 hover:bg-red-700 text-white'
                    ]">
                        <Icon icon="ph:stop" class="w-4 h-4" />
                        <span class="hidden sm:inline">Stop</span>
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
                                <option value="fractal_tree">Fractal Tree</option>
                                <option value="mandala">Colorful Mandala</option>
                                <option value="koch_snowflake">Koch Snowflake</option>
                                <option value="spirograph">Spirograph</option>
                                <option value="dragon_curve">Dragon Curve</option>
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
                        <div class="flex items-center space-x-2 pt-1 pb-0.5">
                            <Icon icon="ph:paint-brush" class="w-4 h-4" />
                            <span>Canvas Output</span>
                        </div>

                        <button @click="downloadCanvas" :disabled="!skulptReady" :class="[
                            'p-1.5 rounded-md transition-colors',
                            theme === 'dark'
                                ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                                : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                        ]" title="Download Image">
                            <Icon icon="ph:download-simple" class="w-4 h-4" />
                        </button>
                    </div>

                    <!-- Canvas Container -->
                    <div class="flex-1 overflow-auto p-4 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                        <div class="relative">
                            <!-- Skulpt Target Div -->
                            <div id="skulpt-canvas" :class="[
                                'border rounded-lg shadow-lg overflow-hidden bg-white',
                                theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
                            ]"></div>

                            <!-- Loading Overlay -->
                            <div v-if="!skulptReady"
                                class="absolute inset-0 flex items-center justify-center bg-white/90 rounded-lg z-10">
                                <div class="text-center w-[100px]">
                                    <div>
                                        <Icon icon="ph:spinner"
                                            class="w-8 h-8 animate-spin text-python-blue-500 mx-auto mb-2" />
                                    </div>
                                    <div class="w-full text-sm text-gray-600">Loading..</div>
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
                        Welcome to <strong>Python Turtle Graphics Online</strong> – your premier
                        <strong>sandbox</strong> for running <strong>python turtle</strong> code.
                        This interactive <strong>online</strong> tool lets you create stunning <strong>graphics</strong>
                        and animations without installing any software.
                        Perfect for learning programming, creating art, and exploring computational geometry, all
                        directly in your browser.
                    </p>

                    <p class="text-base md:text-lg leading-relaxed">
                        Turtle graphics is a popular way to introduce programming to beginners. Simply type <code
                            class="bg-gray-200 dark:bg-gray-700 px-1 rounded">import turtle</code> to get started.
                        It provides a visual, interactive way to learn programming concepts like loops, functions, and
                        conditionals.
                        Watch as your Python code comes to life on the HTML5 canvas, creating shapes, patterns, and
                        artistic designs.
                    </p>

                    <p class="text-base md:text-lg leading-relaxed">
                        This <strong>online</strong> turtle graphics editor is powered by <strong>Skulpt</strong>, a
                        Javascript
                        implementation of Python that runs entirely in your browser. It provides excellent support for
                        the Turtle module,
                        allowing for smooth animations and interactive drawings in a safe <strong>sandbox</strong>
                        environment.
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
import { ref, computed, onMounted } from 'vue'
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
    title: 'Python Turtle Graphics Online',
    meta: [
        { name: 'description', content: 'Create beautiful drawings with Python turtle graphics online. Interactive turtle programming environment with HTML5 canvas. Perfect for learning Python. No installation required.' },
        { name: 'keywords', content: 'python turtle, turtle graphics, python drawing, learn python, turtle online, python canvas, skulpt turtle' },
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
const skulptReady = ref(false)
const output = ref([])

function loadSkulpt() {
    if (window.Sk && window.Sk.builtinFiles) {
        skulptReady.value = true
        console.log('Skulpt already loaded')
        return
    }

    // Load Skulpt Core
    const scriptCore = document.createElement('script')
    scriptCore.src = 'https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt.min.js'
    scriptCore.onload = () => {
        console.log('Skulpt Core loaded')
        // Load Skulpt Stdlib
        const scriptStd = document.createElement('script')
        scriptStd.src = 'https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt-stdlib.js'
        scriptStd.onload = () => {
            console.log('Skulpt Stdlib loaded')
            skulptReady.value = true
        }
        document.head.appendChild(scriptStd)
    }
    document.head.appendChild(scriptCore)
}

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
    fractal_tree: `import turtle

t = turtle.Turtle()
turtle.Screen().bgcolor('black')
t.color('green')
t.left(90)
t.speed(0)
t.pensize(2)

def draw_tree(branch_len):
    if branch_len < 5:
        return
    
    # Draw branch
    t.forward(branch_len)
    
    # Right branch
    t.left(30)
    draw_tree(branch_len * 0.7)
    
    # Left branch
    t.right(60)
    draw_tree(branch_len * 0.7)
    
    # Return to base
    t.left(30)
    t.backward(branch_len)

t.up()
t.backward(100)
t.down()
draw_tree(100)
turtle.done()`,

    mandala: `import turtle

t = turtle.Turtle()
t.speed(0)
turtle.Screen().bgcolor("black")
colors = ["red", "purple", "blue", "green", "orange", "yellow"]

for x in range(360):
    t.pencolor(colors[x % 6])
    t.width(x // 100 + 1)
    t.forward(x)
    t.left(59)

turtle.done()`,

    koch_snowflake: `import turtle

t = turtle.Turtle()
t.speed(0)
t.penup()
t.goto(-150, 90)
t.pendown()

def koch_curve(t, order, size):
    if order == 0:
        t.forward(size)
    else:
        for angle in [60, -120, 60, 0]:
            koch_curve(t, order - 1, size / 3)
            t.left(angle)

for _ in range(3):
    koch_curve(t, 3, 300)
    t.right(120)

turtle.done()`,

    spirograph: `import turtle

t = turtle.Turtle()
t.speed(0)
turtle.bgcolor("black")
t.pensize(2)

for i in range(36):
    for color in ["red", "magenta", "blue", "cyan", "green", "yellow"]:
        t.color(color)
        t.circle(100)
        t.left(10)

turtle.done()`,

    dragon_curve: `import turtle

def dragon(level, size, direction, t):
    if level:
        t.right(direction * 45)
        dragon(level - 1, size / (2 ** 0.5), 1, t)
        t.left(direction * 90)
        dragon(level - 1, size / (2 ** 0.5), -1, t)
        t.right(direction * 45)
    else:
        t.forward(size)

t = turtle.Turtle()
t.speed(0)
t.hideturtle()
t.penup()
t.goto(-100, 0)
t.pendown()

dragon(12, 300, 1, t)
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

const editorKey = ref(0)

function loadExample() {
    if (selectedExample.value && examples[selectedExample.value]) {
        code.value = examples[selectedExample.value]
        editorKey.value++
    }
}

function clearCanvas() {
    const canvasDiv = document.getElementById('skulpt-canvas')
    if (canvasDiv) {
        canvasDiv.innerHTML = ''
    }
    output.value = []
}

function downloadCanvas() {
    const canvasDiv = document.getElementById('skulpt-canvas')
    const canvas = canvasDiv?.querySelector('canvas')
    if (canvas) {
        const link = document.createElement('a')
        link.download = 'turtle-art.png'
        link.href = canvas.toDataURL('image/png')
        link.click()
    }
}

const colorsysSource = `
# Source: https://github.com/python/cpython/blob/3.6/Lib/colorsys.py
"""Conversion functions between RGB and other color systems."""

__all__ = ["rgb_to_yiq","yiq_to_rgb","rgb_to_hls","hls_to_rgb",
           "rgb_to_hsv","hsv_to_rgb"]

ONE_THIRD = 1.0/3.0
ONE_SIXTH = 1.0/6.0
TWO_THIRD = 2.0/3.0

def rgb_to_yiq(r, g, b):
    y = 0.30*r + 0.59*g + 0.11*b
    i = 0.60*r - 0.28*g - 0.32*b
    q = 0.21*r - 0.52*g + 0.31*b
    return (y, i, q)

def yiq_to_rgb(y, i, q):
    r = y + 0.948262*i + 0.624013*q
    g = y - 0.276066*i - 0.639810*q
    b = y - 1.105450*i + 1.729860*q
    if r < 0.0: r = 0.0
    if g < 0.0: g = 0.0
    if b < 0.0: b = 0.0
    if r > 1.0: r = 1.0
    if g > 1.0: g = 1.0
    if b > 1.0: b = 1.0
    return (r, g, b)

def rgb_to_hls(r, g, b):
    maxc = max(r, g, b)
    minc = min(r, g, b)
    l = (minc+maxc)/2.0
    if minc == maxc:
        return 0.0, l, 0.0
    s = (maxc-minc) / (2.0-maxc-minc if l < 0.5 else maxc+minc-2.0)
    rc = (maxc-r) / (maxc-minc)
    gc = (maxc-g) / (maxc-minc)
    bc = (maxc-b) / (maxc-minc)
    if r == maxc:
        h = bc-gc
    elif g == maxc:
        h = 2.0+rc-bc
    else:
        h = 4.0+gc-rc
    h = (h/6.0) % 1.0
    return h, l, s

def hls_to_rgb(h, l, s):
    if s == 0.0:
        return l, l, l
    if l <= 0.5:
        m2 = l * (1.0+s)
    else:
        m2 = l+s-(l*s)
    m1 = 2.0*l - m2
    return (_v(m1, m2, h+ONE_THIRD), _v(m1, m2, h), _v(m1, m2, h-ONE_THIRD))

def _v(m1, m2, hue):
    hue = hue % 1.0
    if hue < ONE_SIXTH:
        return m1 + (m2-m1)*hue*6.0
    if hue < 0.5:
        return m2
    if hue < TWO_THIRD:
        return m1 + (m2-m1)*(TWO_THIRD-hue)*6.0
    return m1

def rgb_to_hsv(r, g, b):
    maxc = max(r, g, b)
    minc = min(r, g, b)
    v = maxc
    if minc == maxc:
        return 0.0, 0.0, v
    s = (maxc-minc) / maxc
    rc = (maxc-r) / (maxc-minc)
    gc = (maxc-g) / (maxc-minc)
    bc = (maxc-b) / (maxc-minc)
    if r == maxc:
        h = bc-gc
    elif g == maxc:
        h = 2.0+rc-bc
    else:
        h = 4.0+gc-rc
    h = (h/6.0) % 1.0
    return h, s, v

def hsv_to_rgb(h, s, v):
    if s == 0.0:
        return v, v, v
    i = int(h*6.0)
    f = (h*6.0) - i
    p = v*(1.0 - s)
    q = v*(1.0 - s*f)
    t = v*(1.0 - s*(1.0-f))
    i = i%6
    if i == 0: return v, t, p
    if i == 1: return q, v, p
    if i == 2: return p, v, t
    if i == 3: return p, q, v
    if i == 4: return t, p, v
    if i == 5: return v, p, q
`

// Skulpt output function
function outf(text) {
    if (text && text !== '\n') {
        output.value.push({
            type: 'output',
            content: text
        })
    }
}

// Skulpt builtin read function
function builtinRead(x) {
    if (x === 'src/lib/colorsys.py' || x === 'colorsys.py') {
        return colorsysSource
    }

    if (window.Sk.builtinFiles === undefined || window.Sk.builtinFiles["files"][x] === undefined)
        throw "File not found: '" + x + "'";
    return window.Sk.builtinFiles["files"][x];
}

const stopExecution = ref(false)

function stopTurtleCode() {
    stopExecution.value = true
}

async function runTurtleCode() {
    if (!code.value.trim() || isRunning.value || !skulptReady.value) return

    isRunning.value = true
    stopExecution.value = false
    output.value = []
    clearCanvas()

    try {
        // Configure Skulpt
        window.Sk.pre = "output"
        window.Sk.configure({
            output: outf,
            read: builtinRead,
            yieldLimit: 100, // Check for interrupts frequently
            execLimit: null // Allow long running animations, but we can stop them manually
        })

            // Set Turtle target
            ; (window.Sk.TurtleGraphics || (window.Sk.TurtleGraphics = {})).target = 'skulpt-canvas'

        // Run the code
        const promise = window.Sk.misceval.asyncToPromise(function () {
            return window.Sk.importMainWithBody("<stdin>", false, code.value, true)
        }, {
            "*": () => {
                if (stopExecution.value) {
                    throw "Execution interrupted by user"
                }
            }
        })

        await promise

        output.value.push({
            type: 'success',
            content: '✓ Code executed successfully'
        })

    } catch (error) {
        if (error === "Execution interrupted by user") {
            output.value.push({
                type: 'warning',
                content: '⚠ Execution stopped by user'
            })
        } else {
            console.error('Skulpt error:', error)
            output.value.push({
                type: 'error',
                content: error.toString()
            })
        }
    } finally {
        isRunning.value = false
        stopExecution.value = false
    }
}

onMounted(() => {
    if (process.client) {
        document.documentElement.classList.add('dark')
        loadSkulpt()
    }
})
</script>

<style>
/* Skulpt Canvas Styling */
#skulpt-canvas canvas {
    display: block;
    margin: 0 auto;
}
</style>
