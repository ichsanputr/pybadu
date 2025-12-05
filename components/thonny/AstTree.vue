<template>
    <div class="pl-4 border-l border-gray-200 dark:border-gray-700">
        <div @click="toggle"
            class="cursor-pointer flex items-center hover:bg-gray-100 dark:hover:bg-gray-800 rounded px-1 group select-none">
            <template v-if="hasChildren">
                <Icon :icon="isOpen ? 'ph:caret-down' : 'ph:caret-right'" class="w-3 h-3 mr-1 text-gray-500" />
            </template>
            <span v-else class="w-4 inline-block"></span>

            <span class="text-purple-600 dark:text-purple-400 font-bold font-mono text-xs">{{ node._type }}</span>
            <span v-if="hasChildren && !isOpen" class="ml-2 text-gray-400 text-xs">...</span>
        </div>

        <div v-if="isOpen && hasChildren" class="ml-2">
            <div v-for="(value, key) in fields" :key="key" class="my-0.5">
                <!-- If value is AST Node -->
                <div v-if="isNode(value)">
                    <span class="text-gray-500 text-xs font-mono mr-1">{{ key }}:</span>
                    <AstTree :node="value" :theme="theme" />
                </div>

                <!-- If value is List of Nodes or primitive types -->
                <div v-else-if="Array.isArray(value)">
                    <div class="flex items-center">
                        <span class="text-gray-500 text-xs font-mono mr-1">{{ key }}:</span>
                        <span class="text-gray-400 text-xs ml-1" v-if="value.length === 0">[]</span>
                        <span class="text-gray-400 text-xs ml-1" v-else>[{{ value.length }} items]</span>
                    </div>
                    <div v-if="value.length > 0" class="pl-2 border-l border-gray-300 dark:border-gray-600 ml-1">
                        <div v-for="(item, i) in value" :key="i">
                            <AstTree v-if="isNode(item)" :node="item" :theme="theme" />
                            <div v-else class="text-xs font-mono pl-4">
                                <span class="text-green-600 dark:text-green-400">{{ formatValue(item) }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Primitive -->
                <div v-else class="flex items-center">
                    <span class="text-gray-500 text-xs font-mono mr-1">{{ key }}:</span>
                    <span class="text-green-600 dark:text-green-400 font-mono text-xs">{{ formatValue(value) }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'

defineOptions({
    name: 'AstTree'
})

const props = defineProps({
    node: { type: Object, required: true },
    theme: { type: String, required: true }
})

const isOpen = ref(true)

const fields = computed(() => {
    const { _type, ...rest } = props.node
    // Filter out some fields if needed (like col_offset, lineno for cleaner view if desired, but user might want them)
    // For now keep only semantic fields, maybe hide location info?
    // User request didn't specify, but usually AST view shows everything.
    // Let's hide 'lineno', 'col_offset', 'end_lineno', 'end_col_offset', 'ctx' to reduce noise, unless user wants full AST.
    // Let's keep it simple and filter out position info for cleaner "Program Tree".
    const result = {}
    for (const key in rest) {
        if (!['lineno', 'col_offset', 'end_lineno', 'end_col_offset'].includes(key)) {
            result[key] = rest[key]
        }
    }
    return result
})

const hasChildren = computed(() => Object.keys(fields.value).length > 0)

function toggle() {
    if (hasChildren.value) {
        isOpen.value = !isOpen.value
    }
}

function isNode(val) {
    return val && typeof val === 'object' && !Array.isArray(val) && val._type
}

function formatValue(val) {
    if (val === null) return 'None'
    if (typeof val === 'string') return `"${val}"`
    return String(val)
}
</script>
