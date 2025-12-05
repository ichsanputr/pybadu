<template>
  <div>
    <!-- Editor Area -->
    <div class="min-h-screen">
      <CodeEditor
        libraryName="simplejson"
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
        @createAssetFolder="createAssetFolder"
      />
    </div>

    <!-- Information Section -->
    <LibraryInfoSection>
      <div class="text-center mb-12">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Online Python simplejson Compiler
        </h1>

        <div class="max-w-4xl mx-auto text-left space-y-6 text-gray-700 dark:text-gray-300">
          <p class="text-base md:text-lg leading-relaxed">
            simplejson is a fast, complete, and extensible JSON encoder/decoder for Python. It powers the standard <code>json</code> module and ships with an optional C extension for major speed boosts, while remaining pure-Python compatible with every runtime that Pyodide exposes. The library provides precise control over serialization through hooks like <code>default</code>, <code>for_json</code>, <code>use_decimal</code>, and formatting flags for pretty printing, canonical ordering, and NaN handling.
          </p>

          <p class="text-base md:text-lg leading-relaxed">
            This compiler lets you inspect payloads, build custom encoders, and test parser settings directly in your browser. Round-trip complex objects, convert Decimals without losing precision, coerce tuples and lists, and extend <code>JSONEncoder</code> or <code>JSONDecoder</code> to satisfy strict API contracts. Every option from the upstream package—<code>object_hook</code>, <code>object_pairs_hook</code>, <code>parse_float</code>, <code>parse_int</code>, and more—is available here so you can validate serialization logic end to end. You can also upload and use files or folders directly in your code for JSON processing and data workflows. This compiler is online and completely free to use.
          </p>

          <p class="text-base md:text-lg leading-relaxed">
            The included examples highlight practical techniques: serializing custom dataclasses, preserving Decimal precision, enforcing stable key order, turning ISO strings into datetime objects, filtering data before encoding, and creating light-weight helper utilities. These workflows are common in JSON APIs, config management, IoT telemetry, and automation scripts that demand predictable serialization.
          </p>

          <h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Who Should Use This</h3>
          <ul class="list-disc list-inside space-y-2 text-base md:text-lg ml-4">
            <li>Backend engineers shaping JSON APIs or RPC payloads</li>
            <li>Data engineers who need high-performance JSON parsing</li>
            <li>Automation scripts that normalize third-party payloads</li>
            <li>Developers requiring Decimal-safe serialization for finance</li>
            <li>Teams extending JSONEncoder/Decoder with custom hooks</li>
            <li>Students exploring how Python’s JSON stack works internally</li>
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
  name: 'SimplejsonPlayground'
})

definePageMeta({
  layout: 'library'
})

useHead({
  title: 'Online Python simplejson Compiler',
  meta: [
    { name: 'description', content: 'Fast JSON encoding and decoding with simplejson in your browser. Customize hooks, preserve Decimal precision, and extend JSONEncoder using Pyodide-powered Python.' },
    { name: 'keywords', content: 'simplejson, json, python json encoder, json decoder, online python compiler, pyodide' },
    { name: 'author', content: 'Pybadu' },
    { property: 'og:title', content: 'Online Python simplejson Compiler' },
    { property: 'og:description', content: 'Fast JSON encoding and decoding with simplejson in your browser' },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/pybadu.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Online Python simplejson Compiler' },
    { name: 'twitter:description', content: 'Fast JSON encoding and decoding with simplejson in your browser' },
    { name: 'twitter:image', content: '/pybadu.png' }
  ]
})

const examples = [
  {
    title: 'Basic Serialization',
    code: `import simplejson as sj

payload = {"foo": "bar", "count": 3}
print(sj.dumps(payload))

decoded = sj.loads('{"active": true, "score": 9.5}')
print(decoded)`
  },
  {
    title: 'Preserve Decimal Precision',
    code: `import simplejson as sj
from decimal import Decimal

totals = {"subtotal": Decimal("19.99"), "tax": Decimal("1.50")}

# Encode decimals precisely
encoded = sj.dumps(totals, use_decimal=True)
print(encoded)

# Parse floats as Decimal
decoded = sj.loads(encoded, parse_float=Decimal)
print(decoded)`
  },
  {
    title: 'Custom Default Hook',
    code: `import simplejson as sj
from datetime import datetime

class Order:
    def __init__(self, order_id, created):
        self.order_id = order_id
        self.created = created

def encode_default(obj):
    if isinstance(obj, datetime):
        return obj.isoformat()
    if isinstance(obj, Order):
        return {"order_id": obj.order_id, "created": obj.created}
    raise TypeError(f"{type(obj)} is not JSON serializable")

order = Order("A-42", datetime(2025, 1, 1, 10, 30))
json_text = sj.dumps(order, default=encode_default, indent=2)
print(json_text)`
  },
  {
    title: 'object_hook For Post Processing',
    code: `import simplejson as sj
from types import SimpleNamespace

raw = '{"user": {"name": "Ava", "active": true}}'

def hook(obj):
    if "name" in obj:
        return SimpleNamespace(**obj)
    return obj

result = sj.loads(raw, object_hook=hook)
print(result.user.name, result.user.active)`
  },
  {
    title: 'Stable Key Ordering & Pretty Print',
    code: `import simplejson as sj

data = {"z": 1, "a": 2, "k": 3}

print(sj.dumps(data, sort_keys=True, indent=2, separators=(",", ": ")))`
  },
  {
    title: 'Subclass JSONEncoder',
    code: `import simplejson as sj
from simplejson import JSONEncoder
from pathlib import Path

class PathEncoder(JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Path):
            return {"path": str(obj), "__type__": "Path"}
        return super().default(obj)

payload = {"home": Path("/home/pybadu")}
print(PathEncoder().encode(payload))`
  }
]

const defaultCode = `import simplejson as sj

data = {"foo": {"bar": 1}}
result = sj.dumps(data)
print(result)`

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
  
  downloadAsset,
  createAssetFolder
} = useLibraryPlayground({
  packageName: 'simplejson',
  defaultCode,
  examples,
  additionalPackages: [],
  setupCode: `
import simplejson as sj
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

