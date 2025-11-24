<template>
  <div>
    <div class="min-h-screen">
      <CodeEditor
        libraryName="NetworkX"
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
        @deleteFile="deleteFile"
        @renameFile="renameFile"
        @saveToStorage="saveToStorage"
      />
    </div>

    <LibraryInfoSection>
      <div class="text-center mb-12">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Online Python NetworkX Compiler
        </h1>

        <div class="max-w-4xl mx-auto text-left space-y-6 text-gray-700 dark:text-gray-300">
          <p class="text-base md:text-lg leading-relaxed">
            NetworkX is the de facto Python package for building, analyzing, and visualizing complex networks. It ships hundreds of algorithms for graph traversal, centrality, connectivity, community detection, flow, and shortest paths, all implemented in pure Python with a focus on clarity and extensibility.[^1]
          </p>

          <p class="text-base md:text-lg leading-relaxed">
            This compiler loads NetworkX directly in the browser so you can prototype graph logic without a local environment. Create graphs from edge lists, compute paths, examine degrees, run centrality metrics, and serialize structures for visualization. It’s perfect for testing algorithm ideas, preparing teaching material, or inspecting dataset snippets before integrating them into larger workflows.
          </p>

          <p class="text-base md:text-lg leading-relaxed">
            The bundled snippets demonstrate practical workflows: building undirected graphs, finding weighted shortest paths, ranking influencers with centrality, generating spanning trees, running bipartite checks, and exporting data for drawing. Adapt them for network science, recommendation systems, knowledge graphs, or operational routing problems.
          </p>

          <h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Who Should Use This</h3>
          <ul class="list-disc list-inside space-y-2 text-base md:text-lg ml-4">
            <li>Data scientists modeling relationships between users, devices, or events</li>
            <li>Researchers teaching graph theory or prototyping new algorithms</li>
            <li>Engineers building routing, dependency, or social analytics services</li>
            <li>Students practicing algorithms on small graphs without local setup</li>
            <li>Anyone needing a quick sandbox for NetworkX experimentation</li>
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
  name: 'NetworkXPlayground'
})

definePageMeta({
  layout: 'library'
})

useHead({
  title: 'Online Python NetworkX Compiler',
  meta: [
    { name: 'description', content: 'Prototype NetworkX graphs directly in your browser. Build graphs, compute paths, and run centrality algorithms with Pyodide-powered Python.' },
    { name: 'keywords', content: 'networkx, graph algorithms, python graphs, shortest path, centrality, online python compiler, pyodide' },
    { name: 'author', content: 'Pybadu' },
    { property: 'og:title', content: 'Online Python NetworkX Compiler' },
    { property: 'og:description', content: 'Prototype NetworkX graphs directly in your browser' },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/pybadu.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Online Python NetworkX Compiler' },
    { name: 'twitter:description', content: 'Prototype NetworkX graphs directly in your browser' },
    { name: 'twitter:image', content: '/pybadu.png' }
  ]
})

const examples = [
  {
    title: 'Basic Graph & Nodes',
    code: `import networkx as nx

G = nx.Graph()
G.add_edge("A", "B")
G.add_edge("B", "C")

print("Nodes:", G.nodes())
print("Edges:", G.edges())`
  },
  {
    title: 'Weighted Shortest Path',
    code: `import networkx as nx

G = nx.Graph()
G.add_edge("A", "B", weight=4)
G.add_edge("B", "D", weight=2)
G.add_edge("A", "C", weight=3)
G.add_edge("C", "D", weight=4)

path = nx.shortest_path(G, "A", "D", weight="weight")
distance = nx.shortest_path_length(G, "A", "D", weight="weight")
print("Path:", path)
print("Distance:", distance)`
  },
  {
    title: 'Degree Centrality Ranking',
    code: `import networkx as nx

G = nx.karate_club_graph()
centrality = nx.degree_centrality(G)
top = sorted(centrality.items(), key=lambda x: x[1], reverse=True)[:5]

for node, score in top:
    print(node, round(score, 3))`
  },
  {
    title: 'Generate Spanning Tree',
    code: `import networkx as nx

G = nx.cycle_graph(6)
tree = nx.minimum_spanning_tree(G)

print("Tree edges:", list(tree.edges()))`
  },
  {
    title: 'Check Bipartite Graph',
    code: `import networkx as nx

B = nx.Graph()
B.add_edges_from([(1, "a"), (1, "b"), (2, "a")])

print("Is bipartite?", nx.is_bipartite(B))
print("Coloring:", nx.bipartite.color(B))`
  },
  {
    title: 'Export For Visualization',
    code: `import json
import networkx as nx

G = nx.path_graph(5)
data = nx.node_link_data(G)
print(json.dumps(data, indent=2))`
  }
]

const defaultCode = `import networkx as nx

G = nx.Graph()
G.add_edge("A", "B")
print(G.nodes())`

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
  packageName: 'networkx',
  defaultCode,
  examples,
  additionalPackages: [],
  setupCode: `
import networkx as nx
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

