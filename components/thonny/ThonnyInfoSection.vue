<template>
    <section class="py-16 px-4" style="border-top: 10px solid #FAF1E6; background-color: #FFFDF6;">
        <div class="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
            <!-- Left Side Ad -->
            <div class="hidden lg:block lg:col-span-2">
                <div class="sticky top-8 flex justify-center">
                    <ClientOnly>
                        <Adsense client="ca-pub-1356911639243870" ad-slot="3430238458" format="vertical"
                            style="display:block; width: 100%;" />
                    </ClientOnly>
                </div>
            </div>

            <!-- Main Content -->
            <div class="lg:col-span-8">
                <article class="max-w-3xl mx-auto prose prose-lg prose-blue text-gray-700">
                    <!-- Header -->
                    <div class="text-left mb-12 not-prose border-b pb-8">
                        <h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
                            {{ title }}
                        </h1>
                        <p class="text-xl text-gray-500 leading-relaxed">
                            Experience the simplicity of Python programming directly in your browser.
                            Thonny Online brings the beloved educational IDE to the web, powered by WebAssembly.
                        </p>
                    </div>

                    <!-- Intro -->
                    <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mt-12 mb-6">What is Thonny Online?</h2>
                    <p class="text-base md:text-lg leading-relaxed text-gray-600 mb-6">
                        <strong>Thonny Online</strong> is a web-based adaptation of the popular Thonny IDE, designed
                        specifically for beginners and educators. Unlike traditional cloud-based IDEs that run code
                        on remote servers, Thonny Online uses <strong>Pyodide</strong> technology to run a full
                        Python interpreter directly inside your web browser.
                    </p>
                    <p class="text-base md:text-lg leading-relaxed text-gray-600 mb-6">
                        This approach means you get a responsive, private coding environment with zero setup. It's
                        perfect for quickly testing snippets, learning Python syntax, or teaching a class without
                        worrying about installation permissions or internet latency.
                    </p>

                    <!-- Features List -->
                    <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mt-12 mb-6">Key Features</h2>
                    <div class="not-prose grid grid-cols-1 sm:grid-cols-2 gap-6 my-8">
                        <div v-for="(card, index) in featureCards" :key="index" class="flex flex-col">
                            <div class="flex items-center mb-2 text-gray-900 font-bold">
                                <Icon :icon="card.icon" class="w-5 h-5 text-blue-600 mr-2" />
                                {{ card.title }}
                            </div>
                            <p class="text-base md:text-lg text-gray-600 leading-relaxed">{{ card.description }}</p>
                        </div>
                    </div>

                    <!-- How to Use -->
                    <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mt-12 mb-6">How to Use Thonny Online</h2>
                    <p class="text-base md:text-lg leading-relaxed text-gray-600 mb-6">Getting started is immediate.
                        Here are the core workflows:</p>

                    <div class="space-y-8 mt-8">
                        <div>
                            <h3 class="text-xl md:text-2xl font-bold text-gray-800 mb-3">
                                How to run Python code?
                            </h3>
                            <p class="text-base md:text-lg leading-relaxed text-gray-600 pl-8">
                                Type your Python code in the main editor. Press <kbd
                                    class="bg-gray-100 border border-gray-300 rounded px-1.5 py-0.5 text-sm font-mono text-gray-700 mx-1">F5</kbd>
                                or click the <strong>Run</strong> button in the toolbar to execute your script. The
                                output will appear in the
                                Shell panel below.
                            </p>
                        </div>

                        <div>
                            <h3 class="text-xl md:text-2xl font-bold text-gray-800 mb-3">
                                How to create a new file?
                            </h3>
                            <p class="text-base md:text-lg leading-relaxed text-gray-600 pl-8">
                                Go to the <strong>File</strong> menu and select <strong>New</strong>, or click the
                                <strong>+</strong> icon in the toolbar.
                                You can work on multiple files simultaneously using the file tabs. Don't forget to save
                                your work!
                            </p>
                        </div>

                        <div>
                            <h3 class="text-xl md:text-2xl font-bold text-gray-800 mb-3">
                                How to use TODO lists?
                            </h3>
                            <p class="text-base md:text-lg leading-relaxed text-gray-600 pl-8">
                                Add comments starting with <code># TODO</code> or <code># FIXME</code> in your code.
                                Then, enable the <strong>TODO</strong> panel from the <strong>View</strong> menu.
                                This panel scans your code and lists all your pending tasks, allowing you to jump
                                directly to them.
                            </p>
                        </div>

                        <div>
                            <h3 class="text-xl md:text-2xl font-bold text-gray-800 mb-3">
                                How to use the Shell?
                            </h3>
                            <p class="text-base md:text-lg leading-relaxed text-gray-600 pl-8">
                                The bottom panel contains an interactive Python shell (REPL). You can type Python
                                commands directly
                                into the input field (marked with <code>>>></code>) for instant execution and value
                                inspection.
                            </p>
                        </div>

                        <div>
                            <h3 class="text-xl md:text-2xl font-bold text-gray-800 mb-3">
                                How to install packages?
                            </h3>
                            <p class="text-base md:text-lg leading-relaxed text-gray-600 pl-8">
                                Open the <strong>Tools</strong> menu and select <strong>Manage packages...</strong>.
                                Search for pure Python packages on PyPI and install them directly into your
                                browser-based environment.
                            </p>
                        </div>
                    </div>

                    <!-- Comparison -->
                    <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mt-12 mb-6">This Website vs Thonny IDE
                    </h2>
                    <p class="text-base md:text-lg leading-relaxed text-gray-600 mb-6">
                        While Thonny Online strives to replicate the desktop experience, running in a browser
                        environment comes
                        with specific architectural differences.
                    </p>

                    <div class="not-prose overflow-hidden rounded-lg border border-gray-200 my-8">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th scope="col"
                                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Feature</th>
                                    <th scope="col"
                                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Desktop Thonny</th>
                                    <th scope="col"
                                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thonny Online</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr v-for="(row, idx) in comparisonRows" :key="idx">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{
                                        row.feature }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ row.desktop }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">{{
                                        row.online }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </article>
            </div>

            <!-- Right Side Ad -->
            <div class="hidden lg:block lg:col-span-2">
                <div class="sticky top-8 flex justify-center">
                    <ClientOnly>
                        <Adsense client="ca-pub-1356911639243870" ad-slot="3430238458" format="vertical"
                            style="display:block; width: 100%;" />
                    </ClientOnly>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import Adsense from '~/components/Adsense.vue'

