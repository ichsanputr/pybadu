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
        <div
            :class="['flex-1 overflow-y-auto p-3 font-mono text-sm', theme === 'light' ? 'bg-white text-gray-800' : 'bg-gray-900 text-gray-200']">
            <div v-if="output.length === 0"
                :class="['text-center py-8', theme === 'light' ? 'text-gray-400' : 'text-gray-600']">
                <p class="text-sm">Python 3.11.3</p>
                <p class="text-xs mt-1">&gt;&gt;&gt; </p>
            </div>
            <div v-for="(item, index) in output" :key="index"
                :class="['mb-1 whitespace-pre-wrap', item.type === 'error' ? 'text-red-600 dark:text-red-400' : theme === 'light' ? 'text-gray-800' : 'text-gray-200']">
                {{ item.content }}</div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'

const props = defineProps({
    theme: { type: String, required: true },
    output: { type: Array, required: true }
})

defineEmits(['clear-output'])
</script>
