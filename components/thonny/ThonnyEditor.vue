<template>
    <div class="flex-1 flex flex-col min-h-0">
        <MonacoEditor ref="monacoEditorRef" height="100%" :modelValue="code"
            @update:modelValue="$emit('update:code', $event)" language="python"
            :theme="theme === 'light' ? 'vs' : 'vs-dark'" :options="editorOptions" class="h-full w-full" />
    </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import MonacoEditor from '~/components/MonacoEditor.vue'

const props = defineProps({
    code: { type: String, required: true },
    theme: { type: String, required: true },
    fontSize: { type: Number, default: 15 }
})

defineEmits(['update:code'])

const monacoEditorRef = ref(null)

const editorOptions = computed(() => ({
    fontSize: props.fontSize,
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
    lineHeight: Math.floor(props.fontSize * 1.4)
}))

defineExpose({
    focus: () => {
        monacoEditorRef.value?.focus()
    }
})
</script>
