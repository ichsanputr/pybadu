<template>
  <div>
    <!-- Editor Area -->
    <div class="sm:min-h-screen">
      <CodeEditor 
        libraryName="orjson"
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
      <div class="text-center mb-12">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Online Python orjson Compiler
        </h1>
        
        <div class="max-w-4xl mx-auto text-left space-y-6 text-gray-700 dark:text-gray-300">
          <p class="text-base md:text-lg leading-relaxed">
            orjson is a fast, correct JSON library for Python that benchmarks as the fastest Python library for JSON serialization 
            and deserialization. It is more correct than the standard json library or other third-party libraries, with strict 
            compliance to UTF-8 and RFC 8259. orjson natively serializes dataclass, datetime, numpy, and UUID instances, making 
            it ideal for high-performance JSON processing in Python applications where speed and correctness are critical.
          </p>
          
          <p class="text-base md:text-lg leading-relaxed">
            This compiler includes <strong>orjson 3.11+</strong> with full support for fast JSON serialization and deserialization, 
            powered by Pyodide WebAssembly technology. orjson.dumps() is approximately 10x faster than the standard json library 
            and serializes common types and subtypes natively. orjson.loads() is approximately 2x faster than json and is strictly 
            compliant with UTF-8 and RFC 8259. Whether you're building high-performance APIs, processing large JSON datasets, 
            serializing dataclasses and numpy arrays, or working with datetime objects, our orjson playground offers instant 
            execution with comprehensive JSON processing capabilities. You can serialize and deserialize JSON data, work with 
            dataclasses and custom types, handle datetime objects, and use various serialization options. You can also upload 
            and use files or folders directly in your code for JSON processing workflows. This compiler is online and completely 
            free to use.
          </p>

          <p class="text-base md:text-lg leading-relaxed">
            Our example collection covers essential orjson topics including basic serialization and deserialization, working with 
            dataclasses and datetime objects, numpy array serialization, custom serialization options, and performance comparisons. 
            You'll learn how to use orjson for fast JSON processing, serialize complex Python objects, and optimize JSON operations 
            in your applications.
          </p>

          <h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Who Should Use This</h3>
          <ul class="list-disc list-inside space-y-2 text-base md:text-lg ml-4">
            <li>Backend developers building high-performance APIs and web services</li>
            <li>Data engineers processing large JSON datasets efficiently</li>
            <li>Developers working with dataclasses, datetime, and numpy in JSON workflows</li>
            <li>Performance-conscious developers needing faster JSON serialization</li>
            <li>Full-stack developers optimizing JSON processing in Python applications</li>
            <li>Students learning fast JSON processing and serialization techniques</li>
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
  name: 'OrjsonPlayground'
})

definePageMeta({
  layout: 'library'
})

useHead({
  title: 'Online Python orjson Compiler',
  meta: [
    { name: 'description', content: 'Fast JSON serialization and deserialization with Python orjson in your browser. High-performance JSON processing with dataclass, datetime, and numpy support powered by Pyodide WebAssembly. No installation required.' },
    { name: 'keywords', content: 'orjson, fast json, json serialization, json deserialization, high performance json, online compiler, pyodide, dataclass json' },
    { name: 'author', content: 'Pybadu' },
    { property: 'og:title', content: 'Online Python orjson Compiler' },
    { property: 'og:description', content: 'Fast JSON serialization and deserialization with Python orjson in your browser' },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/pybadu.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Online Python orjson Compiler' },
    { name: 'twitter:description', content: 'Fast JSON serialization and deserialization with Python orjson in your browser' },
    { name: 'twitter:image', content: '/pybadu.png' }
  ]
})

