<template>
  <div>
    <!-- Editor Area -->
    <div class="sm:min-h-screen">
      <CodeEditor 
        libraryName="sqlparse"
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
        @deleteAsset="deleteAsset"
        @refreshAssets="refreshAssets"
        @createAssetFolder="createAssetFolder" />
    </div>

    <!-- Information Section -->
    <LibraryInfoSection>
      <div class="text-center mb-12">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Online sqlparse Compiler
        </h1>
        
        <div class="max-w-4xl mx-auto text-left space-y-6 text-gray-700 dark:text-gray-300">
          <p class="text-base md:text-lg leading-relaxed">
            sqlparse is a non-validating SQL parser for Python that provides comprehensive support for parsing, splitting, 
            and formatting SQL statements. As a lightweight and efficient library, sqlparse makes it easy to work with SQL 
            code programmatically, whether you're building database tools, analyzing SQL queries, or formatting SQL for 
            better readability. The library is compatible with Python 3.8+ and is widely used in database management tools, 
            SQL formatters, and code analysis applications.
          </p>
          
          <p class="text-base md:text-lg leading-relaxed">
            This compiler includes <strong>sqlparse</strong> with full support for SQL parsing, statement splitting, 
            code formatting, and token extraction, all powered by Pyodide WebAssembly technology. The platform supports 
            all core sqlparse features including splitting multiple SQL statements from a single string, formatting SQL 
            with customizable indentation and keyword casing, parsing SQL into token trees for analysis, extracting specific 
            tokens like keywords, identifiers, and operators, and reindenting SQL code for consistent formatting. You can 
            also upload and use files or folders directly in your code for SQL processing workflows. This compiler is online 
            and completely free to use.
          </p>

          <p class="text-base md:text-lg leading-relaxed">
            Our comprehensive example collection covers essential SQL processing techniques including splitting multiple SQL 
            statements, formatting SQL with different styles and keyword cases, parsing SQL into token structures, extracting 
            and analyzing SQL tokens, reindenting SQL code for readability, and working with complex SQL queries including 
            joins, subqueries, and stored procedures. You'll also learn how to identify SQL statement types, extract table 
            names and column names, and format SQL for different database systems commonly used in real-world applications.
          </p>

          <h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Perfect For</h3>
          <ul class="list-disc list-inside space-y-2 text-base md:text-lg ml-4">
            <li>Database developers formatting and analyzing SQL queries and scripts</li>
            <li>Tool builders creating SQL formatters, validators, and code analyzers</li>
            <li>Data engineers processing and cleaning SQL code in ETL pipelines</li>
            <li>Developers building database management tools and SQL editors</li>
            <li>Code reviewers analyzing and standardizing SQL code quality</li>
            <li>Anyone needing to parse, split, or format SQL statements programmatically</li>
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
  name: 'SqlparsePlayground'
})

definePageMeta({
  layout: 'library'
})

useHead({
  title: 'Online sqlparse Compiler',
  meta: [
    { name: 'description', content: 'Parse, split, and format SQL statements with sqlparse in your browser. SQL parsing, formatting, and token extraction powered by Pyodide WebAssembly. No installation required.' },
    { name: 'keywords', content: 'sqlparse, sql parser, sql formatter, sql splitter, sql tokenizer, online compiler, pyodide, sql processing' },
    { name: 'author', content: 'Pybadu' },
    { property: 'og:title', content: 'Online sqlparse Compiler' },
    { property: 'og:description', content: 'Parse, split, and format SQL statements with sqlparse in your browser' },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/pybadu.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Online sqlparse Compiler' },
    { name: 'twitter:description', content: 'Parse, split, and format SQL statements with sqlparse in your browser' },
    { name: 'twitter:image', content: '/pybadu.png' }
  ]
})

