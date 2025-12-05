<template>
    <div>
        <!-- Editor Area -->
        <div class="sm:min-h-screen">
            <CodeEditor libraryName="Xarray" :theme="theme" :files="files" :activeFileId="activeFileId"
                :code="currentFileContent" :output="output" :isLoading="isLoading" :pyodideReady="pyodideReady"
                :monacoTheme="monacoTheme" :examples="examples" :assets="assets" :assetsUploading="assetsUploading"
                @update:code="updateCurrentFile" @toggleTheme="toggleTheme" @runCode="runCode" @clearCode="clearCode"
                @clearOutput="clearOutput" @loadExample="loadExample" @newFile="createNewFile" @selectFile="selectFile"
                @deleteFile="deleteFile" @renameFile="renameFile" @saveToStorage="saveToStorage"
                @uploadAssets="uploadAssets" @deleteAsset="deleteAsset" @downloadAsset="downloadAsset" @refreshAssets="refreshAssets"
                @createAssetFolder="createAssetFolder" />

        </div>

        <!-- Information Section -->
        <LibraryInfoSection>
            <div class="text-center mb-12">
                <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                    Online Xarray Compiler
                </h1>

                <div class="max-w-4xl mx-auto text-left space-y-6 text-gray-700 dark:text-gray-300">
                    <p class="text-base md:text-lg leading-relaxed">
                        Xarray is an open-source Python library that makes working with labeled multi-dimensional arrays
                        simple and efficient.
                        It introduces labels in the form of dimensions, coordinates, and attributes on top of raw
                        NumPy-like arrays,
                        allowing for a more intuitive, concise, and less error-prone developer experience.
                    </p>

                    <p class="text-base md:text-lg leading-relaxed">
                        Our online Xarray compiler runs entirely in your browser using Pyodide. It allows you to
                        experiment with
                        Xarray's powerful data structures: <strong>DataArray</strong> (labeled N-dimensional arrays) and
                        <strong>Dataset</strong> (a dictionary-like container of DataArrays). You can perform complex
                        operations like
                        group-by, reshaping, and mathematical computations using meaningful label names instead of
                        integer indices.
                    </p>

                    <h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Key Features</h3>
                    <ul class="list-disc list-inside space-y-2 text-base md:text-lg ml-4">
                        <li><strong>Labeled Dimensions:</strong> Select and operate on data by name (e.g., 'time',
                            'lat') rather than axis ID.</li>
                        <li><strong>Metadata Tracking:</strong> Keep track of arbitrary metadata (units, descriptions)
                            alongside your data.</li>
                        <li><strong>Powerful Indexing:</strong> Select data by label values, ranges, or boolean masks.
                        </li>
                        <li><strong>Vectorized Operations:</strong> Apply mathematical operations across multiple
                            dimensions automatically.</li>
                        <li><strong>Group-By Operations:</strong> Perform "split-apply-combine" operations on specific
                            dimensions.</li>
                    </ul>

                    <h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Ideal Use Cases
                    </h3>
                    <ul class="list-disc list-inside space-y-2 text-base md:text-lg ml-4">
                        <li><strong>Scientific Data Analysis:</strong> Climate science, meteorology, oceanography, and
                            physics.</li>
                        <li><strong>Geospatial Analysis:</strong> Working with satellite imagery and gridded
                            geographical data.</li>
                        <li><strong>Time Series Analysis:</strong> Handling complex multi-dimensional time series data.
                        </li>
                        <li><strong>High-Dimensional Data:</strong> Simplifying manipulation of data with 3+ dimensions.
                        </li>
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
    name: 'XarrayPlayground'
})

definePageMeta({
    layout: 'library'
})

