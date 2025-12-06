<template>
    <div>
        <!-- Thonny IDE Area (Full Screen Height) -->
        <div :class="['min-h-screen flex flex-col', theme === 'light' ? 'bg-gray-100' : 'bg-gray-900']"
            style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">

            <!-- Menu Bar -->
            <ThonnyMenuBar :theme="theme" :activeMenu="activeMenu" :menuItems="menuItems" @toggle-menu="toggleMenu"
                @menu-action="handleMenuItem" />

            <!-- Toolbar -->
            <ThonnyToolbar :theme="theme" :pyodideReady="pyodideReady" :isLoading="isLoading" @new-file="createNewFile"
                @save-file="saveFile" @upload-file="handleUploadFile" @run-code="runCurrentFile"
                @stop-execution="stopExecution" />

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

            <!-- Main Content: 2-row layout with CSS Grid -->
            <!-- Main Content: Flex Row (Left: Editor/BottomPanel, Right: Sidebar) -->
            <div class="flex-1 flex flex-row overflow-hidden main-flex-container">
                <!-- Left Column (Editor + Bottom Panel) -->
                <div class="flex-1 grid grid-layout-container" :style="{
                    gridTemplateRows: isBottomPanelVisible ? `${editorHeight}% 6px ${100 - editorHeight}%` : '100% 0px 0px'
                }">
                    <!-- Top Row: Code Editor -->
                    <div class="flex overflow-hidden border-b"
                        :class="theme === 'light' ? 'border-gray-300' : 'border-gray-700'">
                        <ThonnyEditor ref="thonnyEditor" v-model:code="currentFileContent" :theme="theme"
                            :fontSize="editorFontSize" />
                    </div>

                    <!-- Vertical Resize Handle -->
                    <div v-show="isBottomPanelVisible"
                        :class="['cursor-row-resize flex items-center justify-center group', theme === 'light' ? 'bg-gray-300 hover:bg-blue-400' : 'bg-gray-700 hover:bg-blue-500']"
                        @mousedown="startVerticalResize">
                        <div class="w-12 h-0.5 rounded-full bg-gray-500 group-hover:bg-white transition-colors"></div>
                    </div>

                    <!-- Bottom Row: Bottom Panel -->
                    <div class="overflow-hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 h-full w-full"
                        v-show="isBottomPanelVisible">
                        <ThonnyBottomPanel ref="thonnyBottomPanel" :theme="theme" :output="output"
                            :isExecuting="isLoading" :show-shell="showShell" :show-exception="showException"
                            :show-program-tree="showProgramTree" :show-todo="showTodo" :todo-items="todoItems"
                            :ast-data="astData" @clear-output="clearOutput" @execute-command="handleShellCommand"
                            @close="closeBottomPanel" @close-tab="handleCloseTab" @jump-to-line="handleJumpToLine" />
                    </div>
                </div>

                <!-- Horizontal Resize Handle -->
                <div v-if="showVariables"
                    :class="['w-1.5 cursor-col-resize flex items-center justify-center hover:bg-blue-400 transition-colors z-10 flex-shrink-0', theme === 'light' ? 'bg-gray-200' : 'bg-gray-800']"
                    @mousedown="startHorizontalResize">
                    <div class="h-8 w-0.5 rounded-full bg-gray-400"></div>
                </div>

                <!-- Right Column (Variables) -->
                <div v-if="showVariables" class="flex flex-col border-l overflow-hidden"
                    :class="theme === 'light' ? 'border-gray-300 bg-gray-50' : 'border-gray-700 bg-gray-800'"
                    :style="{ width: `${sidebarWidth}%` }">
                    <ThonnyVariables :theme="theme" :variables="variables" class="h-full w-full" />
                </div>
            </div>
        </div>

        <!-- Information Section -->
        <ThonnyInfoSection />

        <!-- Footer -->
        <AppFooter />

        <!-- Toast Notifications -->
        <Toast :toasts="toasts" @remove="removeToast" />

        <!-- Save As Dialog -->
        <InputDialog :is-open="saveDialog.isOpen" title="Save As" message="Enter a filename for your script:"
            placeholder="script.py" default-value="script.py" @submit="handleSaveSubmit" @cancel="handleSaveCancel" />

        <!-- Package Manager Dialog -->
        <PackageManagerDialog :is-open="showPackageManager" :install-package="installPackage"
            :remove-package="removePackage" :get-installed-packages="getInstalledPackages"
            @close="showPackageManager = false" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useHead } from '#app'
