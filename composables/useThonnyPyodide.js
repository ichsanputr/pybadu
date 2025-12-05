import { ref } from 'vue'

export function useThonnyPyodide() {
  const pyodideReady = ref(false)
  const isLoading = ref(false)
  const output = ref([])
  const variables = ref([])
  
  let pyodideWorker = null
  let messageId = 0
  const pendingMessages = new Map()

  // Worker message handling
  function requestResponse(msg) {
    const id = messageId++
    const promise = new Promise((resolve, reject) => {
      const listener = (event) => {
        if (!event.data?.id || event.data.id !== id) return
        
        pyodideWorker.removeEventListener('message', listener)
        pendingMessages.delete(id)
        
        const { id: _, ...rest } = event.data
        
        if (rest.error) {
          reject(new Error(rest.error))
        } else {
          resolve(rest)
        }
      }
      
      pyodideWorker.addEventListener('message', listener)
      pendingMessages.set(id, { resolve, reject, listener })
    })
    
    pyodideWorker.postMessage({ id, ...msg })
    return promise
  }

  const MOCK_INPUT_CODE = `
import builtins
def _mock_input(prompt=""):
    if prompt:
        print(prompt, end="")
    print("\\n[System: Interactive input is not supported. Using default value '0']")
    return "0"

builtins.input = _mock_input
`

  async function initializePyodide() {
    try {
      // Get baseURL for subpath support
      let baseURL = ''
      if (typeof window !== 'undefined') {
        const pathParts = window.location.pathname.split('/').filter(p => p)
        if (pathParts.length > 0 && pathParts[0] === 'pybadu') {
          baseURL = '/pybadu'
        }
      }

      const workerPath = `${baseURL}/workers/pyodide-worker.js`
      console.log('Loading Pyodide worker from:', workerPath)

      pyodideWorker = new Worker(workerPath, { type: 'module' })

      pyodideWorker.addEventListener('message', (event) => {
        const { type, id } = event.data

        // Handle messages without ID (like PYODIDE_READY)
        if (!id) {
          if (type === 'PYODIDE_READY') {
            pyodideReady.value = true
            console.log('Pyodide ready!')
          }
          return
        }

        // Handle messages with ID (request/response)
        const pending = pendingMessages.get(id)
        if (pending) {
          pending.listener(event)
        }
      })

      pyodideWorker.addEventListener('error', (error) => {
        console.error('Pyodide worker error:', error)
      })

      // Initialize Pyodide
      await requestResponse({ type: 'INIT_PYODIDE' })
      
      // Setup environment (mock input)
      await requestResponse({
        type: 'RUN_PYTHON',
        data: { code: MOCK_INPUT_CODE }
      })

    } catch (error) {
      console.error('Failed to initialize Pyodide:', error)
    }
  }

  async function runScript(code) {
    if (!pyodideReady.value || isLoading.value || !code.trim()) return
    isLoading.value = true

    try {
      // Run Python code with mock input prepended
      const response = await requestResponse({
        type: 'RUN_PYTHON',
        data: { code: MOCK_INPUT_CODE + "\n" + code }
      })
      
      // Handle stdout
      if (response.result?.stdout) {
        addOutput(response.result.stdout.trim(), 'print')
      }
      
      // Extract variables from globals
      if (response.result?.globals) {
        updateVariables(response.result.globals)
      }
      
    } catch (error) {
      console.error('Error running Python code:', error)
      addOutput(`Error: ${error.message}`, 'error')
    } finally {
      isLoading.value = false
    }
  }

  async function runShell(code) {
    if (!pyodideReady.value || isLoading.value || !code.trim()) return
    
    try {
        const response = await requestResponse({
            type: 'RUN_PYTHON',
            data: { code: MOCK_INPUT_CODE + "\n" + code }
        })

        if (response.result?.stdout) {
            addOutput(response.result.stdout.trim(), 'print')
        }

        if (response.result?.globals) {
            updateVariables(response.result.globals)
        }
    } catch (error) {
        addOutput(`Error: ${error.message}`, 'error')
    }
  }

  function stopExecution() {
    if (pyodideWorker) {
      pyodideWorker.terminate()
      initializePyodide()
      isLoading.value = false
      addOutput('Execution stopped', 'error')
    }
  }

  function addOutput(content, type = 'print') {
    if (content) {
      output.value.push({ content, type })
    }
  }

  function updateVariables(globals) {
    if (!globals) return
    
    variables.value = Object.entries(globals)
      .filter(([name]) => !name.startsWith('_') && !name.startsWith('__'))
      .map(([name, value]) => ({
        name,
        value: String(value).substring(0, 100) // Limit length
      }))
  }

  function clearOutput() {
    output.value = []
    variables.value = []
  }

  function terminate() {
    if (pyodideWorker) {
      pyodideWorker.terminate()
    }
  }

  return {
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
    addOutput
  }
}
