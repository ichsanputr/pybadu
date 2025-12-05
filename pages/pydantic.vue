<template>
  <div>
    <div class="min-h-screen">
      <CodeEditor
        libraryName="Pydantic"
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
          Online Python Pydantic Compiler
        </h1>

        <div class="max-w-4xl mx-auto text-left space-y-6 text-gray-700 dark:text-gray-300">
          <p class="text-base md:text-lg leading-relaxed">
            Pydantic brings ergonomic data validation and settings management to Python by combining type hints with runtime guarantees. Models convert input data into strongly typed objects, enforce constraints, generate clear errors, and seamlessly serialize/deserialize JSON—powering frameworks like FastAPI and many internal platforms.
          </p>

          <p class="text-base md:text-lg leading-relaxed">
            This compiler bundles Pydantic entirely in the browser so you can model schemas, test validators, and inspect error output without installing dependencies or configuring virtualenvs. Upload files and folders to work with local data for validation, prototype request bodies, normalize data snapshots, explore field constraints, and verify custom validators before wiring them into APIs or ETL jobs. This online compiler is completely free and requires no installation.
          </p>

          <p class="text-base md:text-lg leading-relaxed">
            The examples cover essentials such as BaseModel definitions, validation errors, computed fields, parsing arbitrary objects, settings management, and root validators. Use them to teach data modeling, document contracts for frontend teams, or iterate on strict parsing logic in isolation.
          </p>

          <h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Who Should Use This</h3>
          <ul class="list-disc list-inside space-y-2 text-base md:text-lg ml-4">
            <li>Backend engineers designing request/response schemas</li>
            <li>Data engineers normalizing ingestion pipelines</li>
            <li>Platform teams managing typed configuration and secrets</li>
            <li>FastAPI/Starlette developers validating payloads</li>
            <li>Students learning modern Python typing and validation</li>
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
  name: 'PydanticPlayground'
})

definePageMeta({
  layout: 'library'
})

useHead({
  title: 'Online Python Pydantic Compiler',
  meta: [
    { name: 'description', content: 'Experiment with Pydantic models directly in your browser. Validate data, enforce types, and test custom validators using Pyodide-powered Python.' },
    { name: 'keywords', content: 'pydantic, data validation, fastapi, python typing, online python compiler, pyodide' },
    { name: 'author', content: 'Pybadu' },
    { property: 'og:title', content: 'Online Python Pydantic Compiler' },
    { property: 'og:description', content: 'Experiment with Pydantic models directly in your browser' },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/pybadu.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Online Python Pydantic Compiler' },
    { name: 'twitter:description', content: 'Experiment with Pydantic models directly in your browser' },
    { name: 'twitter:image', content: '/pybadu.png' }
  ]
})

const examples = [
  {
    title: 'Basic Model',
    code: `from pydantic import BaseModel

class User(BaseModel):
    name: str
    age: int = 18

print(User(name="Ichsan"))`
  },
  {
    title: 'Validation Errors',
    code: `from pydantic import BaseModel, ValidationError

class Item(BaseModel):
    id: int
    price: float

try:
    Item(id="abc", price="free")
except ValidationError as exc:
    print(exc.errors())`
  },
  {
    title: 'Field Constraints',
    code: `from pydantic import BaseModel, Field

class Product(BaseModel):
    title: str = Field(min_length=3, max_length=50)
    quantity: int = Field(ge=0, le=1000)

print(Product(title="Widget", quantity=10))`
  },
  {
    title: 'Custom Validator',
    code: `from pydantic import BaseModel, validator

class Signup(BaseModel):
    password: str
    confirm_password: str

    @validator("confirm_password")
    def matches(cls, v, values):
        if v != values.get("password"):
            raise ValueError("Passwords do not match")
        return v

print(Signup(password="secret", confirm_password="secret"))`
  },
  {
    title: 'Computed Properties',
    code: `from pydantic import BaseModel

class Rectangle(BaseModel):
    width: float
    height: float

    @property
    def area(self):
        return self.width * self.height

rect = Rectangle(width=4, height=3)
print(rect.area)`
  },
  {
    title: 'Settings Management',
    code: `from pydantic import BaseSettings

class Settings(BaseSettings):
    api_key: str = "demo"
    debug: bool = False

settings = Settings()
print(settings.json())`
  }
]

const defaultCode = `from pydantic import BaseModel

class User(BaseModel):
    name: str

print(User(name="Ichsan"))`

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
  packageName: 'pydantic',
  defaultCode,
  examples,
  additionalPackages: [],
  setupCode: `
from pydantic import BaseModel, BaseSettings, Field, ValidationError, validator
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

