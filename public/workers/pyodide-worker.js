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

// Asset management functions
function listAssets() {
  try {
    // Use Pyodide's FS to list /assets directory recursively
    const assets = []
    const assetPath = '/assets'
    
    // Check if directory exists
    if (!pyodide.FS.analyzePath(assetPath).exists) {
      pyodide.FS.mkdirTree(assetPath)
      return assets
    }
    
    // Recursive function to list all files and folders
    function listDirectoryRecursive(dirPath, relativePath = '') {
      try {
        const entries = pyodide.FS.readdir(dirPath)
        
        for (const entry of entries) {
          if (entry === '.' || entry === '..') continue
          
          const fullPath = `${dirPath}/${entry}`
          const itemRelativePath = relativePath ? `${relativePath}/${entry}` : entry
          const stat = pyodide.FS.stat(fullPath)
          const isDir = pyodide.FS.isDir(stat.mode)
          
          assets.push({
            name: itemRelativePath,
            isDir: isDir,
            size: isDir ? 0 : stat.size,
            path: fullPath
          })
          
          // If it's a directory, recursively list its contents
          if (isDir) {
            listDirectoryRecursive(fullPath, itemRelativePath)
          }
        }
      } catch (error) {
        console.error('Error listing directory:', dirPath, error)
      }
    }
    
    // Start recursive listing from /assets
    listDirectoryRecursive(assetPath)
    
    return assets
  } catch (error) {
    console.error('Error listing assets:', error)
    return []
  }
}

function uploadAsset(fileName, fileData) {
  try {
    const assetPath = '/assets'
    
    // Ensure directory exists
    if (!pyodide.FS.analyzePath(assetPath).exists) {
      pyodide.FS.mkdirTree(assetPath)
    }
    
    // Write file
    const fullPath = `${assetPath}/${fileName}`
    pyodide.FS.writeFile(fullPath, fileData)
    
    return { success: true, path: fullPath }
  } catch (error) {
    console.error('Error uploading asset:', error)
    throw error
  }
}

function deleteAsset(fileName) {
  try {
    const fullPath = `/assets/${fileName}`
    const stat = pyodide.FS.stat(fullPath)
    const isDir = pyodide.FS.isDir(stat.mode)

    if (isDir) {
      // For directories, we need to remove recursively
      // First check if directory is empty
      const entries = pyodide.FS.readdir(fullPath)
      const actualEntries = entries.filter(e => e !== '.' && e !== '..')

      if (actualEntries.length > 0) {
        // Directory is not empty, remove contents recursively
        function removeRecursive(path) {
          const items = pyodide.FS.readdir(path)
          for (const item of items) {
            if (item === '.' || item === '..') continue
            const itemPath = `${path}/${item}`
            const itemStat = pyodide.FS.stat(itemPath)
            if (pyodide.FS.isDir(itemStat.mode)) {
              removeRecursive(itemPath)
            } else {
              pyodide.FS.unlink(itemPath)
            }
          }
          pyodide.FS.rmdir(path)
        }
        removeRecursive(fullPath)
      } else {
        // Empty directory
        pyodide.FS.rmdir(fullPath)
      }
    } else {
      // Regular file
      pyodide.FS.unlink(fullPath)
    }

    return { success: true }
  } catch (error) {
    console.error('Error deleting asset:', error)
    throw error
  }
}