useHead({
    title: 'Online Xarray Compiler',
    meta: [
        { name: 'description', content: 'Run Python Xarray code online. Experiment with labeled multi-dimensional arrays, datasets, and scientific data analysis directly in your browser.' },
        { name: 'keywords', content: 'xarray, python, multi-dimensional arrays, data analysis, scientific computing, online compiler, pyodide' },
        { property: 'og:title', content: 'Online Xarray Compiler' },
        { property: 'og:description', content: 'Run Python Xarray code online. Experiment with labeled multi-dimensional arrays.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:image', content: '/pybadu.png' }
    ]
})

// Example code snippets
const examples = [
    {
        title: "Basic DataArray",
        code: `# Creating a simple DataArray
import xarray as xr
import numpy as np
import pandas as pd

# Create data
data = xr.DataArray(
    np.random.randn(2, 3),
    dims=("x", "y"),
    coords={"x": [10, 20]},
    name="example_data"
)

print("--- DataArray ---")
print(data)

print("\\n--- Selection by Label ---")
print(data.sel(x=10))

print("\\n--- Mean Calculation ---")
print(data.mean(dim="y"))`
    },
    {
        title: "Working with Datasets",
        code: `# Creating a Dataset
import xarray as xr
import numpy as np
import pandas as pd

# Create a dataset with temperature and precipitation
ds = xr.Dataset(
    {
        "temperature": (("x", "y"), 20 + np.random.randn(2, 2)),
        "precipitation": (("x", "y"), np.random.rand(2, 2)),
    },
    coords={
        "x": [1, 2],
        "y": [10, 20],
    },
)

print("--- Dataset ---")
print(ds)

print("\\n--- Accessing Variable ---")
print(ds["temperature"])

print("\\n--- Dataset Mean ---")
print(ds.mean())`
    },
    {
        title: "Time Series Data",
        code: `# Time Series Analysis with Xarray
import xarray as xr
import numpy as np
import pandas as pd

# Create time coordinates
times = pd.date_range("2024-01-01", periods=5)

# Create DataArray with time dimension
da = xr.DataArray(
    np.random.rand(5),
    coords={"time": times},
    dims="time",
    name="random_data"
)

print("--- Time Series DataArray ---")
print(da)

print("\\n--- Select by Date ---")
print(da.sel(time="2024-01-02"))

print("\\n--- Rolling Mean ---")
print(da.rolling(time=3).mean())`
    },
    {
        title: "Arithmetic Operations",
        code: `# Arithmetic with Labeled Dimensions
import xarray as xr
import numpy as np

arr1 = xr.DataArray(
    [1, 2, 3], 
    dims="x", 
    coords={"x": [10, 20, 30]}
)

arr2 = xr.DataArray(
    [10, 20, 30], 
    dims="x", 
    coords={"x": [10, 20, 30]}
)

print("--- Array 1 ---")
print(arr1)

print("\\n--- Array 2 ---")
print(arr2)

print("\\n--- Addition (arr1 + arr2) ---")
print(arr1 + arr2)

print("\\n--- Broadcasting (arr1 * 10) ---")
print(arr1 * 10)`
    }
]

const defaultCode = `# Welcome to Xarray!
import xarray as xr
import numpy as np
import pandas as pd

# Create a 3D DataArray (e.g., Time x Latitude x Longitude)
data = xr.DataArray(
    np.random.rand(4, 3, 3),
    dims=("time", "lat", "lon"),
    coords={
        "time": pd.date_range("2024-01-01", periods=4),
        "lat": [10, 20, 30],
        "lon": [50, 60, 70],
    },
    name="temperature"
)

print("--- 3D DataArray ---")
print(data)

print("\\n--- Select specific time ---")
print(data.isel(time=0))

print("\\n--- Mean over time ---")
print(data.mean(dim="time"))`

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
    packageName: 'xarray',
    defaultCode,
    examples,
    additionalPackages: ['xarray', 'numpy', 'pandas'], // Xarray depends on numpy and pandas
    setupCode: `
import xarray as xr
import numpy as np
import pandas as pd
  `
})

onMounted(async () => {
    await initializePyodide()
})

onBeforeUnmount(() => {
    cleanupWorker()
})
</script>