defineProps({
    title: {
        type: String,
        default: 'Online Thonny IDE - Try on Browser'
    }
})

const featureCards = [
    {
        title: 'Zero Installation',
        description: 'Start coding instantly. No Python installation, environment setup, or configuration required. Just open the URL and code.',
        icon: 'ph:rocket-launch'
    },
    {
        title: 'Interactive Shell',
        description: 'Experiment with code snippets and inspect values in real-time using the built-in Python REPL shell.',
        icon: 'ph:terminal-window'
    },
    {
        title: 'Variable Inspector',
        description: 'Visualize your program\'s state. See variable names and values update automatically as your code executes.',
        icon: 'ph:list-magnifying-glass'
    },
    {
        title: 'Browser-Based Privacy',
        description: 'Your code runs locally in your browser using WebAssembly. No code is sent to a remote server, ensuring privacy.',
        icon: 'ph:shield-check'
    },
    {
        title: 'Program Tree (AST)',
        description: 'View the abstract syntax tree of your code to better understand how the Python interpreter parses your syntax.',
        icon: 'ph:tree-structure'
    },
    {
        title: 'Package Management',
        description: 'Install and use pure Python packages from PyPI using Micropip, extending the capabilities of the editor.',
        icon: 'ph:package'
    }
]

const comparisonRows = [
    {
        feature: 'Execution Engine',
        desktop: 'Native OS Process',
        online: 'Browser (WebAssembly)'
    },
    {
        feature: 'File System',
        desktop: 'Full Disk Access',
        online: 'Virtual / LocalStorage'
    },
    {
        feature: 'Network Access',
        desktop: 'Unrestricted',
        online: 'Restricted (CORS)'
    },
    {
        feature: 'Step Debugger',
        desktop: 'Full Stepping',
        online: 'Limited / AST View'
    },
    {
        feature: 'External C Modules',
        desktop: 'Supported',
        online: 'Pre-compiled only'
    }
]
</script>

<style scoped>
/* Light theme specific styles for info section */
section {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
</style>
