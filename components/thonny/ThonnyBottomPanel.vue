<template>
    <div :class="['flex flex-col h-full', theme === 'light' ? 'bg-white' : 'bg-gray-900']">
        <!-- Panel Header (Tabs + Actions) -->
        <div
            :class="['flex items-center justify-between px-0 border-b text-sm flex-shrink-0', theme === 'light' ? 'bg-gray-50 border-gray-300 text-gray-700' : 'bg-gray-800 border-gray-700 text-gray-300']">

            <!-- Tabs -->
            <div class="flex items-end">
                <button v-if="showShell" @click="activeTab = 'shell'" :class="['px-4 py-1.5 border-r font-medium text-xs uppercase tracking-wide transition-colors flex items-center group',
                    activeTab === 'shell'
                        ? (theme === 'light' ? 'bg-white text-blue-600 border-b-2 border-b-blue-600' : 'bg-gray-900 text-blue-400 border-b-2 border-b-blue-400')
                        : (theme === 'light' ? 'bg-gray-50 text-gray-500 hover:bg-gray-100' : 'bg-gray-800 text-gray-400 hover:bg-gray-700')
                ]" style="margin-bottom: -1px;">
                    <span class="mr-2">Shell</span>
                    <div @click.stop="$emit('close-tab', 'shell')"
                        :class="['p-0.5 rounded-full opacity-60 group-hover:opacity-100', theme === 'light' ? 'hover:bg-gray-200 text-gray-600' : 'hover:bg-gray-700 text-gray-400']">
                        <Icon icon="ph:x" class="w-3 h-3" />
                    </div>
                </button>
                <button v-if="showProgramTree" @click="activeTab = 'program-tree'" :class="['px-4 py-1.5 border-r font-medium text-xs uppercase tracking-wide transition-colors flex items-center group',
                    activeTab === 'program-tree'
                        ? (theme === 'light' ? 'bg-white text-blue-600 border-b-2 border-b-blue-600' : 'bg-gray-900 text-blue-400 border-b-2 border-b-blue-400')
                        : (theme === 'light' ? 'bg-gray-50 text-gray-500 hover:bg-gray-100' : 'bg-gray-800 text-gray-400 hover:bg-gray-700')
                ]" style="margin-bottom: -1px;">
                    <span class="mr-2">Program Tree</span>
                    <div @click.stop="$emit('close-tab', 'program-tree')"
                        :class="['p-0.5 rounded-full opacity-60 group-hover:opacity-100', theme === 'light' ? 'hover:bg-gray-200 text-gray-600' : 'hover:bg-gray-700 text-gray-400']">
                        <Icon icon="ph:x" class="w-3 h-3" />
                    </div>
                </button>
                <button v-if="showException" @click="activeTab = 'exception'" :class="['px-4 py-1.5 border-r font-medium text-xs uppercase tracking-wide transition-colors flex items-center group',
                    activeTab === 'exception'
                        ? (theme === 'light' ? 'bg-white text-blue-600 border-b-2 border-b-blue-600' : 'bg-gray-900 text-blue-400 border-b-2 border-b-blue-400')
                        : (theme === 'light' ? 'bg-gray-50 text-gray-500 hover:bg-gray-100' : 'bg-gray-800 text-gray-400 hover:bg-gray-700')
                ]" style="margin-bottom: -1px;">
                    <span class="mr-2">Exception</span>
                    <div @click.stop="$emit('close-tab', 'exception')"
                        :class="['p-0.5 rounded-full opacity-60 group-hover:opacity-100', theme === 'light' ? 'hover:bg-gray-200 text-gray-600' : 'hover:bg-gray-700 text-gray-400']">
                        <Icon icon="ph:x" class="w-3 h-3" />
                    </div>
                </button>
                <button v-if="showTodo" @click="activeTab = 'todo'" :class="['px-4 py-1.5 border-r font-medium text-xs uppercase tracking-wide transition-colors flex items-center group',
                    activeTab === 'todo'
                        ? (theme === 'light' ? 'bg-white text-blue-600 border-b-2 border-b-blue-600' : 'bg-gray-900 text-blue-400 border-b-2 border-b-blue-400')
                        : (theme === 'light' ? 'bg-gray-50 text-gray-500 hover:bg-gray-100' : 'bg-gray-800 text-gray-400 hover:bg-gray-700')
                ]" style="margin-bottom: -1px;">
                    <span class="mr-2">TODO</span>
                    <div @click.stop="$emit('close-tab', 'todo')"
                        :class="['p-0.5 rounded-full opacity-60 group-hover:opacity-100', theme === 'light' ? 'hover:bg-gray-200 text-gray-600' : 'hover:bg-gray-700 text-gray-400']">
                        <Icon icon="ph:x" class="w-3 h-3" />
                    </div>
                </button>
            </div>

        </div>

        <!-- Content Area -->
        <div class="flex-1 overflow-hidden relative">

            <!-- Shell Tab Content -->
            <div v-show="activeTab === 'shell'" class="h-full flex flex-col">
                <div ref="shellContainer"
                    :class="['flex-1 overflow-y-auto p-3 font-mono text-sm', theme === 'light' ? 'bg-white text-gray-800' : 'bg-gray-900 text-gray-200']">

                    <!-- Unified Output Stream -->
                    <div v-for="(item, index) in output" :key="'msg-' + index" class="mb-1 font-mono">
                        <!-- User Input -->
                        <div v-if="item.type === 'input'" class="flex"
                            :class="theme === 'light' ? 'text-gray-800' : 'text-gray-200'">
                            <span class="text-green-500 font-bold mr-2">&gt;&gt;&gt;</span>
                            <span>{{ item.content }}</span>
                        </div>

                        <!-- System Info -->
                        <div v-else-if="item.type === 'info' || item.type === 'system'"
                            class="text-blue-500 dark:text-blue-400 font-semibold italic">
                            {{ item.content }}
                        </div>

                        <!-- Error -->
                        <div v-else-if="item.type === 'error'"
                            class="text-red-600 dark:text-red-400 whitespace-pre-wrap">
                            {{ item.content }}
                        </div>

                        <!-- Success -->
                        <div v-else-if="item.type === 'success'" class="text-green-600 dark:text-green-400">
                            {{ item.content }}
                        </div>

                        <!-- Standard Output -->
                        <div v-else class="whitespace-pre-wrap"
                            :class="theme === 'light' ? 'text-gray-800' : 'text-gray-200'">
                            {{ item.content }}
                        </div>
                    </div>

                    <!-- Current input line -->
                    <div v-if="!isExecuting" class="flex items-start mt-2">
                        <span class="text-green-500 font-bold mr-2">&gt;&gt;&gt;</span>
                        <input ref="shellInputRef" v-model="currentInput" @keydown.enter="executeShellCommand"
                            @keydown.up.prevent="navigateHistory('up')" @keydown.down.prevent="navigateHistory('down')"
                            :class="['flex-1 bg-transparent outline-none border-none font-mono', theme === 'light' ? 'text-gray-800' : 'text-gray-200']"
                            placeholder="" autocomplete="off" spellcheck="false" />
                    </div>

                    <!-- Executing indicator -->
                    <div v-if="isExecuting" class="flex items-center space-x-2 text-blue-500 mt-2">
                        <Icon icon="ph:spinner" class="w-4 h-4 animate-spin" />
                        <span class="text-sm">Executing...</span>
                    </div>
                </div>
            </div>

            <!-- Exception Tab Content -->
            <div v-show="activeTab === 'exception'"
                :class="['h-full overflow-y-auto p-4 font-mono text-sm', theme === 'light' ? 'bg-white text-gray-800' : 'bg-gray-900 text-gray-200']">
                <div v-if="lastException" class="text-red-600 dark:text-red-400 space-y-2">
                    <h4 class="font-bold border-b border-red-200 dark:border-red-800 pb-2 mb-2">Most Recent Exception
                    </h4>
                    <pre class="whitespace-pre-wrap">{{ lastException }}</pre>
                </div>
                <div v-else class="flex flex-col items-center justify-center h-full text-gray-400">
                    <Icon icon="ph:check-circle" class="w-12 h-12 mb-2 opacity-50" />
                    <p>No exceptions captured yet.</p>

                </div>
            </div>

            <!-- Program Tree Tab Content -->
            <div v-show="activeTab === 'program-tree'"
                :class="['h-full overflow-y-auto p-4 font-mono text-sm', theme === 'light' ? 'bg-white text-gray-800' : 'bg-gray-900 text-gray-200']">
                <div v-if="astData && !astData.error">
                    <AstTree :node="astData" :theme="theme" />
                </div>
                <div v-else-if="astData && astData.error" class="text-red-500 font-medium">
                    Syntax Error: {{ astData.error }}
                </div>
                <div v-else class="flex flex-col items-center justify-center h-full text-gray-400">
                    <Icon icon="ph:tree-structure" class="w-12 h-12 mb-2 opacity-50" />
                    <p>Run code to generate Program Tree</p>
                </div>
            </div>

            <!-- TODO Tab Content -->
            <div v-show="activeTab === 'todo'"
                :class="['h-full overflow-y-auto font-mono text-sm', theme === 'light' ? 'bg-white text-gray-800' : 'bg-gray-900 text-gray-200']">
                <div v-if="todoItems && todoItems.length > 0">
                    <table class="w-full text-left border-collapse">
                        <thead :class="['sticky top-0 z-10', theme === 'light' ? 'bg-gray-50' : 'bg-gray-800']">
                            <tr :class="theme === 'light' ? 'border-b border-gray-200' : 'border-b border-gray-700'">
                                <th class="py-2 px-4 font-semibold w-24">Line</th>
                                <th class="py-2 px-4 font-semibold w-24">Type</th>
                                <th class="py-2 px-4 font-semibold">Message</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in todoItems" :key="index"
                                :class="['border-b hover:bg-opacity-50', theme === 'light' ? 'border-gray-100 hover:bg-gray-50' : 'border-gray-800 hover:bg-gray-800', 'cursor-pointer']"
                                @click="$emit('jump-to-line', item.line)">
                                <td class="py-2 px-4 text-gray-500">{{ item.line }}</td>
                                <td class="py-2 px-4 font-bold"
                                    :class="item.type === 'FIXME' ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'">
                                    {{ item.type }}
                                </td>
                                <td class="py-2 px-4">{{ item.message }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div v-else class="flex flex-col items-center justify-center h-full text-gray-400">
                    <Icon icon="ph:check-circle" class="w-12 h-12 mb-2 opacity-50" />
                    <p>No line marked with # TODO xx</p>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref, nextTick, watch, computed } from 'vue'
import { Icon } from '@iconify/vue'
import AstTree from './AstTree.vue'

const props = defineProps({
    theme: { type: String, required: true },
    output: { type: Array, required: true },
    isExecuting: { type: Boolean, default: false },
    showShell: { type: Boolean, default: true },
    showException: { type: Boolean, default: false },
    showProgramTree: { type: Boolean, default: false },
    showTodo: { type: Boolean, default: false },
    astData: { type: Object, default: null },
    todoItems: { type: Array, default: () => [] }
})

const emit = defineEmits(['clear-output', 'execute-command', 'close', 'close-tab', 'jump-to-line'])

const activeTab = ref('shell')
// Watch props to ensure active tab is visible
watch(() => [props.showShell, props.showException, props.showProgramTree, props.showTodo], ([newShell, newException, newTree, newTodo]) => {
    if (activeTab.value === 'shell' && !newShell) {
        if (newException) activeTab.value = 'exception'
        else if (newTree) activeTab.value = 'program-tree'
        else if (newTodo) activeTab.value = 'todo'
    } else if (activeTab.value === 'exception' && !newException) {
        if (newShell) activeTab.value = 'shell'
        else if (newTree) activeTab.value = 'program-tree'
        else if (newTodo) activeTab.value = 'todo'
    } else if (activeTab.value === 'program-tree' && !newTree) {
        if (newShell) activeTab.value = 'shell'
        else if (newException) activeTab.value = 'exception'
        else if (newTodo) activeTab.value = 'todo'
    } else if (activeTab.value === 'todo' && !newTodo) {
        if (newShell) activeTab.value = 'shell'
        else if (newException) activeTab.value = 'exception'
        else if (newTree) activeTab.value = 'program-tree'
    } else if (!activeTab.value) {
        if (newShell) activeTab.value = 'shell'
        else if (newException) activeTab.value = 'exception'
        else if (newTree) activeTab.value = 'program-tree'
        else if (newTodo) activeTab.value = 'todo'
    }
}, { immediate: true })

// Ensure we default to a visible tab on mount if needed
// (Handled by immediate watcher mostly, but we set ref('shell') initially)
const shellInputRef = ref(null)
const shellContainer = ref(null)
const currentInput = ref('')
const commandBuffer = ref([])
const historyIndex = ref(-1)

// Computed property to find the last exception from the output
const lastException = computed(() => {
    // Traverse backwards to find the last error
    for (let i = props.output.length - 1; i >= 0; i--) {
        if (props.output[i].type === 'error') {
            return props.output[i].content
        }
    }
    return null
})

// Expose openTab method for parent to control
const openTab = (tabName) => {
    if (['shell', 'exception', 'program-tree', 'todo'].includes(tabName)) {
        activeTab.value = tabName
    }
}

function executeShellCommand() {
    const command = currentInput.value
    // Emit command even if empty
    emit('execute-command', command)

    if (command.trim()) {
        commandBuffer.value.push(command)
    }
    historyIndex.value = -1
    currentInput.value = ''

    scrollToBottom()
}

function navigateHistory(direction) {
    if (commandBuffer.value.length === 0) return

    if (direction === 'up') {
        const newIndex = historyIndex.value + 1
        if (newIndex < commandBuffer.value.length) {
            historyIndex.value = newIndex
            currentInput.value = commandBuffer.value[commandBuffer.value.length - 1 - newIndex]
        }
    } else if (direction === 'down') {
        const newIndex = historyIndex.value - 1
        if (newIndex >= 0) {
            historyIndex.value = newIndex
            currentInput.value = commandBuffer.value[commandBuffer.value.length - 1 - newIndex]
        } else {
            historyIndex.value = -1
            currentInput.value = ''
        }
    }
}

function scrollToBottom() {
    // Only scroll if shell is active
    if (activeTab.value !== 'shell') return

    nextTick(() => {
        if (shellContainer.value) {
            shellContainer.value.scrollTop = shellContainer.value.scrollHeight
        }
    })
}

// Auto-scroll when new output arrives
watch(() => props.output, () => {
    if (activeTab.value === 'shell') {
        scrollToBottom()
    }
}, { deep: true })

// Watch active tab to scroll or focus
watch(activeTab, (newTab) => {
    if (newTab === 'shell') {
        scrollToBottom()
        nextTick(() => {
            shellInputRef.value?.focus()
        })
    }
})

// Focus input on mount
nextTick(() => {
    shellInputRef.value?.focus()
})

defineExpose({
    focusInput: () => {
        activeTab.value = 'shell'
        nextTick(() => shellInputRef.value?.focus())
    },
    openTab,
    activeTab
})
</script>

<style scoped>
/* Scrollbar styling for consistent look */
::-webkit-scrollbar {
    width: 10px;
    height: 10px;
}

::-webkit-scrollbar-track {
    background: transparent;
}

::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 5px;
}

.dark ::-webkit-scrollbar-thumb {
    background: #475569;
}

::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
}

.dark ::-webkit-scrollbar-thumb:hover {
    background: #64748b;
}
</style>
