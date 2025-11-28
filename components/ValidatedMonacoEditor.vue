<template>
    <ClientOnly>
        <div class="monaco-editor-container" :style="{ height: height }">
            <VueMonacoEditor ref="editorRef" :value="modelValue" :language="language" :theme="theme"
                :options="editorOptions" @change="handleChange" @mount="handleEditorMount" class="w-full"
                :style="{ height: height }" />
        </div>
    </ClientOnly>
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue'

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
    },
    enableValidation: {
        type: Boolean,
        default: true
    }
})

const emit = defineEmits(['update:modelValue', 'change', 'validation'])

const editorRef = ref(null)
let editor = null
let monaco = null
let validationTimeout = null

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

    // Debounced validation
    if (props.enableValidation) {
        if (validationTimeout) {
            clearTimeout(validationTimeout)
        }
        validationTimeout = setTimeout(() => {
            validatePythonCode(value)
        }, 500)
    }
}

const handleEditorMount = (editorInstance, monacoInstance) => {
    editor = editorInstance
    monaco = monacoInstance

    // Initial validation
    if (props.enableValidation && props.modelValue) {
        validatePythonCode(props.modelValue)
    }
}

// Basic Python syntax validation
function validatePythonCode(code) {
    if (!editor || !monaco) return

    const model = editor.getModel()
    if (!model) return

    const markers = []
    const lines = code.split('\n')

    // Basic syntax checks
    lines.forEach((line, index) => {
        const lineNumber = index + 1
        const trimmedLine = line.trim()

        // Check for common syntax errors

        // 1. Unclosed parentheses, brackets, braces
        const openParens = (line.match(/\(/g) || []).length
        const closeParens = (line.match(/\)/g) || []).length
        const openBrackets = (line.match(/\[/g) || []).length
        const closeBrackets = (line.match(/\]/g) || []).length
        const openBraces = (line.match(/\{/g) || []).length
        const closeBraces = (line.match(/\}/g) || []).length

        if (openParens > closeParens) {
            markers.push({
                startLineNumber: lineNumber,
                startColumn: line.indexOf('(') + 1,
                endLineNumber: lineNumber,
                endColumn: line.length + 1,
                message: 'Unclosed parenthesis',
                severity: monaco.MarkerSeverity.Error
            })
        }

        if (openBrackets > closeBrackets) {
            markers.push({
                startLineNumber: lineNumber,
                startColumn: line.indexOf('[') + 1,
                endLineNumber: lineNumber,
                endColumn: line.length + 1,
                message: 'Unclosed bracket',
                severity: monaco.MarkerSeverity.Error
            })
        }

        if (openBraces > closeBraces) {
            markers.push({
                startLineNumber: lineNumber,
                startColumn: line.indexOf('{') + 1,
                endLineNumber: lineNumber,
                endColumn: line.length + 1,
                message: 'Unclosed brace',
                severity: monaco.MarkerSeverity.Error
            })
        }

        // 2. Check for missing colons after def, if, for, while, etc.
        const colonKeywords = /^(def|if|elif|else|for|while|try|except|finally|with|class)\s+/
        if (colonKeywords.test(trimmedLine) && !trimmedLine.endsWith(':') && !trimmedLine.includes('#')) {
            markers.push({
                startLineNumber: lineNumber,
                startColumn: 1,
                endLineNumber: lineNumber,
                endColumn: line.length + 1,
                message: 'Missing colon at end of statement',
                severity: monaco.MarkerSeverity.Error
            })
        }

        // 3. Check for invalid indentation (basic check)
        if (line.length > 0 && line[0] === ' ' && line.search(/\S/) % 4 !== 0) {
            markers.push({
                startLineNumber: lineNumber,
                startColumn: 1,
                endLineNumber: lineNumber,
                endColumn: line.search(/\S/) + 1,
                message: 'Inconsistent indentation (use 4 spaces)',
                severity: monaco.MarkerSeverity.Warning
            })
        }

        // 4. Check for unclosed strings (basic)
        const singleQuotes = (line.match(/'/g) || []).length
        const doubleQuotes = (line.match(/"/g) || []).length

        if (singleQuotes % 2 !== 0 && !line.includes('#')) {
            markers.push({
                startLineNumber: lineNumber,
                startColumn: line.indexOf("'") + 1,
                endLineNumber: lineNumber,
                endColumn: line.length + 1,
                message: 'Unclosed string (single quote)',
                severity: monaco.MarkerSeverity.Error
            })
        }

        if (doubleQuotes % 2 !== 0 && !line.includes('#')) {
            markers.push({
                startLineNumber: lineNumber,
                startColumn: line.indexOf('"') + 1,
                endLineNumber: lineNumber,
                endColumn: line.length + 1,
                message: 'Unclosed string (double quote)',
                severity: monaco.MarkerSeverity.Error
            })
        }

        // 5. Check for common typos
        if (/\bpirnt\b/.test(line)) {
            const col = line.indexOf('pirnt')
            markers.push({
                startLineNumber: lineNumber,
                startColumn: col + 1,
                endLineNumber: lineNumber,
                endColumn: col + 6,
                message: "Did you mean 'print'?",
                severity: monaco.MarkerSeverity.Warning
            })
        }

        if (/\bimoprt\b/.test(line)) {
            const col = line.indexOf('imoprt')
            markers.push({
                startLineNumber: lineNumber,
                startColumn: col + 1,
                endLineNumber: lineNumber,
                endColumn: col + 7,
                message: "Did you mean 'import'?",
                severity: monaco.MarkerSeverity.Warning
            })
        }
    })

    // Set markers in Monaco
    monaco.editor.setModelMarkers(model, 'python-validator', markers)

    // Emit validation results
    emit('validation', {
        hasErrors: markers.some(m => m.severity === monaco.MarkerSeverity.Error),
        hasWarnings: markers.some(m => m.severity === monaco.MarkerSeverity.Warning),
        markers: markers
    })
}

// Watch for external value changes
watch(() => props.modelValue, (newValue) => {
    if (props.enableValidation && newValue) {
        validatePythonCode(newValue)
    }
})

onBeforeUnmount(() => {
    if (validationTimeout) {
        clearTimeout(validationTimeout)
    }
})
</script>

<style scoped>
.monaco-editor-container {
    overflow: hidden;
}
</style>
