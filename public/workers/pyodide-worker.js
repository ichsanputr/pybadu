// Pyodide Web Worker
// This worker actually runs Pyodide and executes Python code
// Based on official Pyodide web worker documentation

import { loadPyodide } from 'https://cdn.jsdelivr.net/pyodide/v0.29.0/full/pyodide.mjs'

let pyodide = null
let pyodideReadyPromise = null

// Initialize Pyodide when worker starts
async function initPyodide() {
  if (!pyodideReadyPromise) {
    pyodideReadyPromise = loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.29.0/full/'
    })
  }
  if (!pyodide) {
    pyodide = await pyodideReadyPromise
    self.postMessage({
      type: 'PYODIDE_READY',
      message: 'Pyodide initialized in worker'
    })
  }
  return pyodide
}

// Listen for messages from main thread
self.onmessage = async (event) => {
  const { type, id, data } = event.data

  try {
    switch (type) {
      case 'INIT_PYODIDE':
        // Initialize Pyodide
        await initPyodide()
        self.postMessage({
          type: 'INIT_COMPLETE',
          id,
          message: 'Pyodide ready'
        })
        break

      case 'LOAD_PACKAGES':
        // Make sure Pyodide is ready
        const pyodideInstance = await initPyodide()
        const { packages, packageName, additionalPackages, setupCode } = data

        // Load micropip
        await pyodideInstance.loadPackage('micropip')
        const micropip = pyodideInstance.pyimport('micropip')

        // Install main package
        if (packageName) {
          self.postMessage({
            type: 'PACKAGE_PROGRESS',
            id,
            currentPackage: packageName,
            progress: 30,
            message: `Installing ${packageName}...`
          })
          await micropip.install(packageName)
        }

        // Install additional packages
        for (let i = 0; i < additionalPackages.length; i++) {
          const pkg = additionalPackages[i]
          self.postMessage({
            type: 'PACKAGE_PROGRESS',
            id,
            currentPackage: pkg,
            progress: 50 + (i / additionalPackages.length) * 40,
            message: `Installing ${pkg}...`
          })
          await micropip.install(pkg)
        }

        // Run setup code if provided
        if (setupCode) {
          await pyodideInstance.runPythonAsync(setupCode)
        }

        self.postMessage({
          type: 'PACKAGES_LOADED',
          id,
          message: 'All packages installed successfully'
        })
        break

      case 'RUN_PYTHON':
        // Execute Python code
        const pyodideForRun = await initPyodide()
        const { code, packageName: pkgName } = data

        // Setup stdout capture
        await pyodideForRun.runPythonAsync(`
import sys
from io import StringIO
${pkgName && pkgName.includes('matplotlib') ? `
import matplotlib.pyplot as plt
plt.close('all')
` : ''}
sys.stdout = StringIO()
        `)

        // Run the user's code
        await pyodideForRun.runPythonAsync(code)

        // Capture stdout
        const stdout = await pyodideForRun.runPythonAsync(`
captured_output = sys.stdout.getvalue()
sys.stdout = sys.__stdout__
captured_output
        `)

        // Handle matplotlib plots
        let images = []
        if (pkgName && pkgName.includes('matplotlib')) {
          try {
            const canvas = await pyodideForRun.runPythonAsync(`
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
              images = canvas.split(',').filter(img => img)
            }
          } catch (plotError) {
            console.warn('No plots generated:', plotError)
          }
        }

        self.postMessage({
          type: 'PYTHON_RESULT',
          id,
          result: {
            stdout: stdout ? stdout.trim() : '',
            images: images,
            success: true
          }
        })
        break

      default:
        self.postMessage({
          type: 'ERROR',
          id,
          error: `Unknown message type: ${type}`
        })
    }
  } catch (error) {
    self.postMessage({
      type: 'ERROR',
      id,
      error: error.message || String(error)
    })
  }
}

// Send ready message
self.postMessage({
  type: 'WORKER_READY',
  message: 'Pyodide worker is ready'
})