<template>
  <div>
    <!-- Desktop Version (≥1152px) -->
    <div v-show="!loaderVisible && isDesktop" class="desktop-only">
      <MatplotlibDesktop 
        v-if="true"
        key="desktop-view" 
        :theme="theme" 
        :code="code"
        :output="output" 
        :isLoading="isLoading" 
        :pyodideReady="pyodideReady"
        :monacoTheme="monacoTheme"
        :examples="examples"
        @update:code="code = $event"
        @toggleTheme="toggleTheme"
        @runCode="runCode" 
        @clearCode="clearCode"
        @clearOutput="clearOutput"
        @loadExample="loadExample" />
    </div>

    <!-- Mobile Version (<1152px) -->
    <div v-show="!loaderVisible && isMobileOrTablet" class="mobile-only">
      <MatplotlibMobile 
        v-if="true"
        key="mobile-view" 
        :theme="theme"
        :code="code" 
        :output="output" 
        :isLoading="isLoading" 
        :pyodideReady="pyodideReady"
        :monacoTheme="monacoTheme"
        :examples="examples"
        @update:code="code = $event"
        @toggleTheme="toggleTheme"
        @runCode="runCode" 
        @clearCode="clearCode"
        @clearOutput="clearOutput"
        @loadExample="loadExample" />
    </div>

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
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useHead } from '#app'
import { useBreakpoints } from '@vueuse/core'
import MatplotlibDesktop from '~/components/matplotlib/MatplotlibDesktop.vue'
import MatplotlibMobile from '~/components/matplotlib/MatplotlibMobile.vue'
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
const code = ref(`import matplotlib.pyplot as plt
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

print("Plot generated successfully!")`)

const output = ref([])
const isLoading = ref(false)
const pyodideReady = ref(false)
const pyodide = ref(null)
const loaderVisible = ref(false)

// Theme state - defaults to dark like BudiBadu
const theme = ref('dark')

// VueUse breakpoint for responsive layout
const breakpoints = import.meta.client ? useBreakpoints({
  mobile: 768,
  tablet: 1024,
  desktop: 1152
}) : null

const isMobileOrTablet = computed(() => {
  if (!import.meta.client) return true
  return breakpoints?.smaller('desktop').value ?? false
})

const isDesktop = computed(() => {
  if (!import.meta.client) return true
  return breakpoints?.greaterOrEqual('desktop').value ?? false
})

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
  if (!pyodideReady.value || !code.value.trim()) return
  
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
    pyodide.value.runPython(code.value)
    
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
  code.value = ''
}

function clearOutput() {
  output.value = []
}

// Load example code
function loadExample(example) {
  code.value = example.code
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
/* Hide mobile version on desktop and vice versa using CSS media queries for SSR */
@media (min-width: 1152px) {
  .mobile-only {
    display: none !important;
  }
}

@media (max-width: 1151px) {
  .desktop-only {
    display: none !important;
  }
}

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