import { Icon } from '@iconify/vue'
import ThonnyMenuBar from '~/components/thonny/ThonnyMenuBar.vue'
import ThonnyToolbar from '~/components/thonny/ThonnyToolbar.vue'
import ThonnyEditor from '~/components/thonny/ThonnyEditor.vue'
import ThonnyBottomPanel from '~/components/thonny/ThonnyBottomPanel.vue'
import ThonnyVariables from '~/components/thonny/ThonnyVariables.vue'
import Toast from '~/components/ui/Toast.vue'
import InputDialog from '~/components/ui/InputDialog.vue'
import PackageManagerDialog from '~/components/thonny/PackageManagerDialog.vue'
import ThonnyInfoSection from '~/components/thonny/ThonnyInfoSection.vue'
import AppFooter from '~/components/AppFooter.vue'
import { useThonnyPyodide } from '~/composables/useThonnyPyodide'

defineOptions({
    name: 'ThonnyOnline'
})

definePageMeta({
    layout: 'default'
})

useHead({
    title: 'Online Thonny IDE - Try on Browser',
    htmlAttrs: {
        lang: 'en'
    },
    meta: [
        { name: 'description', content: 'Experience Thonny IDE online directly in your browser. A perfect Python editor for beginners with built-in variable inspector, shell, and zero installation.' },
        { name: 'keywords', content: 'thonny online, python ide online, python compiler online, learn python, python for beginners, educational python ide, pyodide python, web python' },
        { name: 'robots', content: 'index, follow' },
        { name: 'author', content: 'Budibadu' },

        // Open Graph / Facebook
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Budibadu' },
        { property: 'og:url', content: 'https://budibadu.com/thonny-ide-online' },
        { property: 'og:title', content: 'Online Thonny IDE - Python Editor for Beginners' },
        { property: 'og:description', content: 'Start coding Python instantly with Thonny Online. Features include variable inspection, AST visualization, and package management - all in your browser.' },
        { property: 'og:image', content: 'https://budibadu.com/images/og/thonny-online.png' },

        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:url', content: 'https://budibadu.com/thonny-ide-online' },
        { name: 'twitter:title', content: 'Online Thonny IDE - Run Python in Browser' },
        { name: 'twitter:description', content: 'No installation needed. Run Python code, inspect variables, and visualize execution with Thonny Online.' },
        { name: 'twitter:image', content: 'https://budibadu.com/images/og/thonny-online.png' },
    ],
    link: [
        { rel: 'canonical', href: 'https://budibadu.com/thonny-ide-online' }
    ]
})

// Pyodide composable
const {
    pyodideReady,
    isLoading,
    output,
    variables,
    initializePyodide,
    runScript,
    runShell,
    stopExecution,
    clearOutput,
    terminate,
    addOutput,
    installPackage,
    removePackage,
    getInstalledPackages,
    generateAST
} = useThonnyPyodide()

// State
const theme = ref('light')
const activeFileId = ref(1)
const toasts = ref([])
const activeMenu = ref(null)
const showVariables = ref(true)
const editorHeight = ref(65)
const editorFontSize = ref(15)
let toastId = 0

// Dialog State
const saveDialog = ref({
    isOpen: false,
    resolve: null
})
const showPackageManager = ref(false)
const showShell = ref(true)
const showException = ref(false)
const showProgramTree = ref(false)
const showTodo = ref(false)
const todoItems = ref([])
const astData = ref(null)

