// Pyodide Package Loading Worker
// This worker handles package installation status and communication
// Note: Pyodide itself must run in the main thread, but we use this worker
// to handle package installation messages and status updates

let packageStatus = {
  loading: false,
  packages: [],
  currentPackage: null,
  progress: 0
}

// Listen for messages from main thread
self.addEventListener('message', function(e) {
  const { type, data } = e.data
  
  switch (type) {
    case 'PACKAGE_INSTALL_START':
      packageStatus.loading = true
      packageStatus.packages = data.packages || []
      packageStatus.currentPackage = null
      packageStatus.progress = 0
      
      // Simulate progress updates for better UX
      sendProgressUpdate()
      break
      
    case 'PACKAGE_INSTALL_COMPLETE':
      packageStatus.loading = false
      packageStatus.progress = 100
      
      self.postMessage({
        type: 'PACKAGE_STATUS',
        status: 'complete',
        packages: data.packages || [],
        message: 'All packages installed successfully'
      })
      break
      
    case 'PACKAGE_INSTALL_ERROR':
      packageStatus.loading = false
      
      self.postMessage({
        type: 'PACKAGE_STATUS',
        status: 'error',
        error: data.error,
        message: `Failed to install package: ${data.error}`
      })
      break
      
    case 'PACKAGE_PROGRESS':
      packageStatus.currentPackage = data.currentPackage
      packageStatus.progress = data.progress || 0
      
      self.postMessage({
        type: 'PACKAGE_STATUS',
        status: 'loading',
        currentPackage: data.currentPackage,
        progress: data.progress,
        message: `Installing ${data.currentPackage}...`
      })
      break
  }
})

// Send progress updates
function sendProgressUpdate() {
  if (!packageStatus.loading) return
  
  const totalPackages = packageStatus.packages.length
  if (totalPackages === 0) return
  
  // Simulate progress (actual progress will come from main thread)
  const progress = Math.min(packageStatus.progress + 5, 95)
  
  self.postMessage({
    type: 'PACKAGE_STATUS',
    status: 'loading',
    progress: progress,
    message: packageStatus.currentPackage 
      ? `Installing ${packageStatus.currentPackage}...` 
      : 'Preparing packages...'
  })
  
  if (packageStatus.loading && progress < 95) {
    setTimeout(sendProgressUpdate, 200)
  }
}

// Send ready message
self.postMessage({
  type: 'WORKER_READY',
  message: 'Pyodide package worker is ready'
})

