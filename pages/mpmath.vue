<template>
  <div>
    <!-- Editor Area -->
    <div class="sm:min-h-screen">
      <CodeEditor 
        libraryName="mpmath"
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
          Online Python mpmath Compiler
        </h1>
        
        <div class="max-w-4xl mx-auto text-left space-y-6 text-gray-700 dark:text-gray-300">
          <p class="text-base md:text-lg leading-relaxed">
            mpmath is a free (BSD licensed) Python library for real and complex floating-point arithmetic with arbitrary precision. 
            It provides a complete replacement for Python's float/complex types and math/cmath modules, but with the ability to 
            perform calculations at any desired precision from 10 digits to thousands of digits. mpmath implements a huge number 
            of special functions with arbitrary precision and full support for complex numbers, making it essential for high-precision 
            numerical computations, scientific computing, and mathematical research.
          </p>
          
          <p class="text-base md:text-lg leading-relaxed">
            This compiler includes <strong>mpmath 1.3+</strong> with full support for arbitrary-precision arithmetic, powered by 
            Pyodide WebAssembly technology. mpmath features numerical integration (regular, double/triple integrals, oscillatory), 
            numerical differentiation, root-finding algorithms, linear algebra operations, and an extensive collection of special 
            functions including gamma functions, Bessel functions, zeta functions, elliptic integrals, and hypergeometric functions. 
            Whether you're computing mathematical constants to high precision, solving differential equations, performing numerical 
            analysis, or working with special functions, our mpmath playground offers instant execution with comprehensive mathematical 
            capabilities. You can also upload and use files or folders directly in your code for mathematical computation workflows. 
            This compiler is online and completely free to use.
          </p>

          <p class="text-base md:text-lg leading-relaxed">
            Our example collection covers essential mpmath topics including arbitrary-precision arithmetic, computing mathematical 
            constants, special functions evaluation, numerical integration and differentiation, root-finding, and complex number 
            operations. You'll learn how to set precision, perform high-precision calculations, evaluate special functions, and 
            solve numerical problems with arbitrary accuracy.
          </p>

          <h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Who Should Use This</h3>
          <ul class="list-disc list-inside space-y-2 text-base md:text-lg ml-4">
            <li>Mathematicians and researchers performing high-precision numerical computations</li>
            <li>Scientists working with special functions and mathematical constants</li>
            <li>Engineers solving numerical problems requiring arbitrary precision</li>
            <li>Students learning numerical methods and computational mathematics</li>
            <li>Developers building scientific computing applications with precision requirements</li>
            <li>Researchers computing mathematical constants and evaluating special functions</li>
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
  name: 'MpmathPlayground'
})

definePageMeta({
  layout: 'library'
})

useHead({
  title: 'Online Python mpmath Compiler',
  meta: [
    { name: 'description', content: 'Perform arbitrary-precision floating-point arithmetic with Python mpmath in your browser. High-precision calculations, special functions, and numerical methods powered by Pyodide WebAssembly. No installation required.' },
    { name: 'keywords', content: 'mpmath, arbitrary precision, numerical computation, special functions, high precision, online compiler, pyodide, mathematical computing' },
    { name: 'author', content: 'Pybadu' },
    { property: 'og:title', content: 'Online Python mpmath Compiler' },
    { property: 'og:description', content: 'Perform arbitrary-precision floating-point arithmetic with Python mpmath in your browser' },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/pybadu.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Online Python mpmath Compiler' },
    { name: 'twitter:description', content: 'Perform arbitrary-precision floating-point arithmetic with Python mpmath in your browser' },
    { name: 'twitter:image', content: '/pybadu.png' }
  ]
})

