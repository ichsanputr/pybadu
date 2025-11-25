<template>
  <div>
    <!-- Editor Area -->
    <div class="sm:min-h-screen">
      <CodeEditor 
        libraryName="zfpy"
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

    <!-- Information Section -->
    <LibraryInfoSection>
      <div class="text-center mb-12">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Online Python zfpy Compiler
        </h1>
        
        <div class="max-w-4xl mx-auto text-left space-y-6 text-gray-700 dark:text-gray-300">
          <p class="text-base md:text-lg leading-relaxed">
            zfpy is a Python library that provides bindings to the zfp compression library, enabling efficient compression 
            and decompression of multidimensional floating-point and integer arrays. zfp (zfp compression) is a compressed 
            format designed for scientific computing applications that need to balance storage efficiency with access 
            performance. The library provides compressed-array classes that support high throughput read and write random 
            access to individual array elements, making it ideal for applications handling large datasets where you need 
            efficient storage without sacrificing the ability to access specific elements.
          </p>
          
          <p class="text-base md:text-lg leading-relaxed">
            This compiler includes <strong>zfpy 1.0+</strong> with full support for both lossless and lossy compression modes, 
            powered by Pyodide WebAssembly technology. zfpy supports serial and parallel compression of whole arrays with 
            configurable error tolerances and compression rates, making it perfect for scientific data storage and transmission. 
            The library seamlessly integrates with NumPy arrays, allowing you to compress and decompress arrays with simple 
            function calls. Whether you're working with large scientific datasets, image processing, numerical simulations, 
            or data archiving, our zfpy playground offers instant execution with full NumPy integration. You can also upload 
            and use files or folders directly in your code for data processing and compression workflows. This compiler is 
            online and completely free to use.
          </p>

          <p class="text-base md:text-lg leading-relaxed">
            Our example collection covers essential zfpy topics including basic compression and decompression, lossless and lossy 
            compression modes with tolerance and rate control, multi-dimensional array compression, and performance comparisons. 
            You'll learn how to compress NumPy arrays efficiently, control compression ratios and error tolerances, and work with 
            compressed data structures for scientific computing and data storage applications.
          </p>

          <h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Who Should Use This</h3>
          <ul class="list-disc list-inside space-y-2 text-base md:text-lg ml-4">
            <li>Scientific computing researchers working with large multidimensional datasets</li>
            <li>Data scientists needing efficient storage for numerical arrays and matrices</li>
            <li>Engineers developing applications that require random access to compressed array data</li>
            <li>Researchers archiving scientific data with configurable compression quality</li>
            <li>Developers building systems that balance storage efficiency with access performance</li>
            <li>Students learning array compression techniques and scientific computing workflows</li>
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
  name: 'ZfpyPlayground'
})

definePageMeta({
  layout: 'library'
})

useHead({
  title: 'Online Python zfpy Compiler',
  meta: [
    { name: 'description', content: 'Compress and decompress multidimensional arrays with Python zfpy in your browser. Support lossless and lossy compression modes powered by Pyodide WebAssembly. No installation required.' },
    { name: 'keywords', content: 'zfpy, zfp compression, array compression, scientific computing, online compiler, pyodide, numpy compression, data compression' },
    { name: 'author', content: 'Pybadu' },
    { property: 'og:title', content: 'Online Python zfpy Compiler' },
    { property: 'og:description', content: 'Compress and decompress multidimensional arrays with Python zfpy in your browser' },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/pybadu.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Online Python zfpy Compiler' },
    { name: 'twitter:description', content: 'Compress and decompress multidimensional arrays with Python zfpy in your browser' },
    { name: 'twitter:image', content: '/pybadu.png' }
  ]
})

