import { ref, computed, onMounted, watch } from 'vue'

export function useLibraryPlayground(config = {}) {
  const {
    packageName = '',
    defaultCode = '',
    examples = [],
    additionalPackages = [],
    setupCode = ''
  } = config

  // Reactive state
  const files = ref([
    {
      id: 1,
      name: 'main.py',
      content: defaultCode
    }
  ])

  const activeFileId = ref(1)
  const output = ref([])
  const isLoading = ref(false)
  const pyodideReady = ref(false)
  const pyodide = ref(null)
  const loaderVisible = ref(false)
  const theme = ref('dark')

  // File management
  const currentFileContent = computed({
    get: () => {
      const activeFile = files.value.find(f => f.id === activeFileId.value)
      return activeFile ? activeFile.content : ''
    },
    set: (value) => {
      const activeFile = files.value.find(f => f.id === activeFileId.value)
      if (activeFile) {
        activeFile.content = value
      }
    }
  })

  function updateCurrentFile(content) {
    currentFileContent.value = content
  }

  function createNewFile() {
    const newId = Math.max(...files.value.map(f => f.id)) + 1
    const newFile = {
      id: newId,
      name: `file${newId}.py`,
      content: `# New Python file\nimport ${packageName}\n\n# Your code here...\n`
    }
    files.value.push(newFile)
    activeFileId.value = newId
  }

  function selectFile(fileId) {
    activeFileId.value = fileId
  }

  function deleteFile(fileId) {
    if (files.value.length <= 1) return
    
    files.value = files.value.filter(f => f.id !== fileId)
    
    if (activeFileId.value === fileId) {
      activeFileId.value = files.value[0].id
    }
  }

  const monacoTheme = computed(() => (theme.value === 'dark' ? 'vs-dark' : 'vs-light'))

  function setThemeClass(val) {
    if (typeof window !== 'undefined') {
      if (val === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }

  watch(theme, (val) => {
    setThemeClass(val)
  }, { immediate: true })

  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  function waitForPyodide() {
    return new Promise((resolve) => {
      if (window.loadPyodide) {
        resolve()
      } else {
        const checkPyodide = () => {
          if (window.loadPyodide) {
            resolve()
          } else {
            setTimeout(checkPyodide, 100)
          }
        }
        checkPyodide()
      }
    })
  }

  async function runCode() {
    if (!pyodideReady.value || !currentFileContent.value.trim()) return
    
    isLoading.value = true
    const startTime = Date.now()
    
    try {
      output.value = []
      
      pyodide.value.runPython(`
import sys
from io import StringIO
${packageName.includes('matplotlib') ? `
import matplotlib.pyplot as plt
plt.close('all')
` : ''}
sys.stdout = StringIO()
      `)
      
      pyodide.value.runPython(currentFileContent.value)
      
      const stdout = pyodide.value.runPython(`
captured_output = sys.stdout.getvalue()
sys.stdout = sys.__stdout__
captured_output
      `)
      
      const executionTime = Date.now() - startTime
      
      if (stdout && stdout.trim()) {
        output.value.push({
          type: 'print',
          content: stdout.trim(),
          timestamp: new Date().toLocaleTimeString()
        })
      }
      
      output.value.push({
        type: 'success', 
        content: `✓ Code executed successfully in ${executionTime}ms`,
        timestamp: new Date().toLocaleTimeString()
      })
      
    } catch (error) {
      console.error('Error running Python code:', error)
      output.value.push({
        type: 'error',
        content: `Error: ${error.message}`,
        timestamp: new Date().toLocaleTimeString()
      })
    } finally {
      isLoading.value = false
    }
  }

  function clearCode() {
    currentFileContent.value = ''
  }

  function clearOutput() {
    output.value = []
  }

  function loadExample(example) {
    currentFileContent.value = example.code
    setTimeout(() => {
      runCode()
    }, 100)
  }

  async function initializePyodide() {
    if (process.client) {
      try {
        setThemeClass('dark')
        
        await waitForPyodide()
        
        pyodide.value = await loadPyodide()
        
        await pyodide.value.loadPackage("micropip")
        const micropip = pyodide.value.pyimport("micropip")
        
        // Install main package
        if (packageName) {
          await micropip.install(packageName)
        }
        
        // Install additional packages
        for (const pkg of additionalPackages) {
          await micropip.install(pkg)
        }
        
        // Run setup code if provided
        if (setupCode) {
          pyodide.value.runPython(setupCode)
        }
        
        pyodideReady.value = true
        
        // Run initial example if available
        if (currentFileContent.value.trim()) {
          await runCode()
        }
        
      } catch (error) {
        console.error('Failed to initialize Pyodide:', error)
        output.value.push({
          type: 'error',
          content: `Failed to initialize: ${error.message}`,
          timestamp: new Date().toLocaleTimeString()
        })
      }
    }
  }

  return {
    // State
    files,
    activeFileId,
    output,
    isLoading,
    pyodideReady,
    theme,
    loaderVisible,
    currentFileContent,
    monacoTheme,
    
    // Methods
    updateCurrentFile,
    createNewFile,
    selectFile,
    deleteFile,
    toggleTheme,
    runCode,
    clearCode,
    clearOutput,
    loadExample,
    initializePyodide
  }
}