// Example code snippets
const examples = [
  {
    title: "Split SQL Statements",
    code: `# Split multiple SQL statements
import sqlparse

# String containing multiple SQL statements
raw_sql = '''
SELECT * FROM users WHERE age > 25;
INSERT INTO products (name, price) VALUES ('Laptop', 999.99);
UPDATE orders SET status = 'completed' WHERE id = 1;
'''

# Split into individual statements
statements = sqlparse.split(raw_sql)

print(f"Found {len(statements)} SQL statements:\\n")
for i, stmt in enumerate(statements, 1):
    print(f"Statement {i}:")
    print(stmt.strip())
    print()`
  },
  {
    title: "Format SQL",
    code: `# Format SQL with different options
import sqlparse

# Unformatted SQL
sql = "SELECT id,name,email FROM users WHERE age>25 AND status='active' ORDER BY name"

# Format with uppercase keywords and reindent
formatted = sqlparse.format(sql, reindent=True, keyword_case='upper')
print("Formatted SQL (uppercase keywords):")
print(formatted)
print()

# Format with lowercase keywords
formatted_lower = sqlparse.format(sql, reindent=True, keyword_case='lower')
print("Formatted SQL (lowercase keywords):")
print(formatted_lower)
print()

# Format without reindenting
formatted_no_indent = sqlparse.format(sql, reindent=False, keyword_case='upper')
print("Formatted SQL (no reindent):")
print(formatted_no_indent)`
  },
  {
    title: "Parse SQL Tokens",
    code: `# Parse SQL and examine tokens
import sqlparse

sql = "SELECT id, name FROM users WHERE age > 25"

# Parse the SQL statement
parsed = sqlparse.parse(sql)[0]

print("SQL Tokens:")
print("-" * 50)
for token in parsed.tokens:
    if not token.is_whitespace:
        token_type = type(token).__name__
        token_value = str(token).strip()
        print(f"{token_type:20} : {token_value}")

print("\\n" + "-" * 50)
print(f"Total tokens (excluding whitespace): {len([t for t in parsed.tokens if not t.is_whitespace])}")`
  },
  {
    title: "Extract Keywords and Identifiers",
    code: `# Extract specific token types
import sqlparse

sql = "SELECT id, name, email FROM users WHERE age > 25 AND status = 'active'"

parsed = sqlparse.parse(sql)[0]

# Extract keywords
keywords = []
identifiers = []
operators = []

for token in parsed.flatten():
    if token.ttype is None:
        continue
    if token.ttype in sqlparse.tokens.Keyword:
        keywords.append(str(token))
    elif token.ttype in sqlparse.tokens.Name:
        identifiers.append(str(token))
    elif token.ttype in sqlparse.tokens.Operator:
        operators.append(str(token))

print("Keywords found:")
print(f"  {', '.join(keywords)}")
print("\\nIdentifiers found:")
print(f"  {', '.join(identifiers)}")
print("\\nOperators found:")
print(f"  {', '.join(operators)}")`
  },
  {
    title: "Format Complex SQL Query",
    code: `# Format a complex SQL query with joins
import sqlparse

sql = """
SELECT u.id, u.name, u.email, o.order_date, o.total
FROM users u
INNER JOIN orders o ON u.id = o.user_id
WHERE u.status = 'active' AND o.total > 100
ORDER BY o.order_date DESC
LIMIT 10
"""

# Format with uppercase keywords
formatted = sqlparse.format(sql, reindent=True, keyword_case='upper', 
                           indent_width=2, wrap_after=80)

print("Formatted Complex SQL Query:")
print("=" * 60)
print(formatted)
print("=" * 60)`
  },
  {
    title: "Identify Statement Type",
    code: `# Identify the type of SQL statement
import sqlparse

statements = [
    "SELECT * FROM users",
    "INSERT INTO products (name, price) VALUES ('Item', 10.99)",
    "UPDATE users SET status = 'active' WHERE id = 1",
    "DELETE FROM orders WHERE id = 1",
    "CREATE TABLE users (id INT, name VARCHAR(100))"
]

print("SQL Statement Types:")
print("-" * 60)

for sql in statements:
    parsed = sqlparse.parse(sql)[0]
    # Get the first token which is usually the statement type
    first_token = parsed.token_first()
    stmt_type = str(first_token).upper() if first_token else "UNKNOWN"
    print(f"{stmt_type:15} : {sql}")`
  },
  {
    title: "Reindent SQL Code",
    code: `# Reindent SQL for better readability
import sqlparse

# Poorly formatted SQL
sql = """
SELECT u.id, u.name, COUNT(o.id) as order_count
FROM users u LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at > '2024-01-01' AND u.status = 'active'
GROUP BY u.id, u.name
HAVING COUNT(o.id) > 5
ORDER BY order_count DESC
"""

# Reindent with custom width
formatted = sqlparse.format(sql, reindent=True, keyword_case='upper', 
                           indent_width=4)

print("Reindented SQL:")
print("=" * 60)
print(formatted)
print("=" * 60)`
  }
]

const defaultCode = `# Split and format SQL statements
import sqlparse

# String containing multiple SQL statements
raw_sql = '''
SELECT * FROM users WHERE age > 25;
INSERT INTO products (name, price) VALUES ('Laptop', 999.99);
'''

# Split into individual statements
statements = sqlparse.split(raw_sql)

print(f"Found {len(statements)} SQL statements:\\n")

# Format each statement
for i, stmt in enumerate(statements, 1):
    formatted = sqlparse.format(stmt, reindent=True, keyword_case='upper')
    print(f"Statement {i}:")
    print(formatted)
    print()`

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
  createAssetFolder
} = useLibraryPlayground({
  packageName: 'sqlparse',
  defaultCode,
  examples,
  additionalPackages: [],
  setupCode: `
import sqlparse
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

