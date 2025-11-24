<template>
  <div>
    <!-- Editor Area -->
    <div class="min-h-screen">
      <CodeEditor 
        libraryName="ShortUUID"
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
          Online Python ShortUUID Compiler
        </h1>
        
        <div class="max-w-4xl mx-auto text-left space-y-6 text-gray-700 dark:text-gray-300">
          <p class="text-base md:text-lg leading-relaxed">
            ShortUUID is a Python library that generates shorter, URL-safe UUIDs. Unlike standard UUIDs which are 36 characters long, ShortUUID creates compact identifiers that are perfect for use in URLs, database keys, and anywhere you need unique identifiers that are both shorter and URL-safe. The library provides a simple API for generating and working with these compact UUIDs while maintaining uniqueness and compatibility with standard UUIDs.
          </p>
          
          <p class="text-base md:text-lg leading-relaxed">
            This compiler includes <strong>ShortUUID</strong>, enabling you to generate shorter, URL-safe UUIDs directly in your browser. You can create compact unique identifiers, convert between standard UUIDs and short UUIDs, generate random short UUIDs, and work with custom alphabets. The platform provides all the tools you need for comprehensive UUID generation including URL-safe encoding, alphabet customization, and bidirectional conversion between standard and short UUID formats.
          </p>

          <p class="text-base md:text-lg leading-relaxed">
            Our comprehensive example collection covers essential UUID generation techniques including basic short UUID creation, generating multiple UUIDs, converting between standard and short UUIDs, using custom alphabets, and generating URL-safe identifiers. You'll also learn how to use short UUIDs in practical scenarios like generating unique IDs for database records, creating short links, and managing unique identifiers in web applications. The examples demonstrate practical applications commonly used in web development, database design, and distributed systems.
          </p>

          <h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Who Should Use This</h3>
          <ul class="list-disc list-inside space-y-2 text-base md:text-lg ml-4">
            <li>Web developers creating short URLs and unique identifiers</li>
            <li>Database designers needing compact primary keys</li>
            <li>API developers generating unique resource identifiers</li>
            <li>Developers building distributed systems requiring unique IDs</li>
            <li>Students learning about UUID generation and URL encoding</li>
            <li>Anyone needing shorter, URL-safe unique identifiers</li>
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
  name: 'ShortUUIDPlayground'
})

definePageMeta({
  layout: 'library'
})

useHead({
  title: 'Online Python ShortUUID Compiler',
  meta: [
    { name: 'description', content: 'Generate shorter, URL-safe UUIDs with Python ShortUUID in your browser. Create compact unique identifiers powered by Pyodide WebAssembly. No installation required.' },
    { name: 'keywords', content: 'shortuuid, uuid, unique identifier, url-safe uuid, short id, online python compiler, pyodide, python uuid' },
    { name: 'author', content: 'Pybadu' },
    { property: 'og:title', content: 'Online Python ShortUUID Compiler' },
    { property: 'og:description', content: 'Generate shorter, URL-safe UUIDs with Python ShortUUID in your browser' },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/pybadu.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Online Python ShortUUID Compiler' },
    { name: 'twitter:description', content: 'Generate shorter, URL-safe UUIDs with Python ShortUUID in your browser' },
    { name: 'twitter:image', content: '/pybadu.png' }
  ]
})

// Example code snippets
const examples = [
  {
    title: "Basic Short UUID Generation",
    code: `# Generate a short UUID
uuid = shortuuid.uuid()
print("Short UUID:", uuid)
print("Length:", len(uuid))

# Generate another one
uuid2 = shortuuid.uuid()
print("\\nAnother Short UUID:", uuid2)
print("Length:", len(uuid2))`
  },
  {
    title: "Multiple UUIDs",
    code: `# Generate multiple short UUIDs
print("Generating 5 short UUIDs:\\n")
for i in range(5):
    uuid = shortuuid.uuid()
    print(f"{i+1}. {uuid}")`
  },
  {
    title: "Convert Standard UUID to Short",
    code: `# Convert a standard UUID to short UUID
import uuid as std_uuid

# Create a standard UUID
standard_uuid = std_uuid.uuid4()
print("Standard UUID:", standard_uuid)

# Convert to short UUID
short = shortuuid.encode(standard_uuid)
print("Short UUID:", short)
print("Length comparison:")
print(f"  Standard: {len(str(standard_uuid))} characters")
print(f"  Short: {len(short)} characters")`
  },
  {
    title: "Convert Short UUID Back to Standard",
    code: `# Convert short UUID back to standard UUID
short = shortuuid.uuid()
print("Short UUID:", short)

# Decode back to standard UUID
standard = shortuuid.decode(short)
print("Standard UUID:", standard)
print("Type:", type(standard))`
  },
  {
    title: "Custom Alphabet",
    code: `# Use a custom alphabet for shorter IDs
# Default alphabet includes lowercase, uppercase, and digits
default_uuid = shortuuid.uuid()
print("Default alphabet UUID:", default_uuid)

# You can also use shorter alphabets
# Note: shorter alphabets may produce longer strings
print("\\nUUID length with default alphabet:", len(default_uuid))`
  },
  {
    title: "URL-Safe Identifiers",
    code: `# Generate URL-safe identifiers
# ShortUUID is URL-safe by default (no special characters)

url_ids = []
for i in range(3):
    uuid = shortuuid.uuid()
    url_ids.append(uuid)
    print(f"URL-safe ID {i+1}: {uuid}")

print("\\nExample URL:")
print(f"https://example.com/item/{url_ids[0]}")`
  }
]

const defaultCode = `# Generate a shorter, URL-safe UUID
# ShortUUID creates compact identifiers perfect for URLs and database keys

uuid = shortuuid.uuid()
print("Short UUID:", uuid)
print("Length:", len(uuid))

# Compare with standard UUID length (36 characters)
print("\\nStandard UUIDs are 36 characters long")
print("Short UUIDs are typically 22 characters long")`

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
  packageName: 'shortuuid',
  defaultCode,
  examples,
  additionalPackages: [],
  setupCode: `
import shortuuid
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