// Example code snippets
const examples = [
  {
    title: "Basic JSON Serialization",
    code: `import orjson

# Python dictionary
data = {
    "name": "Alice",
    "age": 30,
    "city": "New York",
    "active": True
}

# Serialize to JSON bytes
json_bytes = orjson.dumps(data)
print("Serialized JSON (bytes):")
print(json_bytes)
print(f"\\nType: {type(json_bytes)}")

# Deserialize back to Python
decoded = orjson.loads(json_bytes)
print(f"\\nDeserialized data:")
print(decoded)`
  },
  {
    title: "Working with Dataclasses",
    code: `import orjson
from dataclasses import dataclass

@dataclass
class Person:
    name: str
    age: int
    email: str

# Create dataclass instance
person = Person("Bob", 25, "bob@example.com")

# Serialize dataclass (natively supported)
json_bytes = orjson.dumps(person)
print("Serialized dataclass:")
print(json_bytes.decode('utf-8'))

# Deserialize to dict
data = orjson.loads(json_bytes)
print(f"\\nDeserialized: {data}")`
  },
  {
    title: "Datetime Serialization",
    code: `import orjson
from datetime import datetime, date, time

# Create datetime objects
now = datetime(2024, 1, 15, 14, 30, 0)
today = date(2024, 1, 15)
current_time = time(14, 30, 0)

# Serialize with datetime support
data = {
    "timestamp": now,
    "date": today,
    "time": current_time
}

json_bytes = orjson.dumps(data, option=orjson.OPT_NAIVE_UTC)
print("Serialized with datetime:")
print(json_bytes.decode('utf-8'))

# Deserialize
decoded = orjson.loads(json_bytes)
print(f"\\nDeserialized: {decoded}")`
  },
  {
    title: "Numpy Array Serialization",
    code: `import orjson
import numpy as np

# Create numpy array
arr = np.array([[1, 2, 3], [4, 5, 6]])

# Serialize numpy array
data = {
    "array": arr,
    "shape": arr.shape
}

json_bytes = orjson.dumps(data, option=orjson.OPT_SERIALIZE_NUMPY)
print("Serialized with numpy:")
print(json_bytes.decode('utf-8'))

# Deserialize
decoded = orjson.loads(json_bytes)
print(f"\\nDeserialized array: {decoded['array']}")`
  },
  {
    title: "Serialization Options",
    code: `import orjson

data = {
    "name": "Charlie",
    "age": 35,
    "tags": ["python", "json", "fast"]
}

# Serialize with options
json_bytes1 = orjson.dumps(data)
print("Default serialization:")
print(json_bytes1.decode('utf-8'))

# Sort keys
json_bytes2 = orjson.dumps(data, option=orjson.OPT_SORT_KEYS)
print("\\nWith sorted keys:")
print(json_bytes2.decode('utf-8'))

# Indent (2 spaces)
json_bytes3 = orjson.dumps(data, option=orjson.OPT_INDENT_2)
print("\\nWith indentation:")
print(json_bytes3.decode('utf-8'))`
  },
  {
    title: "Complex Nested Structures",
    code: `import orjson
from datetime import datetime

# Complex nested structure
data = {
    "users": [
        {
            "id": 1,
            "name": "Alice",
            "created_at": datetime(2024, 1, 1),
            "preferences": {
                "theme": "dark",
                "notifications": True
            }
        },
        {
            "id": 2,
            "name": "Bob",
            "created_at": datetime(2024, 1, 2),
            "preferences": {
                "theme": "light",
                "notifications": False
            }
        }
    ],
    "metadata": {
        "total": 2,
        "last_updated": datetime.now()
    }
}

# Serialize
json_bytes = orjson.dumps(data, option=orjson.OPT_NAIVE_UTC | orjson.OPT_SORT_KEYS)
print("Complex nested structure:")
print(json_bytes.decode('utf-8'))`
  }
]

const defaultCode = `import orjson

# Python dictionary
data = {
    "name": "Alice",
    "age": 30,
    "city": "New York",
    "active": True
}

# Serialize to JSON bytes
json_bytes = orjson.dumps(data)
print("Serialized JSON (bytes):")
print(json_bytes)
print(f"\\nType: {type(json_bytes)}")

# Deserialize back to Python
decoded = orjson.loads(json_bytes)
print(f"\\nDeserialized data:")
print(decoded)`

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
  createAssetFolder
} = useLibraryPlayground({
  packageName: 'orjson',
  defaultCode,
  examples,
  additionalPackages: [],
  setupCode: `
import orjson
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

