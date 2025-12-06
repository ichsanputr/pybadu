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

  async function runScript(code, args = []) {
    if (!pyodideReady.value || isLoading.value || !code.trim()) return
    isLoading.value = true

    try {
      // Set sys.argv if provided
      // Default sys.argv[0] is usually the script name, we'll set it to 'main.py'
      const argv = ['main.py', ...args]
      const argvSetupCode = `
import sys
sys.argv = ${JSON.stringify(argv)}
`
      
      // Run Python code with mock input prepended and argv setup
      const response = await requestResponse({
        type: 'RUN_PYTHON',
        data: { 
          code: MOCK_INPUT_CODE + argvSetupCode + "\n" + code,
          mode: 'script'
        }
      })
      
      // Handle stdout
      if (response.result?.stdout) {
        addOutput(response.result.stdout.trim(), 'print')
      }
      
      // Handle error from Python execution
      if (response.result?.error) {
        addOutput(response.result.error, 'error')
      }

      // Extract variables
      if (response.result?.variables) {
        updateVariables(response.result.variables)
      } else if (response.result?.globals) {
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
            data: { 
              code: MOCK_INPUT_CODE + "\n" + code,
              mode: 'shell'
            }
        })

        if (response.result?.stdout) {
            addOutput(response.result.stdout.trim(), 'print')
        }

        if (response.result?.error) {
            addOutput(response.result.error, 'error')
        }

        if (response.result?.variables) {
            updateVariables(response.result.variables)
        } else if (response.result?.globals) {
            updateVariables(response.result.globals)
        }
    } catch (error) {
        addOutput(`Error: ${error.message}`, 'error')
    }
  }

  // System functions - Run Python code without affecting Shell Output (unless explicit)
  async function runSystemPython(code) {
      if (!pyodideReady.value) return null
      try {
          const response = await requestResponse({
              type: 'RUN_PYTHON',
              data: { code }
          })
          return response.result
      } catch (error) {
          console.error("System Python Error:", error)
          throw error
      }
  }

  async function installPackage(packageName) {
      if (!pyodideReady.value) return
      
      return await requestResponse({
          type: 'INSTALL_PACKAGE',
          data: { packageName }
      })
  }

  async function removePackage(packageName) {
      if (!pyodideReady.value) return
      
      return await requestResponse({
          type: 'REMOVE_PACKAGE',
          data: { packageName }
      })
  }

  async function getInstalledPackages() {
      if (!pyodideReady.value) return []
      
      const script = `
import micropip
# list return dict
packages = micropip.list()
# Print to stdout so we can capture it
for name, meta in packages.items():
    print(f"{name}=={meta.version}")
`
      
      const response = await requestResponse({
          type: 'RUN_PYTHON',
          data: { code: script }
      })
      
      // The result contains stdout from the worker
      if (response.result?.stdout) {
          return response.result.stdout.split('\n').filter(p => p.trim())
      }
      return []
  }

  function stopExecution() {
    if (pyodideWorker) {
      // Terminate the worker immediately
      pyodideWorker.terminate()
      
      // Reject any pending messages (promises)
      for (const [id, { reject }] of pendingMessages.entries()) {
        reject(new Error('Execution stopped by user'))
      }
      pendingMessages.clear()
      
      // Reset state
      pyodideReady.value = false
      isLoading.value = false
      addOutput('Execution stopped', 'error')
      
      // Re-initialize a fresh worker
      initializePyodide()
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
      .map(([name, value]) => {
        let displayValue = value
        if (typeof value === 'object' && value !== null) {
            displayValue = JSON.stringify(value)
        }
        return {
            name,
            value: String(displayValue).substring(0, 100)
        }
      })
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

  async function generateAST(userCode) {
    if (!pyodideReady.value || !userCode.trim()) return null

    const pyCode = `
import ast, json

def ast_to_dict(node):
    result = {"_type": type(node).__name__}
    for field in node._fields:
        try:
            value = getattr(node, field)
        except AttributeError:
            continue
            
        if isinstance(value, ast.AST):
            result[field] = ast_to_dict(value)
        elif isinstance(value, list):
            result[field] = [ast_to_dict(x) if isinstance(x, ast.AST) else x for x in value]
        else:
            result[field] = value
    return result

try:
    tree = ast.parse(${JSON.stringify(userCode)})
    print(json.dumps(ast_to_dict(tree)))
except Exception as e:
    print(json.dumps({"error": str(e)}))
`

    try {
        const response = await requestResponse({
            type: 'RUN_PYTHON',
            data: { code: pyCode }
        })

        if (response.result?.stdout) {
            const lines = response.result.stdout.trim().split('\n')
            return JSON.parse(lines[lines.length - 1])
        }
    } catch (e) {
        console.error("AST Generation failed", e)
    }
    return null
  }

  async function generateOutline(userCode) {
    if (!pyodideReady.value) return null

    const pyCode = `
import ast
import json

def get_outline(source_code):
    try:
        tree = ast.parse(source_code)
    except SyntaxError as e:
        return json.dumps({"error": str(e)})

    outline = []

    class OutlineVisitor(ast.NodeVisitor):
        def visit_FunctionDef(self, node):
            outline.append({
                "type": "function",
                "name": node.name,
                "lineno": node.lineno
            })
            self.generic_visit(node)
        
        def visit_AsyncFunctionDef(self, node):
            outline.append({
                "type": "function",
                "name": node.name,
                "lineno": node.lineno
            })
            self.generic_visit(node)

        def visit_ClassDef(self, node):
            class_entry = {
                "type": "class",
                "name": node.name,
                "lineno": node.lineno,
                "methods": []
            }

            # detect methods inside class
            for item in node.body:
                if isinstance(item, ast.FunctionDef):
                    class_entry["methods"].append({
                        "type": "method",
                        "name": item.name,
                        "lineno": item.lineno
                    })
                elif isinstance(item, ast.AsyncFunctionDef):
                    class_entry["methods"].append({
                        "type": "method",
                        "name": item.name,
                        "lineno": item.lineno
                    })
            
            outline.append(class_entry)
            # self.generic_visit(node) # Don't visit children else we duplicate methods as functions if not careful

    OutlineVisitor().visit(tree)
    return json.dumps(outline)

print(get_outline(${JSON.stringify(userCode)}))
`
    try {
        const response = await requestResponse({
            type: 'RUN_PYTHON',
            data: { code: pyCode }
        })

        if (response.result?.stdout) {
            const lines = response.result.stdout.trim().split('\n')
            return JSON.parse(lines[lines.length - 1])
        }
    } catch (e) {
        console.error("Outline Generation failed", e)
    }
    return []
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
    addOutput,
    installPackage,
    removePackage,
    getInstalledPackages,
    generateAST,
    generateOutline
  }
}
