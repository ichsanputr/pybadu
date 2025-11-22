<template>
  <div>
    <!-- Editor Area (100vh) -->
    <div class="h-screen">
      <MatplotlibEditor 
        :theme="theme" 
        :files="files"
        :activeFileId="activeFileId"
        :code="currentFileContent"
        :output="output" 
        :isLoading="isLoading" 
        :pyodideReady="pyodideReady"
        :monacoTheme="monacoTheme"
        :examples="examples"
        @update:code="updateCurrentFile"
        @toggleTheme="toggleTheme"
        @runCode="runCode" 
        @clearCode="clearCode"
        @clearOutput="clearOutput"
        @loadExample="loadExample"
        @newFile="createNewFile"
        @selectFile="selectFile"
        @deleteFile="deleteFile" />

      <!-- Loading Transition (client-only) -->
      <ClientOnly>
        <transition name="fade">
          <div v-if="loaderVisible"
            class="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-[#18181b] transition-colors duration-300">
            <Icon icon="ph:spinner" class="w-10 h-10 text-yellow-500 animate-spin" />
          </div>
        </transition>
      </ClientOnly>
    </div>

    <!-- Explanation Section (scrollable below) -->
    <section class="bg-white dark:bg-gray-900 transition-colors duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="max-w-4xl mx-auto">
          <!-- Header -->
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              About Matplotlib Playground
            </h2>
            <p class="text-lg text-gray-600 dark:text-gray-300">
              An interactive environment for creating beautiful visualizations with Python's most popular plotting library
            </p>
          </div>

          <!-- Features Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <div class="text-center">
              <div class="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Icon icon="ph:chart-line" class="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Interactive Plotting</h3>
              <p class="text-gray-600 dark:text-gray-300 text-sm">Create charts, graphs, and visualizations with instant preview</p>
            </div>
            
            <div class="text-center">
              <div class="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Icon icon="ph:files" class="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Multi-File Support</h3>
              <p class="text-gray-600 dark:text-gray-300 text-sm">Work with multiple Python files like a real IDE</p>
            </div>
            
            <div class="text-center">
              <div class="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Icon icon="ph:browser" class="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Browser-Based</h3>
              <p class="text-gray-600 dark:text-gray-300 text-sm">No installation required, runs entirely in your browser</p>
            </div>
          </div>

          <!-- What you can do -->
          <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-8">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">What you can create:</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <ul class="space-y-3 text-gray-600 dark:text-gray-300">
                  <li class="flex items-start">
                    <Icon icon="ph:check" class="w-5 h-5 text-green-600 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Line plots and scatter plots</span>
                  </li>
                  <li class="flex items-start">
                    <Icon icon="ph:check" class="w-5 h-5 text-green-600 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Bar charts and histograms</span>
                  </li>
                  <li class="flex items-start">
                    <Icon icon="ph:check" class="w-5 h-5 text-green-600 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>3D surface and wireframe plots</span>
                  </li>
                </ul>
              </div>
              <div>
                <ul class="space-y-3 text-gray-600 dark:text-gray-300">
                  <li class="flex items-start">
                    <Icon icon="ph:check" class="w-5 h-5 text-green-600 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Subplots and complex layouts</span>
                  </li>
                  <li class="flex items-start">
                    <Icon icon="ph:check" class="w-5 h-5 text-green-600 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Statistical visualizations</span>
                  </li>
                  <li class="flex items-start">
                    <Icon icon="ph:check" class="w-5 h-5 text-green-600 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Custom styling and themes</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Code Example -->
          <div class="mt-12">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Getting Started</h3>
            <div class="bg-gray-900 rounded-lg p-6 overflow-x-auto">
              <pre class="text-sm text-gray-300"><code>import matplotlib.pyplot as plt
import numpy as np

# Create sample data
x = np.linspace(0, 10, 100)
y = np.sin(x)

# Create a simple plot
plt.figure(figsize=(10, 6))
plt.plot(x, y, label='sin(x)')
plt.xlabel('X values')
plt.ylabel('Y values')
plt.title('Simple Sine Wave')
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()

print("Your first plot is ready!")</code></pre>
            </div>
          </div>

          <!-- Part of ecosystem -->
          <div class="mt-12 text-center">
            <div class="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-8">
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Part of BudiBadu Ecosystem</h3>
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                Pybadu is a specialized subset of the BudiBadu platform, dedicated to providing the best Python library experience.
              </p>
              <a href="https://budibadu.com" target="_blank" class="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200">
                <span>Explore BudiBadu</span>
                <Icon icon="ph:arrow-square-out" class="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useHead } from '#app'
import MatplotlibEditor from '~/components/matplotlib/MatplotlibEditor.vue'
import { Icon } from '@iconify/vue'

// Define component name
defineOptions({
  name: 'MatplotlibPlayground'
})

// Use problem layout for full-screen experience
definePageMeta({
  layout: 'problem'
})

