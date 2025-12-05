<template>
  <div>
    <!-- Editor Area -->
    <div class="sm:min-h-screen">
      <CodeEditor 
        libraryName="lxml"
        :theme="theme" 
        :files="files"
        :activeFileId="activeFileId"
        :code="currentFileContent"
        :output="output" 
        :isLoading="isLoading" 
        :pyodideReady="pyodideReady"
        :monacoTheme="monacoTheme"
        :examples="examples"
        :assets="assets"
        :assetsUploading="assetsUploading"
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
        @uploadAssets="uploadAssets"
        @deleteAsset="deleteAsset" @downloadAsset="downloadAsset"
        @refreshAssets="refreshAssets"
        @createAssetFolder="createAssetFolder" />
    </div>

    <!-- Information Section -->
    <LibraryInfoSection>
      <div class="text-center mb-12">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Online lxml Compiler
        </h1>
        
        <div class="max-w-4xl mx-auto text-left space-y-6 text-gray-700 dark:text-gray-300">
          <p class="text-base md:text-lg leading-relaxed">
            lxml is the most feature-rich and easy-to-use library for processing XML and HTML in Python. It combines the speed 
            and XML feature completeness of the C libraries libxml2 and libxslt with the simplicity of a native Python API, 
            mostly compatible but superior to the well-known ElementTree API. lxml is unique in providing both high performance 
            and comprehensive XML/HTML processing capabilities, making it the go-to choice for developers working with structured 
            markup data.
          </p>
          
          <p class="text-base md:text-lg leading-relaxed">
            This compiler includes <strong>lxml</strong> with full support for XML and HTML parsing, XPath queries, XSLT 
            transformations, and ElementTree API compatibility, all powered by Pyodide WebAssembly technology. The platform 
            supports all core lxml features including parsing XML and HTML from strings or files, navigating and modifying 
            element trees, XPath expressions for powerful element selection, XSLT stylesheet transformations, validation with 
            DTD, RelaxNG, and XML Schema, and HTML-specific methods for working with web content. You can also upload and use 
            files or folders directly in your code for XML/HTML processing workflows. This compiler is online and completely 
            free to use.
          </p>

          <p class="text-base md:text-lg leading-relaxed">
            Our comprehensive example collection covers essential XML and HTML processing techniques including basic XML parsing 
            and element access, HTML parsing with lxml.html, XPath queries for advanced element selection, creating and 
            modifying XML documents, working with namespaces, HTML element methods for web scraping, and XSLT transformations. 
            You'll also learn how to validate XML documents, extract data from complex structures, and handle both well-formed 
            and malformed HTML content commonly found in real-world web processing scenarios.
          </p>

          <h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Perfect For</h3>
          <ul class="list-disc list-inside space-y-2 text-base md:text-lg ml-4">
            <li>Web developers parsing and processing HTML/XML content from websites</li>
            <li>Data engineers extracting structured data from XML documents and feeds</li>
            <li>Developers building XML/HTML processing pipelines and data transformation tools</li>
            <li>System integrators working with XML-based APIs and data exchange formats</li>
            <li>Content managers processing and validating XML/HTML documents</li>
            <li>Anyone needing fast, reliable XML and HTML processing in Python</li>
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
  name: 'LxmlPlayground'
})

definePageMeta({
  layout: 'library'
})

useHead({
  title: 'Online lxml Compiler',
  meta: [
    { name: 'description', content: 'Process XML and HTML with lxml in your browser. Parse documents, use XPath queries, XSLT transformations, and ElementTree API powered by Pyodide WebAssembly. No installation required.' },
    { name: 'keywords', content: 'lxml, xml parsing, html parsing, xpath, xslt, elementtree, online compiler, pyodide, xml processing' },
    { name: 'author', content: 'Pybadu' },
    { property: 'og:title', content: 'Online lxml Compiler' },
    { property: 'og:description', content: 'Process XML and HTML with lxml in your browser. Parse documents, use XPath queries, and XSLT transformations.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/pybadu.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Online lxml Compiler' },
    { name: 'twitter:description', content: 'Process XML and HTML with lxml in your browser' },
    { name: 'twitter:image', content: '/pybadu.png' }
  ]
})

