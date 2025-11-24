<template>
  <div>
    <div class="min-h-screen">
      <CodeEditor
        libraryName="Bleach"
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
          Online Python Bleach Compiler
        </h1>

        <div class="max-w-4xl mx-auto text-left space-y-6 text-gray-700 dark:text-gray-300">
          <p class="text-base md:text-lg leading-relaxed">
            Bleach is Mozilla’s well-maintained HTML sanitization library built on top of html5lib. It strips or escapes malicious markup, enforces safe allowlists for tags/attributes, filters CSS, and neutralizes scripts to keep user-generated content safe inside templates, blogs, forums, or CMS systems.
          </p>

          <p class="text-base md:text-lg leading-relaxed">
            This compiler ships Bleach directly in the browser so you can test sanitization policies without a local server. Paste HTML, tweak allowed tags or attributes, register linkify callbacks, and compare cleaned vs. raw output instantly. It’s a handy sandbox for validating WYSIWYG inputs, Markdown converters, or API payloads before deploying rules into production.
          </p>

          <p class="text-base md:text-lg leading-relaxed">
            We’ve included examples demonstrating default cleaning, custom allowlists, CSS filtering, linkifying plain text, building custom callbacks, and safely embedding user content. Use them to harden comment sections, preview moderation filters, or teach security concepts around untrusted HTML.
          </p>

          <h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Who Should Use This</h3>
          <ul class="list-disc list-inside space-y-2 text-base md:text-lg ml-4">
            <li>Frontend and backend teams sanitizing user-generated HTML</li>
            <li>Security engineers validating XSS protections and allowlists</li>
            <li>Content platform builders (forums, docs, blogs, CMSs)</li>
            <li>Framework users integrating Bleach with Jinja2, Django, or Flask</li>
            <li>Educators teaching web security basics with practical demos</li>
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
  name: 'BleachPlayground'
})

definePageMeta({
  layout: 'library'
})

useHead({
  title: 'Online Python Bleach Compiler',
  meta: [
    { name: 'description', content: 'Sanitize untrusted HTML with Bleach directly in your browser. Test allowlists, linkify, and CSS filtering using Pyodide-powered Python.' },
    { name: 'keywords', content: 'bleach, html sanitizer, python security, xss protection, online python compiler, pyodide' },
    { name: 'author', content: 'Pybadu' },
    { property: 'og:title', content: 'Online Python Bleach Compiler' },
    { property: 'og:description', content: 'Sanitize untrusted HTML with Bleach directly in your browser' },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/pybadu.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Online Python Bleach Compiler' },
    { name: 'twitter:description', content: 'Sanitize untrusted HTML with Bleach directly in your browser' },
    { name: 'twitter:image', content: '/pybadu.png' }
  ]
})

const examples = [
  {
    title: 'Basic Cleaning',
    code: `import bleach

dirty = "<p>Hello<script>alert(1)</script></p>"
print(bleach.clean(dirty))`
  },
  {
    title: 'Custom Allowed Tags',
    code: `import bleach

dirty = '<p><em>Hello</em> <a href="http://example.com">link</a></p>'
print(bleach.clean(dirty, tags=["p", "a"], attributes={"a": ["href"]}))`
  },
  {
    title: 'Sanitize CSS',
    code: `import bleach

html = '<p style="color:red; position:absolute">Hi</p>'
print(bleach.clean(html, strip=True, css_sanitizer=bleach.CSSSanitizer(allowed_css_properties=["color"])))`
  },
  {
    title: 'Linkify Plain Text',
    code: `import bleach

text = "Visit http://example.com or https://pybadu.com"
print(bleach.linkify(text))`
  },
  {
    title: 'Custom Callbacks',
    code: `import bleach
from bleach.linkifier import Linker

def rel_noopener(attrs, new=False):
    attrs["rel"] = "noopener"
    return attrs

linker = Linker(callbacks=[rel_noopener])
print(linker.linkify("Docs at https://bleach.readthedocs.io"))`
  },
  {
    title: 'Strip Everything Unsafe',
    code: `import bleach

html = "<div onclick=\\"alert(1)\\">click me</div>"
print(bleach.clean(html, tags=[], attributes={}, strip=True))`
  }
]

const defaultCode = `import bleach

dirty = "<script>bad()</script>"
print(bleach.clean(dirty))`

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
  packageName: 'bleach',
  defaultCode,
  examples,
  additionalPackages: [],
  setupCode: `
import bleach
from bleach.linkifier import Linker
from bleach.css_sanitizer import CSSSanitizer
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