// SEO Meta
useHead({
  title: 'Matplotlib Playground - Pybadu',
  meta: [
    { name: 'description', content: 'Interactive matplotlib plotting playground powered by Pyodide WebAssembly' }
  ]
})

// Reactive state
const files = ref([
  {
    id: 1,
    name: 'main.py',
    content: `import matplotlib.pyplot as plt
import numpy as np

# Create sample data
x = np.linspace(0, 10, 100)
y = np.sin(x)

# Create the plot
plt.figure(figsize=(10, 6))
plt.plot(x, y, 'b-', linewidth=2, label='sin(x)')
plt.xlabel('x')
plt.ylabel('y') 
plt.title('Sine Wave Plot')
plt.legend()
plt.grid(True, alpha=0.3)

# Display the plot
plt.show()

print("Plot generated successfully!")`
  }
])

const activeFileId = ref(1)
const output = ref([])
const isLoading = ref(false)
const pyodideReady = ref(false)
const pyodide = ref(null)
const loaderVisible = ref(false)

// Theme state - defaults to dark like BudiBadu
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
    content: '# New Python file\nimport matplotlib.pyplot as plt\nimport numpy as np\n\n# Your code here...\n'
  }
  files.value.push(newFile)
  activeFileId.value = newId
}

function selectFile(fileId) {
  activeFileId.value = fileId
}

function deleteFile(fileId) {
  if (files.value.length <= 1) return // Don't delete the last file
  
  files.value = files.value.filter(f => f.id !== fileId)
  
  // If we deleted the active file, switch to the first available
  if (activeFileId.value === fileId) {
    activeFileId.value = files.value[0].id
  }
}

// Monaco theme based on current theme
const monacoTheme = computed(() => (theme.value === 'dark' ? 'vs-dark' : 'vs-light'))

// Theme management functions
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

// Example code snippets
const examples = [
  {
    title: "Basic Line Plot",
    code: `import matplotlib.pyplot as plt
import numpy as np

# Create sample data
x = np.linspace(0, 10, 100)
y = np.sin(x)

# Create the plot
plt.figure(figsize=(10, 6))
plt.plot(x, y, 'b-', linewidth=2, label='sin(x)')
plt.xlabel('x')
plt.ylabel('y') 
plt.title('Sine Wave Plot')
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()

print("Basic line plot created!")`
  },
  {
    title: "Multiple Functions",
    code: `import matplotlib.pyplot as plt
import numpy as np

# Generate data
x = np.linspace(0, 2*np.pi, 100)
y1 = np.sin(x)
y2 = np.cos(x)
y3 = np.tan(x/2)

# Create subplots
fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 8))

# First subplot
ax1.plot(x, y1, 'r-', label='sin(x)', linewidth=2)
ax1.plot(x, y2, 'b--', label='cos(x)', linewidth=2)
ax1.set_title('Trigonometric Functions')
ax1.set_xlabel('x')
ax1.set_ylabel('y')
ax1.legend()
ax1.grid(True, alpha=0.3)

# Second subplot
ax2.plot(x, y3, 'g-', label='tan(x/2)', linewidth=2)
ax2.set_title('Tangent Function')
ax2.set_xlabel('x')
ax2.set_ylabel('y')
ax2.set_ylim(-3, 3)
ax2.legend()
ax2.grid(True, alpha=0.3)

plt.tight_layout()
plt.show()

print("Multiple function plots created!")`
  },
  {
    title: "Scatter Plot",
    code: `import matplotlib.pyplot as plt
import numpy as np

# Generate random data
np.random.seed(42)
x = np.random.randn(100)
y = 2*x + np.random.randn(100)

# Create scatter plot
plt.figure(figsize=(8, 6))
plt.scatter(x, y, alpha=0.6, c=y, cmap='viridis')
plt.colorbar(label='Y values')
plt.xlabel('X values')
plt.ylabel('Y values')
plt.title('Scatter Plot with Color Mapping')
plt.grid(True, alpha=0.3)

# Add trend line
z = np.polyfit(x, y, 1)
p = np.poly1d(z)
plt.plot(x, p(x), "r--", alpha=0.8, label=f'Trend: y={z[0]:.2f}x+{z[1]:.2f}')
plt.legend()
plt.show()

print("Scatter plot with trend line created!")`
  },
  {
    title: "Bar Chart",
    code: `import matplotlib.pyplot as plt
import numpy as np

# Data for bar chart
categories = ['Python', 'JavaScript', 'Java', 'C++', 'Go', 'Rust']
values = [85, 70, 65, 60, 45, 40]
colors = ['#3776ab', '#f7df1e', '#ed8b00', '#00599c', '#00add8', '#ce422b']

# Create bar chart
plt.figure(figsize=(10, 6))
bars = plt.bar(categories, values, color=colors, alpha=0.8)

# Add value labels on bars
for bar, value in zip(bars, values):
    plt.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1, 
             str(value), ha='center', va='bottom', fontweight='bold')

plt.xlabel('Programming Languages')
plt.ylabel('Popularity Score')
plt.title('Programming Language Popularity')
plt.ylim(0, max(values) + 10)
plt.xticks(rotation=45)
plt.grid(True, alpha=0.3, axis='y')
plt.tight_layout()
plt.show()

print("Bar chart created!")`
  },
  {
    title: "Histogram",
    code: `import matplotlib.pyplot as plt
import numpy as np

# Generate random data
np.random.seed(42)
data = np.random.normal(100, 15, 1000)

# Create histogram
plt.figure(figsize=(10, 6))
n, bins, patches = plt.hist(data, bins=30, alpha=0.7, color='skyblue', 
                           edgecolor='black', linewidth=0.5)

# Add statistics
mean_val = np.mean(data)
std_val = np.std(data)
plt.axvline(mean_val, color='red', linestyle='--', linewidth=2, 
            label=f'Mean: {mean_val:.1f}')
plt.axvline(mean_val + std_val, color='orange', linestyle='--', 
            alpha=0.7, label=f'±1 Std: {std_val:.1f}')
plt.axvline(mean_val - std_val, color='orange', linestyle='--', alpha=0.7)

plt.xlabel('Values')
plt.ylabel('Frequency')
plt.title('Histogram of Random Data')
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()

print(f"Histogram created! Mean: {mean_val:.2f}, Std: {std_val:.2f}")`
  },
  {
    title: "3D Surface Plot",
    code: `import matplotlib.pyplot as plt
import numpy as np
from mpl_toolkits.mplot3d import Axes3D

# Create 3D data
x = np.linspace(-5, 5, 50)
y = np.linspace(-5, 5, 50)
X, Y = np.meshgrid(x, y)
Z = np.sin(np.sqrt(X**2 + Y**2))

# Create 3D surface plot
fig = plt.figure(figsize=(12, 8))
ax = fig.add_subplot(111, projection='3d')

# Plot surface
surf = ax.plot_surface(X, Y, Z, cmap='viridis', alpha=0.9)

# Customize the plot
ax.set_xlabel('X axis')
ax.set_ylabel('Y axis') 
ax.set_zlabel('Z axis')
ax.set_title('3D Surface Plot: f(x,y) = sin(√(x²+y²))')

# Add color bar
fig.colorbar(surf, shrink=0.5, aspect=10)

# Rotate view for better perspective
ax.view_init(elev=30, azim=45)

plt.show()

print("3D surface plot created!")`
  }
]

