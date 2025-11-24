<template>
  <div>
    <!-- Editor Area -->
    <div class="min-h-screen">
      <CodeEditor 
        libraryName="BeautifulSoup4"
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
          Online Python BeautifulSoup4 Compiler
        </h1>
        
        <div class="max-w-4xl mx-auto text-left space-y-6 text-gray-700 dark:text-gray-300">
          <p class="text-base md:text-lg leading-relaxed">
            BeautifulSoup4 is a powerful Python library for parsing HTML and XML documents, making it easy to extract data from web pages and structured markup. As one of the most popular web scraping and data extraction tools in Python, BeautifulSoup4 provides an intuitive API for navigating, searching, and modifying parse trees. Whether you're scraping websites, processing HTML content, or extracting structured data from markup, BeautifulSoup4 simplifies the complex task of parsing HTML into a straightforward Python interface.
          </p>
          
          <p class="text-base md:text-lg leading-relaxed">
            This compiler includes <strong>BeautifulSoup4</strong> (bs4), enabling you to parse and extract data from HTML strings directly in your browser. You can work with HTML content without needing external files—simply provide HTML strings inline and BeautifulSoup4 will parse them into a navigable tree structure. The platform provides all the tools you need for comprehensive HTML parsing including tag searching, attribute extraction, CSS selector support, text extraction, and tree navigation. You can find elements by tag name, class, ID, attributes, or use CSS selectors for complex queries.
          </p>

          <p class="text-base md:text-lg leading-relaxed">
            Our comprehensive example collection covers essential HTML parsing techniques including basic HTML parsing, finding elements by tag and attributes, extracting text and attributes, using CSS selectors for advanced queries, navigating the parse tree, and handling nested structures. You'll also learn how to extract links, images, and other specific elements, work with HTML tables, and process complex HTML structures commonly found in real-world web scraping scenarios.
          </p>

          <h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Who Should Use This</h3>
          <ul class="list-disc list-inside space-y-2 text-base md:text-lg ml-4">
            <li>Web developers extracting data from HTML content and web pages</li>
            <li>Data scientists scraping and parsing web content for analysis</li>
            <li>Content managers processing HTML documents and extracting information</li>
            <li>Developers building web scraping tools and data extraction pipelines</li>
            <li>Students learning HTML parsing and web scraping techniques</li>
            <li>Anyone needing to parse and extract data from HTML strings</li>
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
  name: 'BeautifulSoup4Playground'
})

definePageMeta({
  layout: 'library'
})

useHead({
  title: 'Online Python BeautifulSoup4 Compiler',
  meta: [
    { name: 'description', content: 'Parse and extract data from HTML strings with BeautifulSoup4 in your browser. Web scraping, HTML parsing, and data extraction powered by Pyodide WebAssembly. No installation required.' },
    { name: 'keywords', content: 'beautifulsoup4, bs4, html parsing, web scraping, data extraction, online compiler, pyodide, html parser' },
    { name: 'author', content: 'Pybadu' },
    { property: 'og:title', content: 'Online Python BeautifulSoup4 Compiler' },
    { property: 'og:description', content: 'Parse and extract data from HTML strings with BeautifulSoup4 in your browser' },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/pybadu.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Online Python BeautifulSoup4 Compiler' },
    { name: 'twitter:description', content: 'Parse and extract data from HTML strings with BeautifulSoup4 in your browser' },
    { name: 'twitter:image', content: '/pybadu.png' }
  ]
})

