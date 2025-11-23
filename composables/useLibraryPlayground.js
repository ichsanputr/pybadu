import { ref, computed, onMounted, watch } from 'vue'

export function useLibraryPlayground(config = {}) {
  const {
    packageName = '',
    defaultCode = '',
    examples = [],
    additionalPackages = [],
    setupCode = ''
  } = config

  // LocalStorage key based on package name
  const storageKey = `pybadu_${packageName}_files`
  
  // Load files from localStorage or use default
  function loadFilesFromStorage() {
    if (typeof window === 'undefined') return null
    
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.files && parsed.files.length > 0) {
          return parsed
        }
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error)
    }
    return null
  }

  // Save files to localStorage (excluding output)
  function saveFilesToStorage() {
    if (typeof window === 'undefined') return
    
    try {
      const data = {
        files: files.value,
        activeFileId: activeFileId.value,
        timestamp: Date.now()
        // Note: output is intentionally excluded to prevent storing heavy image data
      }
      localStorage.setItem(storageKey, JSON.stringify(data))
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }

  // Initialize files from storage or default
  const storedData = loadFilesFromStorage()
  const files = ref(storedData?.files || [
    {
      id: 1,
      name: 'main.py',
      content: defaultCode
    }
  ])

  const activeFileId = ref(storedData?.activeFileId || 1)
  // Output is never saved or loaded - always starts empty
  const output = ref([])
  const isLoading = ref(false)
  const pyodideReady = ref(false)
  const pyodide = ref(null)
  const loaderVisible = ref(false)
  
  // Initialize theme from document class (in case returning from index page)
  const getInitialTheme = () => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark') ? 'dark' : 'dark'
    }
    return 'dark'
  }
  const theme = ref(getInitialTheme())

  // Auto-save files when they change (output is never saved)
  watch(files, () => {
    saveFilesToStorage()
  }, { deep: true })

  watch(activeFileId, () => {
    saveFilesToStorage()
  })
  
  // Note: output is intentionally not watched or saved to avoid localStorage bloat

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

  function createNewFile(fileData = null) {
    const newId = Math.max(...files.value.map(f => f.id), 0) + 1
    
    const newFile = fileData ? {
      id: newId,
      name: fileData.name || `file${newId}.py`,
      content: fileData.content || ''
    } : {
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

  function renameFile({ fileId, newName }) {
    const file = files.value.find(f => f.id === fileId)
    if (file) {
      file.name = newName
    }
  }

  function saveToStorage() {
    saveFilesToStorage()
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

  // Sync theme with document class on mount
  if (typeof window !== 'undefined') {
    const hasDocumentDark = document.documentElement.classList.contains('dark')
    if (hasDocumentDark) {
      theme.value = 'dark'
    } else {
      // If coming from index page (no dark class), set to dark for compiler pages
      theme.value = 'dark'
      setThemeClass('dark')
    }
  }

  watch(theme, (val) => {
    setThemeClass(val)
  })

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
    
    // Start execution immediately
    const startTime = Date.now()
    
    // Add small delay before showing loading state (300ms)
    setTimeout(() => {
      if (isLoading.value) return // Already set
      isLoading.value = true
    }, 300)
    
    // Add minimum 1 second delay for better UX
    const minDelay = 1000
    
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
      
      // Handle matplotlib plots
      if (packageName.includes('matplotlib')) {
        try {
          const canvas = pyodide.value.runPython(`
import matplotlib.pyplot as plt
import io
import base64

# Get all figures
figs = [plt.figure(n) for n in plt.get_fignums()]
images = []

for fig in figs:
    buf = io.BytesIO()
    fig.savefig(buf, format='png', bbox_inches='tight', dpi=100)
    buf.seek(0)
    img_str = base64.b64encode(buf.read()).decode()
    images.append(img_str)
    buf.close()

','.join(images) if images else ''
          `)
          
          if (canvas && canvas.trim()) {
            const images = canvas.split(',')
            for (const imgData of images) {
              if (imgData) {
                output.value.push({
                  type: 'image',
                  content: imgData,
                  timestamp: new Date().toLocaleTimeString()
                })
              }
            }
          }
        } catch (plotError) {
          console.warn('No plots generated or error capturing plots:', plotError)
        }
      }
      
      const executionTime = Date.now() - startTime
      
      if (stdout && stdout.trim()) {
        output.value.push({
          type: 'print',
          content: stdout.trim(),
          timestamp: new Date().toLocaleTimeString()
        })
      }
      
      // Wait for minimum delay before finishing
      const elapsed = Date.now() - startTime
      if (elapsed < minDelay) {
        await new Promise(resolve => setTimeout(resolve, minDelay - elapsed))
      }
      
      const totalTime = Date.now() - startTime
      output.value.push({
        type: 'success', 
        content: `✓ Code executed successfully in ${totalTime}ms`,
        timestamp: new Date().toLocaleTimeString()
      })
      
    } catch (error) {
      console.error('Error running Python code:', error)
      
      // Wait for minimum delay even on error
      const elapsed = Date.now() - startTime
      if (elapsed < minDelay) {
        await new Promise(resolve => setTimeout(resolve, minDelay - elapsed))
      }
      
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
        loaderVisible.value = true
        setThemeClass(theme.value)
        
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
        loaderVisible.value = false
        
        // Run initial example if available
        if (currentFileContent.value.trim()) {
          await runCode()
        }
        
      } catch (error) {
        console.error('Failed to initialize Pyodide:', error)
        loaderVisible.value = false
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
    renameFile,
    saveToStorage,
    toggleTheme,
    runCode,
    clearCode,
    clearOutput,
    loadExample,
    initializePyodide
  }
}

