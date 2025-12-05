<template>
    <div>
        <!-- Editor Area -->
        <div class="sm:min-h-screen">
            <CodeEditor libraryName="Pygal" :theme="theme" :files="files" :activeFileId="activeFileId"
                :code="currentFileContent" :output="output" :isLoading="isLoading" :pyodideReady="pyodideReady"
                :monacoTheme="monacoTheme" :examples="examples" :assets="assets" :assetsUploading="assetsUploading"
                @update:code="updateCurrentFile" @toggleTheme="toggleTheme" @runCode="runCode" @clearCode="clearCode"
                @clearOutput="clearOutput" @loadExample="loadExample" @newFile="createNewFile" @selectFile="selectFile"
                @deleteFile="deleteFile" @renameFile="renameFile" @saveToStorage="saveToStorage"
                @uploadAssets="uploadAssets" @deleteAsset="deleteAsset" @refreshAssets="refreshAssets"
                @createAssetFolder="createAssetFolder" />

        </div>

        <!-- Information Section -->
        <LibraryInfoSection>
            <div class="text-center mb-12">
                <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                    Online Pygal Compiler
                </h1>

                <div class="max-w-4xl mx-auto text-left space-y-6 text-gray-700 dark:text-gray-300">
                    <p class="text-base md:text-lg leading-relaxed">
                        Pygal is a dynamic Python charting library that specializes in creating beautiful, interactive
                        Scalable Vector Graphics (SVG)
                        visualizations. Unlike libraries that produce static images, Pygal generates vector-based charts
                        that remain crisp and
                        clear at any zoom level, making them perfect for responsive web applications and high-quality
                        reports.
                    </p>

                    <p class="text-base md:text-lg leading-relaxed">
                        Our online Pygal compiler provides a complete environment to experiment with Pygal's extensive
                        features.
                        You can create a wide variety of chart types including Bar, Line, Pie, Histogram, Box, Radar,
                        and Gauge charts.
                        Every chart comes with built-in interactivity—hover over data points to see tooltips, or click
                        on legend items
                        to toggle data series. With support for custom styles, themes, and CSS integration, you can
                        tailor the look
                        and feel of your visualizations to match any design requirement.
                    </p>

                    <p class="text-base md:text-lg leading-relaxed">
                        Powered by Pyodide WebAssembly technology, this compiler runs entirely in your browser. This
                        means you can
                        generate SVG charts instantly without any server-side processing or installation. Whether you're
                        building
                        dashboards, creating reports, or simply exploring data, Pygal offers a simple yet powerful API
                        that lets you
                        create complex visualizations with just a few lines of code.
                    </p>

                    <h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Key Features</h3>
                    <ul class="list-disc list-inside space-y-2 text-base md:text-lg ml-4">
                        <li><strong>Interactive SVGs:</strong> Charts feature tooltips, hover effects, and series
                            toggling</li>
                        <li><strong>Responsive Design:</strong> Vector graphics scale perfectly to any screen size</li>
                        <li><strong>Rich Chart Gallery:</strong> Support for 14+ chart types including Funnel, Dot, and
                            Solid Gauge</li>
                        <li><strong>Customizable Styles:</strong> Built-in themes (Neon, Dark, Light) and CSS styling
                            support</li>
                        <li><strong>Browser-Based:</strong> Generate charts instantly with no server backend required
                        </li>
                    </ul>

                    <h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Ideal Use Cases
                    </h3>
                    <ul class="list-disc list-inside space-y-2 text-base md:text-lg ml-4">
                        <li><strong>Web Dashboards:</strong> Embedding lightweight, interactive charts in web apps</li>
                        <li><strong>Data Reporting:</strong> Creating high-quality visualizations for presentations</li>
                        <li><strong>Data Exploration:</strong> Using interactive features to analyze trends and outliers
                        </li>
                        <li><strong>Comparative Analysis:</strong> Visualizing multiple datasets with stacked and
                            multi-series charts</li>
                        <li><strong>Process Visualization:</strong> Using Funnel and Gauge charts to track metrics and
                            stages</li>
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
    name: 'PygalPlayground'
})

definePageMeta({
    layout: 'library'
})

useHead({
    title: 'Online Pygal Compiler',
    meta: [
        { name: 'description', content: 'Create beautiful interactive SVG charts with Pygal online. Run Python graphing code in your browser with Pyodide. No installation required.' },
        { name: 'keywords', content: 'pygal, python charts, svg graphs, online python compiler, pyodide, data visualization' },
        { property: 'og:title', content: 'Online Pygal Compiler' },
        { property: 'og:description', content: 'Create beautiful interactive SVG charts with Pygal online.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:image', content: '/pybadu.png' }
    ]
})

