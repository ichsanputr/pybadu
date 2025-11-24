<template>
  <div>
    <div class="min-h-screen">
      <CodeEditor
        libraryName="sortedcontainers"
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
        @saveToStorage="saveToStorage"
      />
    </div>

    <LibraryInfoSection>
      <div class="text-center mb-12">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Online Python sortedcontainers Compiler
        </h1>

        <div class="max-w-4xl mx-auto text-left space-y-6 text-gray-700 dark:text-gray-300">
          <p class="text-base md:text-lg leading-relaxed">
            sortedcontainers is a pure-Python collection of SortedList, SortedDict, and SortedSet types that stay ordered while offering operations faster than linear time. It delivers C-extension level performance without compilation, keeps APIs close to built-in lists/dicts/sets, and powers projects ranging from trading systems to async frameworks thanks to its memory-efficient block architecture.[^1]
          </p>

          <p class="text-base md:text-lg leading-relaxed">
            This compiler loads the full <strong>sortedcontainers</strong> toolkit so you can prototype sorted collections entirely in the browser. Create lists that auto-order inserts, maintain key-sorted dictionaries, slice ranked subsets, bisect search ranges, and benchmark workloads such as maintaining rolling leaderboards or scheduling priority queues without touching your local environment.
          </p>

          <p class="text-base md:text-lg leading-relaxed">
            The bundled snippets walk through everyday scenarios: inserting while sorted, using bisect helpers, popping by index, mirroring tree-map behavior with SortedDict, combining SortedSet operations, merging two ordered streams, and measuring comparative performance. Adapt them to validate algorithm ideas, verify complexity claims, or teach data-structure fundamentals.
          </p>

          <h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Who Should Use This</h3>
          <ul class="list-disc list-inside space-y-2 text-base md:text-lg ml-4">
            <li>Backend engineers building ranking, scheduling, or priority systems</li>
            <li>Quant and trading teams maintaining rolling windows of market data</li>
            <li>Data engineers needing ordered dictionaries for ETL pipelines</li>
            <li>Security and telemetry tooling that stores ordered sets of events</li>
            <li>Students learning balanced-tree alternatives in pure Python</li>
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
  name: 'SortedContainersPlayground'
})

definePageMeta({
  layout: 'library'
})

useHead({
  title: 'Online Python sortedcontainers Compiler',
  meta: [
    { name: 'description', content: 'Experiment with SortedList, SortedDict, and SortedSet from sortedcontainers directly in your browser. Maintain ordered collections, run bisect searches, and benchmark operations using Pyodide.' },
    { name: 'keywords', content: 'sortedcontainers, SortedList, SortedDict, SortedSet, sorted collections, online python compiler, pyodide' },
    { name: 'author', content: 'Pybadu' },
    { property: 'og:title', content: 'Online Python sortedcontainers Compiler' },
    { property: 'og:description', content: 'Experiment with SortedList, SortedDict, and SortedSet directly in your browser' },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/pybadu.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Online Python sortedcontainers Compiler' },
    { name: 'twitter:description', content: 'Experiment with SortedList, SortedDict, and SortedSet directly in your browser' },
    { name: 'twitter:image', content: '/pybadu.png' }
  ]
})

const examples = [
  {
    title: 'Maintain SortedList',
    code: `from sortedcontainers import SortedList

scores = SortedList([42, 13, 27])
scores.add(35)
scores.add(18)
print("Scores:", list(scores))
print("Top 3:", scores[-3:])
print("Index of 27:", scores.index(27))`
  },
  {
    title: 'Bisect Searches',
    code: `from sortedcontainers import SortedList

nums = SortedList([5, 10, 15, 20, 25])
print("<= 17 stops at:", nums.bisect_right(17))
print(">= 10 starts at:", nums.bisect_left(10))
print("Range 10-20:", nums[nums.bisect_left(10):nums.bisect_right(20)])`
  },
  {
    title: 'SortedDict As Tree Map',
    code: `from sortedcontainers import SortedDict

tasks = SortedDict({
    5: "Bug fix",
    1: "Pager alert",
    3: "Deploy"
})

tasks[2] = "Code review"
print("By priority:", list(tasks.items()))
print("Highest priority:", tasks.peekitem(0))
print("Pop last:", tasks.popitem(-1))`
  },
  {
    title: 'SortedSet Operations',
    code: `from sortedcontainers import SortedSet

users_a = SortedSet(["ava", "noah", "mia"])
users_b = SortedSet(["li", "mia", "zoe"])

print("Union:", list(users_a | users_b))
print("Intersection:", list(users_a & users_b))
print("First >= 'n':", users_a.bisect_left('n'))`
  },
  {
    title: 'Merge Two Streams',
    code: `from sortedcontainers import SortedList

incoming = SortedList()

def push_batch(batch):
    incoming.update(batch)
    print("Window:", list(incoming)[-5:])

push_batch([8, 2, 5])
push_batch([7, 11, 3])
push_batch([4, 9])`
  },
  {
    title: 'Measure Operation Cost',
    code: `import time
from sortedcontainers import SortedList

items = SortedList(range(10000))

start = time.time()
for n in range(1000):
    items.add(n)
end = time.time()

print("Inserted 1000 items in", round(end - start, 4), "seconds")`
  }
]

const defaultCode = `from sortedcontainers import SortedList

sl = SortedList([3, 1, 2])
print(sl)`

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
  packageName: 'sortedcontainers',
  defaultCode,
  examples,
  additionalPackages: [],
  setupCode: `
from sortedcontainers import SortedList, SortedDict, SortedSet
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

