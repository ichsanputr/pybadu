<template>
  <div>
    <!-- Editor Area -->
    <div class="min-h-screen">
      <CodeEditor 
        libraryName="Pandas"
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
        @saveToStorage="saveToStorage" />

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
        <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-6">
          About Pandas Playground
        </h2>
        
        <div class="max-w-4xl mx-auto text-left space-y-6 text-gray-700 dark:text-gray-300">
          <p class="text-lg leading-relaxed">
            Pandas is Python's premier library for data analysis and manipulation. Our dedicated Pandas playground provides 
            a complete browser-based environment for working with structured data using powerful DataFrame and Series objects. 
            Built on top of NumPy, Pandas offers high-performance, easy-to-use data structures perfect for real-world data analysis.
          </p>
          
          <p class="text-lg leading-relaxed">
            This compiler includes <strong>Pandas 2.x</strong> with <strong>NumPy</strong>, enabling you to perform complex 
            data operations instantly. From data cleaning and transformation to statistical analysis and time series manipulation, 
            our Pandas playground provides all the tools you need for comprehensive data analysis without any installation.
          </p>

          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Core Features</h3>
          
          <ul class="list-disc list-inside space-y-2 text-lg ml-4">
            <li><strong>DataFrames:</strong> Two-dimensional labeled data structures with columns of potentially different types</li>
            <li><strong>Series:</strong> One-dimensional labeled arrays capable of holding any data type</li>
            <li><strong>Data Selection:</strong> Powerful indexing, slicing, and filtering capabilities for data access</li>
            <li><strong>GroupBy Operations:</strong> Split-apply-combine functionality for aggregating data</li>
            <li><strong>Missing Data Handling:</strong> Tools for detecting, removing, and filling missing values</li>
            <li><strong>Merging & Joining:</strong> SQL-like operations for combining multiple datasets</li>
            <li><strong>Time Series:</strong> Specialized functionality for date/time data and resampling</li>
            <li><strong>Data Import/Export:</strong> Reading from and writing to various file formats (CSV, JSON, etc.)</li>
          </ul>

          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Data Operations Covered</h3>

          <p class="text-lg leading-relaxed">
            Master essential data manipulation techniques with our comprehensive examples:
          </p>

          <ul class="list-disc list-inside space-y-2 text-lg ml-4">
            <li><strong>DataFrame Basics:</strong> Creating, viewing, and understanding DataFrame structures and operations</li>
            <li><strong>Data Selection:</strong> Multiple methods for selecting, filtering, and accessing data</li>
            <li><strong>GroupBy & Aggregation:</strong> Grouping data by categories and applying aggregate functions</li>
            <li><strong>Missing Data:</strong> Detecting null values, filling missing data, and dropping incomplete rows</li>
            <li><strong>Data Merging:</strong> Combining datasets using merge, join, and concatenate operations</li>
            <li><strong>Time Series Analysis:</strong> Working with datetime data, resampling, and rolling window calculations</li>
          </ul>

          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Perfect For</h3>

          <ul class="list-disc list-inside space-y-2 text-lg ml-4">
            <li>Data analysts working with structured datasets</li>
            <li>Data scientists preprocessing data for machine learning</li>
            <li>Business intelligence and reporting tasks</li>
            <li>Financial data analysis and portfolio management</li>
            <li>ETL (Extract, Transform, Load) operations</li>
            <li>Statistical analysis and data exploration</li>
            <li>Students learning data analysis with Python</li>
          </ul>
        </div>
      </div>
    </LibraryInfoSection>

    <AppFooter />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useHead } from '#app'
import CodeEditor from '~/components/CodeEditor.vue'
import LibraryInfoSection from '~/components/LibraryInfoSection.vue'
import AnimatedCard from '~/components/ui/AnimatedCard.vue'
import AppFooter from '~/components/AppFooter.vue'
import { Icon } from '@iconify/vue'
import { useLibraryPlayground } from '~/composables/useLibraryPlayground'

defineOptions({
  name: 'PandasPlayground'
})

definePageMeta({
  layout: 'library'
})

useHead({
  title: 'Pandas Playground - Pybadu',
  meta: [
    { name: 'description', content: 'Interactive Pandas data analysis playground powered by Pyodide WebAssembly' }
  ]
})

