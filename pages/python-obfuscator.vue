<template>
    <div>
        <!-- Obfuscator Editor -->
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
                        ]">Online Python Obfuscator</span>
                    </div>
                </div>

                <!-- Right: Actions -->
                <div class="flex items-center space-x-2">
                    <!-- Obfuscate Button -->
                    <button @click="obfuscateCode" :disabled="isObfuscating || !inputCode.trim()" :class="[
                        'flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                        isObfuscating || !inputCode.trim()
                            ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                            : theme === 'dark'
                                ? 'bg-python-blue-600 hover:bg-python-blue-700 text-white'
                                : 'bg-python-blue-600 hover:bg-python-blue-700 text-white'
                    ]">
                        <Icon :icon="isObfuscating ? 'ph:spinner' : 'ph:lock'"
                            :class="['w-4 h-4', isObfuscating ? 'animate-spin' : '']" />
                        <span class="hidden sm:inline">{{ isObfuscating ? 'Obfuscating...' : 'Obfuscate' }}</span>
                    </button>

                    <!-- Copy Button -->
                    <button v-if="obfuscatedCode" @click="copyToClipboard" :class="[
                        'flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                        copied
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : theme === 'dark'
                                ? 'bg-python-blue-600 hover:bg-python-blue-700 text-white'
                                : 'bg-python-blue-600 hover:bg-python-blue-700 text-white'
                    ]">
                        <Icon :icon="copied ? 'ph:check' : 'ph:copy'" class="w-4 h-4" />
                        <span class="hidden sm:inline">{{ copied ? 'Copied!' : 'Copy' }}</span>
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
                <!-- Input Editor -->
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
                            <span>Original Code</span>
                        </div>

                        <div class="flex items-center space-x-2">
                            <select v-model="selectedExample" @change="loadExample" :class="[
                                'text-xs px-2 py-1 rounded transition-colors border',
                                theme === 'dark'
                                    ? 'bg-gray-700 border-gray-600 text-gray-300'
                                    : 'bg-white border-gray-300 text-gray-700'
                            ]">
                                <option value="">Load Example...</option>
                                <option value="fibonacci">Fibonacci Function</option>
                                <option value="calculator">Simple Calculator</option>
                                <option value="sorting">Sorting Algorithm</option>
                                <option value="password">Password Generator</option>
                            </select>
                            <button @click="clearInput" :class="[
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
                        <MonacoEditor v-model="inputCode" :language="'python'" :theme="monacoTheme"
                            :options="monacoOptions" height="100%" class="h-full w-full" />
                    </div>
                </section>

                <!-- Output Editor -->
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
                        <div class="flex items-center space-x-2 h-full pt-1 pb-0.5">
                            <div>
                                <Icon icon="ph:lock-key" class="w-4 h-4" />
                            </div>
                            <div>
                                <span>Obfuscated Code</span>
                            </div>
                        </div>

                        <button v-if="obfuscatedCode" @click="clearOutput" :class="[
                            'text-xs px-2 py-1 rounded transition-colors',
                            theme === 'dark'
                                ? 'hover:bg-gray-700 text-gray-400'
                                : 'hover:bg-gray-200 text-gray-600'
                        ]">
                            Clear
                        </button>
                    </div>

                    <!-- Output Content -->
                    <div class="flex-1 overflow-hidden">
                        <MonacoEditor v-model="obfuscatedCode" :language="'python'" :theme="monacoTheme"
                            :options="{ ...monacoOptions, readOnly: true }" height="100%" class="h-full w-full" />
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
                                <Adsense key="obfuscator-ad-1" client="ca-pub-1356911639243870" ad-slot="3430238458"
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
                    Online Python Code Obfuscator
                </h1>

                <div class="max-w-4xl mx-auto text-left space-y-6 text-gray-700 dark:text-gray-300">
                    <p class="text-base md:text-lg leading-relaxed">
                        Welcome to the <strong>Python Code Obfuscator</strong> – a free online tool to obfuscate your
                        Python code
                        and make it harder to read and reverse-engineer. This tool transforms your readable Python code
                        into an
                        obfuscated version that maintains functionality while being difficult for humans to understand.
                    </p>

                    <p class="text-base md:text-lg leading-relaxed">
                        Our obfuscator uses multiple techniques including variable renaming, string encoding, and code
                        restructuring
                        to protect your Python source code. The obfuscated code runs exactly the same as the original
                        but is much
                        harder to comprehend and modify. Perfect for protecting intellectual property, preventing code
                        theft, or
                        adding an extra layer of security to your Python applications.
                    </p>

                    <p class="text-base md:text-lg leading-relaxed">
                        All obfuscation happens directly in your browser – your code never leaves your computer. The
                        tool is
                        completely free to use with no registration required. Simply paste your Python code, click
                        obfuscate,
                        and get the protected version instantly.
                    </p>

                    <h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Obfuscation
                        Techniques</h3>
                    <ul class="list-disc list-inside space-y-2 text-base md:text-lg ml-4">
                        <li><strong>Variable Renaming:</strong> Replaces meaningful variable names with random strings
                        </li>
                        <li><strong>String Encoding:</strong> Encodes string literals to make them unreadable</li>
                        <li><strong>Code Restructuring:</strong> Reorganizes code structure while maintaining logic</li>
                        <li><strong>Comment Removal:</strong> Strips all comments and docstrings</li>
                        <li><strong>Whitespace Minimization:</strong> Removes unnecessary whitespace</li>
                    </ul>

                    <h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">How This Works
                    </h3>
                    <div class="space-y-6">
                        <!-- Timeline -->
                        <div :class="[
                            'relative p-6 md:p-8 rounded-lg border',
                            'bg-white dark:bg-gray-800',
                            'border-gray-200 dark:border-gray-700'
                        ]">
                            <!-- Timeline Line (hidden on mobile) -->
                            <div
                                class="hidden md:block absolute left-12 top-16 bottom-16 w-0.5 bg-gray-300 dark:bg-gray-600">
                            </div>

                            <div class="space-y-8">
                                <!-- Step 1 -->
                                <div class="flex items-start space-x-4 md:space-x-6 relative">
                                    <div :class="[
                                        'flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-semibold',
                                        'bg-python-blue-600 text-white z-10',
                                        'shadow-md'
                                    ]">
                                        1
                                    </div>
                                    <div class="flex-1 pt-1">
                                        <h4
                                            class="font-semibold text-base md:text-lg text-gray-900 dark:text-white mb-2">
                                            Parse Python Code
                                        </h4>
                                        <p class="text-sm md:text-base text-gray-600 dark:text-gray-300">
                                            Your code is parsed into an Abstract Syntax Tree (AST) using Python's
                                            built-in parser.
                                            This ensures we understand the code structure perfectly.
                                        </p>
                                    </div>
                                </div>

                                <!-- Step 2 -->
                                <div class="flex items-start space-x-4 md:space-x-6 relative">
                                    <div :class="[
                                        'flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-semibold',
                                        'bg-python-blue-600 text-white z-10',
                                        'shadow-md'
                                    ]">
                                        2
                                    </div>
                                    <div class="flex-1 pt-1">
                                        <h4
                                            class="font-semibold text-base md:text-lg text-gray-900 dark:text-white mb-2">
                                            Identify & Map Identifiers
                                        </h4>
                                        <p class="text-sm md:text-base text-gray-600 dark:text-gray-300">
                                            The obfuscator identifies all variables, functions, and classes. It creates
                                            a mapping
                                            of original names to obfuscated names (e.g.,
                                            <code
                                                class="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs">calculate_fibonacci</code>
                                            →
                                            <code
                                                class="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs">_0x0</code>).
                                        </p>
                                    </div>
                                </div>

                                <!-- Step 3 -->
                                <div class="flex items-start space-x-4 md:space-x-6 relative">
                                    <div :class="[
                                        'flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-semibold',
                                        'bg-python-blue-600 text-white z-10',
                                        'shadow-md'
                                    ]">
                                        3
                                    </div>
                                    <div class="flex-1 pt-1">
                                        <h4
                                            class="font-semibold text-base md:text-lg text-gray-900 dark:text-white mb-2">
                                            Transform AST Nodes
                                        </h4>
                                        <p class="text-sm md:text-base text-gray-600 dark:text-gray-300">
                                            The AST is traversed and transformed. Variables are renamed, strings are
                                            encoded with
                                            base64, and comments are removed - all while preserving the code's logic.
                                        </p>
                                    </div>
                                </div>

                                <!-- Step 4 -->
                                <div class="flex items-start space-x-4 md:space-x-6 relative">
                                    <div :class="[
                                        'flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-semibold',
                                        'bg-python-blue-600 text-white z-10',
                                        'shadow-md'
                                    ]">
                                        4
                                    </div>
                                    <div class="flex-1 pt-1">
                                        <h4
                                            class="font-semibold text-base md:text-lg text-gray-900 dark:text-white mb-2">
                                            Generate Obfuscated Code
                                        </h4>
                                        <p class="text-sm md:text-base text-gray-600 dark:text-gray-300">
                                            The transformed AST is converted back to Python code. The result is
                                            syntactically
                                            valid, functionally identical, but much harder to understand.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Comparison Table -->
                        <div class="overflow-x-auto">
                            <table :class="[
                                'w-full border rounded-lg overflow-hidden',
                                'border-gray-200 dark:border-gray-700'
                            ]">
                                <thead :class="[
                                    'bg-python-blue-600 text-white'
                                ]">
                                    <tr>
                                        <th
                                            class="px-3 md:px-4 py-2 md:py-3 text-left text-sm md:text-base font-semibold">
                                            Original Code
                                        </th>
                                        <th class="px-2 py-2 md:py-3 text-center w-12">
                                            <Icon icon="ph:arrow-right" class="w-4 h-4 md:w-5 md:h-5 inline" />
                                        </th>
                                        <th
                                            class="px-3 md:px-4 py-2 md:py-3 text-left text-sm md:text-base font-semibold">
                                            Obfuscated Code
                                        </th>
                                    </tr>
                                </thead>
                                <tbody :class="[
                                    'divide-y',
                                    'divide-gray-200 dark:divide-gray-700'
                                ]">
                                    <tr :class="[
                                        'bg-white dark:bg-gray-800'
                                    ]">
                                        <td class="px-3 md:px-4 py-2 md:py-3 font-mono text-xs md:text-sm">
                                            <code>calculate_fibonacci</code>
                                        </td>
                                        <td class="px-2 py-2 md:py-3 text-center text-gray-400 text-sm">→</td>
                                        <td
                                            class="px-3 md:px-4 py-2 md:py-3 font-mono text-xs md:text-sm text-python-blue-600 dark:text-python-blue-400">
                                            <code>_0x0</code>
                                        </td>
                                    </tr>
                                    <tr :class="[
                                        'bg-gray-50 dark:bg-gray-700'
                                    ]">
                                        <td class="px-3 md:px-4 py-2 md:py-3 font-mono text-xs md:text-sm">
                                            <code>"Fibonacci sequence"</code>
                                        </td>
                                        <td class="px-2 py-2 md:py-3 text-center text-gray-400 text-sm">→</td>
                                        <td
                                            class="px-3 md:px-4 py-2 md:py-3 font-mono text-xs md:text-sm text-python-blue-600 dark:text-python-blue-400 break-all">
                                            <code class="break-all">__import__('base64').b64decode('...')</code>
                                        </td>
                                    </tr>
                                    <tr :class="[
                                        'bg-white dark:bg-gray-800'
                                    ]">
                                        <td class="px-3 md:px-4 py-2 md:py-3 font-mono text-xs md:text-sm">
                                            <code>sequence = [0, 1]</code>
                                        </td>
                                        <td class="px-2 py-2 md:py-3 text-center text-gray-400 text-sm">→</td>
                                        <td
                                            class="px-3 md:px-4 py-2 md:py-3 font-mono text-xs md:text-sm text-python-blue-600 dark:text-python-blue-400">
                                            <code>_0x2 = [0, 1]</code>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Use Cases</h3>
                    <ul class="list-disc list-inside space-y-2 text-base md:text-lg ml-4">
                        <li>Protecting proprietary algorithms and business logic</li>
                        <li>Preventing unauthorized code modification</li>
                        <li>Adding security layer to distributed Python applications</li>
                        <li>Protecting intellectual property in open-source projects</li>
                        <li>Making reverse engineering more difficult</li>
                    </ul>

                    <div :class="[
                        'mt-8 p-4 rounded-lg border',
                        'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                    ]">
                        <p class="text-sm text-yellow-800 dark:text-yellow-200">
                            <strong>Note:</strong> Obfuscation is not encryption. While it makes code harder to read,
                            determined
                            attackers can still reverse-engineer obfuscated code. For sensitive applications, combine
                            obfuscation
                            with other security measures like encryption and access controls.
                        </p>
                    </div>
                </div>
            </div>
        </LibraryInfoSection>

        <AppFooter />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useHead } from '#app'
