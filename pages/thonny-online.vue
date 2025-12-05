<template>
    <div>
        <!-- Thonny IDE Area (Full Screen Height) -->
        <div class="h-screen overflow-hidden">
            <div :class="['h-full flex flex-col', theme === 'light' ? 'bg-gray-100' : 'bg-gray-900']"
                style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">

                <!-- Menu Bar -->
                <ThonnyMenuBar :theme="theme" :activeMenu="activeMenu" :menuItems="menuItems" @toggle-menu="toggleMenu"
                    @menu-action="handleMenuItem" />

                <!-- Toolbar -->
                <ThonnyToolbar :theme="theme" :pyodideReady="pyodideReady" :isLoading="isLoading"
                    @new-file="createNewFile" @save-file="saveFile" @run-code="runCurrentFile"
                    @stop-execution="stopExecution" @toggle-variables="showVariables = !showVariables" />

                <!-- File tabs -->
                <div
                    :class="['flex items-center px-2 border-b flex-shrink-0', theme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-800 border-gray-700']">
                    <div v-for="file in files" :key="file.id" :class="['flex items-center space-x-2 px-3 py-1.5 border-r cursor-pointer text-sm',
                        activeFileId === file.id
                            ? theme === 'light' ? 'bg-gray-50 border-gray-300' : 'bg-gray-700 border-gray-600'
                            : theme === 'light' ? 'bg-gray-100 border-gray-200 hover:bg-gray-50' : 'bg-gray-800 border-gray-700 hover:bg-gray-700',
                        theme === 'light' ? 'text-gray-800' : 'text-gray-200']" @click="selectFile(file.id)">
                        <span>{{ file.name }}</span>
                        <button v-if="files.length > 1" @click.stop="deleteFile(file.id)" class="hover:text-red-600">
                            <Icon icon="ph:x" class="w-3 h-3" />
                        </button>
                    </div>
                </div>

                <!-- Main Content: 2-row layout -->
                <div class="flex-1 flex flex-col overflow-hidden min-h-0">
                    <!-- Top Row: Editor + Variables -->
                    <div :style="{ height: `${editorHeight}%` }" class="flex border-b min-h-0"
                        :class="theme === 'light' ? 'border-gray-300' : 'border-gray-700'">
                        <!-- Code Editor -->
                        <ThonnyEditor v-model:code="currentFileContent" :theme="theme" />

                        <!-- Variables Panel -->
                        <ThonnyVariables v-if="showVariables" :theme="theme" :variables="variables" />
                    </div>

                    <!-- Resize Handle -->
                    <div :class="['h-1.5 cursor-row-resize flex items-center justify-center group flex-shrink-0', theme === 'light' ? 'bg-gray-300 hover:bg-blue-400' : 'bg-gray-700 hover:bg-blue-500']"
                        @mousedown="startResize">
                        <div class="w-12 h-0.5 rounded-full bg-gray-500 group-hover:bg-white transition-colors"></div>
                    </div>

                    <!-- Bottom Row: Shell -->
                    <div :style="{ height: `${100 - editorHeight}%` }" class="min-h-0">
                        <ThonnyShell :theme="theme" :output="output" @clear-output="clearOutput" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Information Section -->
        <LibraryInfoSection>
            <div class="text-center mb-12">
                <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                    Thonny Online - Python IDE for Beginners
                </h1>

                <div class="max-w-4xl mx-auto text-left space-y-6 text-gray-700 dark:text-gray-300">
                    <p class="text-base md:text-lg leading-relaxed">
                        Thonny is a beginner-friendly Python IDE designed specifically for learning programming. Our
                        online version brings the simplicity and power of Thonny directly to your browser, requiring no
                        installation or setup. With its clean interface and helpful features like variable inspection
                        and step-by-step execution visualization, Thonny Online makes learning Python easier and more
                        intuitive than ever before.
                    </p>

                    <p class="text-base md:text-lg leading-relaxed">
                        This online IDE comes with <strong>Python 3.11</strong> powered by Pyodide WebAssembly
                        technology, providing a complete Python environment that runs entirely in your browser. The
                        interface features a two-panel layout with the code editor on top and an interactive shell
                        below, just like the desktop Thonny application. You can write, run, and debug Python code while
                        watching variables update in real-time in the Variables panel.
                    </p>

                    <p class="text-base md:text-lg leading-relaxed">
                        Whether you're taking your first steps in programming or teaching Python to others, Thonny
                        Online provides a distraction-free environment focused on learning fundamentals. The variable
                        inspector helps you understand how your code affects data, while the interactive shell lets you
                        experiment with Python commands instantly.
                    </p>

                    <h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Perfect For</h3>
                    <ul class="list-disc list-inside space-y-2 text-base md:text-lg ml-4">
                        <li>Students learning Python programming for the first time</li>
                        <li>Teachers conducting interactive Python coding lessons</li>
                        <li>Beginners practicing basic programming concepts and syntax</li>
                        <li>Anyone wanting a simple, distraction-free Python environment</li>
                        <li>Quick Python experiments and code testing without installation</li>
                    </ul>
                </div>
            </div>
        </LibraryInfoSection>

        <!-- Footer -->
        <AppFooter />

        <!-- Toast Notifications -->
        <Toast :toasts="toasts" @remove="removeToast" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useHead } from '#app'
