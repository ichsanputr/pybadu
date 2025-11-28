<template>
    <div>
        <!-- Custom Code Tester Editor -->
        <CodeTesterEditor :theme="theme" :files="files" :activeFileId="activeFileId" :code="currentFileContent"
            :output="output" :isLoading="isLoading" :pyodideReady="pyodideReady" :monacoTheme="monacoTheme"
            :examples="examples" @update:code="updateCurrentFile" @toggleTheme="toggleTheme"
            @runCode="runCodeWithValidation" @clearCode="clearCode" @clearOutput="clearOutput"
            @loadExample="loadExample" />

        <!-- Information Section -->
        <LibraryInfoSection>
            <div class="text-center mb-12">
                <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                    Online Python Code Tester
                </h1>

                <div class="max-w-4xl mx-auto text-left space-y-6 text-gray-700 dark:text-gray-300">
                    <p class="text-base md:text-lg leading-relaxed">
                        Welcome to the <strong>Online Python Code Tester</strong> – a powerful, browser-based
                        environment
                        designed for testing, debugging, and running your Python code instantly. Whether you're learning
                        Python, debugging scripts, or experimenting with new ideas, this tool provides instant feedback
                        with clear error messages to help you write better code faster.
                    </p>

                    <p class="text-base md:text-lg leading-relaxed">
                        This code tester runs entirely in your browser using <strong>Pyodide WebAssembly</strong>, which
                        means
                        no server-side execution, no installation required, and complete privacy for your code. The
                        environment
                        provides detailed error messages and traceback information to help you identify and fix issues
                        quickly.
                        All your code is automatically saved to your browser's local storage, so you never lose your
                        work.
                    </p>

                    <p class="text-base md:text-lg leading-relaxed">
                        Our code tester features a clean, distraction-free interface with syntax highlighting,
                        and a responsive output console that displays results, errors, and execution time. Perfect for
                        students, educators, developers, and anyone who wants to quickly test Python code without
                        setting up a
                        local environment.
                    </p>

                    <h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Key Features</h3>
                    <ul class="list-disc list-inside space-y-2 text-base md:text-lg ml-4">
                        <li><strong>Error Line Highlighting:</strong> Errors are highlighted directly in the editor
                            after execution</li>
                        <li><strong>Clear Error Messages:</strong> Detailed error information with line numbers and
                            traceback</li>
                        <li><strong>Auto-save:</strong> Your code is automatically saved to browser storage</li>
                        <li><strong>Execution Metrics:</strong> See how long your code takes to run</li>
                        <li><strong>Dark/Light Themes:</strong> Choose your preferred coding environment</li>
                        <li><strong>Zero Setup:</strong> No installation, no configuration – just start coding</li>
                        <li><strong>Example Code:</strong> Load pre-built examples to learn Python concepts</li>
                    </ul>

                    <h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Who Should Use
                        This</h3>
                    <ul class="list-disc list-inside space-y-2 text-base md:text-lg ml-4">
                        <li>Students learning Python programming fundamentals</li>
                        <li>Educators creating and testing code examples for teaching</li>
                        <li>Developers quickly prototyping and debugging Python scripts</li>
                        <li>Interview candidates practicing coding problems</li>
                        <li>Anyone needing a quick Python REPL without local setup</li>
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
import CodeTesterEditor from '~/components/CodeTesterEditor.vue'
import LibraryInfoSection from '~/components/LibraryInfoSection.vue'
import AppFooter from '~/components/AppFooter.vue'
import { useLibraryPlayground } from '~/composables/useLibraryPlayground'

defineOptions({
    name: 'PythonCodeTester'
})

definePageMeta({
    layout: 'library'
})