// Example code snippets
const examples = [
  {
    title: "Basic Array Compression",
    code: `import numpy as np
import zfpy

# Create a sample array
data = np.random.rand(100, 100).astype(np.float32)
print(f"Original array shape: {data.shape}")
print(f"Original array size: {data.nbytes} bytes")

# Compress the array
compressed = zfpy.compress_numpy(data)
print(f"Compressed size: {len(compressed)} bytes")
print(f"Compression ratio: {data.nbytes / len(compressed):.2f}x")

# Decompress the array
decompressed = zfpy.decompress_numpy(compressed)
print(f"Decompressed array shape: {decompressed.shape}")
print(f"Arrays match: {np.allclose(data, decompressed)}")`
  },
  {
    title: "Lossy Compression with Tolerance",
    code: `import numpy as np
import zfpy

# Create a sample array
data = np.random.rand(50, 50).astype(np.float32)
print(f"Original array size: {data.nbytes} bytes")

# Compress with different tolerances
tolerances = [1e-3, 1e-6, 1e-9]

for tol in tolerances:
    compressed = zfpy.compress_numpy(data, tolerance=tol)
    decompressed = zfpy.decompress_numpy(compressed)
    
    error = np.abs(data - decompressed).max()
    ratio = data.nbytes / len(compressed)
    
    print(f"\\nTolerance: {tol}")
    print(f"  Compression ratio: {ratio:.2f}x")
    print(f"  Max error: {error:.2e}")`
  },
  {
    title: "Compression Rate Control",
    code: `import numpy as np
import zfpy

# Create a sample array
data = np.random.rand(100, 100).astype(np.float32)
print(f"Original array size: {data.nbytes} bytes")

# Compress with different rates (bits per value)
rates = [4, 8, 16, 32]

for rate in rates:
    compressed = zfpy.compress_numpy(data, rate=rate)
    decompressed = zfpy.decompress_numpy(compressed)
    
    error = np.abs(data - decompressed).max()
    ratio = data.nbytes / len(compressed)
    
    print(f"\\nRate: {rate} bits/value")
    print(f"  Compression ratio: {ratio:.2f}x")
    print(f"  Max error: {error:.2e}")`
  },
  {
    title: "3D Array Compression",
    code: `import numpy as np
import zfpy

# Create a 3D array
data = np.random.rand(50, 50, 50).astype(np.float32)
print(f"Original 3D array shape: {data.shape}")
print(f"Original size: {data.nbytes / (1024*1024):.2f} MB")

# Compress the 3D array
compressed = zfpy.compress_numpy(data)
print(f"Compressed size: {len(compressed) / (1024*1024):.2f} MB")
print(f"Compression ratio: {data.nbytes / len(compressed):.2f}x")

# Decompress
decompressed = zfpy.decompress_numpy(compressed)
print(f"Decompressed shape: {decompressed.shape}")
print(f"Arrays match: {np.allclose(data, decompressed)}")`
  },
  {
    title: "Integer Array Compression",
    code: `import numpy as np
import zfpy

# Create an integer array
data = np.random.randint(0, 1000, size=(100, 100), dtype=np.int32)
print(f"Original integer array shape: {data.shape}")
print(f"Original size: {data.nbytes} bytes")

# Compress the integer array
compressed = zfpy.compress_numpy(data)
print(f"Compressed size: {len(compressed)} bytes")
print(f"Compression ratio: {data.nbytes / len(compressed):.2f}x")

# Decompress
decompressed = zfpy.decompress_numpy(compressed)
print(f"Decompressed shape: {decompressed.shape}")
print(f"Arrays match: {np.array_equal(data, decompressed)}")`
  },
  {
    title: "Compression Performance Comparison",
    code: `import numpy as np
import zfpy

# Create a large array
data = np.random.rand(1000, 1000).astype(np.float32)
print(f"Original array size: {data.nbytes / (1024*1024):.2f} MB")

# Test different compression modes
print("\\nCompression Results:")
print("-" * 50)

# Lossless compression
compressed_lossless = zfpy.compress_numpy(data)
print(f"Lossless: {data.nbytes / len(compressed_lossless):.2f}x ratio")

# Lossy with tolerance
compressed_tol = zfpy.compress_numpy(data, tolerance=1e-6)
decompressed_tol = zfpy.decompress_numpy(compressed_tol)
error_tol = np.abs(data - decompressed_tol).max()
print(f"Tolerance 1e-6: {data.nbytes / len(compressed_tol):.2f}x ratio, max error: {error_tol:.2e}")

# Lossy with rate
compressed_rate = zfpy.compress_numpy(data, rate=8)
decompressed_rate = zfpy.decompress_numpy(compressed_rate)
error_rate = np.abs(data - decompressed_rate).max()
print(f"Rate 8 bits: {data.nbytes / len(compressed_rate):.2f}x ratio, max error: {error_rate:.2e}")`
  }
]

const defaultCode = `import numpy as np
import zfpy

# Create a sample array
data = np.random.rand(100, 100).astype(np.float32)
print(f"Original array shape: {data.shape}")
print(f"Original array size: {data.nbytes} bytes")

# Compress the array
compressed = zfpy.compress_numpy(data)
print(f"Compressed size: {len(compressed)} bytes")
print(f"Compression ratio: {data.nbytes / len(compressed):.2f}x")

# Decompress the array
decompressed = zfpy.decompress_numpy(compressed)
print(f"Decompressed array shape: {decompressed.shape}")
print(f"Arrays match: {np.allclose(data, decompressed)}")
`

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
  packageName: 'zfpy',
  defaultCode,
  examples,
  additionalPackages: ['numpy'],
  setupCode: `
import numpy as np
import zfpy
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

