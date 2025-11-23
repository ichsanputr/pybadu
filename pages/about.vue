<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          🐍 Pybadu Python Fiddle
        </h1>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          Run Python code in your browser with Pyodide. No installation required!
        </p>
      </div>

      <!-- Feature Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-lg p-6">
          <div class="text-3xl mb-4">⚡</div>
          <h3 class="text-base md:text-lg font-semibold text-gray-900 mb-2">Instant Execution</h3>
          <p class="text-gray-600">Run Python code instantly in your browser without any setup.</p>
        </div>

        <div class="bg-white rounded-lg shadow-lg p-6">
          <div class="text-3xl mb-4">📦</div>
          <h3 class="text-base md:text-lg font-semibold text-gray-900 mb-2">Standard Library</h3>
          <p class="text-gray-600">Full access to Python's standard library and built-in functions.</p>
        </div>

        <div class="bg-white rounded-lg shadow-lg p-6">
          <div class="text-3xl mb-4">🔒</div>
          <h3 class="text-base md:text-lg font-semibold text-gray-900 mb-2">Safe Environment</h3>
          <p class="text-gray-600">Code runs in a sandboxed WebAssembly environment.</p>
        </div>
      </div>

      <!-- Getting Started -->
      <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 class="text-xl md:text-2xl font-bold text-gray-900 mb-4">🚀 Getting Started</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 class="text-base md:text-lg font-semibold text-gray-900 mb-3">Quick Start</h3>
            <ol class="list-decimal list-inside space-y-2 text-gray-600">
              <li>Click the "Try Fiddle" button below</li>
              <li>Write or paste your Python code</li>
              <li>Click "Run" to execute</li>
              <li>See the output in real-time</li>
            </ol>
          </div>
          <div>
            <h3 class="text-base md:text-lg font-semibold text-gray-900 mb-3">What You Can Do</h3>
            <ul class="list-disc list-inside space-y-2 text-gray-600">
              <li>Basic Python programming</li>
              <li>Data manipulation and analysis</li>
              <li>Algorithm development</li>
              <li>Learning and experimentation</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Action Button -->
      <div class="text-center">
        <NuxtLink
          to="/fiddle"
          class="inline-flex items-center px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-200 text-lg"
        >
          🎮 Try Python Fiddle
        </NuxtLink>
      </div>

      <!-- Example Code Preview -->
      <div class="mt-12 bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-xl md:text-2xl font-bold text-gray-900 mb-4">💻 Example Code</h2>
        <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre class="text-green-400 text-sm"><code># Example: Data analysis with Python
data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# Calculate statistics
mean = sum(data) / len(data)
squared_diffs = [(x - mean) ** 2 for x in data]
variance = sum(squared_diffs) / len(data)
std_dev = variance ** 0.5

print(f"Data: {data}")
print(f"Mean: {mean}")
print(f"Standard Deviation: {std_dev:.2f}")

# Find even numbers
evens = [x for x in data if x % 2 == 0]
print(f"Even numbers: {evens}")</code></pre>
        </div>
        <p class="text-gray-600 mt-4">
          This is just a taste of what you can do with Pybadu. Try the fiddle to experiment with your own code!
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
// SEO Meta
useHead({
  title: 'Pybadu - Python Fiddle in Browser',
  meta: [
    { name: 'description', content: 'Run Python code in your browser with Pybadu - A web-based Python fiddle powered by Pyodide' },
    { name: 'keywords', content: 'python, fiddle, browser, pyodide, online python, python playground' }
  ]
})
</script>