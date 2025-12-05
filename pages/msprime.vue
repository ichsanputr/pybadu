<template>
  <div>
    <!-- Editor Area -->
    <div class="sm:min-h-screen">
      <CodeEditor 
        libraryName="msprime"
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
          Online Python msprime Compiler
        </h1>
        
        <div class="max-w-4xl mx-auto text-left space-y-6 text-gray-700 dark:text-gray-300">
          <p class="text-base md:text-lg leading-relaxed">
            msprime is a population genetics simulator based on tskit that can simulate random ancestral histories for a sample of 
            individuals consistent with given demographic models. It simulates genealogical trees and genomic sequence data using 
            various population genetic models and evolutionary processes. msprime can simulate mutations on ancestral histories 
            (produced by msprime or other tskit-compatible programs) under a variety of genome sequence evolution models, making 
            it an essential tool for population genetics research, evolutionary biology, and bioinformatics.
          </p>
          
          <p class="text-base md:text-lg leading-relaxed">
            This compiler includes <strong>msprime 1.3+</strong> with full support for coalescent simulation, powered by Pyodide 
            WebAssembly technology. msprime supports simulating ancestral histories under different demographic models including 
            constant population size, population growth, migration, and complex demographic scenarios. You can simulate genealogical 
            trees with recombination, add mutations to tree sequences, analyze genetic diversity, and work with tree sequence data 
            structures. Whether you're studying population genetics, evolutionary processes, genetic diversity, or demographic history, 
            our msprime playground offers instant execution with comprehensive simulation capabilities. You can also upload and use 
            files or folders directly in your code for population genetics analysis workflows. This compiler is online and completely 
            free to use.
          </p>

          <p class="text-base md:text-lg leading-relaxed">
            Our example collection covers essential msprime topics including basic coalescent simulation, simulating ancestral histories 
            with recombination, adding mutations to tree sequences, working with demographic models, analyzing genetic diversity, and 
            tree sequence manipulation. You'll learn how to simulate population genetic data, work with tree sequences, analyze genetic 
            variation, and perform population genetics simulations for research and education.
          </p>

          <h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Who Should Use This</h3>
          <ul class="list-disc list-inside space-y-2 text-base md:text-lg ml-4">
            <li>Population geneticists studying evolutionary processes and genetic diversity</li>
            <li>Bioinformaticians analyzing genomic data and simulating genetic scenarios</li>
            <li>Evolutionary biologists modeling demographic history and population structure</li>
            <li>Researchers studying coalescent theory and genealogical processes</li>
            <li>Students learning population genetics and evolutionary biology</li>
            <li>Scientists developing methods for genetic data analysis and simulation</li>
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
  name: 'MsprimePlayground'
})

definePageMeta({
  layout: 'library'
})

useHead({
  title: 'Online Python msprime Compiler',
  meta: [
    { name: 'description', content: 'Simulate population genetics data with Python msprime in your browser. Coalescent simulation, genealogical trees, and genomic sequence data powered by Pyodide WebAssembly. No installation required.' },
    { name: 'keywords', content: 'msprime, population genetics, coalescent simulation, tree sequence, genomic simulation, online compiler, pyodide, bioinformatics' },
    { name: 'author', content: 'Pybadu' },
    { property: 'og:title', content: 'Online Python msprime Compiler' },
    { property: 'og:description', content: 'Simulate population genetics data with Python msprime in your browser' },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/pybadu.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Online Python msprime Compiler' },
    { name: 'twitter:description', content: 'Simulate population genetics data with Python msprime in your browser' },
    { name: 'twitter:image', content: '/pybadu.png' }
  ]
})