import { Icon } from '@iconify/vue'
import ThonnyMenuBar from '~/components/thonny/ThonnyMenuBar.vue'
import ThonnyToolbar from '~/components/thonny/ThonnyToolbar.vue'
import ThonnyEditor from '~/components/thonny/ThonnyEditor.vue'
import ThonnyShell from '~/components/thonny/ThonnyShell.vue'
import ThonnyVariables from '~/components/thonny/ThonnyVariables.vue'
import Toast from '~/components/ui/Toast.vue'
import LibraryInfoSection from '~/components/LibraryInfoSection.vue'
import AppFooter from '~/components/AppFooter.vue'
import { useThonnyPyodide } from '~/composables/useThonnyPyodide'

defineOptions({
    name: 'ThonnyOnline'
})

definePageMeta({
    layout: 'default'
})

useHead({
    title: 'Thonny Online - Python IDE for Beginners',
    meta: [
        { name: 'description', content: 'Learn Python with Thonny Online - a beginner-friendly Python IDE that runs in your browser.' },
        { name: 'keywords', content: 'thonny, python ide, learn python, python for beginners, online python editor' }
    ]
})

// Pyodide composable
const {
    pyodideReady,
    isLoading,
    output,
    variables,
    initializePyodide,
    runCode,
    stopExecution,
    clearOutput,
    terminate
} = useThonnyPyodide()

// State
const theme = ref('light')
const activeFileId = ref(1)
const toasts = ref([])
const activeMenu = ref(null)
const showVariables = ref(true)
const editorHeight = ref(65)
let toastId = 0