// DOM Refs
const thonnyEditor = ref(null)
const thonnyBottomPanel = ref(null)

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
            { name: 'Exception', action: 'toggleException', checked: showException.value },
            { name: 'Files', action: 'toggleFiles', checked: false },
            { name: 'Notes', action: 'toggleNotes', checked: false },
            { name: 'Object inspector', action: 'toggleObjectInspector', checked: false },
            { name: 'Outline', action: 'toggleOutline', checked: false },
            { name: 'Program tree', action: 'toggleProgramTree', checked: showProgramTree.value },
            { name: 'Shell', action: 'toggleShell', checked: showShell.value },
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
            { name: 'Manage packages...', action: 'managePackages' },
            { name: '---' },
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
const isBottomPanelVisible = computed(() => showShell.value || showException.value || showProgramTree.value || showTodo.value)

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
// Resize functionality
const sidebarWidth = ref(30)
let isResizingVertical = false
let isResizingHorizontal = false

function startVerticalResize(e) {
    isResizingVertical = true
    e.preventDefault()

    const handleMouseMove = (moveEvent) => {
        if (!isResizingVertical) return

        const container = document.querySelector('.grid-layout-container')
        if (!container) return

        const containerRect = container.getBoundingClientRect()
        // If bottom panel is hidden, we shouldn't be resizing, but just in case
        if (!isBottomPanelVisible.value) return

        const newHeight = ((moveEvent.clientY - containerRect.top) / containerRect.height) * 100
        editorHeight.value = Math.min(Math.max(newHeight, 20), 80)
    }

    const handleMouseUp = () => {
        isResizingVertical = false
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
}

function startHorizontalResize(e) {
    isResizingHorizontal = true
    e.preventDefault()

    const handleMouseMove = (moveEvent) => {
        if (!isResizingHorizontal) return

        const container = document.querySelector('.main-flex-container')
        if (!container) return

        const containerRect = container.getBoundingClientRect()
        // Calculate width from right edge
        const newWidth = ((containerRect.right - moveEvent.clientX) / containerRect.width) * 100
        sidebarWidth.value = Math.min(Math.max(newWidth, 15), 50)
    }

    const handleMouseUp = () => {
        isResizingHorizontal = false
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
}

function handleCloseTab(tabName) {
    if (tabName === 'shell') showShell.value = false
    if (tabName === 'exception') showException.value = false
    if (tabName === 'program-tree') showProgramTree.value = false
    if (tabName === 'todo') showTodo.value = false
}

async function updateAst() {
    if (showProgramTree.value && currentFileContent.value) {
        astData.value = await generateAST(currentFileContent.value)
    }
}

function updateTodos() {
    if (showTodo.value && currentFileContent.value) {
        const lines = currentFileContent.value.split('\n')
        const items = []
        lines.forEach((line, index) => {
            const match = line.match(/#\s*(TODO|FIXME)\s*:?\s*(.*)/i)
            if (match) {
                items.push({
                    line: index + 1,
                    type: match[1].toUpperCase(), // TODO or FIXME
                    message: match[2].trim()
                })
            }
        })
        todoItems.value = items
    }
}

watch([showProgramTree, showTodo, currentFileContent], () => {
    if (showProgramTree.value) {
        updateAst()
    }
    if (showTodo.value) {
        updateTodos()
    }
})

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
            showException.value = !showException.value
            if (showException.value) {
                // Ensure tab is switched (nextTick because watcher in child needs prop update)
                setTimeout(() => thonnyBottomPanel.value?.openTab('exception'), 0)
            }
            break
        case 'toggleFiles':
            showToast('Files panel - Coming soon! Will show file browser.', 'info')
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
            showProgramTree.value = !showProgramTree.value
            if (showProgramTree.value) {
                updateAst()
                setTimeout(() => thonnyBottomPanel.value?.openTab('program-tree'), 0)
            }
            break
        case 'toggleShell':
            showShell.value = !showShell.value
            if (showShell.value) {
                setTimeout(() => thonnyBottomPanel.value?.openTab('shell'), 0)
            }
            break
        case 'toggleTodo':
            showTodo.value = !showTodo.value
            if (showTodo.value) {
                updateTodos()
                setTimeout(() => thonnyBottomPanel.value?.openTab('todo'), 0)
            }
            break
        case 'toggleProgramArguments':
            showToast('Program arguments - Coming soon! Will allow setting command-line arguments.', 'info')
            break
        case 'togglePlotter':
            showToast('Plotter - Coming soon! Will plot data visualizations.', 'info')
            break
        case 'increaseFontSize':
            editorFontSize.value = Math.min(editorFontSize.value + 1, 72)
            break
        case 'decreaseFontSize':
            editorFontSize.value = Math.max(editorFontSize.value - 1, 8)
            break
        case 'focusEditor':
            thonnyEditor.value?.focus()
            break
        case 'focusShell':
            showShell.value = true
            // If exception was also open, we might need to switch tab explicitly.
            // But ThonnyBottomPanel's focusInput handles tab switching.
            setTimeout(() => thonnyBottomPanel.value?.focusInput(), 0)
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
        case 'managePackages':
            showPackageManager.value = true
            break
        case 'about':
            showToast('Online Thonny IDE - Try on Browser', 'info')
            break
    }
}

// File functions
function selectFile(fileId) {
    activeFileId.value = fileId
}

function createNewFile() {
    if (files.value.length >= 5) {
        showToast('Maximum limit of 5 files reached', 'warning')
        return
    }

    const newId = Math.max(...files.value.map(f => f.id)) + 1
    files.value.push({
        id: newId,
        name: `<untitled-${newId}>`,
        content: '# New Python file\n\n'
    })
    activeFileId.value = newId
    showToast('New file created', 'success')
}

function handleUploadFile() {
    if (files.value.length >= 5) {
        showToast('Maximum limit of 5 files reached', 'warning')
        return
    }

    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.py,.txt'

    input.onchange = (e) => {
        const file = e.target.files[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (event) => {
            const content = event.target.result
            const newId = Math.max(...files.value.map(f => f.id)) + 1

            // Check for duplicate names
            files.value.push({
                id: newId,
                name: file.name,
                content: content
            })
            activeFileId.value = newId

            // Save to localStorage
            localStorage.setItem('thonny-files', JSON.stringify(files.value))
            showToast(`File uploaded: ${file.name}`, 'success')
        }
        reader.readAsText(file)
    }

    input.click()
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

    // Update localStorage
    localStorage.setItem('thonny-files', JSON.stringify(files.value))
}

async function saveFile() {
    if (!currentFile.value) return

    // If file is untitled, ask for a name
    if (currentFile.value.name.startsWith('<untitled')) {
        try {
            const newName = await new Promise((resolve) => {
                saveDialog.value = {
                    isOpen: true,
                    resolve
                }
            })

            if (newName) {
                // Check if user added extension
                currentFile.value.name = newName.endsWith('.py') ? newName : `${newName}.py`
            } else {
                return // User cancelled
            }
        } finally {
            saveDialog.value.isOpen = false
            saveDialog.value.resolve = null
        }
    }

    localStorage.setItem('thonny-files', JSON.stringify(files.value))
    showToast('File saved', 'success')
}

function handleSaveSubmit(value) {
    if (saveDialog.value.resolve) {
        saveDialog.value.resolve(value)
    }
}

function handleSaveCancel() {
    if (saveDialog.value.resolve) {
        saveDialog.value.resolve(null)
    }
}

async function runCurrentFile() {
    if (!currentFile.value) return
    if (isLoading.value) return

    // Artificial delay for UI feedback
    isLoading.value = true
    await new Promise(resolve => setTimeout(resolve, 500))
    isLoading.value = false

    addOutput(`%Run ${currentFile.value.name}`, 'system')
    await runScript(currentFileContent.value)
    updateAst()
}

function handleShellCommand(command) {
    if (command === undefined) return

    // Log the command as user input
    addOutput(command, 'input')

    // Run the command
    if (command.trim()) {
        runShell(command)
    }
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

function closeBottomPanel() {
    showShell.value = false
    showException.value = false
    showProgramTree.value = false
    showTodo.value = false
}

function handleJumpToLine(line) {
    thonnyEditor.value?.revealLine(line)
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
