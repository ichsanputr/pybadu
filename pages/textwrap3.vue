<template>
  <div>
    <!-- Editor Area -->
    <div class="min-h-screen">
      <CodeEditor 
        libraryName="Textwrap3"
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
          Online Python Textwrap3 Compiler
        </h1>
        
        <div class="max-w-4xl mx-auto text-left space-y-6 text-gray-700 dark:text-gray-300">
          <p class="text-base md:text-lg leading-relaxed">
            Textwrap3 is a Python library that provides advanced text wrapping capabilities. It is a backport of Python 3.6's enhanced `textwrap` module, offering features like the `shorten` function and the `max_lines` parameter for more sophisticated text formatting. The library allows you to wrap, fill, dedent, and indent text with fine-grained control over line width, indentation, and maximum line limits, making it ideal for formatting text output, creating readable documentation, and processing text content.
          </p>
          
          <p class="text-base md:text-lg leading-relaxed">
            This compiler includes <strong>Textwrap3</strong>, enabling you to perform advanced text wrapping operations directly in your browser. You can wrap long lines of text to fit within specified widths, fill paragraphs with proper line breaks, shorten text to fit within character limits, and control indentation and dedentation. The library provides all the tools you need for comprehensive text formatting including width control, line limiting, prefix/suffix support, and handling of whitespace. The platform supports all textwrap3 features for creating well-formatted, readable text output.
          </p>

          <p class="text-base md:text-lg leading-relaxed">
            Our comprehensive example collection covers essential text wrapping techniques including basic text wrapping, filling paragraphs, shortening long text, controlling indentation, working with multiple paragraphs, and using max_lines parameter. You'll also learn how to use textwrap3 for formatting output, creating readable text displays, processing user input, and formatting documentation. The examples demonstrate practical applications commonly used in command-line tools, text processing, report generation, and content formatting.
          </p>

          <h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Who Should Use This</h3>
          <ul class="list-disc list-inside space-y-2 text-base md:text-lg ml-4">
            <li>Developers formatting text output in command-line applications</li>
            <li>Content creators processing and formatting text content</li>
            <li>Developers building text processing and formatting tools</li>
            <li>Developers creating readable documentation and reports</li>
            <li>Students learning text processing and formatting techniques</li>
            <li>Anyone needing to wrap and format text with precise control</li>
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
  name: 'Textwrap3Playground'
})

definePageMeta({
  layout: 'library'
})

useHead({
  title: 'Online Python Textwrap3 Compiler',
  meta: [
    { name: 'description', content: 'Advanced text wrapping with Python Textwrap3 in your browser. Wrap, fill, shorten, and format text with precise control powered by Pyodide WebAssembly. No installation required.' },
    { name: 'keywords', content: 'textwrap3, text wrapping, text formatting, text processing, online python compiler, pyodide, python textwrap' },
    { name: 'author', content: 'Pybadu' },
    { property: 'og:title', content: 'Online Python Textwrap3 Compiler' },
    { property: 'og:description', content: 'Advanced text wrapping with Python Textwrap3 in your browser' },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/pybadu.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Online Python Textwrap3 Compiler' },
    { name: 'twitter:description', content: 'Advanced text wrapping with Python Textwrap3 in your browser' },
    { name: 'twitter:image', content: '/pybadu.png' }
  ]
})

// Example code snippets
const examples = [
  {
    title: "Basic Text Wrapping",
    code: `# Wrap text to a specific width
text = "Hello Pybadu " * 5
wrapped = textwrap.fill(text, width=20)
print("Wrapped text:")
print(wrapped)`
  },
  {
    title: "Wrap vs Fill",
    code: `# wrap() returns a list, fill() returns a string
long_text = "This is a long line of text that needs to be wrapped into multiple lines for better readability."

# Using wrap() - returns list
wrapped_list = textwrap.wrap(long_text, width=30)
print("Using wrap() (list):")
for line in wrapped_list:
    print(line)

# Using fill() - returns string
wrapped_string = textwrap.fill(long_text, width=30)
print("\\nUsing fill() (string):")
print(wrapped_string)`
  },
  {
    title: "Shorten Text",
    code: `# Shorten long text to fit within a width
long_text = "This is a very long text that needs to be shortened to fit within a specific character limit."

# Shorten to 50 characters
shortened = textwrap.shorten(long_text, width=50)
print("Original length:", len(long_text))
print("Shortened text:", shortened)
print("Shortened length:", len(shortened))`
  },
  {
    title: "Indentation",
    code: `# Add indentation to wrapped text
text = "This is a paragraph that will be wrapped and indented."

# Wrap with indentation
indented = textwrap.fill(text, width=30, initial_indent='  ', subsequent_indent='    ')
print("Indented text:")
print(indented)`
  },
  {
    title: "Dedent Text",
    code: `# Remove common leading whitespace
text = """
    This is a multi-line string
    with common indentation
    that needs to be removed.
"""

# Dedent removes common leading whitespace
dedented = textwrap.dedent(text)
print("Dedented text:")
print(dedented)`
  },
  {
    title: "Max Lines Parameter",
    code: `# Limit the number of lines in output
long_text = "This is a very long text that will be wrapped into multiple lines. " * 3

# Wrap with max_lines limit
wrapped = textwrap.fill(long_text, width=30, max_lines=3)
print("Wrapped with max_lines=3:")
print(wrapped)

# Using shorten with max_lines
shortened = textwrap.shorten(long_text, width=50, max_lines=2)
print("\\nShortened with max_lines=2:")
print(shortened)`
  }
]

const defaultCode = `# Advanced text wrapping with textwrap3
# Wrap text to a specific width

text = "Hello Pybadu " * 5
wrapped = textwrap.fill(text, width=20)
print("Wrapped text:")
print(wrapped)`

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
  packageName: 'textwrap3',
  defaultCode,
  examples,
  additionalPackages: [],
  setupCode: `
import textwrap
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

