<template>
  <div>
    <div class="min-h-screen">
      <CodeEditor
        libraryName="SymPy"
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
        @createAssetFolder="createAssetFolder"
      />
    </div>

    <LibraryInfoSection>
      <div class="text-center mb-12">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Online Python SymPy Compiler
        </h1>

        <div class="max-w-4xl mx-auto text-left space-y-6 text-gray-700 dark:text-gray-300">
          <p class="text-base md:text-lg leading-relaxed">
            SymPy is a pure-Python computer algebra system covering symbolic calculus, algebra, number theory, matrices, discrete math, plotting, and more. It powers everything from education tools to research workflows thanks to its readable API and ability to export LaTeX, code, or numerical lambdas.[^1]
          </p>

          <p class="text-base md:text-lg leading-relaxed">
            This compiler bundles SymPy directly in the browser so you can explore symbolic math without installing dependencies or configuring kernels. Upload files and folders to work with local mathematical data, differentiate expressions, solve equations, simplify identities, experiment with series, or generate code for numerical backends before bringing the logic into notebooks or services. This online compiler is completely free and requires no installation.
          </p>

          <p class="text-base md:text-lg leading-relaxed">
            Included examples highlight core workflows: symbolic derivatives, equation solving, simplification, matrix computations, series expansion, and lambdify/export helpers. Use them to prototype classroom activities, verify formulas, or share reproducible CAS snippets with teammates quickly.
          </p>

          <h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Who Should Use This</h3>
          <ul class="list-disc list-inside space-y-2 text-base md:text-lg ml-4">
            <li>Students studying calculus, linear algebra, or discrete math</li>
            <li>Researchers manipulating symbolic expressions or analytic proofs</li>
            <li>Engineers generating closed-form solutions before numerical coding</li>
            <li>Educators preparing examples for lessons or documentation</li>
            <li>Anyone needing a quick CAS sandbox without local setup</li>
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
  name: 'SymPyPlayground'
})

definePageMeta({
  layout: 'library'
})

useHead({
  title: 'Online Python SymPy Compiler',
  meta: [
    { name: 'description', content: 'Run SymPy symbolic math directly in your browser. Differentiate, solve equations, and manipulate expressions using Pyodide-powered Python.' },
    { name: 'keywords', content: 'sympy, symbolic math, computer algebra, calculus, python cas, online python compiler, pyodide' },
    { name: 'author', content: 'Pybadu' },
    { property: 'og:title', content: 'Online Python SymPy Compiler' },
    { property: 'og:description', content: 'Run SymPy symbolic math directly in your browser' },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/pybadu.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Online Python SymPy Compiler' },
    { name: 'twitter:description', content: 'Run SymPy symbolic math directly in your browser' },
    { name: 'twitter:image', content: '/pybadu.png' }
  ]
})

const examples = [
  {
    title: 'Symbolic Derivative',
    code: `import sympy as sp

x = sp.symbols("x")
expr = sp.sin(x) * sp.exp(x)
print(sp.diff(expr, x))`
  },
  {
    title: 'Solve Equations',
    code: `import sympy as sp

x = sp.symbols("x")
solution = sp.solve(sp.Eq(x**2 - 4, 0), x)
print(solution)`
  },
  {
    title: 'Simplify Expressions',
    code: `import sympy as sp

x = sp.symbols("x")
expr = sp.expand((x + 1)**4)
print("Expanded:", expr)
print("Factored:", sp.factor(expr))`
  },
  {
    title: 'Matrix Operations',
    code: `import sympy as sp

M = sp.Matrix([[1, 2], [3, 4]])
print("Determinant:", M.det())
print("Inverse:", M.inv())`
  },
  {
    title: 'Series Expansion',
    code: `import sympy as sp

x = sp.symbols("x")
series = sp.series(sp.sin(x) / x, x, 0, 6)
print(series)`
  },
  {
    title: 'Lambdify For Numerical Use',
    code: `import sympy as sp
import math

x = sp.symbols("x")
expr = sp.sin(x) + x**2
f = sp.lambdify(x, expr, modules=["math"])
print(f(math.pi))`
  }
]

const defaultCode = `import sympy as sp

x = sp.symbols("x")
print(sp.diff(x**3, x))`

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
  createAssetFolder,
  initializePyodide,
  cleanupWorker
} = useLibraryPlayground({
  packageName: 'sympy',
  defaultCode,
  examples,
  additionalPackages: [],
  setupCode: `
import sympy as sp
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

