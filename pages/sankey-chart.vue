<template>
    <div>
        <!-- Editor Area -->
        <div class="sm:min-h-screen">
            <CodeEditor libraryName="Online Sankey Chart" :theme="theme" :files="files" :activeFileId="activeFileId"
                :code="currentFileContent" :output="output" :isLoading="isLoading" :pyodideReady="pyodideReady"
                :monacoTheme="monacoTheme" :examples="examples" :assets="assets" :assetsUploading="assetsUploading"
                @update:code="updateCurrentFile" @toggleTheme="toggleTheme" @runCode="runCode" @clearCode="clearCode"
                @clearOutput="clearOutput" @loadExample="loadExample" @newFile="createNewFile" @selectFile="selectFile"
                @deleteFile="deleteFile" @renameFile="renameFile" @saveToStorage="saveToStorage"
                @uploadAssets="uploadAssets" @deleteAsset="deleteAsset" @downloadAsset="downloadAsset"
                @refreshAssets="refreshAssets" @createAssetFolder="createAssetFolder" />

        </div>

        <!-- Information Section -->
        <LibraryInfoSection>
            <!-- Header -->
            <div class="text-center mb-12">
                <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                    Online Sankey Chart Python
                </h1>

                <div class="max-w-4xl mx-auto text-left space-y-6 text-gray-700 dark:text-gray-300">
                    <p class="text-base md:text-lg leading-relaxed">
                        <strong>Sankey diagrams</strong> are specialized flow diagrams where the width of arrows is
                        proportional
                        to the flow quantity, making them perfect for visualizing energy flows, material transfers, cost
                        distributions, and any process where quantities move between different stages. Named after Irish
                        Captain Matthew Henry Phineas Riall Sankey who first used this diagram type in 1898 to
                        illustrate
                        the energy efficiency of a steam engine, Sankey charts have become an indispensable tool in
                        engineering,
                        environmental science, economics, and data analytics. The visual representation instantly
                        reveals
                        dominant flows, losses, and distribution patterns that would be difficult to grasp from raw data
                        alone.
                    </p>

                    <p class="text-base md:text-lg leading-relaxed">
                        This <strong>online Sankey chart tool</strong> uses Python's Matplotlib library, specifically
                        importing the <code>Sankey</code> class from <code>matplotlib.sankey</code> module. Unlike
                        general
                        Matplotlib plotting, this is a dedicated tool focused entirely on building professional Sankey
                        diagrams
                        with Python. It runs completely in your browser using Pyodide WebAssembly technology—no
                        installation,
                        no setup, completely free. You get the full power of Python's Sankey visualization capabilities
                        with
                        support for multi-stage flows, custom colors, labels, orientations, and formatting options to
                        build
                        publication-quality diagrams for presentations, reports, academic papers, and business
                        analytics.
                    </p>

                    <p class="text-base md:text-lg leading-relaxed">
                        Whether you're an energy analyst visualizing power generation and distribution, an environmental
                        scientist tracking material flows in ecosystems, a business analyst showing budget allocations,
                        a supply chain manager mapping logistics flows, or a student learning about process
                        visualization,
                        this free online Python Sankey tool makes it easy to create beautiful and informative flow
                        diagrams.
                        With our comprehensive example gallery featuring energy networks, manufacturing processes,
                        budget
                        breakdowns, water treatment flows, and website traffic patterns, you can quickly learn and adapt
                        Sankey diagram patterns to your specific needs. Create professional Sankey charts online, free,
                        with the flexibility of Python code!
                    </p>

                    <h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Perfect For</h3>
                    <ul class="list-disc list-inside space-y-2 text-base md:text-lg ml-4">
                        <li>Energy analysts visualizing power generation and distribution flows</li>
                        <li>Environmental scientists mapping material and resource flows</li>
                        <li>Business analysts creating budget allocation and cost flow diagrams</li>
                        <li>Data scientists visualizing data pipelines and transformations</li>
                        <li>Students and educators learning about flow diagrams and process visualization</li>
                        <li>Web analysts showing user journey and traffic flow patterns</li>
                    </ul>
                </div>
            </div>

        </LibraryInfoSection>

        <!-- Footer -->
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
    name: 'SankeyChartPlayground'
})

definePageMeta({
    layout: 'library'
})

