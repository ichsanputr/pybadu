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
                        <h1 class="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6 tracking-tight">
                            {{ title }}
                        </h1>
                        <p class="text-base text-gray-500 leading-relaxed">
                            Thonny Online is a modern, browser-based adaptation of the Thonny IDE — offering the same
                            simple, beginner-friendly Python editor directly on the web. Powered by WebAssembly and
                            Pyodide, it provides a familiar Thonny-like experience without installation
                        </p>
                    </div>

                    <!-- Intro -->
                    <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mt-12 mb-6">What is Thonny Online?</h2>

                    <p class="text-base leading-relaxed text-gray-600 mb-6">
                        <strong>Thonny Online</strong> is a browser-based adaptation of the popular Thonny IDE, built
                        for beginners,
                        students, and educators who want a simple and accessible way to learn Python. Instead of relying
                        on remote
                        servers, Thonny Online uses <strong>Pyodide</strong> and <strong>WebAssembly</strong> to run
                        Python directly
                        inside your browser.
                    </p>

                    <p class="text-base leading-relaxed text-gray-600 mb-6">
                        This approach provides a fast, private, installation-free coding environment—ideal for learning
                        Python,
                        experimenting with code, or teaching in the classroom. While not a complete replacement for the
                        full desktop
                        Thonny IDE due to certain browser limitations, it successfully captures most of Thonny’s core
                        features and
                        offers a familiar, beginner-friendly experience entirely on the web.
                    </p>

                    <!-- Key Features -->
                    <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mt-12 mb-6">Key Features</h2>
                    <div class="not-prose grid grid-cols-1 sm:grid-cols-2 gap-6 my-8">
                        <div v-for="(card, index) in featureCards" :key="index" class="flex flex-col">
                            <div class="flex items-center mb-2 text-gray-900 font-bold">
                                <Icon :icon="card.icon" class="w-5 h-5 text-blue-600 mr-2" />
                                {{ card.title }}
                            </div>
                            <p class="text-base text-gray-600 leading-relaxed">{{ card.description }}</p>
                        </div>
                    </div>

                    <!-- Comparison -->
                    <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mt-12 mb-6">This Website vs Thonny IDE
                    </h2>
                    <p class="text-base leading-relaxed text-gray-600 mb-6">
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

                    <!-- FAQ -->
                    <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mt-12 mb-6">Frequently Asked Questions</h2>
                    <p class="text-base leading-relaxed text-gray-600 mb-6">
                        Find quick answers to common questions about Thonny Online's features, including how to run
                        code, visualize data, manage files, and install packages. Whether you're a student or an
                        educator, this guide helps you get the most out of your browser-based Python environment.
                    </p>

                    <div class="space-y-4 mt-8">
                        <div v-for="(step, index) in howToUseSteps" :key="index"
                            class="border border-gray-200 rounded-lg overflow-hidden bg-white">
                            <button @click="toggleFaq(index)"
                                class="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none hover:bg-gray-50 transition-colors">
                                <span class="text-lg font-bold text-gray-800">{{ step.title }}</span>
                                <Icon :icon="activeFaqIndex === index ? 'ph:caret-up' : 'ph:caret-down'"
                                    class="w-5 h-5 text-gray-500 transform transition-transform duration-200"
                                    :class="{ 'rotate-180': activeFaqIndex === index }" />
                            </button>
                            <div v-show="activeFaqIndex === index"
                                class="px-6 py-4 bg-gray-50 border-t border-gray-100 text-base leading-relaxed text-gray-600 prose prose-sm max-w-none start-animation"
                                v-html="step.content">
                            </div>
                        </div>
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
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import Adsense from '~/components/Adsense.vue'

defineProps({
    title: {
        type: String,
        default: 'Online Thonny IDE - Try on Browser'
    }
})

const activeFaqIndex = ref(null)

