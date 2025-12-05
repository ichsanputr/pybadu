<template>
    <div
        :class="['flex items-center px-2 py-2 border-b space-x-1', theme === 'light' ? 'bg-gray-100 border-gray-300' : 'bg-gray-800 border-gray-700']">
        <!-- File operations -->
        <button :class="toolbarButtonClass" title="New file" @click="$emit('new-file')">
            <Icon icon="ph:file-plus" class="w-5 h-5" />
        </button>
        <button :class="toolbarButtonClass" title="Upload file" @click="$emit('upload-file')">
            <Icon icon="ph:file-arrow-up" class="w-5 h-5" />
        </button>
        <button :class="toolbarButtonClass" title="Save" @click="$emit('save-file')">
            <Icon icon="ph:floppy-disk" class="w-5 h-5" />
        </button>

        <div class="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>

        <!-- Run controls -->
        <button :class="[toolbarButtonClass, 'text-green-600 dark:text-green-400']" title="Run (F5)"
            @click="$emit('run-code')" :disabled="!pyodideReady || isLoading">
            <Icon :icon="isLoading ? 'ph:spinner' : 'ph:play-fill'"
                :class="['w-5 h-5', isLoading ? 'animate-spin' : '']" />
        </button>
        <button :class="[toolbarButtonClass, 'text-red-600 dark:text-red-400']" title="Stop"
            @click="$emit('stop-execution')" :disabled="!isLoading">
            <Icon icon="ph:stop-fill" class="w-5 h-5" />
        </button>

        <div class="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>

        <!-- View controls -->
        <button :class="toolbarButtonClass" title="Toggle Variables" @click="$emit('toggle-variables')">
            <Icon icon="ph:list-bullets" class="w-5 h-5" />
        </button>

        <div class="flex-1"></div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
    theme: { type: String, required: true },
    pyodideReady: { type: Boolean, required: true },
    isLoading: { type: Boolean, required: true }
})

defineEmits(['new-file', 'save-file', 'upload-file', 'run-code', 'stop-execution', 'toggle-variables'])

const toolbarButtonClass = computed(() => [
    'p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
    props.theme === 'light' ? 'text-gray-700' : 'text-gray-300'
])
</script>
