<template>
  <div>
    <!-- Editor Area -->
    <div class="sm:min-h-screen">
      <CodeEditor 
        libraryName="MarkupSafe"
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
        @createAssetFolder="createAssetFolder" />

    </div>

    <!-- Information Section -->
    <LibraryInfoSection>
      <div class="text-center mb-12">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Online Python MarkupSafe Compiler
        </h1>
        
        <div class="max-w-4xl mx-auto text-left space-y-6 text-gray-700 dark:text-gray-300">
          <p class="text-base md:text-lg leading-relaxed">
            MarkupSafe is a Python library that implements a text object that escapes characters so it is safe to use in HTML and XML. 
            Characters that have special meanings in markup languages are replaced so that they display as the actual characters rather 
            than being interpreted as markup. This mitigates injection attacks, meaning untrusted user input can safely be displayed on 
            a web page without risk of XSS (Cross-Site Scripting) attacks or other security vulnerabilities.
          </p>
          
          <p class="text-base md:text-lg leading-relaxed">
            This compiler includes <strong>MarkupSafe 3.0+</strong> with full support for HTML and XML escaping, powered by Pyodide 
            WebAssembly technology. MarkupSafe provides the escape() function to safely escape untrusted strings and the Markup 
            class to mark trusted strings as safe. The library is a core dependency of many web frameworks including Flask and Jinja2, 
            making it essential for web development security. Whether you're building web applications, processing user input, generating 
            HTML templates, or working with untrusted data, our MarkupSafe playground offers instant execution with comprehensive 
            security features. You can escape HTML/XML special characters, mark strings as safe, use Markup objects in string operations, 
            and protect your applications from injection attacks. You can also upload and use files or folders directly in your code for 
            text processing workflows. This compiler is online and completely free to use.
          </p>

          <p class="text-base md:text-lg leading-relaxed">
            Our example collection covers essential MarkupSafe topics including basic HTML escaping, using Markup objects, string 
            formatting with safe strings, escaping user input, and protecting web applications from XSS attacks. You'll learn how to 
            safely handle untrusted strings, mark trusted content as safe, and integrate MarkupSafe into web applications for secure 
            text rendering.
          </p>

          <h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Who Should Use This</h3>
          <ul class="list-disc list-inside space-y-2 text-base md:text-lg ml-4">
            <li>Web developers building applications that display user-generated content</li>
            <li>Flask and Jinja2 developers working with template rendering and user input</li>
            <li>Security-conscious developers preventing XSS and injection attacks</li>
            <li>Backend developers processing and sanitizing untrusted text data</li>
            <li>Full-stack developers ensuring safe HTML/XML output in web applications</li>
            <li>Students learning web security and safe text handling practices</li>
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
  name: 'MarkupSafePlayground'
})

definePageMeta({
  layout: 'library'
})

useHead({
  title: 'Online Python MarkupSafe Compiler',
  meta: [
    { name: 'description', content: 'Safely escape HTML and XML with Python MarkupSafe in your browser. Prevent XSS attacks and handle untrusted strings securely powered by Pyodide WebAssembly. No installation required.' },
    { name: 'keywords', content: 'markupsafe, html escaping, xss prevention, web security, safe strings, online compiler, pyodide, flask jinja2' },
    { name: 'author', content: 'Pybadu' },
    { property: 'og:title', content: 'Online Python MarkupSafe Compiler' },
    { property: 'og:description', content: 'Safely escape HTML and XML with Python MarkupSafe in your browser' },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/pybadu.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Online Python MarkupSafe Compiler' },
    { name: 'twitter:description', content: 'Safely escape HTML and XML with Python MarkupSafe in your browser' },
    { name: 'twitter:image', content: '/pybadu.png' }
  ]
})