function toggleFaq(index) {
    activeFaqIndex.value = activeFaqIndex.value === index ? null : index
}

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
        title: 'Structure Outline',
        description: 'Navigate your code easily with the Outline view, showing functions and classes in a hierarchical tree.',
        icon: 'ph:list-dashes'
    },
    {
        title: 'Data Plotter',
        description: 'Visualize numerical data simply by printing numbers to the shell. Detects and plots values automatically.',
        icon: 'ph:chart-line-up'
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

const howToUseSteps = [
    {
        title: 'How do I run my Python code?',
        content: `Just press <kbd class="bg-gray-100 border border-gray-300 rounded px-1.5 py-0.5 text-sm font-mono text-gray-700 mx-1">F5</kbd> on your keyboard or click the green <strong>Run</strong> button in the toolbar. Your script executes instantly in the browser using Pyodide, and output appears in the Shell panel below.`
    },
    {
        title: 'How can I stop a running script?',
        content: `If your code is stuck in an infinite loop or taking too long, click the red <strong>Stop</strong> button in the toolbar. This will terminate the execution immediately.`
    },
    {
        title: 'How can I visualize data with the Plotter?',
        content: `First, enable the <strong>Plotter</strong> from the <strong>View</strong> menu. Then, simply print numbers in your code (e.g., <code>print(math.sin(x))</code>). The Plotter automatically detects these numbers on standard output and draws a real-time line chart. It's perfect for visualizing sensor data, math functions, or simulations.`
    },
    {
        title: 'How do I generate a code outline?',
        content: `Go to <strong>View -> Outline</strong> to open the sidebar panel. This view automatically parses your code to show a hierarchical tree of classes, functions, and methods. Clicking on any item will scroll the editor directly to its definition.`
    },
    {
        title: 'How do I check variable values?',
        content: `The <strong>Variables</strong> panel (View -> Variables) shows the current state of all global variables in your program. It updates automatically after execution finishes or when using the interactive shell.`
    },
    {
        title: 'Can I manage multiple files?',
        content: `Yes! Use the <strong>File -> New</strong> menu or the <strong>+</strong> toolbar icon to create up to 5 files. You can switch between them using tabs at the top of the editor. Files are saved locally in your browser's storage, so they persist even if you refresh the page.`
    },
    {
        title: 'How do I save or upload files?',
        content: `Click the <strong>Save</strong> icon or press <code>Ctrl+S</code> to save your current file. To open a local file from your computer, click the <strong>Upload</strong> icon (folder with arrow). Note that "saving" persists the file to your browser's local storage, not your computer's hard drive.`
    },
    {
        title: 'How do I install external packages?',
        content: `Open <strong>Tools -> Manage packages...</strong>. You can search for and install packages from PyPI. Note that only "pure Python" wheels or packages pre-compiled for Pyodide (like numpy, pandas, scipy, matplotlib) are supported. Binary extensions not ported to WebAssembly will not work.`
    },
    {
        title: 'How do I use the TODO list?',
        content: `Simply add comments starting with <code># TODO</code> or <code># FIXME</code> in your code. Enable the <strong>TODO</strong> view (View -> TODO) to see a list of all these items. detailed with their line numbers. Clicking an item jumps to that line.`
    },
    {
        title: 'What is the Program Tree (AST)?',
        content: `The Program Tree view (View -> Program Tree) visualizes the Abstract Syntax Tree of your code. This is useful for educational purposes to understand how Python parses your source code into a tree structure.`
    },
    {
        title: 'How do I change the font size?',
        content: `You can increase or decrease the editor font size from the <strong>View</strong> menu, or use the shortcuts <code>Ctrl +</code> and <code>Ctrl -</code>.`
    },
    {
        title: 'Can I use input() in my code?',
        content: `Currently, interactive <code>input()</code> is not fully supported in the script runner causing it to hang or return default values. We recommend using hardcoded values or the interactive Shell for testing logic that requires input.`
    },
    {
        title: 'Is my code private?',
        content: `Yes. Thonny Online runs entirely in your browser using WebAssembly. Your code is never sent to a remote server for execution, ensuring your data and logic remain private.`
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
section {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.start-animation {
    animation: slideDown 0.3s ease-out forwards;
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
