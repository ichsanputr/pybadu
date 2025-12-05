<template>
    <Transition name="fade">
        <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <!-- Modal Content -->
            <div
                class="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl p-6 border border-gray-200 dark:border-gray-700 pointer-events-auto flex flex-col h-[600px]">

                <!-- Header -->
                <div class="flex items-center justify-between mb-4 flex-shrink-0">
                    <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Manage Packages</h3>
                    <button @click="close" class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                        <Icon icon="ph:x" class="w-6 h-6" />
                    </button>
                </div>

                <!-- Search Row -->
                <div class="flex space-x-2 mb-4 flex-shrink-0">
                    <div class="relative flex-1">
                        <Icon icon="ph:magnifying-glass"
                            class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input v-model="searchQuery" @keydown.enter="handleSearch" type="text"
                            placeholder="Search PyPI packages..."
                            class="w-full pl-10 pr-4 py-2 border rounded-md bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    <button @click="handleSearch"
                        class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center shadow-sm font-medium">
                        Search PyPI
                    </button>
                </div>

                <!-- Main Content Grid -->
                <div class="grid grid-cols-12 gap-6 flex-1 min-h-0">

                    <!-- Left Col: Default/Standard Packages List -->
                    <div
                        class="col-span-5 flex flex-col border rounded-md border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div
                            class="bg-gray-100 dark:bg-gray-750 px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                            <h4 class="font-medium text-gray-700 dark:text-gray-300 text-sm">Standard Pyodide Packages
                            </h4>
                        </div>
                        <div class="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-2">
                            <ul class="space-y-1">
                                <li v-for="pkg in filteredStandardPackages" :key="pkg.name" @click="selectPackage(pkg)"
                                    :class="['px-3 py-2 rounded cursor-pointer text-sm flex items-center justify-between group transition-colors',
                                        selectedPackage?.name === pkg.name
                                            ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800']">
                                    <span class="font-mono font-medium truncate">{{ pkg.name }}</span>
                                    <Icon icon="ph:caret-right"
                                        class="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </li>
                            </ul>
                        </div>
                    </div>

                    <!-- Right Col: Package Details -->
                    <div
                        class="col-span-7 flex flex-col border rounded-md border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden relative">
                        <!-- Details Content -->
                        <div v-if="selectedPackage" class="flex flex-col h-full p-6 overflow-y-auto">
                            <!-- Package Header -->
                            <div class="flex items-start justify-between mb-4">
                                <div>
                                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white font-mono break-all">{{
                                        selectedPackage.name }}</h2>
                                    <p class="text-sm text-gray-500 mt-1" v-if="selectedPackage.version">Latest: {{
                                        selectedPackage.version }}</p>
                                </div>
                                <div class="flex items-center space-x-2">
                                    <span v-if="installedVersion"
                                        class="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">Installed:
                                        {{ installedVersion }}</span>
                                    <span v-else
                                        class="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full font-medium">Not
                                        Installed</span>
                                </div>
                            </div>

                            <!-- Description -->
                            <div class="mb-6 prose prose-sm dark:prose-invert max-w-none">
                                <p class="text-gray-600 dark:text-gray-300">
                                    {{ selectedPackage.summary || 'No description available.' }}
                                </p>
                            </div>

                            <!-- Action Area -->
                            <div class="mt-auto pt-6 border-t border-gray-100 dark:border-gray-700">
                                <!-- Status Messages -->
                                <div v-if="statusMessage" :class="['mb-4 p-3 rounded-md text-sm flex items-start',
                                    statusType === 'error' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700']">
                                    <Icon :icon="statusType === 'error' ? 'ph:warning-circle' : 'ph:info'"
                                        class="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                                    <span>{{ statusMessage }}</span>
                                </div>

                                <!-- Install Button -->
                                <button @click="install" :disabled="isInstalling"
                                    class="w-full py-2.5 rounded-md font-medium text-white shadow transition-all
                                    bg-blue-600 hover:bg-blue-700 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center">
                                    <Icon v-if="isInstalling" icon="ph:spinner" class="animate-spin w-5 h-5 mr-2" />
                                    <span>{{ isInstalling ? 'Installing...' : (installedVersion ? 'Reinstall / Update' :
                                        'Install Package') }}</span>
                                </button>
                                <p class="text-xs text-center text-gray-400 mt-2">
                                    Note: Only pure Python wheels supported in Pyodide.
                                </p>
                            </div>
                        </div>

                        <!-- Empty State -->
                        <div v-else
                            class="flex flex-col items-center justify-center h-full text-gray-400 p-8 text-center">
                            <Icon icon="ph:package" class="w-16 h-16 mb-4 opacity-20" />
                            <h3 class="text-lg font-medium text-gray-500 mb-1">Select a Package</h3>
                            <p class="text-sm">Choose a standard package from the list or search PyPI directly.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
    isOpen: Boolean,
    installPackage: Function,
    getInstalledPackages: Function
})

