<template>
  <div>
    <!-- Editor Area -->
    <div class="min-h-screen">
      <CodeEditor 
        libraryName="Seaborn"
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
        @deleteFile="deleteFile"
        @renameFile="renameFile"
        @saveToStorage="saveToStorage" />
    </div>

    <!-- Information Section -->
    <LibraryInfoSection>
      <div class="text-center mb-12">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Online Python Seaborn Compiler
        </h1>
        
        <div class="max-w-4xl mx-auto text-left space-y-6 text-gray-700 dark:text-gray-300">
          <p class="text-base md:text-lg leading-relaxed">
            Seaborn is a powerful Python data visualization library built on top of Matplotlib that provides a high-level interface 
            for drawing attractive and informative statistical graphics. Seaborn simplifies the creation of complex visualizations 
            by providing beautiful default styles and color palettes, making it easier to create publication-quality plots with 
            minimal code. The library is particularly well-suited for statistical data visualization and exploratory data analysis.
          </p>
          
          <p class="text-base md:text-lg leading-relaxed">
            This compiler includes <strong>Seaborn</strong> with full support for statistical plotting, powered by Pyodide WebAssembly 
            technology. Seaborn integrates seamlessly with NumPy, Pandas, and Matplotlib, providing functions for creating scatter 
            plots, line plots, bar charts, histograms, box plots, violin plots, heatmaps, and many other statistical visualizations. 
            You can create beautiful visualizations with automatic color palettes, statistical estimation, and built-in themes. Whether 
            you're exploring data distributions, comparing groups, visualizing relationships, or creating statistical plots, our Seaborn 
            playground offers instant execution with full Matplotlib integration for displaying your plots. You can also upload and use 
            files or folders directly in your code for data visualization workflows. This compiler is online and completely free to use.
          </p>

          <p class="text-base md:text-lg leading-relaxed">
            Our comprehensive example collection covers essential data visualization techniques including basic plotting functions, 
            statistical distributions, categorical plots, relational plots, and advanced styling options. You'll also learn how to 
            create various plot types, customize visualizations, work with built-in datasets, and integrate Seaborn into data analysis 
            workflows. The examples demonstrate practical applications commonly used in data science, statistical analysis, and 
            exploratory data visualization.
          </p>

          <h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Who Should Use This</h3>
          <ul class="list-disc list-inside space-y-2 text-base md:text-lg ml-4">
            <li>Data scientists creating statistical visualizations and exploratory data analysis</li>
            <li>Researchers visualizing experimental data and statistical relationships</li>
            <li>Analysts building publication-quality plots for reports and presentations</li>
            <li>Students learning data visualization and statistical plotting techniques</li>
            <li>Developers building data analysis tools with beautiful visualizations</li>
            <li>Statisticians creating informative graphics for data exploration</li>
          </ul>
        </div>
      </div>
    </LibraryInfoSection>

    <AppFooter />
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import { useHead } from '#app'
import CodeEditor from '~/components/CodeEditor.vue'
import LibraryInfoSection from '~/components/LibraryInfoSection.vue'
import AppFooter from '~/components/AppFooter.vue'
import { useLibraryPlayground } from '~/composables/useLibraryPlayground'

defineOptions({
  name: 'SeabornPlayground'
})

definePageMeta({
  layout: 'library'
})

useHead({
  title: 'Online Python Seaborn Compiler',
  meta: [
    { name: 'description', content: 'Create beautiful statistical visualizations with Python Seaborn in your browser. Data visualization and statistical plotting powered by Pyodide WebAssembly. No installation required.' },
    { name: 'keywords', content: 'seaborn, data visualization, statistical plotting, matplotlib, data science, online compiler, pyodide, python plotting' },
    { name: 'author', content: 'Pybadu' },
    { property: 'og:title', content: 'Online Python Seaborn Compiler' },
    { property: 'og:description', content: 'Create beautiful statistical visualizations with Python Seaborn in your browser' },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/pybadu.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Online Python Seaborn Compiler' },
    { name: 'twitter:description', content: 'Create beautiful statistical visualizations with Python Seaborn in your browser' },
    { name: 'twitter:image', content: '/pybadu.png' }
  ]
})

