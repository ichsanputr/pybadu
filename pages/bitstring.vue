<template>
  <div>
    <div class="min-h-screen">
      <CodeEditor
        libraryName="bitstring"
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
          Online Python bitstring Compiler
        </h1>

        <div class="max-w-4xl mx-auto text-left space-y-6 text-gray-700 dark:text-gray-300">
          <p class="text-base md:text-lg leading-relaxed">
            bitstring is a pure-Python toolkit for creating, slicing, and analyzing binary data. It supports constructing bit arrays from binary, hex, octal, integers, floats, files, and format strings while exposing Pythonic slicing, concatenation, and searching helpers. You can precisely pack and unpack structured payloads, flip individual bits, or reinterpret raw data without dropping into lower-level languages.
          </p>

          <p class="text-base md:text-lg leading-relaxed">
            This compiler bundles the latest <strong>bitstring</strong> build so you can create <code>BitArray</code>, <code>Bits</code>, and <code>BitStream</code> objects entirely in the browser. Convert between binary, hex, integers, floats, and files, craft protocol packets, decode sensor frames, and validate bit-level algorithms without installing anything locally. You can also upload and use files or folders directly in your code for binary data processing and protocol workflows. This compiler is online and completely free to use.
          </p>

          <p class="text-base md:text-lg leading-relaxed">
            The curated examples highlight everyday workflows: creating bitstrings from multiple sources, slicing and overwriting segments, appending fields, searching for patterns, reading structured values from a stream, and packing data with the format mini-language. These patterns map to tasks like networking, embedded development, security tooling, and binary data forensics.
          </p>

          <h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Who Should Use This</h3>
          <ul class="list-disc list-inside space-y-2 text-base md:text-lg ml-4">
            <li>Embedded and firmware engineers manipulating protocol frames</li>
            <li>Security researchers analyzing binary blobs or payloads</li>
            <li>Data engineers decoding telemetry or compressed streams</li>
            <li>Students learning bitwise operations via high-level APIs</li>
            <li>Anyone needing readable bit slicing, packing, and streaming utilities</li>
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
  name: 'BitstringPlayground'
})

definePageMeta({
  layout: 'library'
})

useHead({
  title: 'Online Python bitstring Compiler',
  meta: [
    { name: 'description', content: 'Manipulate binary data using the bitstring module directly in your browser. Create BitArray objects, slice bits, and pack custom protocols with Pyodide-powered Python.' },
    { name: 'keywords', content: 'bitstring, BitArray, binary data, python bits, online python compiler, pyodide' },
    { name: 'author', content: 'Pybadu' },
    { property: 'og:title', content: 'Online Python bitstring Compiler' },
    { property: 'og:description', content: 'Manipulate binary data using the bitstring module directly in your browser' },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/pybadu.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Online Python bitstring Compiler' },
    { name: 'twitter:description', content: 'Manipulate binary data using the bitstring module directly in your browser' },
    { name: 'twitter:image', content: '/pybadu.png' }
  ]
})

const examples = [
  {
    title: 'Create BitArray From Formats',
    code: `from bitstring import BitArray

examples = [
    BitArray('0b1101'),
    BitArray(hex='0xff'),
    BitArray(int=13, length=8),
    BitArray(float=3.14159, length=32)
]

for item in examples:
    print(item.bin)`
  },
  {
    title: 'Slice And Assign Bits',
    code: `from bitstring import BitArray

packet = BitArray('0b0000111100001111')
packet[4:8] = '0b1010'
print("Updated packet:", packet.bin)
print("Upper nibble:", packet[:4].uint)
print("Lower nibble:", packet[-4:].uint)`
  },
  {
    title: 'Append Fields',
    code: `from bitstring import BitArray

header = BitArray('0b1010')
length = BitArray(uint=12, length=8)
payload = BitArray(bytes=b'OK')

frame = header + length + payload
print("Frame bits:", frame.bin)
print("Payload text:", frame[-16:].bytes.decode())`
  },
  {
    title: 'Search And Replace',
    code: `from bitstring import BitArray

data = BitArray('0b0000111100001111')
pos = data.find('0b1111')
print("First 1111 at:", pos)

data.replace('0b1111', '0b0000')
print("After replace:", data.bin)`
  },
  {
    title: 'Read Structured Values',
    code: `from bitstring import BitStream

stream = BitStream('0b1010 0001 11110000 01010101')
version = stream.read('uint:4')
flags = stream.read('uint:4')
counter = stream.read('uint:8')
pattern = stream.read('bin:8')

print(version, flags, counter, pattern)`
  },
  {
    title: 'Pack With Format Strings',
    code: `from bitstring import pack

frame = pack('uint:8, int:4, bin:4, bytes:2', 255, -3, '0b1010', b'Hi')
print("Frame bits:", frame.bin)
print("As bytes:", frame.bytes)`
  }
]

const defaultCode = `from bitstring import BitArray

bits = BitArray('0b1101')
print(bits.bin)`

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
  packageName: 'bitstring',
  defaultCode,
  examples,
  additionalPackages: [],
  setupCode: `
from bitstring import BitArray, BitStream, Bits, pack
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