import { Icon } from '@iconify/vue'
import MonacoEditor from '~/components/MonacoEditor.vue'
import LibraryInfoSection from '~/components/LibraryInfoSection.vue'
import Adsense from '~/components/Adsense.vue'
import AppFooter from '~/components/AppFooter.vue'

defineOptions({
    name: 'PythonObfuscator'
})

definePageMeta({
    layout: 'library'
})

useHead({
    title: 'Python Code Obfuscator - Free Online Tool',
    meta: [
        { name: 'description', content: 'Free online Python code obfuscator. Protect your Python source code by making it harder to read and reverse-engineer. Browser-based, no registration required.' },
        { name: 'keywords', content: 'python obfuscator, code obfuscation, python protection, source code protection, obfuscate python, python security' },
        { name: 'author', content: 'Pybadu' },
        { property: 'og:title', content: 'Python Code Obfuscator - Free Online Tool' },
        { property: 'og:description', content: 'Obfuscate your Python code online for free' },
        { property: 'og:type', content: 'website' },
        { property: 'og:image', content: '/pybadu.png' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Python Code Obfuscator' },
        { name: 'twitter:description', content: 'Free online Python code obfuscator' },
        { name: 'twitter:image', content: '/pybadu.png' }
    ]
})

const theme = ref('dark')
const selectedExample = ref('')
const output = ref([])
const inputCode = ref(`# Example Python code
def calculate_fibonacci(n):
    """Calculate Fibonacci sequence up to n terms"""
    if n <= 0:
        return []
    elif n == 1:
        return [0]
    elif n == 2:
        return [0, 1]
    
    sequence = [0, 1]
    for i in range(2, n):
        next_value = sequence[i-1] + sequence[i-2]
        sequence.append(next_value)
    
    return sequence

# Test the function
result = calculate_fibonacci(10)
print("Fibonacci sequence:", result)
`)

const obfuscatedCode = ref('')
const isObfuscating = ref(false)
const copied = ref(false)

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

function obfuscateCode() {
    if (!inputCode.value.trim()) return

    isObfuscating.value = true

    // Use Pyodide for proper Python AST-based obfuscation
    setTimeout(async () => {
        try {
            // Initialize Pyodide if not already done
            if (!window.pyodide) {
                output.value.push({
                    type: 'error',
                    content: 'Initializing Python environment...'
                })

                window.pyodide = await loadPyodide()

                output.value.push({
                    type: 'success',
                    content: 'Python environment ready'
                })
            }

            const code = inputCode.value

            // Python obfuscation script using AST
            const obfuscatorScript = `
import ast
import base64
import random
import string

class ObfuscatorTransformer(ast.NodeTransformer):
    def __init__(self):
        self.var_map = {}
        self.counter = 0
        self.keywords = set([
            'False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await',
            'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except',
            'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is',
            'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return',
            'try', 'while', 'with', 'yield'
        ])
        self.builtins = set([
            'abs', 'all', 'any', 'ascii', 'bin', 'bool', 'bytearray', 'bytes',
            'callable', 'chr', 'classmethod', 'compile', 'complex', 'delattr',
            'dict', 'dir', 'divmod', 'enumerate', 'eval', 'exec', 'filter',
            'float', 'format', 'frozenset', 'getattr', 'globals', 'hasattr',
            'hash', 'help', 'hex', 'id', 'input', 'int', 'isinstance',
            'issubclass', 'iter', 'len', 'list', 'locals', 'map', 'max',
            'memoryview', 'min', 'next', 'object', 'oct', 'open', 'ord',
            'pow', 'print', 'property', 'range', 'repr', 'reversed', 'round',
            'set', 'setattr', 'slice', 'sorted', 'staticmethod', 'str', 'sum',
            'super', 'tuple', 'type', 'vars', 'zip', '__import__'
        ])
    
    def get_obfuscated_name(self, original):
        if original in self.keywords or original in self.builtins:
            return original
        if original not in self.var_map:
            self.var_map[original] = f'_0x{self.counter:x}'
            self.counter += 1
        return self.var_map[original]
    
    def visit_Name(self, node):
        # Rename variables but not keywords or builtins
        if isinstance(node.ctx, (ast.Store, ast.Load, ast.Del)):
            if node.id not in self.keywords and node.id not in self.builtins:
                node.id = self.get_obfuscated_name(node.id)
        return node
    
    def visit_FunctionDef(self, node):
        # Rename function names
        if not node.name.startswith('__'):
            node.name = self.get_obfuscated_name(node.name)
        
        # Rename parameters
        for arg in node.args.args:
            if arg.arg not in self.keywords:
                arg.arg = self.get_obfuscated_name(arg.arg)
        
        # Process function body
        self.generic_visit(node)
        return node
    
    def visit_ClassDef(self, node):
        # Rename class names
        if not node.name.startswith('__'):
            node.name = self.get_obfuscated_name(node.name)
        self.generic_visit(node)
        return node
    
    def visit_Constant(self, node):
        # Encode string constants
        if isinstance(node.value, str) and len(node.value) > 0:
            try:
                encoded = base64.b64encode(node.value.encode()).decode()
                # Create a call to decode the string
                return ast.Call(
                    func=ast.Attribute(
                        value=ast.Call(
                            func=ast.Attribute(
                                value=ast.Call(
                                    func=ast.Name(id='__import__', ctx=ast.Load()),
                                    args=[ast.Constant(value='base64')],
                                    keywords=[]
                                ),
                                attr='b64decode',
                                ctx=ast.Load()
                            ),
                            args=[ast.Constant(value=encoded)],
                            keywords=[]
                        ),
                        attr='decode',
                        ctx=ast.Load()
                    ),
                    args=[],
                    keywords=[]
                )
            except:
                pass
        return node

def obfuscate_code(source_code):
    try:
        # Parse the code
        tree = ast.parse(source_code)
        
        # Transform the AST
        transformer = ObfuscatorTransformer()
        new_tree = transformer.visit(tree)
        
        # Fix missing locations
        ast.fix_missing_locations(new_tree)
        
        # Convert back to code
        obfuscated = ast.unparse(new_tree)
        
        return obfuscated
    except SyntaxError as e:
        return f"Syntax Error: {str(e)}"
    except Exception as e:
        return f"Error: {str(e)}"

# Obfuscate the input code
input_code = """${code.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')}"""
result = obfuscate_code(input_code)
result
`

            // Run the obfuscation in Pyodide
            const result = await window.pyodide.runPythonAsync(obfuscatorScript)

            // Add header
            const header = `# Obfuscated by Pybadu Python Obfuscator\n# https://pybadu.com/python-obfuscator\n# Advanced AST-based obfuscation\n\n`

            obfuscatedCode.value = header + result

        } catch (error) {
            console.error('Obfuscation error:', error)

            // Fallback to simple obfuscation if Pyodide fails
            const code = inputCode.value
            let obfuscated = code

            // 1. Remove comments and docstrings
            obfuscated = obfuscated.replace(/#.*$/gm, '')
            obfuscated = obfuscated.replace(/"""[\s\S]*?"""/g, '')
            obfuscated = obfuscated.replace(/'''[\s\S]*?'''/g, '')

            // 2. Generate random variable names
            const varMap = new Map()
            let varCounter = 0

            const varPattern = /\b([a-z_][a-z0-9_]*)\b/gi
            const matches = code.matchAll(varPattern)

            for (const match of matches) {
                const varName = match[1]
                const keywords = ['def', 'class', 'if', 'elif', 'else', 'for', 'while', 'return', 'import', 'from', 'as', 'print', 'range', 'len', 'str', 'int', 'float', 'list', 'dict', 'set', 'tuple', 'True', 'False', 'None', 'and', 'or', 'not', 'in', 'is', 'lambda', 'with', 'try', 'except', 'finally', 'raise', 'assert', 'break', 'continue', 'pass', 'yield', 'global', 'nonlocal', 'del']

                if (!keywords.includes(varName) && !varMap.has(varName)) {
                    varMap.set(varName, `_0x${(varCounter++).toString(16)}`)
                }
            }

            // 3. Replace variable names
            varMap.forEach((obfName, originalName) => {
                const regex = new RegExp(`\\b${originalName}\\b`, 'g')
                obfuscated = obfuscated.replace(regex, obfName)
            })

            // 4. Encode strings
            obfuscated = obfuscated.replace(/"([^"]*)"/g, (match, str) => {
                if (!str) return '""'
                try {
                    const encoded = btoa(str)
                    return `__import__('base64').b64decode('${encoded}').decode()`
                } catch (e) {
                    return match
                }
            })

            obfuscated = obfuscated.replace(/'([^']*)'/g, (match, str) => {
                if (!str) return "''"
                try {
                    const encoded = btoa(str)
                    return `__import__('base64').b64decode('${encoded}').decode()`
                } catch (e) {
                    return match
                }
            })

            // 5. Clean up empty lines but preserve indentation
            obfuscated = obfuscated.split('\n')
                .map(line => line.trimEnd())
                .filter(line => line.trim())
                .join('\n')

            const header = `# Obfuscated by Pybadu Python Obfuscator\n# https://pybadu.com/python-obfuscator\n# Fallback obfuscation (Pyodide not available)\n\n`

            obfuscatedCode.value = header + obfuscated
        } finally {
            isObfuscating.value = false
        }
    }, 500)
}