// Example code snippets
const examples = [
  {
    title: "Basic Line Plot",
    code: `import seaborn as sns
import matplotlib.pyplot as plt
import numpy as np

# Generate sample data
x = np.linspace(0, 10, 100)
y = np.sin(x)

# Set style
sns.set_theme(style="darkgrid")

# Create line plot
plt.figure(figsize=(10, 6))
sns.lineplot(x=x, y=y)
plt.title('Sine Wave')
plt.show()

print("Line plot created!")`
  },
  {
    title: "Scatter Plot with Hue",
    code: `import seaborn as sns
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

# Create sample data
np.random.seed(42)
data = pd.DataFrame({
    'x': np.random.randn(100),
    'y': np.random.randn(100),
    'category': np.random.choice(['A', 'B', 'C'], 100)
})

# Create scatter plot
plt.figure(figsize=(10, 6))
sns.scatterplot(data=data, x='x', y='y', hue='category')
plt.title('Scatter Plot with Categories')
plt.show()

print("Scatter plot created!")`
  },
  {
    title: "Histogram and KDE",
    code: `import seaborn as sns
import matplotlib.pyplot as plt
import numpy as np

# Generate sample data
np.random.seed(42)
data = np.random.normal(100, 15, 1000)

# Create histogram with KDE
plt.figure(figsize=(10, 6))
sns.histplot(data, kde=True, bins=30)
plt.title('Distribution with KDE')
plt.xlabel('Value')
plt.ylabel('Frequency')
plt.show()

print("Histogram with KDE created!")`
  },
  {
    title: "Box Plot",
    code: `import seaborn as sns
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

# Create sample data
np.random.seed(42)
data = pd.DataFrame({
    'value': np.concatenate([
        np.random.normal(10, 2, 100),
        np.random.normal(15, 3, 100),
        np.random.normal(12, 2.5, 100)
    ]),
    'group': ['A'] * 100 + ['B'] * 100 + ['C'] * 100
})

# Create box plot
plt.figure(figsize=(10, 6))
sns.boxplot(data=data, x='group', y='value')
plt.title('Box Plot by Group')
plt.show()

print("Box plot created!")`
  },
  {
    title: "Heatmap",
    code: `import seaborn as sns
import matplotlib.pyplot as plt
import numpy as np

# Generate correlation matrix
np.random.seed(42)
data = np.random.randn(10, 10)
corr_matrix = np.corrcoef(data)

# Create heatmap
plt.figure(figsize=(10, 8))
sns.heatmap(corr_matrix, annot=True, cmap='coolwarm', center=0)
plt.title('Correlation Heatmap')
plt.show()

print("Heatmap created!")`
  },
  {
    title: "Multiple Subplots",
    code: `import seaborn as sns
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

# Create sample data
np.random.seed(42)
data = pd.DataFrame({
    'x': np.random.randn(200),
    'y': np.random.randn(200),
    'category': np.random.choice(['A', 'B'], 200)
})

# Create subplots
fig, axes = plt.subplots(1, 2, figsize=(14, 6))

# Scatter plot
sns.scatterplot(data=data, x='x', y='y', hue='category', ax=axes[0])
axes[0].set_title('Scatter Plot')

# Histogram
sns.histplot(data=data, x='x', hue='category', kde=True, ax=axes[1])
axes[1].set_title('Distribution')

plt.tight_layout()
plt.show()

print("Multiple plots created!")`
  }
]

const defaultCode = `import seaborn as sns
import matplotlib.pyplot as plt
import numpy as np

# Generate sample data
x = np.linspace(0, 10, 100)
y = np.sin(x)

# Set style
sns.set_theme(style="darkgrid")

# Create line plot
plt.figure(figsize=(10, 6))
sns.lineplot(x=x, y=y)
plt.title('Sine Wave')
plt.show()

print("Line plot created!")`

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
  cleanupWorker
} = useLibraryPlayground({
  packageName: 'seaborn',
  defaultCode,
  examples,
  additionalPackages: ['numpy', 'pandas', 'matplotlib'],
  setupCode: `
import matplotlib
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns

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

