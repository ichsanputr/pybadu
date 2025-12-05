<template>
    <Transition name="fade">
        <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <!-- Modal Content -->
            <div
                class="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-lg p-6 border border-gray-200 dark:border-gray-700 pointer-events-auto flex flex-col max-h-[80vh]">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Manage Packages</h3>
                    <button @click="close" class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                        <Icon icon="ph:x" class="w-5 h-5" />
                    </button>
                </div>

                <!-- Info -->
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Install Python packages from PyPI using <a href="https://micropip.pyodide.org/" target="_blank"
                        class="text-blue-600 hover:underline">micropip</a>. Note: Only pure Python wheels are supported.
                </p>

                <!-- Install Form -->
                <div class="flex space-x-2 mb-6">
                    <input v-model="packageName" @keydown.enter="install" type="text"
                        placeholder="Package name (e.g., cowsay, numpy)"
                        class="flex-1 px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50"
                        :disabled="isInstalling" />
                    <button @click="install"
                        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
                        :disabled="!packageName.trim() || isInstalling">
                        <Icon v-if="isInstalling" icon="ph:spinner" class="animate-spin w-4 h-4 mr-2" />
                        Install
                    </button>
                </div>

                <!-- Package List -->
                <div class="flex-1 overflow-hidden flex flex-col">
                    <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Installed Packages</h4>
                    <div
                        class="flex-1 overflow-y-auto border rounded-md bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 p-2">
                        <div v-if="loadingList" class="flex justify-center py-4">
                            <Icon icon="ph:spinner" class="animate-spin w-5 h-5 text-gray-400" />
                        </div>
                        <ul v-else-if="packages.length > 0" class="space-y-1">
                            <li v-for="pkg in packages" :key="pkg"
                                class="text-sm text-gray-700 dark:text-gray-300 font-mono px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800">
                                {{ pkg }}
                            </li>
                        </ul>
                        <div v-else class="text-center py-4 text-sm text-gray-500 italic">
                            No packages installed yet.
                        </div>
                    </div>
                </div>

                <!-- Logs/Status -->
                <div v-if="statusMessage"
                    :class="['mt-4 text-sm p-2 rounded', statusType === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700']">
                    {{ statusMessage }}
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
    isOpen: Boolean,
    installPackage: Function,
    getInstalledPackages: Function
})

const emit = defineEmits(['close'])

const packageName = ref('')
const isInstalling = ref(false)
const packages = ref([])
const loadingList = ref(false)
const statusMessage = ref('')
const statusType = ref('info')

watch(() => props.isOpen, async (isOpen) => {
    if (isOpen) {
        statusMessage.value = ''
        packageName.value = ''
        await loadPackages()
    }
})

async function loadPackages() {
    if (!props.getInstalledPackages) return
    loadingList.value = true
    try {
        const pkgs = await props.getInstalledPackages()
        packages.value = pkgs.sort()
    } catch (e) {
        console.error("Failed to load packages", e)
    } finally {
        loadingList.value = false
    }
}

async function install() {
    if (!packageName.value.trim() || isInstalling.value || !props.installPackage) return

    isInstalling.value = true
    statusMessage.value = `Installing ${packageName.value}... Check shell for details.`
    statusType.value = 'info'

    try {
        await props.installPackage(packageName.value)
        statusMessage.value = `Successfully installed ${packageName.value}`
        statusType.value = 'success'
        packageName.value = ''
        await loadPackages()
    } catch (e) {
        statusMessage.value = `Failed to install ${packageName.value}. See shell output.`
        statusType.value = 'error'
    } finally {
        isInstalling.value = false
    }
}

function close() {
    emit('close')
}
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