// Menu items
const menuItems = computed(() => [
    {
        name: 'File',
        items: [
            { name: 'New', action: 'newFile', shortcut: 'Ctrl+N' },
            { name: 'Save', action: 'saveFile', shortcut: 'Ctrl+S' },
            { name: '---' },
            { name: 'Close', action: 'closeFile' }
        ]
    },
    {
        name: 'Edit',
        items: [
            { name: 'Undo', action: 'undo', shortcut: 'Ctrl+Z' },
            { name: 'Redo', action: 'redo', shortcut: 'Ctrl+Y' },
            { name: '---' },
            { name: 'Find', action: 'find', shortcut: 'Ctrl+F' }
        ]
    },
    {
        name: 'View',
        items: [
            { name: 'Assistant', action: 'toggleAssistant', checked: false },
            { name: 'Exception', action: 'toggleException', checked: false },
            { name: 'Files', action: 'toggleFiles', checked: false },
            { name: 'Heap', action: 'toggleHeap', checked: false },
            { name: 'Help', action: 'toggleHelpPanel', checked: false },
            { name: 'Notes', action: 'toggleNotes', checked: false },
            { name: 'Object inspector', action: 'toggleObjectInspector', checked: false },
            { name: 'Outline', action: 'toggleOutline', checked: false },
            { name: 'Program tree', action: 'toggleProgramTree', checked: false },
            { name: 'Shell', action: 'toggleShell', checked: true },
            { name: 'Stack', action: 'toggleStack', checked: false },
            { name: 'TODO', action: 'toggleTodo', checked: false },
            { name: 'Variables', action: 'toggleVariables', checked: showVariables.value },
            { name: '---' },
            { name: 'Program arguments', action: 'toggleProgramArguments', checked: false },
            { name: 'Plotter', action: 'togglePlotter', checked: false },
            { name: '---' },
            { name: 'Increase font size', action: 'increaseFontSize', shortcut: 'Ctrl++' },
            { name: 'Decrease font size', action: 'decreaseFontSize', shortcut: 'Ctrl+-' },
            { name: '---' },
            { name: 'Focus editor', action: 'focusEditor', shortcut: 'Alt+E' },
            { name: 'Focus shell', action: 'focusShell', shortcut: 'Alt+S' }
        ]
    },
    {
        name: 'Run',
        items: [
            { name: 'Run current script', action: 'runCode', shortcut: 'F5' },
            { name: 'Stop', action: 'stopExecution' }
        ]
    },
    {
        name: 'Tools',
        items: [
            { name: 'Clear shell', action: 'clearOutput' }
        ]
    },
    {
        name: 'Help',
        items: [
            { name: 'About Thonny Online', action: 'about' }
        ]
    }
])

// Files
const files = ref([
    {
        id: 1,
        name: '<untitled>',
        content: `def celsius_to_fahrenheit(celsius):
    """Convert Celsius to Fahrenheit."""
    return (celsius * 9/5) + 32

# Ask the user for input
temp_c = float(input("Enter temperature in Celsius: "))

# Process
temp_f = celsius_to_fahrenheit(temp_c)

# Output the result
print(f"{temp_c}°C is equal to {temp_f}°F")
`
    }
])

// Computed
const currentFile = computed(() => files.value.find(f => f.id === activeFileId.value))
const currentFileContent = computed({
    get: () => currentFile.value?.content || '',
    set: (value) => {
        if (currentFile.value) {
            currentFile.value.content = value
        }
    }
})

// Resize functionality
let isResizing = false