// Example code snippets
const examples = [
  {
    title: "Basic XML Parsing",
    code: `# Parse XML from string
xml_string = """
<root>
  <person id="1">
    <name>Alice</name>
    <age>25</age>
    <city>New York</city>
  </person>
  <person id="2">
    <name>Bob</name>
    <age>30</age>
    <city>London</city>
  </person>
</root>
"""

from lxml import etree

# Parse XML
root = etree.fromstring(xml_string)

# Access elements
print("Root tag:", root.tag)
print("\\nPeople:")
for person in root.findall('person'):
    name = person.find('name').text
    age = person.find('age').text
    city = person.find('city').text
    person_id = person.get('id')
    print(f"  ID {person_id}: {name}, {age} years old, from {city}")`
  },
  {
    title: "XPath Queries",
    code: `# Use XPath to query XML
xml_string = """
<library>
  <book category="fiction">
    <title>1984</title>
    <author>George Orwell</author>
    <year>1949</year>
  </book>
  <book category="fiction">
    <title>To Kill a Mockingbird</title>
    <author>Harper Lee</author>
    <year>1960</year>
  </book>
  <book category="non-fiction">
    <title>Sapiens</title>
    <author>Yuval Noah Harari</author>
    <year>2011</year>
  </book>
</library>
"""

from lxml import etree

root = etree.fromstring(xml_string)

# Find all book titles
titles = root.xpath('//title/text()')
print("All titles:")
for title in titles:
    print(f"  - {title}")

# Find fiction books
fiction_books = root.xpath('//book[@category="fiction"]/title/text()')
print("\\nFiction books:")
for title in fiction_books:
    print(f"  - {title}")

# Find books after 1950
recent_books = root.xpath('//book[year > 1950]/title/text()')
print("\\nBooks after 1950:")
for title in recent_books:
    print(f"  - {title}")`
  },
  {
    title: "Creating XML",
    code: `# Create XML document programmatically
from lxml import etree

# Create root element
root = etree.Element("catalog")

# Add child elements
book1 = etree.SubElement(root, "book")
book1.set("id", "1")
title1 = etree.SubElement(book1, "title")
title1.text = "Python Programming"
author1 = etree.SubElement(book1, "author")
author1.text = "John Doe"
price1 = etree.SubElement(book1, "price")
price1.text = "29.99"

book2 = etree.SubElement(root, "book")
book2.set("id", "2")
title2 = etree.SubElement(book2, "title")
title2.text = "Web Development"
author2 = etree.SubElement(book2, "author")
author2.text = "Jane Smith"
price2 = etree.SubElement(book2, "price")
price2.text = "34.99"

# Convert to string
xml_output = etree.tostring(root, pretty_print=True, encoding='unicode')
print("Generated XML:")
print(xml_output)`
  },
  {
    title: "HTML Parsing",
    code: `# Parse HTML with lxml.html
from lxml import html

html_string = """
<html>
<head><title>Sample Page</title></head>
<body>
  <h1>Welcome</h1>
  <div class="content">
    <p>This is paragraph 1.</p>
    <p>This is paragraph 2.</p>
  </div>
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
  </ul>
  <a href="https://example.com">Example Link</a>
</body>
</html>
"""

# Parse HTML
doc = html.fromstring(html_string)

# Get title
title = doc.xpath('//title/text()')[0]
print(f"Title: {title}")

# Get heading
h1 = doc.xpath('//h1/text()')[0]
print(f"Heading: {h1}")

# Get all paragraphs
paragraphs = doc.xpath('//p/text()')
print("\\nParagraphs:")
for p in paragraphs:
    print(f"  - {p}")

# Get all links
links = doc.xpath('//a/@href')
print("\\nLinks:")
for link in links:
    print(f"  - {link}")`
  },
  {
    title: "HTML Element Methods",
    code: `# Use lxml.html specific methods
from lxml import html

html_string = """
<html>
<body>
  <div>
    <a href="/page1">Page 1</a>
    <a href="/page2">Page 2</a>
    <a href="https://external.com">External</a>
  </div>
  <form action="/submit" method="post">
    <input type="text" name="username" value="john">
    <input type="email" name="email" value="john@example.com">
    <button type="submit">Submit</button>
  </form>
</body>
</html>
"""

doc = html.fromstring(html_string)

# Get all links
links = doc.xpath('//a')
print("Links:")
for link in links:
    href = link.get('href')
    text = link.text_content()
    print(f"  {text} -> {href}")

# Get form inputs
form = doc.xpath('//form')[0]
inputs = form.xpath('.//input')
print("\\nForm inputs:")
for inp in inputs:
    name = inp.get('name')
    value = inp.get('value')
    input_type = inp.get('type')
    print(f"  {name} ({input_type}): {value}")

# Get all text content
body_text = doc.xpath('//body')[0].text_content()
print("\\nBody text content:")
print(body_text.strip())`
  },
  {
    title: "Working with Namespaces",
    code: `# Handle XML namespaces
xml_string = """
<root xmlns:book="http://example.com/books">
  <book:book>
    <book:title>Python Guide</book:title>
    <book:author>John Doe</book:author>
  </book:book>
  <book:book>
    <book:title>Web Development</book:title>
    <book:author>Jane Smith</book:author>
  </book:book>
</root>
"""

from lxml import etree

root = etree.fromstring(xml_string)

# Define namespace map
nsmap = {'book': 'http://example.com/books'}

# Find elements with namespace
books = root.xpath('//book:book', namespaces=nsmap)
print(f"Found {len(books)} books:")
for book in books:
    title = book.xpath('book:title/text()', namespaces=nsmap)[0]
    author = book.xpath('book:author/text()', namespaces=nsmap)[0]
    print(f"  - {title} by {author}")`
  },
  {
    title: "Modifying XML",
    code: `# Modify existing XML document
from lxml import etree

xml_string = """
<inventory>
  <item id="1">
    <name>Laptop</name>
    <quantity>10</quantity>
  </item>
  <item id="2">
    <name>Mouse</name>
    <quantity>25</quantity>
  </item>
</inventory>
"""

root = etree.fromstring(xml_string)

# Update quantity for item 1
item1 = root.xpath('//item[@id="1"]')[0]
quantity_elem = item1.find('quantity')
quantity_elem.text = '15'

# Add new item
new_item = etree.SubElement(root, "item")
new_item.set("id", "3")
name_elem = etree.SubElement(new_item, "name")
name_elem.text = "Keyboard"
quantity_elem = etree.SubElement(new_item, "quantity")
quantity_elem.text = "20"

# Display modified XML
xml_output = etree.tostring(root, pretty_print=True, encoding='unicode')
print("Modified XML:")
print(xml_output)`
  }
]

const defaultCode = `# Parse XML from string
xml_string = """
<root>
  <person id="1">
    <name>Alice</name>
    <age>25</age>
    <city>New York</city>
  </person>
  <person id="2">
    <name>Bob</name>
    <age>30</age>
    <city>London</city>
  </person>
</root>
"""

from lxml import etree

# Parse XML
root = etree.fromstring(xml_string)

# Access elements
print("Root tag:", root.tag)
print("\\nPeople:")
for person in root.findall('person'):
    name = person.find('name').text
    age = person.find('age').text
    city = person.find('city').text
    person_id = person.get('id')
    print(f"  ID {person_id}: {name}, {age} years old, from {city}")`

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
  assets,
  assetsUploading,
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
  refreshAssets,
  uploadAssets,
  deleteAsset,
  
  downloadAsset,
  createAssetFolder
} = useLibraryPlayground({
  packageName: 'lxml',
  defaultCode,
  examples,
  additionalPackages: [],
  setupCode: `
from lxml import etree
from lxml import html
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

