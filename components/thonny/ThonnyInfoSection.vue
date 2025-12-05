<template>
    <section class="py-16 px-4 bg-white bg-[#FFFDF6]" style="border-top: 10px solid #FAF1E6;">
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
                    <h2>What is Thonny Online?</h2>
                    <p>
                        <strong>Thonny Online</strong> is a web-based adaptation of the popular Thonny IDE, designed
                        specifically for beginners and educators. Unlike traditional cloud-based IDEs that run code
                        on remote servers, Thonny Online uses <strong>Pyodide</strong> technology to run a full
                        Python interpreter directly inside your web browser.
                    </p>
                    <p>
                        This approach means you get a responsive, private coding environment with zero setup. It's
                        perfect for quickly testing snippets, learning Python syntax, or teaching a class without
                        worrying about installation permissions or internet latency.
                    </p>

                    <!-- Features List -->
                    <h2>Key Features</h2>
                    <div class="not-prose grid grid-cols-1 sm:grid-cols-2 gap-6 my-8">
                        <div v-for="(card, index) in featureCards" :key="index" class="flex flex-col">
                            <div class="flex items-center mb-2 text-gray-900 font-bold">
                                <Icon :icon="card.icon" class="w-5 h-5 text-blue-600 mr-2" />
                                {{ card.title }}
                            </div>
                            <p class="text-sm text-gray-600 leading-relaxed">{{ card.description }}</p>
                        </div>
                    </div>

                    <!-- How to Use -->
                    <h2>How to Use Thonny Online</h2>
                    <p>Getting started is immediate. Here are the core workflows:</p>

                    <div class="not-prose space-y-6 my-8 border-l-2 border-blue-100 pl-6">
                        <div>
                            <h4 class="font-bold text-gray-900 flex items-center mb-1">
                                <Icon icon="ph:play-circle" class="w-5 h-5 text-blue-600 mr-2" />
                                Running Code
                            </h4>
                            <p class="text-gray-600 text-base">
                                Type your Python code in the main editor. Press <kbd
                                    class="bg-gray-100 border rounded px-1 text-xs">F5</kbd> or click the
                                <strong>Run</strong>
                                button to execute.
                            </p>
                        </div>

                        <div>
                            <h4 class="font-bold text-gray-900 flex items-center mb-1">
                                <Icon icon="ph:files" class="w-5 h-5 text-blue-600 mr-2" />
                                Managing Files
                            </h4>
                            <p class="text-gray-600 text-base">
                                Use the tabs above the editor to switch between files. Files are auto-saved to your
                                browser.
                            </p>
                        </div>

                        <div>
                            <h4 class="font-bold text-gray-900 flex items-center mb-1">
                                <Icon icon="ph:terminal" class="w-5 h-5 text-blue-600 mr-2" />
                                Using the Shell
                            </h4>
                            <p class="text-gray-600 text-base">
                                The bottom panel contains an interactive Python shell (REPL) for instant command
                                execution.
                            </p>
                        </div>

                        <div>
                            <h4 class="font-bold text-gray-900 flex items-center mb-1">
                                <Icon icon="ph:sidebar" class="w-5 h-5 text-blue-600 mr-2" />
                                Panels
                            </h4>
                            <p class="text-gray-600 text-base">
                                Toggle <strong>Variables</strong>, <strong>Program Tree</strong>, and
                                <strong>TODO</strong>
                                panels via the View menu.
                            </p>
                        </div>
                    </div>

                    <!-- Comparison -->
                    <h2>Online vs. Desktop</h2>
                    <p>
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
                                        class="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                                        Thonny Online</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr v-for="(row, idx) in comparisonRows" :key="idx">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{
                                        row.feature }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ row.desktop }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">{{
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

h2 {
    @apply text-2xl md:text-3xl font-bold text-gray-900 mt-12 mb-6;
}

h3 {
    @apply text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-4;
}

h4 {
    @apply text-lg font-semibold text-gray-800 mb-2;
}

p {
    @apply text-base md:text-lg leading-relaxed text-gray-600 mb-6;
}
</style>
