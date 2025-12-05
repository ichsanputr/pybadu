<template>
  <div>
    <div class="min-h-screen">
      <CodeEditor
        libraryName="html2text"
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
          Online Python html2text Compiler
        </h1>

        <div class="max-w-4xl mx-auto text-left space-y-6 text-gray-700 dark:text-gray-300">
          <p class="text-base md:text-lg leading-relaxed">
            html2text is a Python utility that converts HTML into clean Markdown-style text. It preserves semantic structure—headings, lists, emphasis, links, tables—while stripping scripts and styling, making it perfect for readable previews, email digests, and search indexing.[^1]
          </p>

          <p class="text-base md:text-lg leading-relaxed">
            This compiler loads html2text entirely in the browser so you can experiment with conversion options before wiring them into a pipeline. Upload files and folders to work with local HTML content, test different body widths, disable automatic links, keep line breaks, or tweak inline emphasis and see results instantly. This online compiler is completely free and requires no installation.
          </p>

          <p class="text-base md:text-lg leading-relaxed">
            Sample snippets cover the most common workflows: converting basic HTML, handling links and images, formatting lists and tables, customizing converters, stripping reference links, and preparing plain-text emails. Use them to sanitize rich content coming from CMS exports, newsletters, or scraped webpages.
          </p>

          <h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Who Should Use This</h3>
          <ul class="list-disc list-inside space-y-2 text-base md:text-lg ml-4">
            <li>Newsletter/email teams generating plain-text variants</li>
            <li>Static site and blogging platforms offering Markdown previews</li>
            <li>Developers indexing or diffing HTML content</li>
            <li>Automation scripts that need readable logs from HTML sources</li>
            <li>Students learning how HTML maps to Markdown structures</li>
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
  name: 'Html2TextPlayground'
})

definePageMeta({
  layout: 'library'
})

useHead({
  title: 'Online Python html2text Compiler',
  meta: [
    { name: 'description', content: 'Convert HTML to Markdown-style text with html2text directly in your browser. Tweak formatting options using Pyodide-powered Python.' },
    { name: 'keywords', content: 'html2text, html to markdown, plain text email, python html converter, online python compiler, pyodide' },
    { name: 'author', content: 'Pybadu' },
    { property: 'og:title', content: 'Online Python html2text Compiler' },
    { property: 'og:description', content: 'Convert HTML to Markdown-style text directly in your browser' },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/pybadu.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Online Python html2text Compiler' },
    { name: 'twitter:description', content: 'Convert HTML to Markdown-style text directly in your browser' },
    { name: 'twitter:image', content: '/pybadu.png' }
  ]
})

const examples = [
  {
    title: 'Basic Conversion',
    code: `import html2text

html = "<h1>Hello</h1><p>Welcome to <strong>Pybadu</strong>.</p>"
print(html2text.html2text(html))`
  },
  {
    title: 'Keep Line Breaks',
    code: `import html2text

converter = html2text.HTML2Text()
converter.body_width = 0
converter.single_line_break = True

html = "<p>Line one.<br>Line two.</p>"
print(converter.handle(html))`
  },
  {
    title: 'Disable Links',
    code: `import html2text

converter = html2text.HTML2Text()
converter.ignore_links = True

html = '<p><a href="https://example.com">Docs</a></p>'
print(converter.handle(html))`
  },
  {
    title: 'Lists And Tables',
    code: `import html2text

html = """
<ul><li>Item A</li><li>Item B</li></ul>
<table>
  <tr><th>Name</th><th>Score</th></tr>
  <tr><td>Ava</td><td>95</td></tr>
</table>
"""
print(html2text.html2text(html))`
  },
  {
    title: 'Images To Alt Text',
    code: `import html2text

html = '<p><img src="logo.png" alt="PyBadu Logo" /></p>'
print(html2text.html2text(html))`
  },
  {
    title: 'Custom Converter Function',
    code: `import html2text

def convert(html, width=60):
    converter = html2text.HTML2Text()
    converter.body_width = width
    converter.skip_internal_links = True
    return converter.handle(html)

sample = "<p>Internal <a href='#ref'>link</a> and external <a href='https://pybadu.com'>site</a>.</p>"
print(convert(sample))`
  }
]

const defaultCode = `import html2text

print(html2text.html2text("<h1>Hello</h1>"))`

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
  packageName: 'html2text',
  defaultCode,
  examples,
  additionalPackages: [],
  setupCode: `
import html2text
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

