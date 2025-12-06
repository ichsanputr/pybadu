<template>
    <div :class="['flex flex-col h-full', theme === 'light' ? 'bg-white' : 'bg-gray-800']">
        <div v-if="outline.length > 0" class="flex-1 overflow-y-auto font-mono text-sm">
            <div v-for="(item, index) in outline" :key="index" class="cursor-pointer">
                <!-- Function Definition -->
                <div v-if="item.type === 'function'" @click="$emit('jump-to-line', item.lineno)"
                    :class="['px-3 py-1 hover:bg-opacity-50 flex items-center', theme === 'light' ? 'hover:bg-gray-100 text-gray-700' : 'hover:bg-gray-700 text-gray-300']">
                    <Icon icon="ph:function-bold" class="w-4 h-4 mr-2 text-purple-500" />
                    <span>{{ item.name }}</span>
                </div>

                <!-- Class Definition -->
                <div v-else-if="item.type === 'class'">
                    <div @click="$emit('jump-to-line', item.lineno)"
                        :class="['px-3 py-1 hover:bg-opacity-50 flex items-center font-bold', theme === 'light' ? 'hover:bg-gray-100 text-gray-800' : 'hover:bg-gray-700 text-gray-200']">
                        <Icon icon="ph:cube-bold" class="w-4 h-4 mr-2 text-blue-500" />
                        <span>{{ item.name }}</span>
                    </div>

                    <!-- Methods -->
                    <div v-for="(method, mIndex) in item.methods" :key="'m' + mIndex"
                        @click="$emit('jump-to-line', method.lineno)"
                        :class="['pl-8 pr-3 py-1 hover:bg-opacity-50 flex items-center', theme === 'light' ? 'hover:bg-gray-100 text-gray-600' : 'hover:bg-gray-700 text-gray-400']">
                        <Icon icon="ph:function" class="w-3 h-3 mr-2 opacity-70" />
                        <span>{{ method.name }}</span>
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="flex flex-col items-center justify-center h-full text-gray-400 p-4 text-center">
            <Icon icon="ph:list-dashes" class="w-12 h-12 mb-2 opacity-50" />
            <p>No outline available.</p>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'

defineProps({
    theme: { type: String, required: true },
    outline: { type: Array, default: () => [] }
})

defineEmits(['jump-to-line'])
</script>
