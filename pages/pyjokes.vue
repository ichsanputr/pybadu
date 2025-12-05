<template>
  <div>
    <!-- Editor Area -->
    <div class="min-h-screen">
      <CodeEditor 
        libraryName="Pyjokes"
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
          Online Python Pyjokes Compiler
        </h1>
        
        <div class="max-w-4xl mx-auto text-left space-y-6 text-gray-700 dark:text-gray-300">
          <p class="text-base md:text-lg leading-relaxed">
            Pyjokes is a fun and lightweight Python library for generating random programming jokes. Perfect for adding humor to your applications, presentations, or just for entertainment, Pyjokes provides a simple API to fetch programming-related jokes in multiple languages. Whether you're building a chatbot, creating a fun command-line tool, or just want to lighten the mood in your code, Pyjokes makes it easy to access a collection of programming jokes with just a few lines of code.
          </p>
          
          <p class="text-base md:text-lg leading-relaxed">
            This compiler includes <strong>Pyjokes</strong>, enabling you to generate random programming jokes directly in your browser. The library supports multiple joke categories including general programming jokes, neutral jokes, and language-specific jokes. You can generate single jokes or multiple jokes at once, filter by category, and even specify the language for joke generation. The platform provides all the tools you need to integrate humor into your Python applications, making it perfect for learning, entertainment, or adding a fun element to your projects. You can also upload and use files or folders directly in your code for joke generation and entertainment workflows. This compiler is online and completely free to use.
          </p>

          <p class="text-base md:text-lg leading-relaxed">
            Our comprehensive example collection covers essential joke generation techniques including basic joke generation, generating multiple jokes, filtering by category, working with different joke types, and customizing joke output. You'll also learn how to integrate jokes into your applications, create joke generators, and use pyjokes in various programming contexts. The examples demonstrate practical applications commonly used in chatbots, command-line tools, and entertainment applications.
          </p>

          <h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Who Should Use This</h3>
          <ul class="list-disc list-inside space-y-2 text-base md:text-lg ml-4">
            <li>Developers building chatbots and conversational applications</li>
            <li>Educators creating fun programming examples and demos</li>
            <li>Students learning Python and looking for entertaining projects</li>
            <li>Developers building command-line tools with humor</li>
            <li>Anyone wanting to add programming jokes to their applications</li>
            <li>Developers creating entertainment and fun programming projects</li>
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
  name: 'PyjokesPlayground'
})

definePageMeta({
  layout: 'library'
})

useHead({
  title: 'Online Python Pyjokes Compiler',
  meta: [
    { name: 'description', content: 'Generate random programming jokes with Pyjokes in your browser. Fun Python library for jokes, entertainment, and humor in your code powered by Pyodide WebAssembly. No installation required.' },
    { name: 'keywords', content: 'pyjokes, programming jokes, python jokes, random jokes, humor, online compiler, pyodide, entertainment' },
    { name: 'author', content: 'Pybadu' },
    { property: 'og:title', content: 'Online Python Pyjokes Compiler' },
    { property: 'og:description', content: 'Generate random programming jokes with Pyjokes in your browser' },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/pybadu.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Online Python Pyjokes Compiler' },
    { name: 'twitter:description', content: 'Generate random programming jokes with Pyjokes in your browser' },
    { name: 'twitter:image', content: '/pybadu.png' }
  ]
})

// Example code snippets
const examples = [
  {
    title: "Basic Joke Generation",
    code: `# Generate a random programming joke
# Get a random joke
joke = pyjokes.get_joke()
print("Random Joke:")
print(joke)

# Get a joke in a specific language
joke_en = pyjokes.get_joke(language='en', category='neutral')
print("\\nNeutral Joke (English):")
print(joke_en)`
  },
  {
    title: "Multiple Jokes",
    code: `# Generate multiple jokes
print("5 Random Programming Jokes:\\n")
for i in range(5):
    joke = pyjokes.get_joke()
    print(f"{i+1}. {joke}\\n")`
  },
  {
    title: "Joke Categories",
    code: `# Get jokes by category
# All categories
print("All Categories Joke:")
print(pyjokes.get_joke(category='all'))
print()

# Neutral jokes
print("Neutral Joke:")
print(pyjokes.get_joke(category='neutral'))
print()

# Chuck Norris jokes (if available)
print("Chuck Norris Joke:")
print(pyjokes.get_joke(category='chuck'))`
  },
  {
    title: "Different Languages",
    code: `# Get jokes in different languages
# English
joke_en = pyjokes.get_joke(language='en')
print("English Joke:")
print(joke_en)
print()

# German
joke_de = pyjokes.get_joke(language='de')
print("German Joke:")
print(joke_de)
print()

# Spanish
joke_es = pyjokes.get_joke(language='es')
print("Spanish Joke:")
print(joke_es)`
  },
  {
    title: "Joke Generator Function",
    code: `# Create a simple joke generator
def generate_jokes(count=3, category='all'):
    print(f"Generating {count} {category} jokes:\\n")
    jokes = []
    for i in range(count):
        joke = pyjokes.get_joke(category=category)
        jokes.append(joke)
        print(f"{i+1}. {joke}\\n")
    return jokes

# Generate neutral jokes
neutral_jokes = generate_jokes(3, 'neutral')

# Generate all category jokes
all_jokes = generate_jokes(5, 'all')`
  },
  {
    title: "Interactive Joke Display",
    code: `# Display jokes in a formatted way
def display_joke():
    joke = pyjokes.get_joke()
    print("=" * 50)
    print("PROGRAMMING JOKE")
    print("=" * 50)
    print(joke)
    print("=" * 50)

# Display multiple jokes
for i in range(3):
    display_joke()
    print()`
  }
]

const defaultCode = `# Generate a random programming joke
# Get a random joke
joke = pyjokes.get_joke()
print("Random Programming Joke:")
print(joke)

# Get a neutral joke
neutral_joke = pyjokes.get_joke(category='neutral')
print("\\nNeutral Joke:")
print(neutral_joke)`

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
  cleanupWorker,
  assets,
  assetsUploading,
  refreshAssets,
  uploadAssets,
  deleteAsset,
  createAssetFolder
} = useLibraryPlayground({
  packageName: 'pyjokes',
  defaultCode,
  examples,
  additionalPackages: [],
  setupCode: `
import pyjokes
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

