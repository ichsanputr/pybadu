<template>
  <ClientOnly>
    <div class="monaco-editor-container" :style="{ height: height }">
      <VueMonacoEditor
        :value="modelValue"
        :language="language"
        :theme="theme"
        :options="editorOptions"
        @change="handleChange"
        class="w-full"
        :style="{ height: height }"
      />
    </div>
    <template #fallback>
      <div class="w-full flex items-center justify-center bg-gray-100" :style="{ height: height }">
        <div class="text-gray-500">Loading editor...</div>
      </div>
    </template>
  </ClientOnly>
</template>

<script setup>
import { computed } from 'vue'

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

const handleChange = (value) => {
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<style scoped>
.monaco-editor-container {
  overflow: hidden;
}
</style>