<template>
  <div>
    <!-- Editor Area -->
    <div class="sm:min-h-screen">
      <CodeEditor
        libraryName="Test Assets"
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
        @deleteAsset="deleteAsset"
        @refreshAssets="refreshAssets"
        @createAssetFolder="createAssetFolder" />

    </div>

    <!-- Footer -->
    <AppFooter />
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import { useHead } from '#app'
import CodeEditor from '~/components/CodeEditor.vue'
import AppFooter from '~/components/AppFooter.vue'
import { useLibraryPlayground } from '~/composables/useLibraryPlayground'

defineOptions({
  name: 'TestAssets'
})

definePageMeta({
  layout: 'library'
})

useHead({
  title: 'Test Assets - Pybadu'
})

const examples = [
  {
    title: "Test Assets",
    code: `# Test reading from assets
import os

print("Files in /assets/:")
try:
    files = os.listdir('/assets')
    for file in files:
        print(f"  {file}")
        if os.path.isdir(f'/assets/{file}'):
            print(f"    (folder with {len(os.listdir(f'/assets/{file}'))} items)")
        else:
            size = os.path.getsize(f'/assets/{file}')
            print(f"    (file, {size} bytes)")
except Exception as e:
    print(f"Error: {e}")

print("\\nReading sample file:")
try:
    with open('/assets/sample_data/sample.txt', 'r') as f:
        content = f.read()
        print(content[:200] + "..." if len(content) > 200 else content)
except Exception as e:
    print(f"Error reading file: {e}")

print("\\nReading CSV file:")
try:
    with open('/assets/sample_data/data.csv', 'r') as f:
        lines = f.readlines()[:5]  # First 5 lines
        for line in lines:
            print(line.strip())
        print("...")
except Exception as e:
    print(f"Error reading CSV: {e}")`
  }
]

const defaultCode = `# Test assets functionality
print("Testing assets...")

# List all files in /assets
import os
if os.path.exists('/assets'):
    print("Assets directory exists!")
    files = os.listdir('/assets')
    print(f"Found {len(files)} items:")
    for file in files:
        print(f"  - {file}")
else:
    print("Assets directory not found")

print("\\nDone!")`

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
  createAssetFolder,
  createSampleAssets
} = useLibraryPlayground({
  packageName: 'test',
  defaultCode,
  examples,
  additionalPackages: [],
  setupCode: ''
})

onMounted(async () => {
  await initializePyodide()
  // Create sample assets for testing
  await createSampleAssets()
})

onBeforeUnmount(() => {
  cleanupWorker()
})
</script>