useHead({
    title: 'Online Python Code Tester',
    meta: [
        { name: 'description', content: 'Test and debug your Python code online with clear error messages. Browser-based Python code tester powered by Pyodide WebAssembly. No installation required.' },
        { name: 'keywords', content: 'python tester, python debugger, online python, code tester, pyodide, python online compiler' },
        { name: 'author', content: 'Pybadu' },
        { property: 'og:title', content: 'Online Python Code Tester - Test & Debug Python Code' },
        { property: 'og:description', content: 'Test Python code online with enhanced error handling' },
        { property: 'og:type', content: 'website' },
        { property: 'og:image', content: '/pybadu.png' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Online Python Code Tester' },
        { name: 'twitter:description', content: 'Test Python code online with enhanced error handling' },
        { name: 'twitter:image', content: '/pybadu.png' }
    ]
})

// Example code snippets for testing
const examples = [
    {
        title: "Hello World Test",
        code: `# Simple Hello World test
print("Hello, World!")
print("Python version test successful!")

# Test basic arithmetic
result = 2 + 2
print(f"2 + 2 = {result}")
`
    },
    {
        title: "Syntax Error Example",
        code: `# This code has intentional syntax errors for testing
# Uncomment lines below to test error handling

# Missing closing parenthesis
# print("Hello World"

# Invalid indentation
# def test():
# print("Wrong indent")

# Undefined variable
# print(undefined_variable)

# Working code:
print("This line works fine!")
`
    },
    {
        title: "Function Testing",
        code: `# Test function definitions and calls
def greet(name):
    """Greet a person by name"""
    return f"Hello, {name}!"

def add_numbers(a, b):
    """Add two numbers"""
    return a + b

# Test the functions
print(greet("Python Developer"))
print(f"5 + 3 = {add_numbers(5, 3)}")

# Test with different types
try:
    result = add_numbers("Hello", " World")
    print(f"String concatenation: {result}")
except Exception as e:
    print(f"Error: {e}")
`
    },
    {
        title: "Loop Testing",
        code: `# Test different loop constructs
print("Testing for loop:")
for i in range(5):
    print(f"  Iteration {i}")

print("\\nTesting while loop:")
count = 0
while count < 3:
    print(f"  Count: {count}")
    count += 1

print("\\nTesting list comprehension:")
squares = [x**2 for x in range(6)]
print(f"  Squares: {squares}")
`
    },
    {
        title: "Exception Handling",
        code: `# Test exception handling
def divide(a, b):
    """Safely divide two numbers"""
    try:
        result = a / b
        return f"{a} / {b} = {result}"
    except ZeroDivisionError:
        return "Error: Cannot divide by zero!"
    except TypeError:
        return "Error: Invalid types for division"

# Test cases
print(divide(10, 2))
print(divide(10, 0))
print(divide("10", 2))

# Test try-except-finally
try:
    print("\\nTesting finally block:")
    x = 1 / 1
    print(f"  Result: {x}")
finally:
    print("  Finally block executed!")
`
    },
    {
        title: "Data Structures Test",
        code: `# Test various data structures
print("Testing Lists:")
my_list = [1, 2, 3, 4, 5]
print(f"  Original: {my_list}")
my_list.append(6)
print(f"  After append: {my_list}")

print("\\nTesting Dictionaries:")
person = {
    "name": "Alice",
    "age": 30,
    "city": "New York"
}
print(f"  Person: {person}")
print(f"  Name: {person['name']}")

print("\\nTesting Sets:")
set1 = {1, 2, 3, 4}
set2 = {3, 4, 5, 6}
print(f"  Set 1: {set1}")
print(f"  Set 2: {set2}")
print(f"  Union: {set1 | set2}")
print(f"  Intersection: {set1 & set2}")
`
    }
]

const defaultCode = `# Python Code Tester
# Write your Python code here and click Run to test it

def main():
    """Main function to test your code"""
    print("Welcome to Python Code Tester!")
    print("=" * 40)
    
    # Your code here
    name = "Developer"
    print(f"Hello, {name}!")
    
    # Test some basic operations
    numbers = [1, 2, 3, 4, 5]
    total = sum(numbers)
    print(f"\\nSum of {numbers} = {total}")
    
    print("\\n✓ Code test completed successfully!")

# Run the main function
main()
`

// Use the shared composable with no additional packages
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
    packageName: '', // No specific package - just base Python
    defaultCode,
    examples,
    additionalPackages: [],
    setupCode: ''
})

// Run code function
async function runCodeWithValidation() {
    await runCode()
}

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