// Example code snippets
const examples = [
  {
    title: "Arbitrary Precision Arithmetic",
    code: `from mpmath import mp

# Set decimal places (precision)
mp.dps = 50

# High-precision calculations
a = mp.mpf('0.1')
b = mp.mpf('0.2')
result = a + b

print(f"0.1 + 0.2 with 50 decimal places:")
print(result)
print(f"\\nExact representation: {result}")

# Compare with regular Python float
regular = 0.1 + 0.2
print(f"\\nRegular Python float: {regular}")
print(f"Difference: {result - regular}")`
  },
  {
    title: "Computing Pi with High Precision",
    code: `from mpmath import mp

# Compute pi using Gaussian integral
mp.dps = 50

# Method 1: Using quad (numerical integration)
pi1 = mp.quad(lambda x: mp.exp(-x**2), [-mp.inf, mp.inf]) ** 2

# Method 2: Using mpmath's built-in pi
pi2 = mp.pi

print(f"Pi computed via Gaussian integral (50 digits):")
print(pi1)
print(f"\\nBuilt-in pi constant (50 digits):")
print(pi2)
print(f"\\nDifference: {abs(pi1 - pi2)}")`
  },
  {
    title: "Special Functions",
    code: `from mpmath import mp

mp.dps = 30

# Gamma function
gamma_val = mp.gamma(5)
print(f"Gamma(5) = 4! = {gamma_val}")

# Zeta function
zeta_val = mp.zeta(2)
print(f"\\nZeta(2) = π²/6 ≈ {zeta_val}")

# Bessel function
bessel_val = mp.besselj(0, 1)
print(f"\\nJ₀(1) = {bessel_val}")

# Error function
erf_val = mp.erf(1)
print(f"\\nErf(1) = {erf_val}")

# Exponential integral
ei_val = mp.ei(1)
print(f"\\nEi(1) = {ei_val}")`
  },
  {
    title: "Numerical Integration",
    code: `from mpmath import mp

mp.dps = 30

# Define function
def f(x):
    return mp.sin(x) * mp.exp(-x)

# Integrate from 0 to infinity
result = mp.quad(f, [0, mp.inf])

print(f"∫₀^∞ sin(x)·e^(-x) dx = {result}")

# Double integral
def g(x, y):
    return x * y

result2 = mp.quad(g, [0, 1], [0, 1])
print(f"\\n∫₀¹∫₀¹ x·y dx dy = {result2}")`
  },
  {
    title: "Root Finding",
    code: `from mpmath import mp

mp.dps = 30

# Define function
def f(x):
    return x**3 - 2*x - 5

# Find root using secant method
root = mp.findroot(f, 2)

print(f"Root of x³ - 2x - 5 = 0:")
print(f"x ≈ {root}")
print(f"\\nVerification: f({root}) = {f(root)}")

# Find multiple roots
def g(x):
    return mp.sin(x) - 0.5

roots = mp.findroot(g, [0, 10], solver='mnewton')
print(f"\\nRoots of sin(x) - 0.5 = 0 in [0, 10]:")
print(roots)`
  },
  {
    title: "Complex Number Operations",
    code: `from mpmath import mp

mp.dps = 30

# Complex numbers with high precision
z1 = mp.mpc(1, 1)  # 1 + i
z2 = mp.mpc(2, -1)  # 2 - i

# Operations
sum_z = z1 + z2
prod_z = z1 * z2
power_z = z1 ** 3

print(f"z1 = {z1}")
print(f"z2 = {z2}")
print(f"\\nz1 + z2 = {sum_z}")
print(f"z1 × z2 = {prod_z}")
print(f"z1³ = {power_z}")

# Complex functions
exp_z = mp.exp(z1)
log_z = mp.log(z1)
sin_z = mp.sin(z1)

print(f"\\nexp(z1) = {exp_z}")
print(f"log(z1) = {log_z}")
print(f"sin(z1) = {sin_z}")`
  }
]

const defaultCode = `from mpmath import mp

# Set decimal places (precision)
mp.dps = 50

# High-precision calculations
a = mp.mpf('0.1')
b = mp.mpf('0.2')
result = a + b

print(f"0.1 + 0.2 with 50 decimal places:")
print(result)
print(f"\\nExact representation: {result}")

# Compare with regular Python float
regular = 0.1 + 0.2
print(f"\\nRegular Python float: {regular}")
print(f"Difference: {result - regular}")`

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
  packageName: 'mpmath',
  defaultCode,
  examples,
  additionalPackages: [],
  setupCode: `
from mpmath import mp
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

