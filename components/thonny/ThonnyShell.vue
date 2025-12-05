<template>
    <div :class="['flex flex-col h-full', theme === 'light' ? 'bg-white' : 'bg-gray-900']">
        <!-- Shell Header -->
        <div
            :class="['flex items-center justify-between px-3 py-1.5 border-b text-sm flex-shrink-0', theme === 'light' ? 'bg-gray-50 border-gray-300 text-gray-700' : 'bg-gray-800 border-gray-700 text-gray-300']">
            <div class="flex items-center space-x-2">
                <Icon icon="ph:terminal" class="w-4 h-4" />
                <span class="font-medium">Shell</span>
            </div>
            <button @click="$emit('clear-output')"
                :class="['text-xs px-2 py-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700', theme === 'light' ? 'text-gray-600' : 'text-gray-400']">
                Clear
            </button>
        </div>

        <!-- Shell Content -->
        <div ref="shellContainer"
            :class="['flex-1 overflow-y-auto p-3 font-mono text-sm', theme === 'light' ? 'bg-white text-gray-800' : 'bg-gray-900 text-gray-200']">
            <!-- Output from editor runs -->
            <div v-for="(item, index) in output" :key="'output-' + index"
                :class="['mb-1 whitespace-pre-wrap', item.type === 'error' ? 'text-red-600 dark:text-red-400' : theme === 'light' ? 'text-gray-800' : 'text-gray-200']">
                {{ item.content }}</div>

            <!-- Shell command history -->
            <div v-for="(item, index) in shellHistory" :key="'shell-' + index" class="mb-2">
                <!-- Input line -->
                <div v-if="item.type === 'input'" class="flex">
                    <span class="text-green-500 mr-2">&gt;&gt;&gt;</span>
                    <span>{{ item.content }}</span>
                </div>
                <!-- Output line -->
                <div v-else-if="item.type === 'output'" :class="['ml-6', item.isError ? 'text-red-400' : '']">
                    <pre class="whitespace-pre-wrap">{{ item.content }}</pre>
                </div>
            </div>

            <!-- Current input line -->
            <div v-if="!isExecuting" class="flex items-start">
                <span class="text-green-500 mr-2">&gt;&gt;&gt;</span>
                <input ref="shellInputRef" v-model="currentInput" @keydown.enter="executeShellCommand"
                    @keydown.up.prevent="navigateHistory('up')" @keydown.down.prevent="navigateHistory('down')"
                    :class="['flex-1 bg-transparent outline-none border-none', theme === 'light' ? 'text-gray-800' : 'text-gray-200']"
                    placeholder="Type Python code..." autocomplete="off" spellcheck="false" />
            </div>

            <!-- Executing indicator -->
            <div v-if="isExecuting" class="flex items-center space-x-2 text-blue-500">
                <Icon icon="ph:spinner" class="w-4 h-4 animate-spin" />
                <span class="text-sm">Executing...</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, nextTick, watch } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
    theme: { type: String, required: true },
    output: { type: Array, required: true },
    shellHistory: { type: Array, default: () => [] },
    isExecuting: { type: Boolean, default: false }
})

const emit = defineEmits(['clear-output', 'execute-command'])

const shellInputRef = ref(null)
const shellContainer = ref(null)
const currentInput = ref('')
const commandHistory = ref([])
const historyIndex = ref(-1)

function executeShellCommand() {
    if (!currentInput.value.trim() || props.isExecuting) return

    const command = currentInput.value
    emit('execute-command', command)

    // Add to command history
    commandHistory.value.push(command)
    historyIndex.value = -1

    // Clear input
    currentInput.value = ''

    scrollToBottom()
}

function navigateHistory(direction) {
    if (commandHistory.value.length === 0) return

    if (direction === 'up') {
        if (historyIndex.value < commandHistory.value.length - 1) {
            historyIndex.value++
            currentInput.value = commandHistory.value[commandHistory.value.length - 1 - historyIndex.value]
        }
    } else if (direction === 'down') {
        if (historyIndex.value > 0) {
            historyIndex.value--
            currentInput.value = commandHistory.value[commandHistory.value.length - 1 - historyIndex.value]
        } else if (historyIndex.value === 0) {
            historyIndex.value = -1
            currentInput.value = ''
        }
    }
}

function scrollToBottom() {
    nextTick(() => {
        if (shellContainer.value) {
            shellContainer.value.scrollTop = shellContainer.value.scrollHeight
        }
    })
}

// Auto-scroll when new output arrives
watch(() => [props.output, props.shellHistory], scrollToBottom, { deep: true })

// Focus input on mount
nextTick(() => {
    shellInputRef.value?.focus()
})

defineExpose({
    focusInput: () => shellInputRef.value?.focus()
})
</script>