// Example code snippets
const examples = [
    {
        title: "Basic Bar Chart",
        code: `# Simple Bar Chart
import pygal

bar_chart = pygal.Bar()
bar_chart.title = 'Browser Usage'

# Add data
bar_chart.add('Chrome', [63.5, 64.1, 64.8, 65.2, 65.9])
bar_chart.add('Firefox', [14.2, 13.8, 13.5, 13.2, 12.9])
bar_chart.add('Safari', [9.8, 9.9, 10.1, 10.3, 10.5])
bar_chart.add('Edge', [4.5, 4.6, 4.8, 5.1, 5.3])
bar_chart.add('Opera', [2.1, 2.2, 2.3, 2.4, 2.5])

# Render to string
print(bar_chart.render(is_unicode=True))`
    },
    {
        title: "Pie Chart",
        code: `# Pie Chart Example
import pygal

pie_chart = pygal.Pie()
pie_chart.title = 'Browser Market Share (2024)'

# Add data slices
pie_chart.add('Chrome', 65.9)
pie_chart.add('Firefox', 12.9)
pie_chart.add('Safari', 10.5)
pie_chart.add('Edge', 5.3)
pie_chart.add('Opera', 2.5)
pie_chart.add('Others', 2.9)

# Render
print(pie_chart.render(is_unicode=True))`
    },
    {
        title: "Line Chart",
        code: `# Line Chart Example
import pygal

line_chart = pygal.Line()
line_chart.title = 'Monthly Sales'
line_chart.x_labels = map(str, range(2002, 2013))

line_chart.add('Firefox', [None, None, 0, 16.6, 25, 31, 36.4, 45.5, 46.3, 42.8, 37.1])
line_chart.add('Chrome',  [None, None, None, None, None, None, 0, 3.9, 10.8, 23.8, 35.3])
line_chart.add('IE',      [85.8, 84.6, 84.7, 74.5, 66, 58.6, 54.7, 44.8, 36.2, 26.6, 20.1])
line_chart.add('Others',  [14.2, 15.4, 15.3, 8.9, 9, 10.4, 8.9, 5.8, 6.7, 6.8, 7.5])

print(line_chart.render(is_unicode=True))`
    },
    {
        title: "Gauge Chart",
        code: `# Gauge Chart Example
import pygal

gauge = pygal.Gauge(human_readable=True)
gauge.title = 'Delta Blue V8 performance'
gauge.range = [0, 10000]

gauge.add('Chrome', 8212)
gauge.add('Firefox', 8099)
gauge.add('Opera', 2933)
gauge.add('IE', 41)

print(gauge.render(is_unicode=True))`
    },
    {
        title: "Stacked Bar Chart",
        code: `# Stacked Bar Chart
import pygal

bar_chart = pygal.StackedBar()
bar_chart.title = 'Browser Usage evolution (in %)'
bar_chart.x_labels = map(str, range(2002, 2013))

bar_chart.add('Firefox', [None, None, 0, 16.6, 25, 31, 36.4, 45.5, 46.3, 42.8, 37.1])
bar_chart.add('Chrome',  [None, None, None, None, None, None, 0, 3.9, 10.8, 23.8, 35.3])
bar_chart.add('IE',      [85.8, 84.6, 84.7, 74.5, 66, 58.6, 54.7, 44.8, 36.2, 26.6, 20.1])
bar_chart.add('Others',  [14.2, 15.4, 15.3, 8.9, 9, 10.4, 8.9, 5.8, 6.7, 6.8, 7.5])

print(bar_chart.render(is_unicode=True))`
    }
]

const defaultCode = `# Welcome to Pygal!
import pygal

# Create a simple Bar chart
bar_chart = pygal.Bar()
bar_chart.title = 'Hello Pygal'

# Add some data
bar_chart.add('Fibonacci', [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55])
bar_chart.add('Padovan', [1, 1, 1, 2, 2, 3, 4, 5, 7, 9, 12])

# Render the chart to SVG string
# We use is_unicode=True to get a string instead of bytes
print(bar_chart.render(is_unicode=True))`

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
    createAssetFolder
} = useLibraryPlayground({
    packageName: 'pygal',
    defaultCode,
    examples,
    additionalPackages: [],
    setupCode: `
import pygal
  `
})

onMounted(async () => {
    await initializePyodide()
})

onBeforeUnmount(() => {
    cleanupWorker()
})
</script>
