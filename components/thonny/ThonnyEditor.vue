<template>
    <div class="flex-1 flex flex-col min-h-0">
        <MonacoEditor height="100%" :modelValue="code" @update:modelValue="$emit('update:code', $event)"
            language="python" :theme="theme === 'light' ? 'vs' : 'vs-dark'" :options="editorOptions"
            class="h-full w-full" />
    </div>
</template>

<script setup>
import MonacoEditor from '~/components/MonacoEditor.vue'

const props = defineProps({
    code: { type: String, required: true },
    theme: { type: String, required: true }
})

defineEmits(['update:code'])

const editorOptions = {
    fontSize: 15,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    wordWrap: 'off',
    lineNumbers: 'on',
    folding: true,
    automaticLayout: true,
    tabSize: 4,
    insertSpaces: true,
    renderWhitespace: 'none',
    fontFamily: '"Courier New", Courier, monospace',
    cursorStyle: 'line',
    lineHeight: 20
}
</script>