const emit = defineEmits(['close'])

// State
const searchQuery = ref('')
const selectedPackage = ref(null)
const isInstalling = ref(false)
const statusMessage = ref('')
const statusType = ref('info')
const installedPackagesMap = ref(new Map())

// Standard Pyodide Packages Source (Subset of common ones)
const standardPackages = [
    { name: 'matplotlib', summary: 'Plotting library for Python' },
    { name: 'numpy', summary: 'Fundamental package for scientific computing' },
    { name: 'pandas', summary: 'Data structures for data analysis, time series, and statistics' },
    { name: 'scipy', summary: 'Scientific Library for Python' },
    { name: 'scikit-learn', summary: 'Machine learning library' },
    { name: 'beautifulsoup4', summary: 'Screen-scraping library' },
    { name: 'requests', summary: 'Python HTTP for Humans (Patched for Pyodide)' },
    { name: 'pillow', summary: 'Python Imaging Library' },
    { name: 'networkx', summary: 'Python package for creating and manipulating complex networks' },
    { name: 'sympy', summary: 'Computer algebra system (CAS) in Python' },
    { name: 'pytz', summary: 'World timezone definitions, modern and historical' },
    { name: 'micropip', summary: 'Package installer for Pyodide' },
    { name: 'setuptools', summary: 'Easily download, build, install, upgrade, and uninstall Python packages' },
    { name: 'packaging', summary: 'Core utilities for Python packages' },
    { name: 'joblib', summary: 'Lightweight pipelining in Python' },
    { name: 'docutils', summary: 'Docutils is a modular system for processing documentation' },
    { name: 'biopython', summary: 'Tools for biological computation' },
    { name: 'bleach', summary: 'An easy safelist-based HTML-sanitizing tool' },
    { name: 'bokeh', summary: 'Interactive plots and applications in the browser' }
].sort((a, b) => a.name.localeCompare(b.name))

const filteredStandardPackages = computed(() => {
    if (!searchQuery.value) return standardPackages
    const q = searchQuery.value.toLowerCase()
    return standardPackages.filter(p => p.name.toLowerCase().includes(q))
})

const installedVersion = computed(() => {
    if (!selectedPackage.value) return null
    return installedPackagesMap.value.get(selectedPackage.value.name.toLowerCase()) || null
})

// Actions
function selectPackage(pkg) {
    selectedPackage.value = { ...pkg }
    statusMessage.value = ''
}

function handleSearch() {
    if (!searchQuery.value.trim()) return

    // Check if it exists in standard list first to keep summary
    const standardMatch = standardPackages.find(p => p.name.toLowerCase() === searchQuery.value.trim().toLowerCase())

    if (standardMatch) {
        selectPackage(standardMatch)
    } else {
        // Create a temporary object for the custom search
        selectedPackage.value = {
            name: searchQuery.value.trim(),
            summary: 'Package found via search. (Details not fetched)',
            version: 'Unknown'
        }
    }
}

async function loadInstalledPackages() {
    if (!props.getInstalledPackages) return
    try {
        const pkgs = await props.getInstalledPackages()
        // Format: ["name==version", ...]
        const map = new Map()
        pkgs.forEach(p => {
            const parts = p.split('==')
            if (parts.length === 2) {
                map.set(parts[0].toLowerCase(), parts[1])
            } else {
                map.set(p.toLowerCase(), 'Installed')
            }
        })
        installedPackagesMap.value = map
    } catch (e) {
        console.error("Failed to load installed packages", e)
    }
}

async function install() {
    if (!selectedPackage.value || isInstalling.value || !props.installPackage) return

    const pkgName = selectedPackage.value.name
    isInstalling.value = true
    statusMessage.value = `Installing ${pkgName}... Please wait.`
    statusType.value = 'info'

    try {
        await props.installPackage(pkgName)
        statusMessage.value = `Successfully installed ${pkgName}.`
        statusType.value = 'success'
        await loadInstalledPackages()
    } catch (e) {
        statusMessage.value = `Failed to install ${pkgName}. It might not be available as a pure Python wheel.`
        statusType.value = 'error'
    } finally {
        isInstalling.value = false
    }
}

function close() {
    emit('close')
}

// Watchers
watch(() => props.isOpen, (newVal) => {
    if (newVal) {
        loadInstalledPackages()
        searchQuery.value = ''
        selectedPackage.value = null
        statusMessage.value = ''
        isInstalling.value = false
    }
})

// Utils
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
