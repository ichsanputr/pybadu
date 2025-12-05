<template>
  <div>
    <!-- Editor Area -->
    <div class="min-h-screen">
      <CodeEditor 
        libraryName="Tabulate"
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
        @deleteAsset="deleteAsset" @downloadAsset="downloadAsset"
        @refreshAssets="refreshAssets"
        @createAssetFolder="createAssetFolder" />
    </div>

    <!-- Information Section -->
    <LibraryInfoSection>
      <div class="text-center mb-12">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Online Python Tabulate Compiler
        </h1>
        
        <div class="max-w-4xl mx-auto text-left space-y-6 text-gray-700 dark:text-gray-300">
          <p class="text-base md:text-lg leading-relaxed">
            Tabulate is a simple and powerful Python library for creating beautifully formatted tables from lists of data. Perfect for displaying data in a readable, organized format, Tabulate makes it easy to convert Python lists, dictionaries, and other data structures into well-formatted tables. Whether you're working with command-line applications, generating reports, or displaying data in a structured way, Tabulate provides a clean and intuitive API for table formatting.
          </p>
          
          <p class="text-base md:text-lg leading-relaxed">
            This compiler includes <strong>Tabulate</strong>, enabling you to pretty print tables from Python lists directly in your browser. The library supports multiple table formats including plain text, grid, simple, pipe, orgtbl, and more. You can create tables from lists of lists, dictionaries, or other iterable data structures, customize table headers, align columns, and format numbers. The platform provides all the tools you need for comprehensive table formatting including various output styles, column alignment options, and flexible data input formats. You can also upload and use files or folders directly in your code for data processing and table generation workflows. This compiler is online and completely free to use.
          </p>

          <p class="text-base md:text-lg leading-relaxed">
            Our comprehensive example collection covers essential table formatting techniques including basic table creation, different table formats, working with headers, aligning columns, formatting numbers, and creating tables from dictionaries. You'll also learn how to customize table appearance, handle different data types, and create professional-looking tables for reports and data display. The examples demonstrate practical applications commonly used in data analysis, reporting tools, and command-line applications.
          </p>

          <h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Who Should Use This</h3>
          <ul class="list-disc list-inside space-y-2 text-base md:text-lg ml-4">
            <li>Data analysts formatting and displaying structured data</li>
            <li>Developers building command-line tools with table output</li>
            <li>Report generators creating formatted data presentations</li>
            <li>Students learning data formatting and presentation techniques</li>
            <li>Developers working with data visualization and reporting</li>
            <li>Anyone needing to display data in organized table format</li>
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
  name: 'TabulatePlayground'
})

definePageMeta({
  layout: 'library'
})

useHead({
  title: 'Online Python Tabulate Compiler',
  meta: [
    { name: 'description', content: 'Pretty print tables from Python lists with Tabulate in your browser. Format data, create tables, and display structured information powered by Pyodide WebAssembly. No installation required.' },
    { name: 'keywords', content: 'tabulate, python tables, table formatting, pretty print, data display, online compiler, pyodide, table generator' },
    { name: 'author', content: 'Pybadu' },
    { property: 'og:title', content: 'Online Python Tabulate Compiler' },
    { property: 'og:description', content: 'Pretty print tables from Python lists with Tabulate in your browser' },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/pybadu.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Online Python Tabulate Compiler' },
    { name: 'twitter:description', content: 'Pretty print tables from Python lists with Tabulate in your browser' },
    { name: 'twitter:image', content: '/pybadu.png' }
  ]
})

// Example code snippets
const examples = [
  {
    title: "Basic Table Creation",
    code: `# Create a simple table from a list of lists
data = [
    ['Name', 'Age', 'City'],
    ['Alice', 25, 'New York'],
    ['Bob', 30, 'London'],
    ['Charlie', 35, 'Paris']
]

table = tabulate(data, headers='firstrow', tablefmt='grid')
print("Basic Table:")
print(table)`
  },
  {
    title: "Different Table Formats",
    code: `# Try different table formats
data = [
    ['Product', 'Price', 'Stock'],
    ['Laptop', 999, 15],
    ['Mouse', 25, 100],
    ['Keyboard', 75, 50]
]

formats = ['plain', 'simple', 'grid', 'pipe', 'orgtbl']
for fmt in formats:
    print(f"\\n{fmt.upper()} format:")
    print(tabulate(data, headers='firstrow', tablefmt=fmt))`
  },
  {
    title: "Table from Dictionary",
    code: `# Create table from dictionary
data = {
    'Name': ['Alice', 'Bob', 'Charlie'],
    'Age': [25, 30, 35],
    'City': ['New York', 'London', 'Paris']
}

table = tabulate(data, headers='keys', tablefmt='grid')
print("Table from Dictionary:")
print(table)`
  },
  {
    title: "Column Alignment",
    code: `# Customize column alignment
data = [
    ['Item', 'Price', 'Quantity'],
    ['Laptop', 999.99, 15],
    ['Mouse', 25.50, 100],
    ['Keyboard', 75.25, 50]
]

# Right align numbers
table = tabulate(data, headers='firstrow', tablefmt='grid', 
                 numalign='right', stralign='left')
print("Table with Custom Alignment:")
print(table)`
  },
  {
    title: "Number Formatting",
    code: `# Format numbers in table
data = [
    ['Product', 'Sales', 'Revenue'],
    ['Product A', 150, 15000.50],
    ['Product B', 230, 23000.75],
    ['Product C', 95, 9500.25]
]

table = tabulate(data, headers='firstrow', tablefmt='grid',
                 floatfmt='.2f')
print("Table with Formatted Numbers:")
print(table)`
  },
  {
    title: "Complex Table",
    code: `# Create a more complex table
headers = ['Name', 'Department', 'Salary', 'Bonus']
data = [
    ['Alice', 'Engineering', 75000, 5000],
    ['Bob', 'Marketing', 65000, 3000],
    ['Charlie', 'Sales', 70000, 4000],
    ['David', 'Engineering', 80000, 6000]
]

table = tabulate(data, headers=headers, tablefmt='grid',
                 numalign='right', stralign='left')
print("Employee Data Table:")
print(table)`
  }
]

const defaultCode = `# Create a simple table from a list of lists
data = [
    ['Name', 'Age', 'City'],
    ['Alice', 25, 'New York'],
    ['Bob', 30, 'London'],
    ['Charlie', 35, 'Paris']
]

table = tabulate(data, headers='firstrow', tablefmt='grid')
print("Basic Table:")
print(table)`

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
  createAssetFolder
} = useLibraryPlayground({
  packageName: 'tabulate',
  defaultCode,
  examples,
  additionalPackages: [],
  setupCode: `
from tabulate import tabulate
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

