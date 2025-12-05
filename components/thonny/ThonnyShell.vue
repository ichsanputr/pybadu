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
                <div v-else-if="item.type === 'error'" class="text-red-600 dark:text-red-400 whitespace-pre-wrap">
                    {{ item.content }}
                </div>

                <!-- Success -->
                <div v-else-if="item.type === 'success'" class="text-green-600 dark:text-green-400">
                    {{ item.content }}
                </div>

                <!-- Standard Output -->
                <div v-else class="whitespace-pre-wrap" :class="theme === 'light' ? 'text-gray-800' : 'text-gray-200'">
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
</template>

<script setup>
import { ref, nextTick, watch } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
    theme: { type: String, required: true },
    output: { type: Array, required: true }, // Unified history
    isExecuting: { type: Boolean, default: false }
})

const emit = defineEmits(['clear-output', 'execute-command'])

const shellInputRef = ref(null)
const shellContainer = ref(null)
const currentInput = ref('')
const commandBuffer = ref([])
const historyIndex = ref(-1)

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
    nextTick(() => {
        if (shellContainer.value) {
            shellContainer.value.scrollTop = shellContainer.value.scrollHeight
        }
    })
}

// Auto-scroll when new output arrives
watch(() => props.output, scrollToBottom, { deep: true })

// Focus input on mount
nextTick(() => {
    shellInputRef.value?.focus()
})

defineExpose({
    focusInput: () => shellInputRef.value?.focus()
})
</script>
