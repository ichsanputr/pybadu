<template>
  <div>
    <div class="min-h-screen">
      <CodeEditor
        libraryName="validators"
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

    <LibraryInfoSection>
      <div class="text-center mb-12">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Online Python validators Compiler
        </h1>

        <div class="max-w-4xl mx-auto text-left space-y-6 text-gray-700 dark:text-gray-300">
          <p class="text-base md:text-lg leading-relaxed">
            validators is a lightweight, schema-free validation toolbox that covers common inputs like emails, URLs, IP addresses, credit cards, slugs, and UUIDs. Each helper returns a boolean or ValidationFailure, so you can validate single values without defining forms, models, or declarative schemas.[^1]
          </p>

          <p class="text-base md:text-lg leading-relaxed">
            This compiler bundles validators in the browser so you can prototype validation logic, test edge cases, and compare options instantly. Upload files and folders to work with local data for validation, check whether strings are RFC-compliant emails, detect disposable domains, verify IPv4/IPv6, ensure URLs include schemes, or customize error messages before wiring them into APIs, CLIs, or data-ingestion pipelines. This online compiler is completely free and requires no installation.
          </p>

          <p class="text-base md:text-lg leading-relaxed">
            The included snippets show practical workflows: validating emails and URLs, inspecting ValidationFailure objects, building helper wrappers, bulk-validating lists, creating custom validators, and combining checks for signup flows. Use them to harden forms, sanitize ETL input, or teach validation best practices.
          </p>

          <h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Who Should Use This</h3>
          <ul class="list-disc list-inside space-y-2 text-base md:text-lg ml-4">
            <li>Backend teams validating request payloads or configs</li>
            <li>Automation engineers cleaning CSVs, spreadsheets, or logs</li>
            <li>Security-minded developers blocking malformed or malicious input</li>
            <li>Product teams prototyping signup and onboarding flows</li>
            <li>Students practicing Python-friendly data validation techniques</li>
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
  name: 'ValidatorsPlayground'
})

definePageMeta({
  layout: 'library'
})

useHead({
  title: 'Online Python validators Compiler',
  meta: [
    { name: 'description', content: 'Validate emails, URLs, IPs, credit cards, UUIDs, and more using the validators package directly in your browser.' },
    { name: 'keywords', content: 'validators, email validation, url validation, python validation, online python compiler, pyodide' },
    { name: 'author', content: 'Pybadu' },
    { property: 'og:title', content: 'Online Python validators Compiler' },
    { property: 'og:description', content: 'Validate emails, URLs, IPs, credit cards, UUIDs, and more in your browser' },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/pybadu.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Online Python validators Compiler' },
    { name: 'twitter:description', content: 'Validate emails, URLs, IPs, credit cards, UUIDs, and more in your browser' },
    { name: 'twitter:image', content: '/pybadu.png' }
  ]
})

const examples = [
  {
    title: 'Email Validation',
    code: `import validators

tests = ["user@example.com", "bad@email", "foo@spam..com"]
for value in tests:
    print(value, validators.email(value))`
  },
  {
    title: 'Inspect ValidationFailure',
    code: `import validators

result = validators.url("ftp://example.com", public=True)
if result is True:
    print("valid URL")
else:
    print("invalid:", result.message)`
  },
  {
    title: 'Batch Validate URLs',
    code: `import validators

urls = [
    "https://pybadu.com",
    "http://localhost:8000",
    "not a url"
]

valid = [u for u in urls if validators.url(u)]
print("Valid URLs:", valid)`
  },
  {
    title: 'Custom Helper Wrapper',
    code: `import validators

def ensure_email(value):
    result = validators.email(value)
    if result is True:
        return value
    raise ValueError("Invalid email")

print(ensure_email("team@pybadu.com"))`
  },
  {
    title: 'Combine Multiple Checks',
    code: `import validators

def validate_signup(email, website):
    return validators.email(email) is True and validators.url(website) is True

print(validate_signup("hi@pybadu.com", "https://pybadu.com"))
print(validate_signup("bad", "nope"))`
  },
  {
    title: 'Validate IP And UUID',
    code: `import validators

print("IPv4:", validators.ipv4("192.168.1.1"))
print("IPv6:", validators.ipv6("2001:db8::1"))
print("UUID:", validators.uuid("123e4567-e89b-12d3-a456-426614174000"))`
  }
]

const defaultCode = `import validators

print(validators.email("test@gmail.com"))`

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
  packageName: 'validators',
  defaultCode,
  examples,
  additionalPackages: [],
  setupCode: `
import validators
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