useHead({
    title: 'Online Sankey Chart Python',
    meta: [
        { name: 'description', content: 'Build Sankey diagrams online for free with Python. Visualize flows, energy distribution, budgets, and processes in your browser. No installation required.' },
        { name: 'keywords', content: 'sankey chart, sankey diagram, python sankey, online sankey, build sankey, free sankey, flow diagram, energy flow, matplotlib sankey, sankey online free, python flow diagram' },
        { name: 'author', content: 'Pybadu' },
        { property: 'og:title', content: 'Online Sankey Chart Python - Free Sankey Diagram Tool' },
        { property: 'og:description', content: 'Build beautiful Sankey diagrams online for free. Visualize flows and processes with Python in your browser.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:image', content: '/pybadu.png' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Online Sankey Chart Python' },
        { name: 'twitter:description', content: 'Build Sankey diagrams online for free in your browser with Python' },
        { name: 'twitter:image', content: '/pybadu.png' }
    ]
})

// Example code snippets
const examples = [
    {
        title: "Basic Sankey Diagram",
        code: `import matplotlib.pyplot as plt
from matplotlib.sankey import Sankey

# Create a simple Sankey diagram
fig = plt.figure(figsize=(10, 6))
ax = fig.add_subplot(1, 1, 1, xticks=[], yticks=[])

sankey = Sankey(ax=ax, scale=0.01, offset=0.2, head_angle=120)

# Define flows: positive = input, negative = output
sankey.add(flows=[100, -40, -30, -30],
           labels=['Input', 'Output A', 'Output B', 'Output C'],
           orientations=[0, 1, -1, 0],
           pathlengths=[0.5, 0.5, 0.5, 0.5],
           facecolor='#3776ab')

# Render the diagram
diagrams = sankey.finish()

plt.title('Basic Sankey Diagram', fontsize=16, fontweight='bold')
plt.tight_layout()
plt.show()

print("Basic Sankey diagram created!")`
    },
    {
        title: "Energy Flow Diagram",
        code: `import matplotlib.pyplot as plt
from matplotlib.sankey import Sankey

# Energy distribution Sankey diagram
fig = plt.figure(figsize=(12, 8))
ax = fig.add_subplot(1, 1, 1, xticks=[], yticks=[])

sankey = Sankey(ax=ax, scale=0.005, offset=0.3, head_angle=120, 
                format='%.0f', unit=' MW')

# Primary energy input
sankey.add(flows=[1000, -350, -250, -200, -200],
           labels=['Power Plant\\n1000 MW', 
                   'Residential\\n350 MW', 
                   'Commercial\\n250 MW',
                   'Industrial\\n200 MW', 
                   'Losses\\n200 MW'],
           orientations=[0, 1, 1, -1, -1],
           pathlengths=[0.3, 0.5, 0.4, 0.5, 0.4],
           facecolor='#2ecc71',
           alpha=0.8)

diagrams = sankey.finish()

plt.title('Energy Distribution Network', fontsize=18, fontweight='bold', pad=20)
plt.tight_layout()
plt.show()

print("Energy flow Sankey diagram created!")`
    },
    {
        title: "Multi-Stage Process",
        code: `import matplotlib.pyplot as plt
from matplotlib.sankey import Sankey

# Multi-stage manufacturing process
fig = plt.figure(figsize=(14, 8))
ax = fig.add_subplot(1, 1, 1, xticks=[], yticks=[])

sankey = Sankey(ax=ax, scale=0.01, offset=0.2, head_angle=100, 
                format='%.0f', unit=' units')

# Stage 1: Raw materials
sankey.add(flows=[100, -25, -75],
           labels=['Raw Materials', 'Waste', ''],
           orientations=[0, 1, 0],
           pathlengths=[0.3, 0.3, 0.3],
           facecolor='#e74c3c',
           alpha=0.8)

# Stage 2: Processing
sankey.add(flows=[75, -10, -65],
           labels=['', 'Defects', ''],
           orientations=[0, 1, 0],
           pathlengths=[0.3, 0.3, 0.3],
           facecolor='#3498db',
           alpha=0.8,
           prior=0, connect=(2, 0))

# Stage 3: Final product
sankey.add(flows=[65, -5, -60],
           labels=['', 'Quality Control\\nRejects', 'Final\\nProduct'],
           orientations=[0, 1, 0],
           pathlengths=[0.3, 0.3, 0.3],
           facecolor='#2ecc71',
           alpha=0.8,
           prior=1, connect=(2, 0))

diagrams = sankey.finish()

plt.title('Manufacturing Process Flow', fontsize=18, fontweight='bold', pad=20)
plt.tight_layout()
plt.show()

print("Multi-stage process Sankey diagram created!")`
    },
    {
        title: "Budget Allocation",
        code: `import matplotlib.pyplot as plt
from matplotlib.sankey import Sankey

# Budget allocation Sankey diagram
fig = plt.figure(figsize=(12, 9))
ax = fig.add_subplot(1, 1, 1, xticks=[], yticks=[])

sankey = Sankey(ax=ax, scale=0.0008, offset=0.3, head_angle=110,
                format='$%.0f', unit='K')

# Total budget breakdown
sankey.add(flows=[1000, -350, -250, -200, -150, -50],
           labels=['Annual\\nBudget', 
                   'Operations\\n$350K',
                   'Marketing\\n$250K',
                   'R&D\\n$200K',
                   'HR\\n$150K',
                   'Other\\n$50K'],
           orientations=[0, 1, 1, -1, -1, 0],
           pathlengths=[0.25, 0.4, 0.5, 0.5, 0.4, 0.25],
           facecolor='#9b59b6',
           alpha=0.85)

diagrams = sankey.finish()

plt.title('Annual Budget Allocation', fontsize=18, fontweight='bold', pad=20)
plt.tight_layout()
plt.show()

print("Budget allocation Sankey diagram created!")`
    },
    {
        title: "Water Treatment Plant",
        code: `import matplotlib.pyplot as plt
from matplotlib.sankey import Sankey

# Water treatment flow diagram
fig = plt.figure(figsize=(14, 10))
ax = fig.add_subplot(1, 1, 1, xticks=[], yticks=[])

sankey = Sankey(ax=ax, scale=0.003, offset=0.25, head_angle=115,
                format='%.1f', unit=' ML/day')

# Input water
sankey.add(flows=[500, -50, -450],
           labels=['Raw Water\\n500 ML/day', 
                   'Screening\\nRejects',
                   ''],
           orientations=[0, 1, 0],
           pathlengths=[0.3, 0.3, 0.3],
           facecolor='#1abc9c',
           alpha=0.8)

# Primary treatment
sankey.add(flows=[450, -80, -370],
           labels=['', 
                   'Sedimentation\\nSludge',
                   ''],
           orientations=[0, 1, 0],
           pathlengths=[0.3, 0.3, 0.3],
           facecolor='#3498db',
           alpha=0.8,
           prior=0, connect=(2, 0))

# Secondary treatment
sankey.add(flows=[370, -40, -330],
           labels=['', 
                   'Biological\\nWaste',
                   ''],
           orientations=[0, 1, 0],
           pathlengths=[0.3, 0.3, 0.3],
           facecolor='#2ecc71',
           alpha=0.8,
           prior=1, connect=(2, 0))

# Final distribution
sankey.add(flows=[330, -10, -320],
           labels=['', 
                   'Filtration\\nBackwash',
                   'Treated Water\\n320 ML/day'],
           orientations=[0, 1, 0],
           pathlengths=[0.3, 0.3, 0.3],
           facecolor='#3498db',
           alpha=0.8,
           prior=2, connect=(2, 0))

diagrams = sankey.finish()

plt.title('Water Treatment Plant Flow', fontsize=18, fontweight='bold', pad=20)
plt.tight_layout()
plt.show()

print("Water treatment Sankey diagram created!")`
    },
    {
        title: "Website Traffic Flow",
        code: `import matplotlib.pyplot as plt
from matplotlib.sankey import Sankey

# Website visitor flow
fig = plt.figure(figsize=(13, 9))
ax = fig.add_subplot(1, 1, 1, xticks=[], yticks=[])

sankey = Sankey(ax=ax, scale=0.0005, offset=0.3, head_angle=110,
                format='%.0f', unit=' visitors')

# Initial traffic
sankey.add(flows=[10000, -3000, -7000],
           labels=['Total\\nVisitors', 
                   'Bounce\\n3000',
                   ''],
           orientations=[0, 1, 0],
           pathlengths=[0.25, 0.35, 0.35],
           facecolor='#e67e22',
           alpha=0.85)

# Engaged users
sankey.add(flows=[7000, -4000, -3000],
           labels=['', 
                   'Browse Only\\n4000',
                   ''],
           orientations=[0, 1, 0],
           pathlengths=[0.3, 0.35, 0.35],
           facecolor='#3498db',
           alpha=0.85,
           prior=0, connect=(2, 0))

# Conversions
sankey.add(flows=[3000, -2000, -1000],
           labels=['', 
                   'Add to Cart\\n2000',
                   'Purchase\\n1000'],
           orientations=[0, 1, 0],
           pathlengths=[0.3, 0.35, 0.35],
           facecolor='#2ecc71',
           alpha=0.85,
           prior=1, connect=(2, 0))

diagrams = sankey.finish()

plt.title('Website Traffic & Conversion Flow', fontsize=18, fontweight='bold', pad=20)
plt.tight_layout()
plt.show()

print("Website traffic flow Sankey diagram created!")`
    }
]

const defaultCode = `import matplotlib.pyplot as plt
from matplotlib.sankey import Sankey

# Create a simple Sankey diagram
fig = plt.figure(figsize=(10, 6))
ax = fig.add_subplot(1, 1, 1, xticks=[], yticks=[])

sankey = Sankey(ax=ax, scale=0.01, offset=0.2, head_angle=120)

# Define flows: positive = input, negative = output
sankey.add(flows=[100, -40, -30, -30],
           labels=['Input', 'Output A', 'Output B', 'Output C'],
           orientations=[0, 1, -1, 0],
           pathlengths=[0.5, 0.5, 0.5, 0.5],
           facecolor='#3776ab')

# Render the diagram
diagrams = sankey.finish()

plt.title('Basic Sankey Diagram', fontsize=16, fontweight='bold')
plt.tight_layout()
plt.show()

print("Sankey diagram generated successfully!")`

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

    downloadAsset,
    createAssetFolder
} = useLibraryPlayground({
    packageName: 'matplotlib', // Use matplotlib package (sankey is part of it)
    storageKeyPrefix: 'sankey', // But use separate storage key for file history
    defaultCode,
    examples,
    additionalPackages: [],
    setupCode: `
import matplotlib
import matplotlib.pyplot as plt
import numpy as np

# Set matplotlib backend for web
matplotlib.use('Agg')

# Configure matplotlib for better web display
plt.rcParams['figure.facecolor'] = 'white'
plt.rcParams['axes.facecolor'] = 'white'
plt.rcParams['figure.dpi'] = 100
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
