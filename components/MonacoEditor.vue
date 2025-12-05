<template>
  <ClientOnly>
    <div class="monaco-editor-container" :style="{ height: height }">
      <VueMonacoEditor :value="modelValue" :language="language" :theme="theme" :options="editorOptions"
        @change="handleChange" @mount="handleMount" class="w-full" :style="{ height: height }" />
    </div>
  </ClientOnly>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    default: 'python'
  },
  theme: {
    type: String,
    default: 'vs-dark'
  },
  height: {
    type: String,
    default: '400px'
  },
  fontSize: {
    type: [Number, String],
    default: 16
  },
  options: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

// Use options prop if provided, otherwise use defaults
const editorOptions = computed(() => {
  if (props.options && Object.keys(props.options).length > 0) {
    return props.options
  }

  // Fallback to default options
  return {
    automaticLayout: true,
    minimap: { enabled: false },
    fontSize: Number(props.fontSize) || 16,
    lineNumbers: 'on',
    scrollBeyondLastLine: false,
    readOnly: false,
    wordWrap: 'on',
    tabSize: 4,
    insertSpaces: true
  }
})

const editorRef = ref(null)

const handleMount = (editor) => {
  editorRef.value = editor
}

const handleChange = (value) => {
  emit('update:modelValue', value)
  emit('change', value)
}

defineExpose({
  focus: () => {
    editorRef.value?.focus()
  }
})
</script>

<style scoped>
.monaco-editor-container {
  overflow: hidden;
}
</style>