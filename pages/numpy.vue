<template>
  <div>
    <!-- Editor Area -->
    <div class="min-h-screen">
      <MatplotlibEditor 
        libraryName="NumPy"
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
        @deleteFile="deleteFile" />

      <!-- Loading Transition (client-only) -->
      <ClientOnly>
        <transition name="fade">
          <div v-if="loaderVisible"
            class="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-[#18181b] transition-colors duration-300">
            <Icon icon="ph:spinner" class="w-10 h-10 text-python-yellow-500 animate-spin" />
          </div>
        </transition>
      </ClientOnly>
    </div>

    <!-- Information Section -->
    <LibraryInfoSection>
      <div class="text-center mb-12">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 mb-4">
          <Icon icon="simple-icons:numpy" class="w-8 h-8 text-white" />
        </div>
        <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          About NumPy Playground
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Scientific computing with powerful N-dimensional arrays and comprehensive mathematical functions.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnimatedCard>
          <div class="text-center">
            <div class="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Icon icon="ph:grid-four" class="w-7 h-7 text-white" />
            </div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Array Computing</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Powerful multidimensional array objects</p>
          </div>
        </AnimatedCard>
        
        <AnimatedCard>
          <div class="text-center">
            <div class="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Icon icon="ph:function" class="w-7 h-7 text-white" />
            </div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Linear Algebra</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Advanced mathematical operations</p>
          </div>
        </AnimatedCard>
        
        <AnimatedCard>
          <div class="text-center">
            <div class="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Icon icon="ph:lightning" class="w-7 h-7 text-white" />
            </div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Fast Performance</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Optimized C-based computations</p>
          </div>
        </AnimatedCard>
      </div>
    </LibraryInfoSection>

    <AppFooter />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useHead } from '#app'
import MatplotlibEditor from '~/components/matplotlib/MatplotlibEditor.vue'
import LibraryInfoSection from '~/components/LibraryInfoSection.vue'
import AnimatedCard from '~/components/ui/AnimatedCard.vue'
import AppFooter from '~/components/AppFooter.vue'
import { Icon } from '@iconify/vue'
import { useLibraryPlayground } from '~/composables/useLibraryPlayground'

defineOptions({
  name: 'NumpyPlayground'
})

definePageMeta({
  layout: 'library'
})

useHead({
  title: 'NumPy Playground - Pybadu',
  meta: [
    { name: 'description', content: 'Interactive NumPy computing playground powered by Pyodide WebAssembly' }
  ]
})

// Example code snippets
const examples = [
  {
    title: "Array Basics",
    code: `import numpy as np

# Create arrays
arr1 = np.array([1, 2, 3, 4, 5])
arr2 = np.array([[1, 2, 3], [4, 5, 6]])

print("1D Array:", arr1)
print("Shape:", arr1.shape)
print("\\n2D Array:")
print(arr2)
print("Shape:", arr2.shape)

# Array operations
print("\\nSum:", arr1.sum())
print("Mean:", arr1.mean())
print("Standard Deviation:", arr1.std())
print("Max:", arr1.max())
print("Min:", arr1.min())`
  },
  {
    title: "Array Creation",
    code: `import numpy as np

# Different ways to create arrays
zeros = np.zeros((3, 4))
ones = np.ones((2, 3))
identity = np.eye(4)
random = np.random.rand(3, 3)
arange = np.arange(0, 10, 2)
linspace = np.linspace(0, 1, 5)

print("Zeros array:")
print(zeros)
print("\\nOnes array:")
print(ones)
print("\\nIdentity matrix:")
print(identity)
print("\\nRandom array:")
print(random)
print("\\nArange:", arange)
print("Linspace:", linspace)`
  },
  {
    title: "Matrix Operations",
    code: `import numpy as np

# Matrix multiplication
A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])

print("Matrix A:")
print(A)
print("\\nMatrix B:")
print(B)

# Matrix multiplication
C = np.dot(A, B)
print("\\nA @ B (Matrix Multiplication):")
print(C)

# Element-wise multiplication
D = A * B
print("\\nA * B (Element-wise):")
print(D)

# Transpose
print("\\nTranspose of A:")
print(A.T)

# Determinant and inverse
det = np.linalg.det(A)
inv = np.linalg.inv(A)
print(f"\\nDeterminant of A: {det}")
print("Inverse of A:")
print(inv)`
  },
  {
    title: "Statistical Operations",
    code: `import numpy as np

# Generate random data
np.random.seed(42)
data = np.random.randn(100)

print("Statistical Analysis:")
print(f"Mean: {np.mean(data):.4f}")
print(f"Median: {np.median(data):.4f}")
print(f"Standard Deviation: {np.std(data):.4f}")
print(f"Variance: {np.var(data):.4f}")
print(f"Min: {np.min(data):.4f}")
print(f"Max: {np.max(data):.4f}")

# Percentiles
print(f"\\n25th Percentile: {np.percentile(data, 25):.4f}")
print(f"50th Percentile: {np.percentile(data, 50):.4f}")
print(f"75th Percentile: {np.percentile(data, 75):.4f}")

# Correlation
data2 = 2 * data + np.random.randn(100) * 0.5
correlation = np.corrcoef(data, data2)[0, 1]
print(f"\\nCorrelation coefficient: {correlation:.4f}")`
  },
  {
    title: "Broadcasting",
    code: `import numpy as np

# Broadcasting example
arr = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
print("Original array:")
print(arr)

# Add scalar
result1 = arr + 10
print("\\nAdd 10 to all elements:")
print(result1)

# Multiply by vector
vector = np.array([1, 2, 3])
result2 = arr * vector
print("\\nMultiply each row by [1, 2, 3]:")
print(result2)

# Add column vector
col_vector = np.array([[1], [2], [3]])
result3 = arr + col_vector
print("\\nAdd column vector:")
print(result3)`
  },
  {
    title: "Linear Algebra",
    code: `import numpy as np

# Solve linear equations: Ax = b
A = np.array([[3, 1], [1, 2]])
b = np.array([9, 8])

x = np.linalg.solve(A, b)
print("Solving Ax = b:")
print("A =")
print(A)
print("b =", b)
print("Solution x =", x)
print("Verification Ax =", np.dot(A, x))

# Eigenvalues and eigenvectors
print("\\nEigenvalues and Eigenvectors:")
eigenvalues, eigenvectors = np.linalg.eig(A)
print("Eigenvalues:", eigenvalues)
print("Eigenvectors:")
print(eigenvectors)

# Singular Value Decomposition
print("\\nSingular Value Decomposition:")
U, s, Vt = np.linalg.svd(A)
print("Singular values:", s)`
  }
]

const defaultCode = `import numpy as np

# Create a sample array
arr = np.array([1, 2, 3, 4, 5])

print("Array:", arr)
print("Mean:", np.mean(arr))
print("Sum:", np.sum(arr))
print("Standard Deviation:", np.std(arr))

# Create a 2D array
matrix = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
print("\\nMatrix:")
print(matrix)
print("Shape:", matrix.shape)`

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
  toggleTheme,
  runCode,
  clearCode,
  clearOutput,
  loadExample,
  initializePyodide
} = useLibraryPlayground({
  packageName: 'numpy',
  defaultCode,
  examples,
  additionalPackages: [],
  setupCode: `
import numpy as np
  `
})

onMounted(async () => {
  await initializePyodide()
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