// Example code snippets
const examples = [
  {
    title: "DataFrame Basics",
    code: `import pandas as pd
import numpy as np

# Create a DataFrame
data = {
    'Name': ['Alice', 'Bob', 'Charlie', 'David', 'Eve'],
    'Age': [25, 30, 35, 28, 32],
    'City': ['New York', 'London', 'Paris', 'Tokyo', 'Berlin'],
    'Salary': [50000, 60000, 55000, 65000, 58000]
}

df = pd.DataFrame(data)

print("DataFrame:")
print(df)
print("\\nDataFrame Info:")
print(df.info())
print("\\nBasic Statistics:")
print(df.describe())`
  },
  {
    title: "Data Selection",
    code: `import pandas as pd

# Create sample data
data = {
    'Product': ['A', 'B', 'C', 'D', 'E'],
    'Price': [10, 20, 15, 30, 25],
    'Quantity': [100, 150, 200, 80, 120],
    'Category': ['X', 'Y', 'X', 'Y', 'Z']
}

df = pd.DataFrame(data)

print("Original DataFrame:")
print(df)

# Select single column
print("\\nPrice column:")
print(df['Price'])

# Select multiple columns
print("\\nProduct and Price:")
print(df[['Product', 'Price']])

# Filter rows
print("\\nProducts with Price > 15:")
print(df[df['Price'] > 15])

# Filter by category
print("\\nCategory X products:")
print(df[df['Category'] == 'X'])`
  },
  {
    title: "Group By Operations",
    code: `import pandas as pd

# Create sales data
data = {
    'Region': ['North', 'South', 'North', 'South', 'East', 'East', 'West'],
    'Product': ['A', 'A', 'B', 'B', 'A', 'B', 'A'],
    'Sales': [100, 150, 200, 180, 120, 160, 140],
    'Profit': [20, 30, 40, 35, 25, 32, 28]
}

df = pd.DataFrame(data)

print("Original Data:")
print(df)

# Group by Region
print("\\nSales by Region:")
print(df.groupby('Region')['Sales'].sum())

print("\\nAverage Profit by Region:")
print(df.groupby('Region')['Profit'].mean())

# Multiple aggregations
print("\\nMultiple Aggregations by Region:")
print(df.groupby('Region').agg({
    'Sales': ['sum', 'mean'],
    'Profit': ['sum', 'mean']
}))`
  },
  {
    title: "Missing Data Handling",
    code: `import pandas as pd
import numpy as np

# Create data with missing values
data = {
    'A': [1, 2, np.nan, 4, 5],
    'B': [5, np.nan, np.nan, 8, 9],
    'C': [10, 11, 12, np.nan, 14]
}

df = pd.DataFrame(data)

print("DataFrame with missing values:")
print(df)

# Check for missing values
print("\\nMissing values per column:")
print(df.isnull().sum())

# Fill missing values with mean
print("\\nFill with mean:")
print(df.fillna(df.mean()))

# Drop rows with missing values
print("\\nDrop rows with any missing value:")
print(df.dropna())

# Forward fill
print("\\nForward fill:")
print(df.fillna(method='ffill'))`
  },
  {
    title: "Data Merging",
    code: `import pandas as pd

# Create two DataFrames
df1 = pd.DataFrame({
    'ID': [1, 2, 3, 4],
    'Name': ['Alice', 'Bob', 'Charlie', 'David'],
    'Department': ['HR', 'IT', 'Sales', 'IT']
})

df2 = pd.DataFrame({
    'ID': [1, 2, 3, 5],
    'Salary': [50000, 60000, 55000, 65000],
    'Experience': [2, 5, 3, 7]
})

print("DataFrame 1:")
print(df1)
print("\\nDataFrame 2:")
print(df2)

# Inner join
print("\\nInner Join:")
print(pd.merge(df1, df2, on='ID', how='inner'))

# Left join
print("\\nLeft Join:")
print(pd.merge(df1, df2, on='ID', how='left'))

# Outer join
print("\\nOuter Join:")
print(pd.merge(df1, df2, on='ID', how='outer'))`
  },
  {
    title: "Time Series",
    code: `import pandas as pd
import numpy as np

# Create time series data
dates = pd.date_range('2024-01-01', periods=10, freq='D')
data = {
    'Date': dates,
    'Temperature': np.random.randint(20, 35, 10),
    'Humidity': np.random.randint(40, 80, 10)
}

df = pd.DataFrame(data)
df.set_index('Date', inplace=True)

print("Time Series Data:")
print(df)

print("\\nStatistics:")
print(df.describe())

# Rolling average
print("\\n3-day Rolling Average of Temperature:")
print(df['Temperature'].rolling(window=3).mean())

# Resample (if we had more data)
print("\\nBasic time series created!")
print("Date range:", df.index.min(), "to", df.index.max())`
  }
]

const defaultCode = `import pandas as pd
import numpy as np

# Create a sample DataFrame
data = {
    'Name': ['Alice', 'Bob', 'Charlie', 'David', 'Eve'],
    'Age': [25, 30, 35, 28, 32],
    'City': ['New York', 'London', 'Paris', 'Tokyo', 'Berlin'],
    'Salary': [50000, 60000, 55000, 65000, 58000]
}

df = pd.DataFrame(data)

print("DataFrame:")
print(df)
print("\\nSummary Statistics:")
print(df.describe())
print("\\nAverage Age:", df['Age'].mean())
print("Average Salary:", df['Salary'].mean())`

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
  initializePyodide
} = useLibraryPlayground({
  packageName: 'pandas',
  defaultCode,
  examples,
  additionalPackages: ['numpy'],
  setupCode: `
import pandas as pd
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

