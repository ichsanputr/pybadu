import { ref, computed, onMounted, watch } from 'vue'

export function useLibraryPlayground(config = {}) {
  const {
    packageName = '',
    storageKeyPrefix = '', // Optional custom prefix for localStorage key
    defaultCode = '',
    examples = [],
    additionalPackages = [],
    setupCode = ''
  } = config

  // LocalStorage key based on storageKeyPrefix (or packageName if not provided)
  const storageKey = `pybadu_${storageKeyPrefix || packageName}_files`
  
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
  // Note: pyodide now runs in worker, not in main thread
  const pyodide = ref(null)
  const loaderVisible = ref(false)
  
  // Theme is stateless - always starts with dark, not saved to localStorage
  const theme = ref('dark')

  // Assets state
  const assets = ref([])
  const assetsUploading = ref(false)

  // Apply dark theme immediately on compiler pages (before any rendering)
  if (process.client) {
    // Apply dark class immediately to prevent flash of light theme
    document.documentElement.classList.add('dark')
  }

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

  // Global singleton worker - shared across all pages
  // This prevents reloading Pyodide CDN on every page navigation
  let globalPyodideWorker = null
  let globalMessageId = 0
  const globalPendingMessages = new Map()
  let globalLoadedPackages = new Set() // Track loaded packages to avoid reloading

  // Request/Response pattern for worker communication (based on Pyodide docs)
  function getPromiseAndResolve() {
    let resolve, reject
    const promise = new Promise((res, rej) => {
      resolve = res
      reject = rej
    })
    return { promise, resolve, reject }
  }

  function getId() {
    // Use global message ID to avoid conflicts across pages
    return ++globalMessageId
  }

  function requestResponse(worker, msg) {
    const { promise, resolve, reject } = getPromiseAndResolve()
    const id = getId()
    
    const listener = (event) => {
      // Ignore messages without id or with different id
      if (!event.data?.id || event.data.id !== id) return
      
      // Ignore progress messages (they don't have id anymore, but double-check)
      if (event.data.type === 'PACKAGE_PROGRESS') return
      
      // This is the final response - resolve the promise
      worker.removeEventListener('message', listener)
      globalPendingMessages.delete(id)
      
      const { id: _, ...rest } = event.data
      
      if (rest.error) {
        reject(new Error(rest.error))
      } else {
        resolve(rest)
      }
    }
    
    worker.addEventListener('message', listener)
    globalPendingMessages.set(id, { resolve, reject, listener })
    
    worker.postMessage({ id, ...msg })
    return promise
  }

  // Initialize Pyodide worker (singleton - shared across pages)
  function initPyodideWorker() {
    if (typeof Worker === 'undefined') {
      console.warn('Web Workers not supported')
      return false
    }
    
    // Use global singleton worker - create only once
    if (!globalPyodideWorker) {
      try {
        // Get baseURL for subpath support (e.g., /pybadu/)
        let baseURL = ''
        if (process.client) {
          // Extract base path from current location
          // For /pybadu/matplotlib, baseURL should be /pybadu
          const pathParts = window.location.pathname.split('/').filter(p => p)
          // If path starts with a known base (like 'pybadu'), use it
          if (pathParts.length > 0 && pathParts[0] === 'pybadu') {
            baseURL = '/pybadu'
          }
        }
        
        const workerPath = `${baseURL}/workers/pyodide-worker.js`
        console.log('Loading Pyodide worker from:', workerPath)
        
        // Create worker with type: 'module' to use ES6 imports (singleton)
        globalPyodideWorker = new Worker(workerPath, { type: 'module' })
        
        globalPyodideWorker.addEventListener('message', (e) => {
          const { type, id, message, progress, currentPackage, result, error } = e.data
          
          // Handle messages without ID (like WORKER_READY, PYODIDE_READY)
          if (!id) {
            if (type === 'WORKER_READY') {
              console.log('Worker ready:', message)
            } else if (type === 'PYODIDE_READY') {
              console.log('Pyodide ready in worker:', message)
            }
            return
          }
          
          // Handle messages with ID (request/response)
          const pending = globalPendingMessages.get(id)
          if (pending) {
            pending.listener(e)
          }
        })
        
        globalPyodideWorker.addEventListener('error', (error) => {
          console.error('Pyodide worker error:', error)
          output.value.push({
            type: 'error',
            content: `Worker error: ${error.message}`,
            timestamp: new Date().toLocaleTimeString()
          })
        })
        
        return true
      } catch (error) {
        console.error('Failed to create Pyodide worker:', error)
        return false
      }
    }
    return true
  }

  async function runCode(options = {}) {
    if (!pyodideReady.value || !currentFileContent.value.trim() || !globalPyodideWorker) return
    
    const { shouldClearOutput = true } = options

    // Show loader immediately when button is clicked
    isLoading.value = true
    
    // Start execution immediately
    const startTime = Date.now()
    
    // Add minimum 1 second delay for better UX
    const minDelay = 1000
    
    try {
      if (shouldClearOutput) {
        output.value = []
      }
      
      // Run Python code in worker (use global singleton)
      const response = await requestResponse(globalPyodideWorker, {
        type: 'RUN_PYTHON',
        data: {
          code: currentFileContent.value,
          packageName: packageName,
          additionalPackages: additionalPackages
        }
      })
      
      // Collect all output items first (don't display yet)
      const outputItems = []
      
      // Handle images from matplotlib
      if (response.result?.images && response.result.images.length > 0) {
        for (const imgData of response.result.images) {
          if (imgData) {
            outputItems.push({
              type: 'image',
              content: imgData,
              timestamp: new Date().toLocaleTimeString()
            })
          }
        }
      }
      
      // Handle stdout
      if (response.result?.stdout && response.result.stdout.trim()) {
        outputItems.push({
          type: 'print',
          content: response.result.stdout.trim(),
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
      
      // Refresh assets to detect any files created/modified by Python code
      await refreshAssets()
      
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

  // Asset management functions
  async function refreshAssets() {
    if (!globalPyodideWorker) return
    
    try {
      const response = await requestResponse(globalPyodideWorker, {
        type: 'LIST_ASSETS'
      })
      assets.value = response.assets || []
    } catch (error) {
      console.error('Error refreshing assets:', error)
      assets.value = []
    }
  }

  async function uploadAssets(files, targetFolder = '') {
    if (!globalPyodideWorker || !files.length) return
    
    assetsUploading.value = true
    
    try {
      for (const file of files) {
        const fileData = await file.arrayBuffer()
        const uint8Array = new Uint8Array(fileData)
        
        // Prepend target folder path if specified
        const fileName = targetFolder ? `${targetFolder}/${file.name}` : file.name
        
        await requestResponse(globalPyodideWorker, {
          type: 'UPLOAD_ASSET',
          data: {
            fileName: fileName,
            fileData: uint8Array
          }
        })
      }
      
      await refreshAssets()
    } catch (error) {
      console.error('Error uploading assets:', error)
    } finally {
      assetsUploading.value = false
    }
  }

  async function deleteAsset(fileName) {
    if (!globalPyodideWorker) return
    
    try {
      await requestResponse(globalPyodideWorker, {
        type: 'DELETE_ASSET',
        data: {
          fileName
        }
      })
      
      await refreshAssets()
    } catch (error) {
      console.error('Error deleting asset:', error)
      // Show error to user
      output.value.push({
        type: 'error',
        content: `Failed to delete ${fileName}: ${error.message}`,
        timestamp: new Date().toLocaleTimeString()
      })
    }
  }

  async function createAssetFolder(folderName) {
    if (!globalPyodideWorker) return
    
    try {
      await requestResponse(globalPyodideWorker, {
        type: 'CREATE_ASSET_FOLDER',
        data: {
          folderName
        }
      })
      
      await refreshAssets()
    } catch (error) {
      console.error('Error creating asset folder:', error)
    }
  }

  async function downloadAsset(fileName) {
    console.log('downloadAsset called with:', fileName)
    if (!globalPyodideWorker) {
      console.error('No worker available')
      return
    }
    
    try {
      // Request file content from worker
      console.log('Requesting file from worker:', fileName)
      const response = await requestResponse(globalPyodideWorker, {
        type: 'DOWNLOAD_ASSET',
        data: {
          fileName
        }
      })
      
      console.log('Worker response:', response)

      if (!response.fileData) {
        throw new Error('No file data received')
      }
      
      console.log('File data length:', response.fileData.length)

      // Convert Uint8Array back to Blob
      const blob = new Blob([new Uint8Array(response.fileData)], { type: 'application/octet-stream' })
      console.log('Blob created, size:', blob.size)
      
      // Create download link
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName.split('/').pop() // Get just the filename without path
      document.body.appendChild(a)
      a.click()
      console.log('Download triggered for:', a.download)
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading asset:', error)
      // Show error to user
      output.value.push({
        type: 'error',
        content: `Failed to download ${fileName}: ${error.message}`,
        timestamp: new Date().toLocaleTimeString()
      })
    }
  }

  async function initializePyodide() {
    if (process.client) {
      try {
        loaderVisible.value = true
        setThemeClass(theme.value)
        
        // Initialize Pyodide worker (Pyodide runs in worker, not main thread)
        // This creates a singleton worker shared across all pages
        if (!initPyodideWorker()) {
          throw new Error('Failed to initialize web worker')
        }
        
        // Check if packages are already loaded for this combination
        const packageKey = `${packageName || 'none'}_${(additionalPackages || []).sort().join(',')}`
        
        if (!globalLoadedPackages.has(packageKey)) {
          // Initialize Pyodide in worker (only once globally)
          await requestResponse(globalPyodideWorker, {
            type: 'INIT_PYODIDE'
          })
          
          // Load packages in worker (this waits for PACKAGES_LOADED response)
          // The worker will only send PACKAGES_LOADED after ALL packages are installed,
          // verified with import tests, and ready to use
          await requestResponse(globalPyodideWorker, {
            type: 'LOAD_PACKAGES',
            data: {
              packageName,
              additionalPackages,
              setupCode
            }
          })
          
          // Mark packages as loaded
          globalLoadedPackages.add(packageKey)
          console.log('Packages loaded and cached:', packageKey)
        } else {
          // Packages already loaded - skip initialization
          console.log('Packages already loaded, reusing existing worker:', packageKey)
        }
        
        // Worker has completed ALL verification and delays before sending PACKAGES_LOADED
        // Only set ready after worker confirms everything is ready
        pyodideReady.value = true
        loaderVisible.value = false
        
        // Don't auto-run code on page load to improve performance
        // User can manually run code when ready
        
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

  // Cleanup worker on unmount (only if this is the last page using it)
  // Note: We don't actually terminate the global worker to keep it alive across pages
  function cleanupWorker() {
    // Just cancel pending messages for this page instance
    // Don't terminate global worker - it's shared across pages
    const currentPageMessages = Array.from(globalPendingMessages.entries())
      .filter(([id, { listener }]) => {
        // Cancel messages that might be from this page
        return true
      })
    
    // Note: We keep the global worker alive for other pages
    // Only terminate on actual page unload (beforeunload event)
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
    assets,
    assetsUploading,
    
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
    cleanupWorker,
    refreshAssets,
    uploadAssets,
    deleteAsset,
    downloadAsset,
    createAssetFolder
  }
}

