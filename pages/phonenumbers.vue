<template>
  <div>
    <div class="min-h-screen">
      <CodeEditor
        libraryName="phonenumbers"
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
          Online Python phonenumbers Compiler
        </h1>

        <div class="max-w-4xl mx-auto text-left space-y-6 text-gray-700 dark:text-gray-300">
          <p class="text-base md:text-lg leading-relaxed">
            phonenumbers is Google’s libphonenumber port for Python, supporting parsing, validation, formatting, carrier lookup, geocoding, and timezone hints for international phone numbers. It understands regional dialing rules, checks number types (mobile, fixed line, toll-free, etc.), and formats output according to national or E.164 standards.
          </p>

          <p class="text-base md:text-lg leading-relaxed">
            This compiler bundles phonenumbers in the browser so you can test number handling without installing dependencies or setting up CLIs. Upload files and folders to work with local phone number data, parse strings from any country, validate user input, format numbers for SMS gateways, detect carrier/region metadata, and generate sanitized output before wiring the logic into signup forms, CRM imports, or messaging services. This online compiler is completely free and requires no installation.
          </p>

          <p class="text-base md:text-lg leading-relaxed">
            Included examples walk through common tasks: parsing E.164 numbers, formatting for display, checking possible vs. valid numbers, identifying carrier/region, extracting numbers from text, and building helper utilities. Adapt them to enforce consistent phone data across onboarding flows, spreadsheets, and support tools.
          </p>

          <h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Who Should Use This</h3>
          <ul class="list-disc list-inside space-y-2 text-base md:text-lg ml-4">
            <li>Product teams validating phone inputs during signup or checkout</li>
            <li>CRM and marketing ops cleaning spreadsheets of customer numbers</li>
            <li>Messaging and telephony services targeting multiple countries</li>
            <li>Support engineers enriching tickets with carrier/region metadata</li>
            <li>Students learning about international numbering plans</li>
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
  name: 'PhoneNumbersPlayground'
})

definePageMeta({
  layout: 'library'
})

useHead({
  title: 'Online Python phonenumbers Compiler',
  meta: [
    { name: 'description', content: 'Parse, validate, and format international phone numbers with the phonenumbers library directly in your browser.' },
    { name: 'keywords', content: 'phonenumbers, phone validation, libphonenumber, python phone parser, online python compiler, pyodide' },
    { name: 'author', content: 'Pybadu' },
    { property: 'og:title', content: 'Online Python phonenumbers Compiler' },
    { property: 'og:description', content: 'Parse, validate, and format international phone numbers in your browser' },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/pybadu.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Online Python phonenumbers Compiler' },
    { name: 'twitter:description', content: 'Parse, validate, and format international phone numbers in your browser' },
    { name: 'twitter:image', content: '/pybadu.png' }
  ]
})

const examples = [
  {
    title: 'Parse Indonesian Number',
    code: `import phonenumbers

num = phonenumbers.parse("+628123456789")
print(num)`
  },
  {
    title: 'Format In Multiple Styles',
    code: `import phonenumbers
from phonenumbers import PhoneNumberFormat

num = phonenumbers.parse("+14155552671")
print(phonenumbers.format_number(num, PhoneNumberFormat.E164))
print(phonenumbers.format_number(num, PhoneNumberFormat.NATIONAL))
print(phonenumbers.format_number(num, PhoneNumberFormat.INTERNATIONAL))`
  },
  {
    title: 'Validate And Check Type',
    code: `import phonenumbers
from phonenumbers import number_type, PhoneNumberType

num = phonenumbers.parse("+447911123456")
print("Possible:", phonenumbers.is_possible_number(num))
print("Valid:", phonenumbers.is_valid_number(num))
print("Type:", number_type(num) == PhoneNumberType.MOBILE)`
  },
  {
    title: 'Carrier And Region Metadata',
    code: `import phonenumbers
from phonenumbers import carrier, geocoder

num = phonenumbers.parse("+33123456789")
print("Carrier:", carrier.name_for_number(num, "en"))
print("Region:", geocoder.description_for_number(num, "en"))`
  },
  {
    title: 'Extract From Text',
    code: `import phonenumbers

text = "Support lines: +1 415-555-2671 or (021) 1234567."
for match in phonenumbers.PhoneNumberMatcher(text, "US"):
    print(match.number)`
  },
  {
    title: 'Helper For Clean Output',
    code: `import phonenumbers
from phonenumbers import PhoneNumberFormat

def normalize(phone, region="ID"):
    num = phonenumbers.parse(phone, region)
    if phonenumbers.is_valid_number(num):
        return phonenumbers.format_number(num, PhoneNumberFormat.E164)
    return None

print(normalize("0812-345-6789"))`
  }
]

const defaultCode = `import phonenumbers

print(phonenumbers.parse("+628123456789"))`

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
  
  downloadAsset,
  createAssetFolder,
  initializePyodide,
  cleanupWorker
} = useLibraryPlayground({
  packageName: 'phonenumbers',
  defaultCode,
  examples,
  additionalPackages: [],
  setupCode: `
import phonenumbers
from phonenumbers import carrier, geocoder, PhoneNumberFormat, PhoneNumberType
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

