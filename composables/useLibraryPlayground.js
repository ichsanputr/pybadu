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

  // Save files to localStorage (excluding output and activeFileId)
  function saveFilesToStorage() {
    if (typeof window === 'undefined') return
    
    try {
      const data = {
        files: files.value,
        timestamp: Date.now()
        // Note: output and activeFileId are intentionally excluded
        // - output: prevents storing heavy image data
        // - activeFileId: always defaults to first file on page reload
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

  // activeFileId always defaults to first file on page reload (not saved to localStorage)
  const activeFileId = ref(Number(files.value[0]?.id) || 1)
  // Output is never saved or loaded - always starts empty
  const output = ref([])
  const isLoading = ref(false)
  const pyodideReady = ref(false)
  const pyodide = ref(null)
  const loaderVisible = ref(false)
  
  // Theme is stateless - always starts with dark, not saved to localStorage
  const theme = ref('dark')

  // Auto-save files when they change (output is never saved)
  watch(files, () => {
    saveFilesToStorage()
  }, { deep: true })

  // Note: activeFileId is not watched - it always defaults to first file on reload
  
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

  // Watch theme changes and apply to document (but never save to localStorage)
  watch(theme, (val) => {
    setThemeClass(val)
  }, { immediate: true })

  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  // Web worker for package loading status
  let packageWorker = null

  // Load Pyodide CDN script dynamically (only on compiler pages)
  function loadPyodideScript() {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if (window.loadPyodide) {
        resolve()
        return
      }

      // Check if script is already being loaded
      if (document.querySelector('script[src*="pyodide.js"]')) {
        // Wait for it to load
        waitForPyodide().then(resolve).catch(reject)
        return
      }

      // Create and load script
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.29.0/full/pyodide.js'
      script.async = true
      script.crossOrigin = 'anonymous'
      
      script.onload = () => {
        waitForPyodide().then(resolve).catch(reject)
      }
      
      script.onerror = () => {
        reject(new Error('Failed to load Pyodide script'))
      }
      
      document.head.appendChild(script)
    })
  }

  function waitForPyodide() {
    return new Promise((resolve, reject) => {
      if (window.loadPyodide) {
        resolve()
      } else {
        let attempts = 0
        const maxAttempts = 100 // 10 seconds max wait
        
        const checkPyodide = () => {
          attempts++
          if (window.loadPyodide) {
            resolve()
          } else if (attempts >= maxAttempts) {
            reject(new Error('Pyodide loader timeout'))
          } else {
            setTimeout(checkPyodide, 100)
          }
        }
        checkPyodide()
      }
    })
  }

  // Initialize package worker
  function initPackageWorker() {
    if (typeof Worker !== 'undefined' && !packageWorker) {
      try {
        packageWorker = new Worker('/workers/pyodide-worker.js')
        
        packageWorker.addEventListener('message', (e) => {
          const { type, status, message, progress, currentPackage } = e.data
          
          if (type === 'PACKAGE_STATUS') {
            // Update loading status (can be used for progress UI if needed)
            if (status === 'complete') {
              console.log('Packages installed:', message)
            } else if (status === 'error') {
              console.error('Package installation error:', e.data.error)
            } else if (status === 'loading') {
              // Progress update (can be used for progress bar)
              console.log(`Package loading: ${currentPackage || '...'} (${progress}%)`)
            }
          }
        })
        
        packageWorker.addEventListener('error', (error) => {
          console.error('Package worker error:', error)
        })
      } catch (error) {
        console.warn('Web Worker not available, continuing without worker:', error)
      }
    }
  }

  async function runCode() {
    if (!pyodideReady.value || !currentFileContent.value.trim()) return
    
    // Show loader immediately when button is clicked
    isLoading.value = true
    
    // Start execution immediately
    const startTime = Date.now()
    
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
      
      // Collect all output items first (don't display yet)
      const outputItems = []
      
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
                outputItems.push({
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
        outputItems.push({
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
      outputItems.push({
        type: 'success', 
        content: `✓ Code executed successfully in ${totalTime}ms`,
        timestamp: new Date().toLocaleTimeString()
      })
      
      // Wait 500ms before showing output
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Now display all collected output items
      output.value.push(...outputItems)
      
    } catch (error) {
      console.error('Error running Python code:', error)
      
      // Wait for minimum delay even on error
      const elapsed = Date.now() - startTime
      if (elapsed < minDelay) {
        await new Promise(resolve => setTimeout(resolve, minDelay - elapsed))
      }
      
      // Wait 500ms before showing error output
      await new Promise(resolve => setTimeout(resolve, 500))
      
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
    // Don't auto-run when loading example
    // User can manually run when ready
  }

  async function initializePyodide() {
    if (process.client) {
      try {
        loaderVisible.value = true
        setThemeClass(theme.value)
        
        // Initialize package worker
        initPackageWorker()
        
        // Load Pyodide CDN script dynamically (only on compiler pages)
        await loadPyodideScript()
        
        // Initialize Pyodide
        pyodide.value = await loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.29.0/full/'
        })
        
        // Notify worker about package installation start
        const packagesToInstall = []
        if (packageName) packagesToInstall.push(packageName)
        packagesToInstall.push(...additionalPackages)
        
        if (packageWorker) {
          packageWorker.postMessage({
            type: 'PACKAGE_INSTALL_START',
            data: { packages: packagesToInstall }
          })
        }
        
        // Load micropip
        await pyodide.value.loadPackage("micropip")
        const micropip = pyodide.value.pyimport("micropip")
        
        // Install main package with progress updates
        if (packageName) {
          if (packageWorker) {
            packageWorker.postMessage({
              type: 'PACKAGE_PROGRESS',
              data: { 
                currentPackage: packageName,
                progress: 30
              }
            })
          }
          await micropip.install(packageName)
        }
        
        // Install additional packages with progress updates
        for (let i = 0; i < additionalPackages.length; i++) {
          const pkg = additionalPackages[i]
          if (packageWorker) {
            packageWorker.postMessage({
              type: 'PACKAGE_PROGRESS',
              data: { 
                currentPackage: pkg,
                progress: 50 + (i / additionalPackages.length) * 40
              }
            })
          }
          await micropip.install(pkg)
        }
        
        // Notify worker about completion
        if (packageWorker) {
          packageWorker.postMessage({
            type: 'PACKAGE_INSTALL_COMPLETE',
            data: { packages: packagesToInstall }
          })
        }
        
        // Run setup code if provided
        if (setupCode) {
          pyodide.value.runPython(setupCode)
        }
        
        pyodideReady.value = true
        loaderVisible.value = false
        
        // Don't auto-run code on page load to improve performance
        // User can manually run code when ready
        
      } catch (error) {
        console.error('Failed to initialize Pyodide:', error)
        loaderVisible.value = false
        
        // Notify worker about error
        if (packageWorker) {
          packageWorker.postMessage({
            type: 'PACKAGE_INSTALL_ERROR',
            data: { error: error.message }
          })
        }
        
        output.value.push({
          type: 'error',
          content: `Failed to initialize: ${error.message}`,
          timestamp: new Date().toLocaleTimeString()
        })
      }
    }
  }

  // Cleanup worker on unmount
  function cleanupWorker() {
    if (packageWorker) {
      packageWorker.terminate()
      packageWorker = null
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
    initializePyodide,
    cleanupWorker
  }
}