// Wait for Pyodide to be available globally
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

// Run Python code
async function runCode() {
  if (!pyodideReady.value || !currentFileContent.value.trim()) return
  
  isLoading.value = true
  const startTime = Date.now()
  
  try {
    // Clear previous output
    output.value = []
    
    // Capture Python print statements
    pyodide.value.runPython(`
import sys
from io import StringIO
import matplotlib.pyplot as plt

# Clear any previous plots
plt.close('all')

# Capture stdout
sys.stdout = StringIO()
    `)
    
    // Execute user code
    pyodide.value.runPython(currentFileContent.value)
    
    // Get the captured output
    const stdout = pyodide.value.runPython(`
captured_output = sys.stdout.getvalue()
sys.stdout = sys.__stdout__  # Reset stdout
captured_output
    `)
    
    const executionTime = Date.now() - startTime
    
    // Add output messages
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

// Clear functions
function clearCode() {
  currentFileContent.value = ''
}

function clearOutput() {
  output.value = []
}

// Load example code
function loadExample(example) {
  currentFileContent.value = example.code
  // Auto-run the example
  setTimeout(() => {
    runCode()
  }, 100)
}

// Initialize Pyodide and packages
onMounted(async () => {
  if (process.client) {
    try {
      // Ensure dark theme is applied
      setThemeClass('dark')
      
      // Wait for Pyodide to be available
      await waitForPyodide()
      
      // Load Pyodide
      pyodide.value = await loadPyodide()
      
      // Load micropip
      await pyodide.value.loadPackage("micropip")
      const micropip = pyodide.value.pyimport("micropip")
      
      // Install matplotlib
      await micropip.install("matplotlib")
      
      // Pre-load essential packages
      pyodide.value.runPython(`
import matplotlib
import matplotlib.pyplot as plt
import numpy as np

# Set matplotlib backend for web
matplotlib.use('Agg')

# Configure matplotlib for better web display
plt.rcParams['figure.facecolor'] = 'white'
plt.rcParams['axes.facecolor'] = 'white'
plt.rcParams['figure.dpi'] = 100
      `)
      
      pyodideReady.value = true
      
      // Run initial example
      await runCode()
      
    } catch (error) {
      console.error('Failed to initialize Pyodide or matplotlib:', error)
      output.value.push({
        type: 'error',
        content: `Failed to initialize: ${error.message}`,
        timestamp: new Date().toLocaleTimeString()
      })
    }
  }
})
</script>

<style scoped>
/* Fade transition for loader */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>