function createAssetFolder(folderName) {
  try {
    const fullPath = `/assets/${folderName}`
    pyodide.FS.mkdirTree(fullPath)
    return { success: true, path: fullPath }
  } catch (error) {
    console.error('Error creating asset folder:', error)
    throw error
  }
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

        // Install additional packages first (dependencies)
        const totalPackages = (additionalPackages?.length || 0) + (packageName ? 1 : 0)
        let installedCount = 0
        
        if (additionalPackages && additionalPackages.length > 0) {
          for (let i = 0; i < additionalPackages.length; i++) {
            const pkg = additionalPackages[i]
            // Progress messages don't need id - they're not part of request/response
            self.postMessage({
              type: 'PACKAGE_PROGRESS',
              currentPackage: pkg,
              progress: 30 + (installedCount / totalPackages) * 60,
              message: `Installing ${pkg}...`
            })
            await micropip.install(pkg)
            installedCount++
          }
        }

        // Install main package after dependencies
        if (packageName) {
          // Progress messages don't need id - they're not part of request/response
          self.postMessage({
            type: 'PACKAGE_PROGRESS',
            currentPackage: packageName,
            progress: 30 + (installedCount / totalPackages) * 60,
            message: `Installing ${packageName}...`
          })
          await micropip.install(packageName)
          installedCount++
        }

        // Run setup code if provided
        if (setupCode) {
          await pyodideInstance.runPythonAsync(setupCode)
        }

        // Helper function to get import name variations
        function getImportNames(pkgName) {
          const variations = [
            pkgName,
            pkgName.replace('-', '_'),
            pkgName === 'scikit-learn' ? 'sklearn' : null,
            pkgName === 'beautifulsoup4' ? 'bs4' : null,
            pkgName === 'snowballstemmer' ? 'snowballstemmer' : null,
            pkgName === 'pyyaml' ? 'yaml' : null,
            pkgName === 'markupsafe' ? 'markupsafe' : null
          ].filter(Boolean)
          return variations
        }

        // Helper function to verify package can be imported
        // Uses actual import attempts - no arbitrary delays
        async function verifyPackageImport(pkgName, maxRetries = 10) {
          const importNames = getImportNames(pkgName)
          
          for (let attempt = 0; attempt < maxRetries; attempt++) {
            for (const importName of importNames) {
              try {
                // Actual import attempt - if this succeeds, package is ready
                await pyodideInstance.runPythonAsync(`import ${importName}`)
                return true // Successfully imported - package is ready!
              } catch (e) {
                // Try next name variation
                continue
              }
            }
            // If all name variations failed, package might still be registering
            // Yield to event loop to allow Pyodide to process package registration
            // This is not a delay - it's yielding to let async operations complete
            if (attempt < maxRetries - 1) {
              await new Promise(resolve => {
                // Use setImmediate or setTimeout(0) to yield to event loop
                // This allows Pyodide's internal async operations to complete
                if (typeof setImmediate !== 'undefined') {
                  setImmediate(resolve)
                } else {
                  setTimeout(resolve, 0)
                }
              })
            }
          }
          return false // All attempts failed
        }

        // Verify ALL additional packages - wait for actual import success
        if (additionalPackages && additionalPackages.length > 0) {
          for (const pkg of additionalPackages) {
            const verified = await verifyPackageImport(pkg)
            if (!verified) {
              console.warn(`Could not verify import for ${pkg} after retries, but continuing...`)
            }
          }
        }

        // Verify main package - wait for actual import success
        if (packageName) {
          const verified = await verifyPackageImport(packageName)
          if (!verified) {
            console.warn(`Could not verify import for ${packageName} after retries, but continuing...`)
          }
        }

        // All packages installed and verified - wait 1 second before signaling ready
        // This ensures packages are fully registered and ready for use
        await new Promise(resolve => setTimeout(resolve, 1000))

        console.log('All packages installed and verified successfully')
        // Send ready signal after all verification and delay
        self.postMessage({
          type: 'PACKAGES_LOADED',
          id,
          message: 'All packages installed and verified successfully'
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
${pkgName && (pkgName.includes('matplotlib') || pkgName.includes('seaborn')) ? `
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
        if (pkgName && (pkgName.includes('matplotlib') || pkgName.includes('seaborn'))) {
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

      case 'LIST_ASSETS':
        await initPyodide()
        const assets = listAssets()
        self.postMessage({
          type: 'ASSETS_LIST',
          id,
          assets
        })
        break

      case 'UPLOAD_ASSET':
        await initPyodide()
        const { fileName, fileData } = data
        const uploadResult = uploadAsset(fileName, fileData)
        self.postMessage({
          type: 'ASSET_UPLOADED',
          id,
          result: uploadResult
        })
        break

      case 'DELETE_ASSET':
        await initPyodide()
        const { fileName: deleteFileName } = data
        const deleteResult = deleteAsset(deleteFileName)
        self.postMessage({
          type: 'ASSET_DELETED',
          id,
          result: deleteResult
        })
        break

      case 'CREATE_ASSET_FOLDER':
        await initPyodide()
        const { folderName } = data
        const folderResult = createAssetFolder(folderName)
        self.postMessage({
          type: 'ASSET_FOLDER_CREATED',
          id,
          result: folderResult
        })
        break

      case 'DOWNLOAD_ASSET':
        await initPyodide()
        const { fileName: downloadFileName } = data
        console.log('[Worker] Download request for:', downloadFileName)
        try {
          const filePath = `/assets/${downloadFileName}`
          console.log('[Worker] Reading file from:', filePath)
          const fileData = pyodide.FS.readFile(filePath)
          console.log('[Worker] File data length:', fileData.length)
          self.postMessage({
            type: 'ASSET_DOWNLOADED',
            id,
            fileData: Array.from(fileData) // Convert Uint8Array to regular array for postMessage
          })
          console.log('[Worker] File data sent to main thread')
        } catch (error) {
          console.error('[Worker] Error reading file:', error)
          self.postMessage({
            type: 'ERROR',
            id,
            error: `Failed to read file: ${error.message}`
          })
        }
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