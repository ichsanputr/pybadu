<template>
    <div
        :class="['w-full md:w-1/3 border-l flex flex-col h-full', theme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-800 border-gray-700']">
        <div
            :class="['px-3 py-1.5 border-b text-sm font-medium flex-shrink-0 flex items-center justify-between', theme === 'light' ? 'bg-gray-50 border-gray-300 text-gray-700' : 'bg-gray-800 border-gray-700 text-gray-300']">
            <div class="flex items-center space-x-2">
                <Icon icon="ph:warning" class="w-4 h-4" />
                <span>Exceptions</span>
            </div>
            <button @click="$emit('close')"
                :class="['hover:bg-gray-200 dark:hover:bg-gray-700 rounded p-0.5 transition-colors', theme === 'light' ? ' text-gray-600' : 'text-gray-400']">
                <Icon icon="ph:x" class="w-3 h-3" />
            </button>
        </div>
        <div class="flex-1 overflow-y-auto p-3">
            <div v-if="exceptions.length === 0"
                :class="['text-center py-8 px-4 text-sm', theme === 'light' ? 'text-gray-500' : 'text-gray-400']">
                <Icon icon="ph:check-circle" class="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No exceptions</p>
            </div>
            <div v-else class="space-y-3">
                <div v-for="(exception, index) in exceptions" :key="index"
                    :class="['p-3 rounded border', theme === 'light' ? 'bg-red-50 border-red-200' : 'bg-red-900/20 border-red-800']">
                    <div class="flex items-start space-x-2 mb-2">
                        <Icon icon="ph:warning-circle"
                            class="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <div class="flex-1">
                            <div
                                :class="['font-semibold text-sm mb-1', theme === 'light' ? 'text-red-800' : 'text-red-300']">
                                {{ exception.type }}
                            </div>
                            <div
                                :class="['text-xs font-mono whitespace-pre-wrap', theme === 'light' ? 'text-red-700' : 'text-red-400']">
                                {{ exception.message }}
                            </div>
                        </div>
                    </div>
                    <div v-if="exception.traceback"
                        :class="['text-xs font-mono whitespace-pre-wrap mt-2 p-2 rounded', theme === 'light' ? 'bg-white text-gray-700' : 'bg-gray-900 text-gray-300']">
                        {{ exception.traceback }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'

defineProps({
    theme: { type: String, required: true },
    exceptions: { type: Array, required: true }
})

defineEmits(['close'])
</script>