// Example code snippets
const examples = [
  {
    title: "Basic Coalescent Simulation",
    code: `import msprime

# Simulate ancestral history for 3 diploid samples
ts = msprime.sim_ancestry(
    samples=3,
    population_size=10000,
    sequence_length=1000
)

print(f"Number of trees: {ts.num_trees}")
print(f"Number of samples: {ts.num_samples}")
print(f"Sequence length: {ts.sequence_length}")
print(f"\\nTree sequence summary:")
print(ts)`
  },
  {
    title: "Simulation with Recombination",
    code: `import msprime

# Simulate with recombination
ts = msprime.sim_ancestry(
    samples=5,
    recombination_rate=1e-8,
    sequence_length=5000,
    population_size=10000
)

print(f"Number of trees: {ts.num_trees}")
print(f"Sequence length: {ts.sequence_length}")

# Get first tree
tree = ts.first()
print(f"\\nFirst tree:")
print(tree.draw_text())`
  },
  {
    title: "Adding Mutations",
    code: `import msprime

# Simulate ancestral history
ts = msprime.sim_ancestry(
    samples=4,
    population_size=10000,
    sequence_length=1000
)

# Add mutations
mts = msprime.sim_mutations(ts, rate=1e-8)

print(f"Original tree sequence: {ts.num_trees} trees")
print(f"With mutations: {mts.num_mutations} mutations")
print(f"\\nNumber of sites: {mts.num_sites}")

# Get genetic diversity
diversity = mts.diversity()
print(f"\\nGenetic diversity: {diversity}")`
  },
  {
    title: "Demographic Model",
    code: `import msprime

# Define demographic model with population growth
demography = msprime.Demography()
demography.add_population(name="pop1", initial_size=10000)
demography.add_population(name="pop2", initial_size=5000)
demography.add_population_parameters_change(
    time=1000,
    population="pop1",
    initial_size=20000
)

# Simulate with demographic model
ts = msprime.sim_ancestry(
    samples={"pop1": 3, "pop2": 2},
    demography=demography,
    sequence_length=2000
)

print(f"Number of populations: {ts.num_populations}")
print(f"Number of samples: {ts.num_samples}")
print(f"\\nDemography:")
print(demography)`
  },
  {
    title: "Analyzing Genetic Diversity",
    code: `import msprime

# Simulate tree sequence
ts = msprime.sim_ancestry(
    samples=10,
    population_size=10000,
    sequence_length=5000,
    recombination_rate=1e-8
)

# Add mutations
mts = msprime.sim_mutations(ts, rate=1e-8)

# Calculate statistics
diversity = mts.diversity()
tajimas_d = mts.Tajimas_D()
num_segregating = mts.num_sites

print(f"Genetic diversity (π): {diversity:.6f}")
print(f"Tajima's D: {tajimas_d:.6f}")
print(f"Number of segregating sites: {num_segregating}")

# Get tree statistics
num_trees = mts.num_trees
print(f"\\nNumber of trees: {num_trees}")`
  },
  {
    title: "Tree Sequence Analysis",
    code: `import msprime

# Simulate tree sequence
ts = msprime.sim_ancestry(
    samples=6,
    population_size=10000,
    sequence_length=3000,
    recombination_rate=1e-8
)

# Add mutations
mts = msprime.sim_mutations(ts, rate=1e-8)

print(f"Tree sequence properties:")
print(f"  Samples: {mts.num_samples}")
print(f"  Trees: {mts.num_trees}")
print(f"  Sites: {mts.num_sites}")
print(f"  Mutations: {mts.num_mutations}")

# Iterate through trees
print(f"\\nTree information:")
for i, tree in enumerate(mts.trees()):
    if i < 3:  # Show first 3 trees
        print(f"  Tree {i}: {tree.interval}")
        print(f"    Root: {tree.root}")
        print(f"    Num nodes: {tree.num_nodes()}")`
  }
]

const defaultCode = `import msprime

# Simulate ancestral history for 3 diploid samples
ts = msprime.sim_ancestry(
    samples=3,
    population_size=10000,
    sequence_length=1000
)

print(f"Number of trees: {ts.num_trees}")
print(f"Number of samples: {ts.num_samples}")
print(f"Sequence length: {ts.sequence_length}")
print(f"\\nTree sequence summary:")
print(ts)`

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
  packageName: 'msprime',
  defaultCode,
  examples,
  additionalPackages: [],
  setupCode: `
import msprime
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