// Example code snippets
const examples = [
  {
    title: "Basic HTML Parsing",
    code: `# Parse HTML string
html = """
<html>
<head><title>Sample Page</title></head>
<body>
  <h1>Welcome</h1>
  <p>This is a paragraph.</p>
  <p>Another paragraph with <strong>bold text</strong>.</p>
</body>
</html>
"""

soup = BeautifulSoup(html, 'html.parser')

# Get title
print("Title:", soup.title.string)

# Get all paragraphs
paragraphs = soup.find_all('p')
print("\\nParagraphs:")
for p in paragraphs:
    print(f"  - {p.get_text()}")`
  },
  {
    title: "Finding Elements by Tag",
    code: `# Find elements by tag name
html = """
<div>
  <h2>Section 1</h2>
  <p>Content 1</p>
  <h2>Section 2</h2>
  <p>Content 2</p>
</div>
"""

soup = BeautifulSoup(html, 'html.parser')

# Find all h2 tags
headings = soup.find_all('h2')
print("Headings:")
for h2 in headings:
    print(f"  - {h2.string}")

# Find first paragraph
first_p = soup.find('p')
print(f"\\nFirst paragraph: {first_p.get_text()}")`
  },
  {
    title: "Extracting Attributes",
    code: `# Extract attributes from elements
html = """
<a href="https://example.com" class="link" id="main-link">Example</a>
<img src="image.jpg" alt="Sample Image" width="200" height="100">
"""

soup = BeautifulSoup(html, 'html.parser')

# Get link attributes
link = soup.find('a')
print("Link attributes:")
print(f"  href: {link.get('href')}")
print(f"  class: {link.get('class')}")
print(f"  id: {link.get('id')}")

# Get image attributes
img = soup.find('img')
print("\\nImage attributes:")
print(f"  src: {img.get('src')}")
print(f"  alt: {img.get('alt')}")
print(f"  width: {img.get('width')}")`
  },
  {
    title: "CSS Selectors",
    code: `# Use CSS selectors to find elements
html = """
<div class="container">
  <p class="highlight">Important text</p>
  <p class="normal">Regular text</p>
  <span id="special">Special content</span>
</div>
"""

soup = BeautifulSoup(html, 'html.parser')

# Find by class
highlighted = soup.select('.highlight')
print("Highlighted elements:")
for elem in highlighted:
    print(f"  - {elem.get_text()}")

# Find by ID
special = soup.select('#special')
print(f"\\nSpecial element: {special[0].get_text()}")

# Find by tag and class
container_p = soup.select('div.container p')
print("\\nParagraphs in container:")
for p in container_p:
    print(f"  - {p.get_text()}")`
  },
  {
    title: "Extracting Links",
    code: `# Extract all links from HTML
html = """
<div>
  <a href="/page1">Page 1</a>
  <a href="/page2">Page 2</a>
  <a href="https://external.com">External</a>
</div>
"""

soup = BeautifulSoup(html, 'html.parser')

# Find all links
links = soup.find_all('a')
print("Links found:")
for link in links:
    href = link.get('href')
    text = link.get_text()
    print(f"  {text} -> {href}")`
  },
  {
    title: "Parsing HTML Tables",
    code: `# Parse HTML table data
html = """
<table>
  <tr>
    <th>Name</th>
    <th>Age</th>
    <th>City</th>
  </tr>
  <tr>
    <td>Alice</td>
    <td>25</td>
    <td>New York</td>
  </tr>
  <tr>
    <td>Bob</td>
    <td>30</td>
    <td>London</td>
  </tr>
</table>
"""

soup = BeautifulSoup(html, 'html.parser')

# Extract table data
rows = soup.find_all('tr')
print("Table data:")
for row in rows:
    cells = row.find_all(['th', 'td'])
    if cells:
        data = [cell.get_text().strip() for cell in cells]
        print(f"  {' | '.join(data)}")`
  }
]

const defaultCode = `# Parse HTML string
html = """
<html>
<head><title>Sample Page</title></head>
<body>
  <h1>Welcome to BeautifulSoup4</h1>
  <p>This is a paragraph with <strong>bold text</strong>.</p>
  <a href="https://example.com">Example Link</a>
</body>
</html>
"""

soup = BeautifulSoup(html, 'html.parser')

# Get title
print("Title:", soup.title.string)

# Get heading
h1 = soup.find('h1')
print(f"Heading: {h1.get_text()}")

# Get paragraph
p = soup.find('p')
print(f"Paragraph: {p.get_text()}")

# Get link
link = soup.find('a')
print(f"Link: {link.get_text()} -> {link.get('href')}")`

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
  cleanupWorker
} = useLibraryPlayground({
  packageName: 'beautifulsoup4',
  defaultCode,
  examples,
  additionalPackages: [],
  setupCode: `
from bs4 import BeautifulSoup
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

