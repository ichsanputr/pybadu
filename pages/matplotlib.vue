<template>
  <div>
    <!-- Editor Area -->
    <div class="min-h-screen">
      <MatplotlibEditor 
        libraryName="Matplotlib"
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
            <Icon icon="ph:spinner" class="w-10 h-10 text-python-yellow-500 animate-spin" />
          </div>
        </transition>
      </ClientOnly>
    </div>

    <!-- Information Section -->
    <LibraryInfoSection>
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-4">
          <Icon icon="simple-icons:matplotlib" class="w-8 h-8 text-white" />
        </div>
        <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          About Matplotlib Playground
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Create stunning data visualizations with Python's most popular plotting library. Run matplotlib code directly in your browser with zero setup.
        </p>
      </div>

      <!-- Features -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <AnimatedCard>
          <div class="text-center">
            <div class="w-14 h-14 bg-gradient-to-br from-python-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Icon icon="ph:chart-line" class="w-7 h-7 text-white" />
            </div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Interactive Plotting</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Create 2D and 3D visualizations with instant preview and real-time updates</p>
          </div>
        </AnimatedCard>
        
        <AnimatedCard>
          <div class="text-center">
            <div class="w-14 h-14 bg-gradient-to-br from-python-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Icon icon="ph:files" class="w-7 h-7 text-white" />
            </div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Multi-File Support</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Organize your code across multiple files like a professional IDE</p>
          </div>
        </AnimatedCard>
        
        <AnimatedCard>
          <div class="text-center">
            <div class="w-14 h-14 bg-gradient-to-br from-python-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Icon icon="ph:rocket-launch" class="w-7 h-7 text-white" />
            </div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Instant Execution</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">No installation needed - powered by Pyodide WebAssembly</p>
          </div>
        </AnimatedCard>
      </div>

      <!-- Example Code -->
      <div class="mb-12 overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800">
        <div class="bg-gradient-to-r from-python-blue-600 to-blue-600 px-6 py-3">
          <p class="text-white font-semibold">Quick Example</p>
        </div>
        <div class="bg-gray-900 p-6">
          <pre class="text-sm text-gray-300 overflow-x-auto"><code>import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(0, 10, 100)
y = np.sin(x)

plt.figure(figsize=(10, 6))
plt.plot(x, y, 'b-', linewidth=2)
plt.title('Sine Wave')
plt.grid(True, alpha=0.3)
plt.show()</code></pre>
        </div>
      </div>
    </LibraryInfoSection>

    <!-- Footer -->
    <AppFooter />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useHead } from '#app'
import MatplotlibEditor from '~/components/matplotlib/MatplotlibEditor.vue'
import LibraryInfoSection from '~/components/LibraryInfoSection.vue'
import AnimatedCard from '~/components/ui/AnimatedCard.vue'
import AppFooter from '~/components/AppFooter.vue'
import { Icon } from '@iconify/vue'
import { useLibraryPlayground } from '~/composables/useLibraryPlayground'

defineOptions({
  name: 'MatplotlibPlayground'
})

definePageMeta({
  layout: 'library'
})

useHead({
  title: 'Matplotlib Playground - Pybadu',
  meta: [
    { name: 'description', content: 'Interactive matplotlib plotting playground powered by Pyodide WebAssembly' }
  ]
})

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

const defaultCode = `import matplotlib.pyplot as plt
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

// Use the shared composable
const {
  files,
  activeFileId,
  output,
  isLoading,
  pyodideReady,
  theme,
  loaderVisible,
  currentFileContent,
  monacoTheme,
  updateCurrentFile,
  createNewFile,
  selectFile,
  deleteFile,
  toggleTheme,
  runCode,
  clearCode,
  clearOutput,
  loadExample,
  initializePyodide
} = useLibraryPlayground({
  packageName: 'matplotlib',
  defaultCode,
  examples,
  additionalPackages: [],
  setupCode: `
import matplotlib
import matplotlib.pyplot as plt
import numpy as np

# Set matplotlib backend for web
matplotlib.use('Agg')

# Configure matplotlib for better web display
plt.rcParams['figure.facecolor'] = 'white'
plt.rcParams['axes.facecolor'] = 'white'
plt.rcParams['figure.dpi'] = 100
  `
})

onMounted(async () => {
  await initializePyodide()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
