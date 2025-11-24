<template>
  <div>
    <div class="min-h-screen">
      <CodeEditor
        libraryName="Pendulum"
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
        @createAssetFolder="createAssetFolder"
      />
    </div>

    <LibraryInfoSection>
      <div class="text-center mb-12">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Online Python Pendulum Compiler
        </h1>

        <div class="max-w-4xl mx-auto text-left space-y-6 text-gray-700 dark:text-gray-300">
          <p class="text-base md:text-lg leading-relaxed">
            Pendulum is a drop-in replacement for Python’s datetime module that makes timezone handling, duration math, and “humanized” output intuitive. It inherits from datetime, keeps every instance timezone-aware, and exposes batteries like `diff_for_humans()`, localization helpers, and natural language durations—ideal for scheduling, reporting, and UX-friendly timestamps.[^1]
          </p>

          <p class="text-base md:text-lg leading-relaxed">
            This compiler bundles Pendulum entirely in the browser so you can experiment with timezone conversions, period arithmetic, and locale-friendly formatting without installing dependencies or configuring environments. Upload files and folders to work with local datetime data, inspect DST transitions, compare deltas, parse ISO strings, and prototype dashboards or reminders before deploying to production. This online compiler is completely free and requires no installation.
          </p>

          <p class="text-base md:text-lg leading-relaxed">
            The examples demonstrate common workflows: creating datetimes, shifting timezones, formatting for humans, calculating durations, parsing strings, and generating ranges. Use them to validate cron logic, teach datetime topics, or verify timezone-sensitive features while keeping feedback loops instant.
          </p>

          <h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Who Should Use This</h3>
          <ul class="list-disc list-inside space-y-2 text-base md:text-lg ml-4">
            <li>Product teams building scheduling, reminders, or calendar views</li>
            <li>Data analysts comparing timestamps across regions</li>
            <li>Backend engineers managing timezone-aware APIs</li>
            <li>UX teams presenting “time ago” copy in multiple locales</li>
            <li>Students learning advanced datetime manipulation</li>
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
  name: 'PendulumPlayground'
})

definePageMeta({
  layout: 'library'
})

useHead({
  title: 'Online Python Pendulum Compiler',
  meta: [
    { name: 'description', content: 'Work with timezone-aware datetimes using Pendulum directly in your browser. Convert timezones, format durations, and parse strings with Pyodide-powered Python.' },
    { name: 'keywords', content: 'pendulum, datetime, timezone, python dates, diff_for_humans, online python compiler, pyodide' },
    { name: 'author', content: 'Pybadu' },
    { property: 'og:title', content: 'Online Python Pendulum Compiler' },
    { property: 'og:description', content: 'Work with timezone-aware datetimes using Pendulum directly in your browser' },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/pybadu.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Online Python Pendulum Compiler' },
    { name: 'twitter:description', content: 'Work with timezone-aware datetimes using Pendulum directly in your browser' },
    { name: 'twitter:image', content: '/pybadu.png' }
  ]
})

const examples = [
  {
    title: 'Current Time In Zone',
    code: `import pendulum

now_paris = pendulum.now("Europe/Paris")
print(now_paris)`
  },
  {
    title: 'Timezone Conversion',
    code: `import pendulum

meeting = pendulum.datetime(2025, 2, 4, 9, 0, tz="Asia/Jakarta")
print("Jakarta:", meeting)
print("New York:", meeting.in_timezone("America/New_York"))`
  },
  {
    title: 'Human Friendly Differences',
    code: `import pendulum

past = pendulum.now().subtract(minutes=5)
print(past.diff_for_humans())`
  },
  {
    title: 'Durations And Arithmetic',
    code: `import pendulum

start = pendulum.datetime(2025, 1, 1, tz="UTC")
end = start.add(days=10, hours=3)
delta = end - start
print(delta)
print(delta.in_words(locale="en"))`
  },
  {
    title: 'Parsing Strings',
    code: `import pendulum

dt = pendulum.parse("2025-05-20T15:30:00Z")
print(dt.to_day_datetime_string())`
  },
  {
    title: 'Range Generation',
    code: `import pendulum

start = pendulum.datetime(2025, 1, 1, tz="UTC")
for dt in pendulum.period(start, start.add(days=3)).range("days"):
    print(dt)`
  }
]

const defaultCode = `import pendulum

print(pendulum.now().add(days=3))`

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
  packageName: 'pendulum',
  defaultCode,
  examples,
  additionalPackages: [],
  setupCode: `
import pendulum
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

