<template>
  <div>
    <!-- Editor Area -->
    <div class="sm:min-h-screen">
      <CodeEditor libraryName="NumPy" :theme="theme" :files="files" :activeFileId="activeFileId"
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
          Online NumPy Compiler
        </h1>

        <div class="max-w-4xl mx-auto text-left space-y-6 text-gray-700 dark:text-gray-300">
          <p class="text-base md:text-lg leading-relaxed">
            NumPy (Numerical Python) is the fundamental package for scientific computing in Python and serves as the
            foundation for the entire Python data science ecosystem. Our dedicated online NumPy compiler provides a
            complete browser environment for working with large, multi-dimensional arrays and matrices, along with a
            comprehensive collection of mathematical functions to operate on these arrays. NumPy's powerful ndarray
            object is the cornerstone of modern data analysis, machine learning, and scientific computing in Python.
          </p>

          <p class="text-base md:text-lg leading-relaxed">
            This compiler includes <strong>NumPy 1.14+</strong> with full support for ndarray operations, linear
            algebra,
            Fourier transforms, and random number generation, all powered by Pyodide WebAssembly technology. The
            compiler
            supports all core NumPy features including array creation, manipulation with powerful indexing and slicing,
            broadcasting for efficient element-wise operations, and a comprehensive library of mathematical functions
            covering trigonometric, exponential, and logarithmic operations. Whether you're performing matrix
            operations,
            statistical analysis, or scientific computations, our NumPy playground offers instant execution without any
            setup.
            You can also upload and use files or folders directly in your code for data processing and numerical
            workflows.
            This compiler is online and completely free to use.
          </p>

          <p class="text-base md:text-lg leading-relaxed">
            Our platform comes with carefully crafted examples covering essential NumPy topics such as array basics,
            array creation using zeros, ones, identity matrices, random arrays, arange, and linspace functions. You'll
            learn matrix operations including multiplication, transpose, determinant, and inverse operations, as well as
            statistical analysis techniques for computing mean, median, standard deviation, percentiles, and correlation
            coefficients. The examples also demonstrate NumPy's broadcasting rules for efficient computations and linear
            algebra operations like solving linear equations, eigenvalue problems, and SVD decomposition.
          </p>

          <h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Ideal Use Cases</h3>
          <ul class="list-disc list-inside space-y-2 text-base md:text-lg ml-4">
            <li>Scientific computing and numerical analysis for research and education</li>
            <li>Data preprocessing for machine learning pipelines and model training</li>
            <li>Statistical analysis and modeling with advanced mathematical operations</li>
            <li>Signal and image processing applications in various domains</li>
            <li>Physics and engineering simulations requiring efficient array computations</li>
            <li>Financial calculations and quantitative analysis for trading algorithms</li>
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
  title: 'Online NumPy Compiler',
  meta: [
    { name: 'description', content: 'Run NumPy code online in your browser. Scientific computing with arrays, matrices, and numerical operations powered by Pyodide WebAssembly. No installation required.' },
    { name: 'keywords', content: 'numpy, scientific computing, python arrays, numerical python, online compiler, pyodide, numpy online, data science' },
    { name: 'author', content: 'Pybadu' },
    { property: 'og:title', content: 'Online NumPy Compiler' },
    { property: 'og:description', content: 'Run NumPy code online in your browser. Scientific computing with arrays and matrices.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/pybadu.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Online NumPy Compiler' },
    { name: 'twitter:description', content: 'Run NumPy code online with arrays and matrices' },
    { name: 'twitter:image', content: '/pybadu.png' }
  ]
})

// Example code snippets
const examples = [
  {
    title: "Array Basics",
    code: `# Create arrays
import numpy as np

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
    code: `# Different ways to create arrays
import numpy as np

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
    code: `# Matrix multiplication
import numpy as np

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
    code: `# Generate random data
import numpy as np

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
    code: `# Broadcasting example
import numpy as np

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
    code: `# Solve linear equations: Ax = b
import numpy as np

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

const defaultCode = `# Create a sample array
import numpy as np

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
