<template>
  <div>
    <div class="min-h-screen">
      <CodeEditor
        libraryName="num2words"
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
          Online Python num2words Compiler
        </h1>

        <div class="max-w-4xl mx-auto text-left space-y-6 text-gray-700 dark:text-gray-300">
          <p class="text-base md:text-lg leading-relaxed">
            num2words converts integers, decimals, and currency amounts into natural language text. It supports dozens of locales, cardinal/ordinal forms, spelled-out years, and currency-specific grammars, making it handy for invoices, accessibility output, voice prompts, and educational tools.[^1]
          </p>

          <p class="text-base md:text-lg leading-relaxed">
            This compiler bundles num2words in the browser so you can try locale tweaks and converter options instantly. Upload files and folders to work with local number data for conversion, experiment with `lang` fallbacks, switch between cardinal/ordinal/currency outputs, and verify complex numbers before pushing changes into billing systems or localization pipelines. This online compiler is completely free and requires no installation.
          </p>

          <p class="text-base md:text-lg leading-relaxed">
            The examples demonstrate typical workflows: basic conversions, ordinal text, localized output, currency formatting, error handling, and helper utilities for bulk processing. Use them to prototype document templates, generate narration text, or ensure consistent wording across multilingual apps.
          </p>

          <h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Who Should Use This</h3>
          <ul class="list-disc list-inside space-y-2 text-base md:text-lg ml-4">
            <li>Finance teams generating invoices or receipt summaries</li>
            <li>Voice interfaces needing spoken numbers in multiple languages</li>
            <li>Accessibility tooling that spells out amounts or dates</li>
            <li>Educators teaching number words across locales</li>
            <li>Developers validating localization rules for billing, lottery, or forms</li>
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
  name: 'Num2WordsPlayground'
})

definePageMeta({
  layout: 'library'
})

useHead({
  title: 'Online Python num2words Compiler',
  meta: [
    { name: 'description', content: 'Convert numbers to natural language text with num2words directly in your browser. Test languages, ordinals, and currency formats using Pyodide-powered Python.' },
    { name: 'keywords', content: 'num2words, numbers to words, python localization, currency text, online python compiler, pyodide' },
    { name: 'author', content: 'Pybadu' },
    { property: 'og:title', content: 'Online Python num2words Compiler' },
    { property: 'og:description', content: 'Convert numbers to natural language text directly in your browser' },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/pybadu.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Online Python num2words Compiler' },
    { name: 'twitter:description', content: 'Convert numbers to natural language text directly in your browser' },
    { name: 'twitter:image', content: '/pybadu.png' }
  ]
})

const examples = [
  {
    title: 'Basic Conversion',
    code: `from num2words import num2words

print(num2words(123))`
  },
  {
    title: 'Ordinal Output',
    code: `from num2words import num2words

print(num2words(42, to="ordinal"))
print(num2words(42, to="ordinal_num"))`
  },
  {
    title: 'Localized Languages',
    code: `from num2words import num2words

print(num2words(2024, lang="fr"))
print(num2words(2024, lang="es"))
print(num2words(2024, lang="id"))`
  },
  {
    title: 'Currency Formatting',
    code: `from num2words import num2words

print(num2words(24.10, to="currency", lang="en"))
print(num2words(24.10, to="currency", lang="es"))`
  },
  {
    title: 'Graceful Fallback',
    code: `from num2words import num2words

def safe_num2words(value, lang="en"):
    try:
        return num2words(value, lang=lang)
    except NotImplementedError:
        return num2words(value, lang="en")

print(safe_num2words(42, lang="xx"))`
  },
  {
    title: 'Bulk Helper Utility',
    code: `from num2words import num2words

def to_words_list(values, lang="en"):
    return [num2words(value, lang=lang) for value in values]

print(to_words_list([1, 2, 3]))`
  }
]

const defaultCode = `from num2words import num2words

print(num2words(123))`

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
  packageName: 'num2words',
  defaultCode,
  examples,
  additionalPackages: [],
  setupCode: `
from num2words import num2words
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

