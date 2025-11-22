<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <!-- Hero Section -->
    <div class="relative overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
        <div class="text-center">
          <h1 class="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            🐍 <span class="text-primary-600">Pybadu</span>
          </h1>
          <p class="text-xl md:text-2xl text-gray-600 mb-4">
            Python Fiddle in Your Browser
          </p>
          <p class="text-lg text-gray-500 mb-12 max-w-3xl mx-auto">
            Write, run, and experiment with Python code instantly. No installation required. 
            Powered by <span class="font-semibold text-primary-600">Pyodide</span> WebAssembly technology.
          </p>
          
          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <NuxtLink
              to="/fiddle"
              class="inline-flex items-center px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 text-lg"
            >
              🚀 Start Coding Now
            </NuxtLink>
            <NuxtLink
              to="/about"
              class="inline-flex items-center px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-lg shadow-md border border-gray-200 transition-colors duration-200 text-lg"
            >
              📚 Learn More
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Why Choose Pybadu?</h2>
          <p class="text-lg text-gray-600">Everything you need to code Python in the browser</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center">
            <div class="text-4xl mb-4">⚡</div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">Instant Execution</h3>
            <p class="text-gray-600">
              No setup required. Start coding Python immediately in your browser with full execution speed.
            </p>
          </div>
          
          <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center">
            <div class="text-4xl mb-4">🛠️</div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">Full Python Support</h3>
            <p class="text-gray-600">
              Complete Python standard library, classes, functions, and all language features you know and love.
            </p>
          </div>
          
          <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 text-center">
            <div class="text-4xl mb-4">🔒</div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">Safe & Secure</h3>
            <p class="text-gray-600">
              Code runs in a secure WebAssembly sandbox. No server required, complete privacy protection.
            </p>
          </div>
          
          <div class="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 text-center">
            <div class="text-4xl mb-4">📱</div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">Cross-Platform</h3>
            <p class="text-gray-600">
              Works on any device with a modern browser. Desktop, tablet, or mobile - code anywhere.
            </p>
          </div>
          
          <div class="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 text-center">
            <div class="text-4xl mb-4">🎯</div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">Perfect for Learning</h3>
            <p class="text-gray-600">
              Ideal for students, educators, and anyone learning Python. Experiment without installation hassles.
            </p>
          </div>
          
          <div class="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 text-center">
            <div class="text-4xl mb-4">💾</div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">Local Storage</h3>
            <p class="text-gray-600">
              Your code stays in your browser. No accounts needed, no data sent to servers.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Code Preview Section -->
    <div class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">See It in Action</h2>
          <p class="text-lg text-gray-600">Here's what you can do with Pybadu</p>
        </div>
        
        <div class="bg-white rounded-xl shadow-xl overflow-hidden max-w-4xl mx-auto">
          <!-- Mock Editor Header -->
          <div class="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
            <div class="flex items-center space-x-4">
              <span class="font-semibold">🐍 Python Editor</span>
            </div>
            <div class="flex space-x-2">
              <div class="w-3 h-3 bg-red-500 rounded-full"></div>
              <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div class="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
          
          <!-- Mock Code Editor -->
          <div class="grid grid-cols-1 lg:grid-cols-2">
            <div class="bg-gray-900 p-6">
              <pre class="text-green-400 text-sm leading-relaxed"><code># Data analysis example
data = [23, 45, 56, 78, 32, 67, 89, 12, 34, 90]

# Calculate statistics
mean = sum(data) / len(data)
sorted_data = sorted(data)
median = sorted_data[len(data) // 2]

print(f"Dataset: {data}")
print(f"Mean: {mean:.2f}")
print(f"Median: {median}")

# Find outliers
outliers = [x for x in data if abs(x - mean) > 20]
print(f"Outliers: {outliers}")

# Create histogram
bins = {}
for value in data:
    bin_key = (value // 10) * 10
    bins[bin_key] = bins.get(bin_key, 0) + 1

print("\\nHistogram:")
for bin_start in sorted(bins.keys()):
    print(f"{bin_start}-{bin_start+9}: {'█' * bins[bin_start]}")</code></pre>
            </div>
            
            <!-- Mock Output -->
            <div class="bg-gray-50 p-6 border-l border-gray-200">
              <div class="text-sm text-gray-600 mb-3 font-semibold">📤 Output:</div>
              <pre class="text-sm text-gray-800 leading-relaxed"><code>Dataset: [23, 45, 56, 78, 32, 67, 89, 12, 34, 90]
Mean: 52.60
Median: 56

Outliers: [89, 12, 90]

Histogram:
10-19: █
20-29: █
30-39: ██
40-49: █
50-59: █
60-69: █
70-79: █
80-89: █
90-99: █</code></pre>
            </div>
          </div>
        </div>
        
        <div class="text-center mt-8">
          <NuxtLink
            to="/fiddle"
            class="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-200"
          >
            Try This Example →
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div class="mb-6">
          <h3 class="text-2xl font-bold mb-2">🐍 Pybadu</h3>
          <p class="text-gray-400">Python Fiddle for the Modern Web</p>
        </div>
        
        <div class="flex justify-center space-x-6 mb-6">
          <NuxtLink to="/fiddle" class="text-gray-300 hover:text-white transition-colors">
            Fiddle
          </NuxtLink>
          <NuxtLink to="/about" class="text-gray-300 hover:text-white transition-colors">
            About
          </NuxtLink>
        </div>
        
        <div class="border-t border-gray-800 pt-6">
          <p class="text-gray-400 text-sm">
            © {{ new Date().getFullYear() }} Pybadu. Built with 
            <span class="text-primary-400">Nuxt 3</span>, 
            <span class="text-primary-400">Tailwind CSS</span>, and 
            <span class="text-primary-400">Pyodide</span>.
          </p>
          <p class="text-gray-500 text-xs mt-2">
            Run Python code securely in your browser with WebAssembly technology.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
// SEO Meta
useHead({
  title: 'Pybadu - Python Fiddle in Browser',
  meta: [
    { name: 'description', content: 'Run Python code in your browser instantly with Pybadu. No installation required. Powered by Pyodide WebAssembly technology.' },
    { name: 'keywords', content: 'python, fiddle, browser, pyodide, online python editor, python playground, webassembly' }
  ]
})
</script>