// Example code snippets
const examples = [
  {
    title: "Basic HTML Escaping",
    code: `from markupsafe import escape

# Unsafe string with HTML/script tags
unsafe_string = "\\u003cscript\\u003ealert(1);\\u003c/script\\u003e"
safe_string = escape(unsafe_string)

print("Original unsafe string:")
print(unsafe_string)
print("\\nEscaped safe string:")
print(safe_string)
print("\\nSafe string representation:")
print(repr(safe_string))`
  },
  {
    title: "Markup Objects",
    code: `from markupsafe import Markup, escape

# Mark a string as safe (trusted HTML)
safe_html = Markup("<strong>Hello</strong> World")
print("Safe HTML:")
print(safe_html)
print(f"\\nType: {type(safe_html)}")

# Escape already marked as safe (no double escaping)
already_safe = Markup("<em>Safe content</em>")
escaped = escape(already_safe)
print(f"\\nEscaped safe content: {escaped}")`
  },
  {
    title: "String Formatting with Markup",
    code: `from markupsafe import Markup, escape

# Template with placeholders
template = Markup("Hello <em>{name}</em>")

# Format with user input (automatically escaped)
user_name = '"World"'
result = template.format(name=user_name)

print("Template:")
print(template)
print(f"\\nUser input: {user_name}")
print(f"\\nFormatted result:")
print(result)
print(f"\\nNote: Quotes are escaped automatically")`
  },
  {
    title: "Escaping User Input",
    code: `from markupsafe import escape

# Simulate user input from form
user_inputs = [
    "\\u003cscript\\u003ealert(1)\\u003c/script\\u003e",
    "\\u003cimg src=x onerror=alert(1)\\u003e",
    "Normal text with \\u003ctags\\u003e",
    "& special characters &"
]

print("Escaping user inputs:")
print("-" * 50)
for user_input in user_inputs:
    escaped = escape(user_input)
    print(f"\\nInput:  {user_input}")
    print(f"Output: {escaped}")`
  },
  {
    title: "Combining Safe and Unsafe Content",
    code: `from markupsafe import Markup, escape

# Trusted HTML template
template = Markup("\\u003cdiv class='message'\\u003e{content}\\u003c/div\\u003e")

# User-generated content (untrusted)
user_content = "\\u003cscript\\u003ealert(1)\\u003c/script\\u003e"

# Combine safely
safe_content = template.format(content=escape(user_content))

print("Template:")
print(template)
print(f"\\nUser content: {user_content}")
print(f"\\nSafe combined result:")
print(safe_content)

# Direct string operations
combined = Markup("\\u003cp\\u003e") + escape(user_content) + Markup("\\u003c/p\\u003e")
print(f"\\nAlternative method:")
print(combined)`
  },
  {
    title: "XML Escaping",
    code: `from markupsafe import escape

# XML special characters
xml_content = "<tag>Content with & special chars</tag>"
escaped_xml = escape(xml_content)

print("Original XML:")
print(xml_content)
print("\\nEscaped XML:")
print(escaped_xml)

# XML attributes
attr_value = 'value with "quotes" and <tags>'
escaped_attr = escape(attr_value)
print(f"\\nAttribute value: {attr_value}")
print(f"Escaped attribute: {escaped_attr}")`
  }
]

const defaultCode = `from markupsafe import escape, Markup

# Unsafe string with HTML/script tags
unsafe_string = "\\u003cscript\\u003ealert(1);\\u003c/script\\u003e"
safe_string = escape(unsafe_string)

print("Original unsafe string:")
print(unsafe_string)
print("\\nEscaped safe string:")
print(safe_string)
print("\\nSafe string representation:")
print(repr(safe_string))

# Mark a string as safe
safe_html = Markup("\\u003cstrong\\u003eHello\\u003c/strong\\u003e World")
print(f"\\nSafe HTML: {safe_html}")`

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
  initializePyodide,
  cleanupWorker,
  refreshAssets,
  uploadAssets,
  deleteAsset,
  createAssetFolder
} = useLibraryPlayground({
  packageName: 'markupsafe',
  defaultCode,
  examples,
  additionalPackages: [],
  setupCode: `
from markupsafe import escape, Markup
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

