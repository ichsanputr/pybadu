<template>
  <div>
    <!-- Editor Area -->
    <div class="min-h-screen">
      <CodeEditor libraryName="JMESPath" :theme="theme" :files="files" :activeFileId="activeFileId"
        :code="currentFileContent" :output="output" :isLoading="isLoading" :pyodideReady="pyodideReady"
        :monacoTheme="monacoTheme" :examples="examples" :assets="assets" :assetsUploading="assetsUploading"
        @update:code="updateCurrentFile" @toggleTheme="toggleTheme" @runCode="runCode" @clearCode="clearCode"
        @clearOutput="clearOutput" @loadExample="loadExample" @newFile="createNewFile" @selectFile="selectFile"
        @deleteFile="deleteFile" @renameFile="renameFile" @saveToStorage="saveToStorage" @uploadAssets="uploadAssets"
        @deleteAsset="deleteAsset" @downloadAsset="downloadAsset" @refreshAssets="refreshAssets"
        @createAssetFolder="createAssetFolder" />
    </div>

    <!-- Information Section -->
    <LibraryInfoSection>
      <div class="text-center mb-12">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Online Python JMESPath Compiler
        </h1>

        <div class="max-w-4xl mx-auto text-left space-y-6 text-gray-700 dark:text-gray-300">
          <p class="text-base md:text-lg leading-relaxed">
            JMESPath is a declarative query language for JSON, similar to XPath but designed specifically for structured
            JSON data. You express what you want to retrieve, and the engine efficiently extracts it—handling nesting,
            arrays, filters, projections, and built-in functions in a single expression. It ships with concise syntax
            for traversing deeply nested objects, reshaping payloads, and computing derived values without writing
            imperative parsing code.
          </p>

          <p class="text-base md:text-lg leading-relaxed">
            This playground bundles jmespath so you can explore queries entirely in the browser using Pyodide. Upload
            files and folders to work with local JSON data, load sample payloads, refine expressions, and print the JSON
            result instantly. Experiment with filters, wildcards, slicing, function pipelines like max_by or sort_by,
            and multi-select projections in a safe sandbox without touching your backend. This online compiler is
            completely free and requires no installation.
          </p>

          <p class="text-base md:text-lg leading-relaxed">
            The curated examples cover everyday tasks: grabbing nested keys, filtering arrays, flattening collections,
            summarizing data, running function-based aggregations, and building reusable helper utilities. These
            techniques map directly to tooling such as AWS CLI output parsing, log processors, ETL scripts, API
            integrations, and any automation that needs predictable JSON querying.
          </p>

          <h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Who Should Use This</h3>
          <ul class="list-disc list-inside space-y-2 text-base md:text-lg ml-4">
            <li>Cloud engineers parsing AWS CLI or SDK JSON responses</li>
            <li>Backend developers transforming API payloads</li>
            <li>Automation and scripting workflows that query structured logs</li>
            <li>Data engineers who need lightweight JSON extraction in ETL jobs</li>
            <li>Students learning declarative querying over JSON structures</li>
            <li>QA teams crafting assertions against JSON fixtures</li>
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
  name: 'JMESPathPlayground'
})

definePageMeta({
  layout: 'library'
})

useHead({
  title: 'Online Python JMESPath Compiler',
  meta: [
    { name: 'description', content: 'Query JSON with the JMESPath expression language directly in your browser. Test filters, projections, and functions using Pyodide-powered Python.' },
    { name: 'keywords', content: 'jmespath, json query, python json, online python compiler, pyodide' },
    { name: 'author', content: 'Pybadu' },
    { property: 'og:title', content: 'Online Python JMESPath Compiler' },
    { property: 'og:description', content: 'Query JSON with the JMESPath expression language directly in your browser' },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/pybadu.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Online Python JMESPath Compiler' },
    { name: 'twitter:description', content: 'Query JSON with the JMESPath expression language directly in your browser' },
    { name: 'twitter:image', content: '/pybadu.png' }
  ]
})

const examples = [
  {
    title: 'Basic Search',
    code: `import jmespath

data = {"foo": {"bar": 1}}
expr = "foo.bar"

result = jmespath.search(expr, data)
print(result)`
  },
  {
    title: 'Filter Books By Price',
    code: `import jmespath

store = {
    "book": [
        {"title": "Clean Code", "price": 30},
        {"title": "Effective Python", "price": 22},
        {"title": "Learn SQL", "price": 15}
    ]
}

expr = "book[?price > \`20\`].title"
print(jmespath.search(expr, store))`
  },
  {
    title: 'Project Fields From Collection',
    code: `import jmespath

people = {
    "employees": [
        {"name": "Ava", "dept": "Data"},
        {"name": "Noah", "dept": "Infra"},
        {"name": "Mia", "dept": "Security"}
    ]
}

expr = "employees[].{person:name, team:dept}"
print(jmespath.search(expr, people))`
  },
  {
    title: 'Use Built-in Functions',
    code: `import jmespath

inventory = {
    "items": [
        {"name": "laptop", "stock": 3},
        {"name": "monitor", "stock": 8},
        {"name": "keyboard", "stock": 20}
    ]
}

expr = "max_by(items, &stock)"
print(jmespath.search(expr, inventory))`
  },
  {
    title: 'Slice Arrays And Combine',
    code: `import jmespath

payload = {"values": [10, 20, 30, 40, 50]}

expr = "values[1:4]"
print(jmespath.search(expr, payload))

expr = "sum(values)"
print("sum:", jmespath.search(expr, payload))`
  },
  {
    title: 'Reusable Helper Function',
    code: `import jmespath

def ensure(expr, data, default=None):
    result = jmespath.search(expr, data)
    return default if result is None else result

payload = {"meta": {"request_id": "abc-123"}}

print(ensure("meta.request_id", payload, default="missing"))
print(ensure("meta.trace_id", payload, default="missing"))`
  }
]

const defaultCode = `import jmespath

payload = {"foo": {"bar": 1}}
expression = "foo.bar"

result = jmespath.search(expression, payload)
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
  refreshAssets,
  uploadAssets,
  deleteAsset,

  downloadAsset,
  createAssetFolder,
  initializePyodide,
  cleanupWorker
} = useLibraryPlayground({
  packageName: 'jmespath',
  defaultCode,
  examples,
  additionalPackages: [],
  setupCode: `
import jmespath
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
