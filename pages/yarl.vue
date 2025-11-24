<template>
  <div>
    <!-- Editor Area -->
    <div class="min-h-screen">
      <CodeEditor 
        libraryName="Yarl"
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
          Online Python Yarl Compiler
        </h1>
        
        <div class="max-w-4xl mx-auto text-left space-y-6 text-gray-700 dark:text-gray-300">
          <p class="text-base md:text-lg leading-relaxed">
            Yarl is a powerful Python library for parsing, constructing, and manipulating URLs in an immutable and convenient manner. It provides a comprehensive `URL` class that allows developers to handle all components of a URL including scheme, host, path, query parameters, and fragments with ease. Unlike string-based URL manipulation, Yarl offers type-safe operations and automatic encoding/decoding, making it ideal for web development, API clients, and URL processing tasks.
          </p>
          
          <p class="text-base md:text-lg leading-relaxed">
            This compiler includes <strong>Yarl</strong>, enabling you to parse and build URLs directly in your browser. The library provides immutable URL objects, meaning any modification creates a new URL object while preserving the original. You can easily access URL components, modify paths, add or remove query parameters, join URLs, and handle percent-encoding automatically. The platform provides all the tools you need for comprehensive URL manipulation including component access, path joining, query parameter management, and URL building from scratch. You can also upload and use files or folders directly in your code for URL processing and web development workflows. This compiler is online and completely free to use.
          </p>

          <p class="text-base md:text-lg leading-relaxed">
            Our comprehensive example collection covers essential URL manipulation techniques including basic URL parsing, accessing URL components, modifying URLs with different methods, building URLs from components, working with query parameters, and joining URLs. You'll also learn how to use Yarl for API endpoint construction, URL validation, query parameter manipulation, and creating human-readable URL representations. The examples demonstrate practical applications commonly used in web scraping, API development, HTTP client libraries, and URL routing systems.
          </p>

          <h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Who Should Use This</h3>
          <ul class="list-disc list-inside space-y-2 text-base md:text-lg ml-4">
            <li>Web developers building API clients and HTTP libraries</li>
            <li>Backend developers handling URL routing and parsing</li>
            <li>Web scrapers constructing and manipulating URLs</li>
            <li>API developers building dynamic endpoints with query parameters</li>
            <li>Students learning URL manipulation and web development</li>
            <li>Anyone working with URLs who needs safe and convenient parsing</li>
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
  name: 'YarlPlayground'
})

definePageMeta({
  layout: 'library'
})

useHead({
  title: 'Online Python Yarl Compiler',
  meta: [
    { name: 'description', content: 'Parse and build URLs with Python Yarl in your browser. URL manipulation, query parameters, and path operations powered by Pyodide WebAssembly. No installation required.' },
    { name: 'keywords', content: 'yarl, url parser, url builder, url manipulation, query parameters, online python compiler, pyodide, python url' },
    { name: 'author', content: 'Pybadu' },
    { property: 'og:title', content: 'Online Python Yarl Compiler' },
    { property: 'og:description', content: 'Parse and build URLs with Python Yarl in your browser' },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/pybadu.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Online Python Yarl Compiler' },
    { name: 'twitter:description', content: 'Parse and build URLs with Python Yarl in your browser' },
    { name: 'twitter:image', content: '/pybadu.png' }
  ]
})

// Example code snippets
const examples = [
  {
    title: "Basic URL Parsing",
    code: `# Parse a URL and access its components
url = URL('https://www.python.org/~guido?arg=1#frag')

print("Full URL:", url)
print("Scheme:", url.scheme)
print("Host:", url.host)
print("Path:", url.path)
print("Query String:", url.query_string)
print("Fragment:", url.fragment)`
  },
  {
    title: "Accessing URL Components",
    code: `# Access various URL components
url = URL('https://user:pass@example.com:8080/path/to/page?key=value&foo=bar#section')

print("Scheme:", url.scheme)
print("User:", url.user)
print("Password:", url.password)
print("Host:", url.host)
print("Port:", url.port)
print("Path:", url.path)
print("Query:", url.query)
print("Fragment:", url.fragment)
print("Authority:", url.authority)`
  },
  {
    title: "Modifying URLs",
    code: `# Create new URLs by modifying existing ones
base_url = URL('https://example.com/api/v1')

# Change path
new_path = base_url.with_path('/api/v2/users')
print("New path:", new_path)

# Add query parameters
with_query = base_url.with_query({'page': 1, 'limit': 10})
print("With query:", with_query)

# Change fragment
with_fragment = base_url.with_fragment('section1')
print("With fragment:", with_fragment)`
  },
  {
    title: "Building URLs from Components",
    code: `# Build a URL from components
url = URL.build(
    scheme='https',
    host='api.example.com',
    path='/users',
    query={'id': 123, 'format': 'json'}
)

print("Built URL:", url)
print("Full URL string:", str(url))`
  },
  {
    title: "Query Parameter Manipulation",
    code: `# Work with query parameters
url = URL('https://example.com/search?q=python&page=1')

# Access query as dict
print("Query dict:", url.query)

# Update query parameters
new_url = url.update_query({'page': 2, 'sort': 'date'})
print("Updated query:", new_url)

# Remove query parameter
no_page = url.with_query(url.query.copy())
del no_page.query['page']
print("Without page:", no_page)`
  },
  {
    title: "Joining URLs",
    code: `# Join URLs and paths
base = URL('https://example.com/api')

# Join with path
joined = base / 'v1' / 'users' / '123'
print("Joined path:", joined)

# Join with another URL
other = URL('/posts/456')
result = base.join(other)
print("Joined URL:", result)

# Join with relative path
relative = base / '../v2' / 'items'
print("Relative join:", relative)`
  }
]

const defaultCode = `# Parse and manipulate URLs with Yarl
# Yarl provides immutable URL objects for safe URL manipulation

# Parse a URL
url = URL('https://www.example.com/path/to/page?param1=value1&param2=value2#section')

# Access URL components
print("Scheme:", url.scheme)
print("Host:", url.host)
print("Path:", url.path)
print("Query:", url.query)
print("Fragment:", url.fragment)

# Modify the URL (creates a new URL object)
new_url = url.with_path('/new/path').with_query({'new': 'param'})
print("\\nModified URL:", new_url)`

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
  packageName: 'yarl',
  defaultCode,
  examples,
  additionalPackages: [],
  setupCode: `
from yarl import URL
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

