<template>
  <div>
    <!-- Editor Area -->
    <div class="min-h-screen">
      <CodeEditor 
        libraryName="Dateparser"
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
          Online Python Dateparser Compiler
        </h1>
        
        <div class="max-w-4xl mx-auto text-left space-y-6 text-gray-700 dark:text-gray-300">
          <p class="text-base md:text-lg leading-relaxed">
            Dateparser is a Python library for parsing human-readable date and time expressions into timezone-aware <code>datetime</code> objects. It understands natural language phrases such as “tomorrow at 5pm”, “next Friday”, or “two weeks ago”, along with formatted dates in dozens of locales. Dateparser intelligently interprets incomplete information, applies configurable parsing preferences, and returns precise Python datetime values that you can use for scheduling, reminders, logging, and analytics.
          </p>
          
          <p class="text-base md:text-lg leading-relaxed">
            This compiler bundles Dateparser, allowing you to experiment with natural language date parsing directly in your browser. Upload files and folders to work with local date data, parse relative expressions, control preferred date order, work with multiple languages, auto-detect time zones, and search entire paragraphs for embedded dates. The playground exposes the full API including the dateparser.parse helper, advanced settings, and the search_dates utility for extracting multiple matches. This online compiler is completely free and requires no installation.
          </p>

          <p class="text-base md:text-lg leading-relaxed">
            The included examples demonstrate everyday workflows such as parsing reminders, handling localized input, working with timezone-aware outputs, configuring relative base dates, scanning text for multiple timestamps, and customizing parser settings. These patterns map directly to real-world use cases like chatbots, automation scripts, productivity tools, logging pipelines, and any system that accepts free-form date input.
          </p>

          <h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Who Should Use This</h3>
          <ul class="list-disc list-inside space-y-2 text-base md:text-lg ml-4">
            <li>Developers building reminder, calendar, or productivity apps</li>
            <li>Chatbot and AI builders interpreting natural language timestamps</li>
            <li>Automation engineers parsing dates from emails, logs, or tickets</li>
            <li>Data teams normalizing human-entered date fields</li>
            <li>Backend services accepting internationalized date input</li>
            <li>Students learning how to process human-friendly date text</li>
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
  name: 'DateparserPlayground'
})

definePageMeta({
  layout: 'library'
})

useHead({
  title: 'Online Python Dateparser Compiler',
  meta: [
    { name: 'description', content: 'Parse human-friendly dates with Python Dateparser in your browser. Convert natural language timestamps, extract dates from text, and handle locales using Pyodide WebAssembly.' },
    { name: 'keywords', content: 'dateparser, natural language dates, parse dates, datetime, online python compiler, pyodide' },
    { name: 'author', content: 'Pybadu' },
    { property: 'og:title', content: 'Online Python Dateparser Compiler' },
    { property: 'og:description', content: 'Parse human-friendly dates with Python Dateparser in your browser' },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/pybadu.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Online Python Dateparser Compiler' },
    { name: 'twitter:description', content: 'Parse human-friendly dates with Python Dateparser in your browser' },
    { name: 'twitter:image', content: '/pybadu.png' }
  ]
})

// Example code snippets
const examples = [
  {
    title: "Parse Relative Dates",
    code: `inputs = [
    "tomorrow at 5pm",
    "next friday 9:30",
    "in 3 weeks",
    "two hours ago"
]

for text in inputs:
    parsed = dateparser.parse(text)
    print(f"{text:<20} -> {parsed}")`
  },
  {
    title: "Localized Parsing",
    code: `phrases = [
    "mañana a las 10",
    "demain à midi",
    "morgen um 8 uhr",
]

languages = ['es', 'fr', 'de']

for phrase, lang in zip(phrases, languages):
    parsed = dateparser.parse(phrase, languages=[lang])
    print(f"{phrase} ({lang}) -> {parsed}")`
  },
  {
    title: "Search Dates In Text",
    code: `text = "Kickoff on 5 Jan 2025, follow-up next Monday at noon, final review in 2 weeks."
matches = search_dates(text)

for match, parsed in matches:
    print(f"Found '{match}' -> {parsed}")`
  },
  {
    title: "Timezone-Aware Results",
    code: `settings = {
    "RETURN_AS_TIMEZONE_AWARE": True,
    "TIMEZONE": "UTC",
    "TO_TIMEZONE": "Asia/Jakarta"
}

parsed = dateparser.parse("tomorrow 8am", settings=settings)
print("Original text: tomorrow 8am")
print("Timezone-aware:", parsed)
print("Timezone:", parsed.tzinfo)`
  },
  {
    title: "Custom Relative Base",
    code: `base = datetime(2025, 1, 10, 9, 0)
settings = { "RELATIVE_BASE": base }

phrases = ["next monday", "two days later", "friday 6pm"]
for phrase in phrases:
    parsed = dateparser.parse(phrase, settings=settings)
    print(f"{phrase:<15} -> {parsed}")`
  },
  {
    title: "Prefer Future Dates",
    code: `settings = { "PREFER_DATES_FROM": "future" }

phrases = ["Saturday", "Jan 5", "10/12"]
for phrase in phrases:
    parsed = dateparser.parse(phrase, settings=settings)
    print(f"{phrase:<10} -> {parsed}")`
  }
]

const defaultCode = `# Parse a human-friendly date expression
text = "tomorrow at 5pm"
parsed = dateparser.parse(text)

print("Input:", text)
print("Parsed datetime:", parsed)`

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
  refreshAssets,
  uploadAssets,
  deleteAsset,
  createAssetFolder,
  initializePyodide,
  cleanupWorker
} = useLibraryPlayground({
  packageName: 'dateparser',
  defaultCode,
  examples,
  additionalPackages: [],
  setupCode: `
import dateparser
from datetime import datetime
from dateparser.search import search_dates
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