function clearInput() {
    inputCode.value = ''
}

function clearOutput() {
    obfuscatedCode.value = ''
}

const examples = {
    fibonacci: `# Example Python code
def calculate_fibonacci(n):
    """Calculate Fibonacci sequence up to n terms"""
    if n <= 0:
        return []
    elif n == 1:
        return [0]
    elif n == 2:
        return [0, 1]
    
    sequence = [0, 1]
    for i in range(2, n):
        next_value = sequence[i-1] + sequence[i-2]
        sequence.append(next_value)
    
    return sequence

# Test the function
result = calculate_fibonacci(10)
print("Fibonacci sequence:", result)
`,
    calculator: `# Simple Calculator
def add(a, b):
    """Add two numbers"""
    return a + b

def subtract(a, b):
    """Subtract two numbers"""
    return a - b

def multiply(a, b):
    """Multiply two numbers"""
    return a * b

def divide(a, b):
    """Divide two numbers"""
    if b == 0:
        return "Error: Division by zero"
    return a / b

# Test calculations
print("10 + 5 =", add(10, 5))
print("10 - 5 =", subtract(10, 5))
print("10 * 5 =", multiply(10, 5))
print("10 / 5 =", divide(10, 5))
`,
    sorting: `# Bubble Sort Algorithm
def bubble_sort(arr):
    """Sort array using bubble sort"""
    n = len(arr)
    
    for i in range(n):
        swapped = False
        
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        
        if not swapped:
            break
    
    return arr

# Test sorting
numbers = [64, 34, 25, 12, 22, 11, 90]
print("Original array:", numbers)
sorted_array = bubble_sort(numbers.copy())
print("Sorted array:", sorted_array)
`,
    password: `# Password Generator
import random
import string

def generate_password(length=12, use_special=True):
    """Generate a random password"""
    characters = string.ascii_letters + string.digits
    
    if use_special:
        characters += string.punctuation
    
    password = ''.join(random.choice(characters) for _ in range(length))
    return password

def generate_multiple_passwords(count=5, length=12):
    """Generate multiple passwords"""
    passwords = []
    
    for i in range(count):
        pwd = generate_password(length)
        passwords.append(pwd)
    
    return passwords

# Generate passwords
print("Single password:", generate_password(16))
print("\\nMultiple passwords:")
for i, pwd in enumerate(generate_multiple_passwords(3, 14), 1):
    print(f"  {i}. {pwd}")
`
}

function loadExample() {
    if (selectedExample.value && examples[selectedExample.value]) {
        inputCode.value = examples[selectedExample.value]
        // Don't reset - keep the selected value visible
    }
}

function copyToClipboard() {
    if (!obfuscatedCode.value) return

    navigator.clipboard.writeText(obfuscatedCode.value)
    copied.value = true

    setTimeout(() => {
        copied.value = false
    }, 2000)
}

// Load Pyodide from CDN
async function loadPyodide() {
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js'
    document.head.appendChild(script)

    return new Promise((resolve, reject) => {
        script.onload = async () => {
            try {
                const pyodide = await window.loadPyodide({
                    indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/'
                })
                resolve(pyodide)
            } catch (error) {
                reject(error)
            }
        }
        script.onerror = reject
    })
}

// Apply dark theme on mount
if (process.client) {
    document.documentElement.classList.add('dark')
}
</script>
