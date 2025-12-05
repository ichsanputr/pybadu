<template>
  <div>
    <!-- Editor Area -->
    <div class="sm:min-h-screen">
      <CodeEditor 
        libraryName="PyYAML"
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
          Online Python PyYAML Compiler
        </h1>
        
        <div class="max-w-4xl mx-auto text-left space-y-6 text-gray-700 dark:text-gray-300">
          <p class="text-base md:text-lg leading-relaxed">
            PyYAML is a YAML parser and emitter for Python, providing a complete YAML 1.1 parser with Unicode support, pickle 
            support, and a capable extension API. YAML (YAML Ain't Markup Language) is a human-readable data serialization 
            format designed for configuration files, data exchange, and scripting languages. PyYAML features sensible error 
            messages, standard YAML tag support, and Python-specific tags that allow representation of arbitrary Python objects, 
            making it an essential tool for working with YAML data in Python applications.
          </p>
          
          <p class="text-base md:text-lg leading-relaxed">
            This compiler includes <strong>PyYAML 6.0+</strong> with full YAML 1.1 parser support, powered by Pyodide WebAssembly 
            technology. PyYAML supports parsing YAML documents from strings and files, emitting Python objects to YAML format, 
            safe loading for untrusted input, and custom tag handling. Whether you're working with configuration files, API 
            responses, data serialization, or complex nested data structures, our PyYAML playground offers instant execution 
            with comprehensive YAML processing capabilities. You can parse YAML strings, convert Python dictionaries and 
            objects to YAML, handle multi-document YAML files, and work with custom YAML tags. You can also upload and use files 
            or folders directly in your code for YAML processing workflows. This compiler is online and completely free to use.
          </p>

          <p class="text-base md:text-lg leading-relaxed">
            Our example collection covers essential PyYAML topics including basic parsing and dumping, safe loading for security, 
            multi-document handling, custom tags and types, and configuration file processing. You'll learn how to parse YAML 
            strings and files, convert Python objects to YAML format, handle nested data structures, and work with YAML in 
            real-world applications.
          </p>

          <h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Who Should Use This</h3>
          <ul class="list-disc list-inside space-y-2 text-base md:text-lg ml-4">
            <li>Developers working with configuration files and application settings in YAML format</li>
            <li>DevOps engineers managing infrastructure-as-code and deployment configurations</li>
            <li>Data engineers processing YAML data from APIs and configuration sources</li>
            <li>Software developers building applications that require data serialization and persistence</li>
            <li>System administrators managing YAML-based configuration files and templates</li>
            <li>Students learning YAML parsing and data serialization techniques</li>
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
  name: 'PyYAMLPlayground'
})

definePageMeta({
  layout: 'library'
})

useHead({
  title: 'Online Python PyYAML Compiler',
  meta: [
    { name: 'description', content: 'Parse and emit YAML data with Python PyYAML in your browser. Work with YAML configuration files and data serialization powered by Pyodide WebAssembly. No installation required.' },
    { name: 'keywords', content: 'pyyaml, yaml parser, yaml emitter, configuration files, data serialization, online compiler, pyodide, yaml python' },
    { name: 'author', content: 'Pybadu' },
    { property: 'og:title', content: 'Online Python PyYAML Compiler' },
    { property: 'og:description', content: 'Parse and emit YAML data with Python PyYAML in your browser' },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/pybadu.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Online Python PyYAML Compiler' },
    { name: 'twitter:description', content: 'Parse and emit YAML data with Python PyYAML in your browser' },
    { name: 'twitter:image', content: '/pybadu.png' }
  ]
})

// Example code snippets
const examples = [
  {
    title: "Basic YAML Parsing",
    code: `import yaml

# YAML string
yaml_str = """
name: John Doe
age: 30
city: New York
skills:
  - Python
  - JavaScript
  - SQL
"""

# Parse YAML string
data = yaml.safe_load(yaml_str)

print("Parsed data:")
print(data)
print(f"\\nName: {data['name']}")
print(f"Age: {data['age']}")
print(f"Skills: {data['skills']}")`
  },
  {
    title: "YAML Dumping",
    code: `import yaml

# Python dictionary
data = {
    'name': 'Jane Smith',
    'age': 28,
    'email': 'jane@example.com',
    'hobbies': ['reading', 'coding', 'traveling'],
    'address': {
        'street': '123 Main St',
        'city': 'San Francisco',
        'zip': '94102'
    }
}

# Convert to YAML string
yaml_str = yaml.dump(data, default_flow_style=False, sort_keys=False)

print("YAML output:")
print(yaml_str)`
  },
  {
    title: "Safe Loading",
    code: `import yaml

# Safe loading prevents code execution
yaml_str = """
name: Alice
age: 25
active: true
"""

# Safe load (recommended for untrusted input)
data = yaml.safe_load(yaml_str)

print("Safely loaded data:")
print(data)
print(f"\\nType of 'active': {type(data['active'])}")

# Regular load (use with caution)
data2 = yaml.load(yaml_str, Loader=yaml.SafeLoader)
print(f"\\nRegular load result: {data2}")`
  },
  {
    title: "Multi-Document YAML",
    code: `import yaml

# Multi-document YAML string
multi_doc = """
---
name: Document 1
value: 100
---
name: Document 2
value: 200
---
name: Document 3
value: 300
"""

# Load all documents
documents = list(yaml.safe_load_all(multi_doc))

print(f"Number of documents: {len(documents)}")
print("\\nDocuments:")
for i, doc in enumerate(documents, 1):
    print(f"\\nDocument {i}:")
    print(doc)`
  },
  {
    title: "Nested Data Structures",
    code: `import yaml

# Complex nested structure
config = {
    'server': {
        'host': 'localhost',
        'port': 8080,
        'ssl': True
    },
    'database': {
        'name': 'mydb',
        'user': 'admin',
        'tables': ['users', 'products', 'orders']
    },
    'features': {
        'cache': True,
        'logging': {
            'level': 'INFO',
            'file': 'app.log'
        }
    }
}

# Convert to YAML
yaml_output = yaml.dump(config, default_flow_style=False, indent=2)

print("Configuration YAML:")
print(yaml_output)

# Parse it back
parsed = yaml.safe_load(yaml_output)
print(f"\\nParsed server port: {parsed['server']['port']}")`
  },
  {
    title: "Custom Formatting",
    code: `import yaml

data = {
    'application': 'MyApp',
    'version': '1.0.0',
    'settings': {
        'debug': False,
        'timeout': 30
    },
    'users': ['alice', 'bob', 'charlie']
}

# Dump with custom options
yaml_str = yaml.dump(
    data,
    default_flow_style=False,  # Use block style
    sort_keys=True,             # Sort keys alphabetically
    indent=4,                   # Indentation
    allow_unicode=True          # Allow unicode characters
)

print("Formatted YAML:")
print(yaml_str)`
  }
]

const defaultCode = `import yaml

# YAML string
yaml_str = """
name: John Doe
age: 30
city: New York
skills:
  - Python
  - JavaScript
  - SQL
"""

# Parse YAML string
data = yaml.safe_load(yaml_str)

print("Parsed data:")
print(data)
print(f"\\nName: {data['name']}")
print(f"Age: {data['age']}")
print(f"Skills: {data['skills']}")`

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
  assets,
  assetsUploading,
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
  refreshAssets,
  uploadAssets,
  deleteAsset,
  
  downloadAsset,
  createAssetFolder
} = useLibraryPlayground({
  packageName: 'pyyaml',
  defaultCode,
  examples,
  additionalPackages: [],
  setupCode: `
import yaml
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

