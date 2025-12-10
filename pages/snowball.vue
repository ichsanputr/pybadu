<template>
  <div>
    <!-- Editor Area -->
    <div class="min-h-screen">
      <CodeEditor libraryName="Snowball Stemmer" :theme="theme" :files="files" :activeFileId="activeFileId"
        :code="currentFileContent" :output="output" :isLoading="isLoading" :pyodideReady="pyodideReady"
        :monacoTheme="monacoTheme" :examples="examples" @update:code="updateCurrentFile" @toggleTheme="toggleTheme"
        @runCode="runCode" @clearCode="clearCode" @clearOutput="clearOutput" @loadExample="loadExample"
        @newFile="createNewFile" @selectFile="selectFile" @deleteFile="deleteFile" @renameFile="renameFile"
        @saveToStorage="saveToStorage" />
    </div>

    <!-- Information Section -->
    <LibraryInfoSection>
      <div class="text-center mb-12">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Online Python Snowball Stemmer Compiler
        </h1>

        <div class="max-w-4xl mx-auto text-left space-y-6 text-gray-700 dark:text-gray-300">
          <p class="text-base md:text-lg leading-relaxed">
            Snowball Stemmer is a powerful text processing library that reduces words to their root forms through
            stemming algorithms.
            Stemming is essential in natural language processing, information retrieval, and search engines, as it helps
            normalize text
            by removing word suffixes and prefixes. For example, words like "running", "runs", and "ran" can all be
            reduced to their
            common root "run", making text analysis more efficient and accurate.
          </p>

          <p class="text-base md:text-lg leading-relaxed">
            This compiler includes <strong>Snowball Stemmer</strong> with support for multiple languages including
            English, Spanish,
            French, German, Italian, Portuguese, and Russian. The library implements the Snowball stemming algorithm,
            which is an
            improved version of the Porter stemming algorithm. You can perform text normalization, reduce word
            variations to their
            base forms, and improve the accuracy of text matching and search operations. The platform provides all the
            tools you
            need for comprehensive text processing including multi-language support, batch processing capabilities, and
            efficient
            stemming algorithms optimized for performance. You can also upload and use files or folders directly in your
            code for
            text processing and NLP workflows. This compiler is online and completely free to use.
          </p>

          <p class="text-base md:text-lg leading-relaxed">
            Our comprehensive example collection covers essential text processing techniques including basic word
            stemming,
            batch processing of word lists, multi-language stemming operations, and text normalization workflows. You'll
            also
            learn how to stem words in different languages, process text documents, and integrate stemming into larger
            text
            processing pipelines. The examples demonstrate practical applications commonly used in search engines,
            document
            classification systems, and natural language processing applications.
          </p>

          <h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Who Should Use This</h3>
          <ul class="list-disc list-inside space-y-2 text-base md:text-lg ml-4">
            <li>Natural language processing developers building text analysis systems</li>
            <li>Search engine developers implementing text normalization and matching</li>
            <li>Data scientists preprocessing text data for machine learning models</li>
            <li>Content management system developers building search functionality</li>
            <li>Linguists and researchers analyzing word forms and language patterns</li>
            <li>Students learning text processing and NLP techniques</li>
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
  name: 'SnowballPlayground'
})

definePageMeta({
  layout: 'library'
})

useHead({
  title: 'Online Python Snowball Stemmer Compiler',
  meta: [
    { name: 'description', content: 'Process text with Python Snowball Stemmer in your browser. Stem words, normalize text, and perform NLP operations powered by Pyodide WebAssembly. No installation required.' },
    { name: 'keywords', content: 'snowball stemmer, text processing, nlp, word stemming, text normalization, online compiler, pyodide, natural language processing' },
    { name: 'author', content: 'Pybadu' },
    { property: 'og:title', content: 'Online Python Snowball Stemmer Compiler' },
    { property: 'og:description', content: 'Process text with Python Snowball Stemmer in your browser' },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/pybadu.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Online Python Snowball Stemmer Compiler' },
    { name: 'twitter:description', content: 'Process text with Python Snowball Stemmer in your browser' },
    { name: 'twitter:image', content: '/pybadu.png' }
  ]
})

