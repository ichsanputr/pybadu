<template>
  <div>
    <!-- Editor Area -->
    <div class="min-h-screen">
      <CodeEditor 
        libraryName="Faker"
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
          Online Python Faker Compiler
        </h1>
        
        <div class="max-w-4xl mx-auto text-left space-y-6 text-gray-700 dark:text-gray-300">
          <p class="text-base md:text-lg leading-relaxed">
            Faker is a powerful Python library that generates fake data for various purposes including unit testing, performance testing, building demos, and anonymizing production data. It can produce realistic data across a wide range of categories such as names, addresses, emails, phone numbers, company information, dates, credit card numbers, and much more. Faker is particularly useful for developers who need to populate databases, create test fixtures, or generate sample data for development and testing purposes.
          </p>
          
          <p class="text-base md:text-lg leading-relaxed">
            This compiler includes <strong>Faker</strong>, enabling you to generate fake data directly in your browser. The library supports multiple locales, allowing you to generate data appropriate for different regions and languages. You can create realistic names, addresses, emails, phone numbers, company information, job titles, dates, times, text content, and many other data types. The platform provides all the tools you need for comprehensive fake data generation including localization support, diverse data providers, and extensible architecture for custom data generation.
          </p>

          <p class="text-base md:text-lg leading-relaxed">
            Our comprehensive example collection covers essential fake data generation techniques including basic data generation, working with different data types, using multiple locales, generating dates and times, creating text content, and working with company and financial data. You'll also learn how to use Faker for testing, database seeding, creating demo applications, and generating realistic sample data. The examples demonstrate practical applications commonly used in software development, testing, data anonymization, and application prototyping.
          </p>

          <h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Who Should Use This</h3>
          <ul class="list-disc list-inside space-y-2 text-base md:text-lg ml-4">
            <li>Developers creating test fixtures and mock data for unit testing</li>
            <li>Database administrators seeding databases with sample data</li>
            <li>QA engineers generating test data for performance and stress testing</li>
            <li>Developers building demo applications and prototypes</li>
            <li>Data engineers anonymizing production data for testing</li>
            <li>Students learning about data generation and testing techniques</li>
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
  name: 'FakerPlayground'
})

definePageMeta({
  layout: 'library'
})

useHead({
  title: 'Online Python Faker Compiler',
  meta: [
    { name: 'description', content: 'Generate fake data with Python Faker in your browser. Create names, emails, addresses, and more for testing and demos powered by Pyodide WebAssembly. No installation required.' },
    { name: 'keywords', content: 'faker, fake data, test data, mock data, data generation, online python compiler, pyodide, python testing' },
    { name: 'author', content: 'Pybadu' },
    { property: 'og:title', content: 'Online Python Faker Compiler' },
    { property: 'og:description', content: 'Generate fake data with Python Faker in your browser' },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/pybadu.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Online Python Faker Compiler' },
    { name: 'twitter:description', content: 'Generate fake data with Python Faker in your browser' },
    { name: 'twitter:image', content: '/pybadu.png' }
  ]
})

// Example code snippets
const examples = [
  {
    title: "Basic Fake Data Generation",
    code: `# Generate basic fake data
fake = Faker()

print("Name:", fake.name())
print("Email:", fake.email())
print("Address:", fake.address())
print("Phone:", fake.phone_number())
print("\\nCompany:", fake.company())
print("Job:", fake.job())`
  },
  {
    title: "Multiple Data Types",
    code: `# Generate various types of fake data
fake = Faker()

print("Personal Information:")
print("  Name:", fake.name())
print("  Email:", fake.email())
print("  Phone:", fake.phone_number())
print("  Date of Birth:", fake.date_of_birth())

print("\\nLocation:")
print("  Address:", fake.address())
print("  City:", fake.city())
print("  Country:", fake.country())
print("  Zipcode:", fake.zipcode())

print("\\nInternet:")
print("  URL:", fake.url())
print("  IP Address:", fake.ipv4())
print("  User Agent:", fake.user_agent())`
  },
  {
    title: "Localization",
    code: `# Generate data in different locales
# English (default)
fake_en = Faker('en_US')
print("English Name:", fake_en.name())
print("English Address:", fake_en.address())

# French
fake_fr = Faker('fr_FR')
print("\\nFrench Name:", fake_fr.name())
print("French Address:", fake_fr.address())

# German
fake_de = Faker('de_DE')
print("\\nGerman Name:", fake_de.name())
print("German Address:", fake_de.address())`
  },
  {
    title: "Dates and Times",
    code: `# Generate dates and times
fake = Faker()

print("Date between 2020-2023:")
print(fake.date_between(start_date='2020-01-01', end_date='2023-12-31'))

print("\\nRandom Date:")
print(fake.date())

print("\\nRandom Time:")
print(fake.time())

print("\\nDate Time:")
print(fake.date_time())

print("\\nFuture Date:")
print(fake.future_date())`
  },
  {
    title: "Text Generation",
    code: `# Generate text content
fake = Faker()

print("Word:", fake.word())
print("\\nSentence:", fake.sentence())
print("\\nParagraph:", fake.paragraph())
print("\\nText (3 sentences):", fake.text(max_nb_chars=200))

print("\\nLorem Ipsum:")
print(fake.text())`
  },
  {
    title: "Company and Financial Data",
    code: `# Generate company and financial information
fake = Faker()

print("Company Information:")
print("  Company:", fake.company())
print("  Industry:", fake.bs())
print("  Catch Phrase:", fake.catch_phrase())

print("\\nFinancial:")
print("  Credit Card Number:", fake.credit_card_number())
print("  Credit Card Provider:", fake.credit_card_provider())
print("  Currency Code:", fake.currency_code())
print("  Currency Name:", fake.currency_name())`
  }
]

const defaultCode = `# Generate fake data with Faker
# Faker is useful for testing, demos, and data anonymization

fake = Faker()

# Generate basic information
print("Name:", fake.name())
print("Email:", fake.email())
print("Address:", fake.address())
print("Phone:", fake.phone_number())

# Generate company information
print("\\nCompany:", fake.company())
print("Job Title:", fake.job())`

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
  packageName: 'faker',
  defaultCode,
  examples,
  additionalPackages: [],
  setupCode: `
from faker import Faker
fake = Faker()
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