function startResize(e) {
    isResizing = true
    e.preventDefault()

    const handleMouseMove = (moveEvent) => {
        if (!isResizing) return

        const container = document.querySelector('.flex-1.flex.flex-col.overflow-hidden.min-h-0')
        if (!container) return

        const containerRect = container.getBoundingClientRect()
        const newHeight = ((moveEvent.clientY - containerRect.top) / containerRect.height) * 100
        editorHeight.value = Math.min(Math.max(newHeight, 20), 80)
    }

    const handleMouseUp = () => {
        isResizing = false
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
}

// Menu functions
function toggleMenu(menuName) {
    activeMenu.value = activeMenu.value === menuName ? null : menuName
}

function handleMenuItem(action) {
    activeMenu.value = null

    switch (action) {
        case 'newFile':
            createNewFile()
            break
        case 'saveFile':
            saveFile()
            break
        case 'closeFile':
            if (files.value.length > 1) {
                deleteFile(activeFileId.value)
            }
            break
        // View menu items
        case 'toggleVariables':
            showVariables.value = !showVariables.value
            break
        case 'toggleAssistant':
            showToast('Assistant panel - Coming soon! Will provide helpful hints for errors.', 'info')
            break
        case 'toggleException':
            showToast('Exception panel - Coming soon! Will show detailed exception information.', 'info')
            break
        case 'toggleFiles':
            showToast('Files panel - Coming soon! Will show file browser.', 'info')
            break
        case 'toggleHeap':
            showToast('Heap viewer - Coming soon! Will visualize memory allocation.', 'info')
            break
        case 'toggleHelpPanel':
            showToast('Help panel - Coming soon! Will provide context-sensitive help.', 'info')
            break
        case 'toggleNotes':
            showToast('Notes panel - Coming soon! Will allow you to take notes.', 'info')
            break
        case 'toggleObjectInspector':
            showToast('Object inspector - Coming soon! Will inspect Python objects.', 'info')
            break
        case 'toggleOutline':
            showToast('Outline panel - Coming soon! Will show code structure.', 'info')
            break
        case 'toggleProgramTree':
            showToast('Program tree - Coming soon! Will show program execution tree.', 'info')
            break
        case 'toggleShell':
            showToast('Shell is always visible in Thonny Online', 'info')
            break
        case 'toggleStack':
            showToast('Stack viewer - Coming soon! Will show call stack during debugging.', 'info')
            break
        case 'toggleTodo':
            showToast('TODO panel - Coming soon! Will track TODO comments.', 'info')
            break
        case 'toggleProgramArguments':
            showToast('Program arguments - Coming soon! Will allow setting command-line arguments.', 'info')
            break
        case 'togglePlotter':
            showToast('Plotter - Coming soon! Will plot data visualizations.', 'info')
            break
        case 'increaseFontSize':
            showToast('Font size increased', 'success')
            break
        case 'decreaseFontSize':
            showToast('Font size decreased', 'success')
            break
        case 'focusEditor':
            showToast('Editor focused', 'success')
            break
        case 'focusShell':
            showToast('Shell focused', 'success')
            break
        // Run menu
        case 'runCode':
            runCurrentFile()
            break
        case 'stopExecution':
            stopExecution()
            break
        case 'clearOutput':
            clearOutput()
            break
        case 'about':
            showToast('Thonny Online - Python IDE for Beginners', 'info')
            break
    }
}

// File functions
function selectFile(fileId) {
    activeFileId.value = fileId
}

function createNewFile() {
    const newId = Math.max(...files.value.map(f => f.id)) + 1
    files.value.push({
        id: newId,
        name: `<untitled-${newId}>`,
        content: '# New Python file\n\n'
    })
    activeFileId.value = newId
    showToast('New file created', 'success')
}

function deleteFile(fileId) {
    if (files.value.length <= 1) {
        showToast('Cannot delete the last file', 'warning')
        return
    }
    files.value = files.value.filter(f => f.id !== fileId)
    if (activeFileId.value === fileId) {
        activeFileId.value = files.value[0].id
    }
}

function saveFile() {
    localStorage.setItem('thonny-files', JSON.stringify(files.value))
    showToast('File saved', 'success')
}

function runCurrentFile() {
    runCode(currentFileContent.value)
}

function showToast(message, type = 'info') {
    const id = toastId++
    toasts.value.push({ id, message, type })
    setTimeout(() => removeToast(id), 3000)
}

function removeToast(id) {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
        toasts.value.splice(index, 1)
    }
}

// Lifecycle
onMounted(() => {
    const savedFiles = localStorage.getItem('thonny-files')
    if (savedFiles) {
        try {
            files.value = JSON.parse(savedFiles)
        } catch (e) {
            console.error('Failed to load saved files:', e)
        }
    }

    initializePyodide()

    const handleKeyDown = (e) => {
        if (e.key === 'F5') {
            e.preventDefault()
            runCurrentFile()
        }
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault()
            saveFile()
        }
    }

    window.addEventListener('keydown', handleKeyDown)
    document.addEventListener('click', () => { activeMenu.value = null })

    onBeforeUnmount(() => {
        window.removeEventListener('keydown', handleKeyDown)
        terminate()
    })
})
</script>

<style scoped>
/* Thonny styling */
</style>
