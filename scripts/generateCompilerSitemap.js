/**
 * Compiler Sitemap Generator
 * Scans all compiler pages (CodeEditor-based) and generates compiler-sitemap.xml
 * Run with: node scripts/generateCompilerSitemap.js
 */

import fs from 'fs'
import path from 'path'
import process from 'process'
import { fileURLToPath } from 'url'

// ES modules path setup
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuration
const BASE_URL = process.env.PYBADU_BASE_URL || 'https://budibadu.com/pybadu'
const OUTPUT_FILE = path.join(__dirname, '../public/compiler-sitemap.xml')
const PAGES_DIR = path.join(__dirname, '../pages')

/**
 * Convert a pages-relative filepath into a route
 */
function toRoute(filePath) {
  const relative = path.relative(PAGES_DIR, filePath)
  const noExt = relative.replace(/\.vue$/i, '')
  // Convert Windows separators to URL separators
  let route = noExt.split(path.sep).join('/')

  // Remove trailing /index for nested routes
  if (route.endsWith('/index')) {
    route = route.slice(0, -('/index'.length))
  }

  // Root index.vue maps to "/"
  if (!route || route === 'index') {
    return '/'
  }

  return `/${route}`
}

/**
 * Determine if the Vue file is a compiler page by checking CodeEditor usage
 */
function isCompilerPage(filePath) {
  const content = fs.readFileSync(filePath, 'utf8')
  return content.includes('<CodeEditor')
}

/**
 * Recursively collect compiler routes
 */
function collectCompilerRoutes(dirPath) {
  const routes = []
  const entries = fs.readdirSync(dirPath, { withFileTypes: true })

  entries.forEach(entry => {
    const fullPath = path.join(dirPath, entry.name)

    if (entry.isDirectory()) {
      // Skip Nuxt special dirs like __tests__ or directories starting with '_'
      if (!entry.name.startsWith('_')) {
        routes.push(...collectCompilerRoutes(fullPath))
      }
      return
    }

    if (entry.isFile() && entry.name.endsWith('.vue') && isCompilerPage(fullPath)) {
      routes.push(toRoute(fullPath))
    }
  })

  return routes
}

/**
 * Generate xml entry
 */
function generateUrlEntry(route) {
  return `    <url>\n        <loc>${BASE_URL}${route}</loc>\n    </url>\n`
}

/**
 * Generate sitemap xml for compiler routes
 */
function generateSitemap(routes) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

  routes.forEach(route => {
    xml += generateUrlEntry(route)
  })

  xml += '</urlset>\n'
  return xml
}

/**
 * Main
 */
function main() {
  try {
    console.log('🔍 Scanning compiler pages...')
    const routes = collectCompilerRoutes(PAGES_DIR)
      .map(route => route.trim())
      .filter(Boolean)

    const uniqueRoutes = Array.from(new Set(routes)).sort((a, b) => a.localeCompare(b))

    console.log(`✅ Found ${uniqueRoutes.length} compiler routes`)

    const sitemap = generateSitemap(uniqueRoutes)
    fs.writeFileSync(OUTPUT_FILE, sitemap, 'utf8')

    console.log(`📄 compiler-sitemap.xml written to ${OUTPUT_FILE}`)
    console.log('🌐 Routes included:')
    uniqueRoutes.forEach(route => console.log(`   - ${BASE_URL}${route}`))
  } catch (error) {
    console.error('❌ Error generating compiler sitemap:', error)
    process.exit(1)
  }
}

main()


