<template>
    <div :class="['flex flex-col h-full', theme === 'light' ? 'bg-gray-50' : 'bg-gray-800']">
        <!-- Panel Header (Tabs) -->
        <div
            :class="['flex items-center px-0 border-b text-sm flex-shrink-0 overflow-x-auto', theme === 'light' ? 'bg-gray-100 border-gray-300 text-gray-700' : 'bg-gray-800 border-gray-700 text-gray-300']">

            <button v-if="showVariables" @click="activeTab = 'variables'" :class="['px-3 py-1.5 border-r font-medium text-xs uppercase tracking-wide transition-colors flex items-center group flex-shrink-0',
                activeTab === 'variables'
                    ? (theme === 'light' ? 'bg-white text-blue-600 border-b-2 border-b-blue-600' : 'bg-gray-900 text-blue-400 border-b-2 border-b-blue-400')
                    : (theme === 'light' ? 'bg-gray-100 text-gray-500 hover:bg-gray-200' : 'bg-gray-800 text-gray-400 hover:bg-gray-700')
            ]" style="margin-bottom: -1px;">
                <span class="mr-2">Variables</span>
                <div @click.stop="$emit('close-tab', 'variables')"
                    :class="['p-0.5 rounded-full opacity-60 group-hover:opacity-100', theme === 'light' ? 'hover:bg-gray-300 text-gray-600' : 'hover:bg-gray-600 text-gray-400']">
                    <Icon icon="ph:x" class="w-3 h-3" />
                </div>
            </button>

            <button v-if="showOutline" @click="activeTab = 'outline'" :class="['px-3 py-1.5 border-r font-medium text-xs uppercase tracking-wide transition-colors flex items-center group flex-shrink-0',
                activeTab === 'outline'
                    ? (theme === 'light' ? 'bg-white text-blue-600 border-b-2 border-b-blue-600' : 'bg-gray-900 text-blue-400 border-b-2 border-b-blue-400')
                    : (theme === 'light' ? 'bg-gray-100 text-gray-500 hover:bg-gray-200' : 'bg-gray-800 text-gray-400 hover:bg-gray-700')
            ]" style="margin-bottom: -1px;">
                <span class="mr-2">Outline</span>
                <div @click.stop="$emit('close-tab', 'outline')"
                    :class="['p-0.5 rounded-full opacity-60 group-hover:opacity-100', theme === 'light' ? 'hover:bg-gray-300 text-gray-600' : 'hover:bg-gray-600 text-gray-400']">
                    <Icon icon="ph:x" class="w-3 h-3" />
                </div>
            </button>
        </div>

        <!-- Content Area -->
        <div class="flex-1 overflow-hidden relative w-full bg-white dark:bg-gray-900">
            <!-- Variables Content -->
            <div v-show="activeTab === 'variables'" class="absolute inset-0 flex flex-col min-h-0">
                <ThonnyVariables :theme="theme" :variables="variables" class="h-full w-full" />
            </div>

            <!-- Outline Content -->
            <div v-show="activeTab === 'outline'" class="absolute inset-0 flex flex-col min-h-0">
                <ThonnyOutline :theme="theme" :outline="outlineData" @jump-to-line="$emit('jump-to-line', $event)" />
            </div>

            <!-- Future tab contents... -->
            <div v-show="activeTab === 'assistant'"
                class="absolute inset-0 flex items-center justify-center text-gray-400">
                <p>Assistant Coming Soon</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import ThonnyVariables from './ThonnyVariables.vue'
import ThonnyOutline from './ThonnyOutline.vue'

const props = defineProps({
    theme: { type: String, required: true },
    showVariables: { type: Boolean, default: false },
    showOutline: { type: Boolean, default: false },
    variables: { type: Array, default: () => [] },
    outlineData: { type: Array, default: () => [] }
})

const emit = defineEmits(['close-tab', 'jump-to-line'])

const activeTab = ref(null)

// Watch props to ensure active tab is visible
watch(() => [props.showVariables, props.showOutline], ([newVariables, newOutline]) => {
    if (activeTab.value === 'variables' && !newVariables) {
        if (newOutline) activeTab.value = 'outline'
        else activeTab.value = null
    } else if (activeTab.value === 'outline' && !newOutline) {
        if (newVariables) activeTab.value = 'variables'
        else activeTab.value = null
    } else if (!activeTab.value) {
        if (newVariables) activeTab.value = 'variables'
        else if (newOutline) activeTab.value = 'outline'
    }
}, { immediate: true })

// Expose openTab
const openTab = (tabName) => {
    if (['variables', 'outline'].includes(tabName)) {
        activeTab.value = tabName
    }
}

defineExpose({
    openTab
})
</script>
