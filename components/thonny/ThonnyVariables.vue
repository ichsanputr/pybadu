<template>
    <div :class="['flex flex-col h-full flex-shrink-0', theme === 'light' ? 'bg-white' : 'bg-gray-800']">

        <div class="flex-1 overflow-y-auto">
            <div v-if="variables.length === 0"
                :class="['text-center py-8 px-4 text-sm', theme === 'light' ? 'text-gray-500' : 'text-gray-400']">
                <Icon icon="ph:list-bullets" class="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No variables</p>
            </div>
            <table v-else class="w-full text-xs">
                <thead :class="['sticky top-0', theme === 'light' ? 'bg-gray-50' : 'bg-gray-800']">
                    <tr :class="theme === 'light' ? 'border-b border-gray-200' : 'border-b border-gray-700'">
                        <th class="text-left px-2 py-1.5 font-medium">Name</th>
                        <th class="text-left px-2 py-1.5 font-medium">Value</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(variable, index) in variables" :key="index"
                        :class="['border-b', theme === 'light' ? 'border-gray-100' : 'border-gray-700']">
                        <td :class="['px-2 py-1.5 font-mono', theme === 'light' ? 'text-blue-600' : 'text-blue-400']">
                            {{ variable.name }}
                        </td>
                        <td :class="['px-2 py-1.5 font-mono truncate max-w-[180px]', theme === 'light' ? 'text-gray-700' : 'text-gray-300']"
                            :title="variable.value">
                            {{ variable.value }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'

const props = defineProps({
    theme: { type: String, required: true },
    variables: { type: Array, required: true }
})
</script>
