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

    </div>

    <!-- Information Section -->
    <LibraryInfoSection>
      <div class="text-center mb-12">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Online Pandas Compiler
        </h1>
        
        <div class="max-w-4xl mx-auto text-left space-y-6 text-gray-700 dark:text-gray-300">
          <p class="text-base md:text-lg leading-relaxed">
            Pandas is Python's premier library for data analysis and manipulation, used by millions of data professionals 
            worldwide. Our dedicated online Pandas compiler provides a complete browser-based environment for working with 
            structured data using powerful DataFrame and Series objects. Built on top of NumPy, Pandas offers high-performance, 
            easy-to-use data structures perfect for real-world data analysis, making it the industry standard for data 
            manipulation in Python. From financial analysis to scientific research, Pandas is the tool of choice for 
            professionals who need to clean, transform, and analyze data efficiently.
          </p>
          
          <p class="text-base md:text-lg leading-relaxed">
            This compiler includes <strong>Pandas 2.x</strong> with <strong>NumPy</strong>, enabling you to perform complex 
            data operations instantly through Pyodide WebAssembly technology. You can work with DataFrames (two-dimensional 
            labeled data structures with columns of potentially different types) and Series (one-dimensional labeled arrays), 
            performing operations like data cleaning, transformation, statistical analysis, and time series manipulation. 
            The platform provides all the tools you need for comprehensive data analysis including powerful indexing and 
            slicing capabilities, GroupBy operations for split-apply-combine functionality, sophisticated missing data 
            handling, and SQL-like operations for combining multiple datasets.
          </p>

          <p class="text-base md:text-lg leading-relaxed">
            Our comprehensive example collection covers essential data manipulation techniques including DataFrame basics, 
            data selection and filtering, grouping data by categories with aggregate functions, detecting and filling 
            missing values, and combining datasets using merge, join, and concatenate operations. You'll also learn time 
            series analysis with datetime data, resampling techniques, and rolling window calculations. The examples 
            demonstrate data import/export with various file formats (CSV, JSON) and advanced data transformation pipelines 
            that are commonly used in production environments.
          </p>

          <h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Who Should Use This</h3>
          <ul class="list-disc list-inside space-y-2 text-base md:text-lg ml-4">
            <li>Data analysts working with structured datasets and creating insights</li>
            <li>Data scientists preprocessing data for machine learning models</li>
            <li>Business intelligence professionals building reports and dashboards</li>
            <li>Financial analysts performing portfolio management and risk analysis</li>
            <li>ETL developers building data pipelines and transformation workflows</li>
            <li>Students learning data analysis and manipulation techniques with Python</li>
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
  title: 'Online Pandas Compiler',
  meta: [
    { name: 'description', content: 'Analyze data with Pandas in your browser. Create DataFrames, manipulate data, and perform statistical analysis powered by Pyodide WebAssembly. No installation required.' },
    { name: 'keywords', content: 'pandas, data analysis, dataframe, python data, online compiler, pyodide, pandas online, data manipulation' },
    { name: 'author', content: 'Pybadu' },
    { property: 'og:title', content: 'Online Pandas Compiler' },
    { property: 'og:description', content: 'Analyze data with Pandas DataFrames in your browser' },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/pybadu.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Online Pandas Compiler' },
    { name: 'twitter:description', content: 'Analyze data with Pandas in your browser' },
    { name: 'twitter:image', content: '/pybadu.png' }
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