// Example code snippets
const examples = [
  {
    title: "Basic Word Stemming",
    code: `import snowballstemmer

# Stem words in English
words = ['running', 'runs', 'ran', 'easily', 'fairly', 'programming', 'programs']
stemmer = snowballstemmer.stemmer('english')
stemmed = stemmer.stemWords(words)

print("Original words:", words)
print("Stemmed words:", stemmed)

for original, stemmed_word in zip(words, stemmed):
    print(f"{original} -> {stemmed_word}")`
  },
  {
    title: "Multi-Language Stemming",
    code: `import snowballstemmer

# Stem words in different languages
english_words = ['running', 'jumping', 'beautiful']
spanish_words = ['corriendo', 'programación', 'desarrollo']
french_words = ['courant', 'programmation', 'développement']

# English
en_stemmer = snowballstemmer.stemmer('english')
en_stemmed = en_stemmer.stemWords(english_words)
print("English:", dict(zip(english_words, en_stemmed)))

# Spanish
es_stemmer = snowballstemmer.stemmer('spanish')
es_stemmed = es_stemmer.stemWords(spanish_words)
print("Spanish:", dict(zip(spanish_words, es_stemmed)))

# French
fr_stemmer = snowballstemmer.stemmer('french')
fr_stemmed = fr_stemmer.stemWords(french_words)
print("French:", dict(zip(french_words, fr_stemmed)))`
  },
  {
    title: "Text Normalization",
    code: `import snowballstemmer

# Normalize a sentence by stemming all words
sentence = "The running program runs programs that are running programs"
words = sentence.lower().split()

stemmer = snowballstemmer.stemmer('english')
stemmed_words = stemmer.stemWords(words)

print("Original sentence:", sentence)
print("Original words:", words)
print("Stemmed words:", stemmed_words)
print("Normalized sentence:", ' '.join(stemmed_words))`
  },
  {
    title: "Batch Processing",
    code: `import snowballstemmer

# Process multiple word lists
word_lists = [
    ['running', 'jumping', 'walking'],
    ['programming', 'developing', 'coding'],
    ['beautiful', 'wonderful', 'amazing']
]

stemmer = snowballstemmer.stemmer('english')

for i, word_list in enumerate(word_lists, 1):
    stemmed = stemmer.stemWords(word_list)
    print(f"List {i}:")
    for original, stemmed_word in zip(word_list, stemmed):
        print(f"  {original} -> {stemmed_word}")
    print()`
  },
  {
    title: "Language Comparison",
    code: `import snowballstemmer

# Compare stemming across languages
test_words = {
    'english': ['running', 'programming', 'development'],
    'spanish': ['corriendo', 'programación', 'desarrollo'],
    'french': ['courant', 'programmation', 'développement']
}

for lang, words in test_words.items():
    stemmer = snowballstemmer.stemmer(lang)
    stemmed = stemmer.stemWords(words)
    print(f"{lang.capitalize()}:")
    for original, stemmed_word in zip(words, stemmed):
        print(f"  {original} -> {stemmed_word}")
    print()`
  },
  {
    title: "Verb Forms Stemming",
    code: `import snowballstemmer

# Stem different verb forms
verb_forms = [
    'run', 'runs', 'running', 'ran',
    'walk', 'walks', 'walking', 'walked',
    'jump', 'jumps', 'jumping', 'jumped'
]

stemmer = snowballstemmer.stemmer('english')
stemmed = stemmer.stemWords(verb_forms)

print("Verb Forms Stemming:")
for original, stemmed_word in zip(verb_forms, stemmed):
    print(f"{original:10} -> {stemmed_word}")`
  }
]

const defaultCode = `import snowballstemmer

# Stem words in English
words = ['running', 'runs', 'ran', 'easily', 'fairly', 'programming', 'programs']
stemmer = snowballstemmer.stemmer('english')
stemmed = stemmer.stemWords(words)

print("Original words:", words)
print("Stemmed words:", stemmed)

for original, stemmed_word in zip(words, stemmed):
    print(f"{original} -> {stemmed_word}")`

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
  packageName: 'snowballstemmer',
  defaultCode,
  examples,
  additionalPackages: [],
  setupCode: `
import snowballstemmer
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
