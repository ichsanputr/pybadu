<template>
  <div>
    <!-- Editor Area -->
    <div class="sm:min-h-screen">
      <CodeEditor 
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
        :assets="assets"
        :assetsUploading="assetsUploading"
        @update:code="updateCurrentFile"
        @toggleTheme="toggleTheme"
        @runCode="runCode" 
        @clearCode="clearCode"
        @clearOutput="clearOutput"
        @loadExample="loadExample"
        @newFile="createNewFile"
        @selectFile="selectFile"
        @deleteFile="deleteFile"
        @renameFile="renameFile"
        @saveToStorage="saveToStorage"
        @uploadAssets="uploadAssets"
        @deleteAsset="deleteAsset"
        @refreshAssets="refreshAssets"
        @createAssetFolder="createAssetFolder" />

    </div>

    <!-- Information Section -->
    <LibraryInfoSection>
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Online Matplotlib Compiler
        </h1>
        
        <div class="max-w-4xl mx-auto text-left space-y-6 text-gray-700 dark:text-gray-300">
          <p class="text-base md:text-lg leading-relaxed">
            Matplotlib is Python's most comprehensive library for creating static, animated, and interactive visualizations. 
            As the foundation of Python's data visualization ecosystem, Matplotlib has been the go-to choice for scientists, 
            engineers, and data analysts worldwide for over two decades. Our dedicated online Matplotlib compiler provides a 
            complete browser-based environment where you can experiment with data visualization techniques without any 
            installation or setup required.
          </p>
          
          <p class="text-base md:text-lg leading-relaxed">
            This compiler comes pre-configured with <strong>Matplotlib 3.x</strong> and <strong>NumPy</strong>, powered by 
            Pyodide WebAssembly technology that brings the full power of Python directly to your browser. You can create 
            publication-quality figures, complex multi-subplot layouts, and 3D visualizations instantly. The online compiler 
            supports all major Matplotlib features including line plots, scatter plots, bar charts, histograms, pie charts, 
            3D surface plots, contour plots, heatmaps, and statistical visualizations. You have full control over every 
            aspect of your plots—from colors and labels to custom styling and annotations.
          </p>

          <p class="text-base md:text-lg leading-relaxed">
            The multi-file project support allows you to organize complex visualizations across multiple Python files, making 
            it perfect for both simple examples and sophisticated data analysis projects. Whether you're learning data 
            visualization, prototyping charts for presentations, or teaching Python data science, our platform offers a 
            seamless coding experience with instant feedback and real-time preview capabilities. With our example gallery 
            featuring 6+ pre-built examples, you can quickly learn different plot types and visualization techniques.
          </p>

          <h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Perfect For</h3>
          <ul class="list-disc list-inside space-y-2 text-base md:text-lg ml-4">
            <li>Data scientists prototyping visualizations and creating publication-ready figures</li>
            <li>Students learning Python data visualization and exploring different plot types</li>
            <li>Educators teaching data science courses with interactive examples</li>
            <li>Researchers presenting scientific findings through charts and graphs</li>
            <li>Developers sharing interactive visualization demos and code snippets</li>
          </ul>
        </div>
      </div>

    </LibraryInfoSection>

    <!-- Footer -->
    <AppFooter />
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import { useHead } from '#app'
import CodeEditor from '~/components/CodeEditor.vue'
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
  title: 'Online Matplotlib Compiler',
  meta: [
    { name: 'description', content: 'Create stunning Python data visualizations with our online Matplotlib compiler. Run Matplotlib code in your browser with Pyodide WebAssembly. No installation required.' },
    { name: 'keywords', content: 'matplotlib, python visualization, data plotting, online python compiler, pyodide, matplotlib online, python charts, data science' },
    { name: 'author', content: 'Pybadu' },
    { property: 'og:title', content: 'Online Matplotlib Compiler' },
    { property: 'og:description', content: 'Create stunning Python data visualizations with our online Matplotlib compiler. Run Matplotlib code in your browser.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/pybadu.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Online Matplotlib Compiler' },
    { name: 'twitter:description', content: 'Create stunning Python data visualizations with Matplotlib in your browser' },
    { name: 'twitter:image', content: '/pybadu.png' }
  ]
})

// Example code snippets
const examples = [
  {
    title: "Basic Line Plot",
    code: `# Create sample data
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
    code: `# Generate data
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
    code: `# Generate random data
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
    code: `# Data for bar chart
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
    code: `# Generate random data
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
    code: `from mpl_toolkits.mplot3d import Axes3D

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

const defaultCode = `# Create sample data
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
  renameFile,
  saveToStorage,
  toggleTheme,
  runCode,
  clearCode,
  clearOutput,
  loadExample,
  initializePyodide,
  cleanupWorker,
  assets,
  assetsUploading,
  refreshAssets,
  uploadAssets,
  deleteAsset,
  createAssetFolder,
  createSampleAssets
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
  // Create sample assets for testing
  await createSampleAssets()
})

onBeforeUnmount(() => {
  cleanupWorker()
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
