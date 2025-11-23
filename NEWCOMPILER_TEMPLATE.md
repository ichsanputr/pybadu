# Template for Creating New Compiler Pages

## Quick Reference

### File Structure:
```
pages/
├── scipy.vue
├── beautifulsoup4.vue
├── pillow.vue
├── nltk.vue
├── regex.vue
├── pytz.vue
├── requests.vue
├── sqlalchemy.vue
├── pytest.vue
└── opencv-python.vue
```

### Key Changes from Matplotlib Template:

1. **Library Name**: Change all instances of "Matplotlib" to your package name
2. **Default Code**: Provide a simple, working example
3. **Examples**: 3-5 examples showcasing key features
4. **About Section**: 
   - 3-4 paragraphs describing the library
   - 1 list with 4-5 key features
   - Keep SEO-friendly language

### SEO Meta Template:
```javascript
useHead({
  title: 'Online {PackageName} Compiler - {Category} | Pybadu',
  meta: [
    { name: 'description', content: '{Brief description}. No installation required.' },
    { name: 'keywords', content: '{package}, {related}, {keywords}, online compiler, pyodide' },
    { name: 'author', content: 'Pybadu' },
    { property: 'og:title', content: 'Online {PackageName} Compiler - {Category}' },
    { property: 'og:description', content: '{Brief description}' },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/pybadu.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Online {PackageName} Compiler' },
    { name: 'twitter:description', content: '{Brief description}' },
    { name: 'twitter:image', content: '/pybadu.png' }
  ]
})
```

### H1 Format:
```vue
<h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
  Online {PackageName} Compiler
</h1>
```

### List Format:
```vue
<h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Perfect For</h3>
<ul class="list-disc list-inside space-y-2 text-sm md:text-base ml-4">
  <li><strong>Feature:</strong> Description</li>
</ul>
```

### Paragraph Format:
```vue
<p class="text-base md:text-lg leading-relaxed">
  {Content}
</p>
```

## Package-Specific Details:

### 1. SciPy
- **Category**: Scientific Computing
- **Default Code**: Signal processing or optimization example
- **Key Features**: FFT, optimization, linear algebra, stats

### 2. BeautifulSoup4
- **Category**: Web Scraping
- **Default Code**: Parse HTML example
- **Key Features**: HTML parsing, CSS selectors, tree navigation

### 3. Pillow
- **Category**: Image Processing  
- **Default Code**: Load, resize, filter image
- **Key Features**: Image manipulation, filters, formats, drawing

### 4. NLTK
- **Category**: Natural Language Processing
- **Default Code**: Tokenization, sentiment analysis
- **Key Features**: Tokenization, POS tagging, sentiment, corpora

### 5. Regex
- **Category**: Pattern Matching
- **Default Code**: Email/URL validation
- **Key Features**: Pattern matching, substitution, validation

### 6. PyTZ
- **Category**: Timezone Handling
- **Default Code**: Convert timezones
- **Key Features**: Timezone conversion, DST, UTC operations

### 7. Requests
- **Category**: HTTP Client
- **Default Code**: GET/POST requests
- **Key Features**: HTTP methods, sessions, authentication

### 8. SQLAlchemy
- **Category**: Database ORM
- **Default Code**: Define models, queries
- **Key Features**: ORM, migrations, relationships, queries

### 9. Pytest
- **Category**: Testing Framework
- **Default Code**: Write and run tests
- **Key Features**: Fixtures, assertions, parametrize, coverage

### 10. OpenCV-Python
- **Category**: Computer Vision
- **Default Code**: Image processing, edge detection
- **Key Features**: Image processing, video, object detection

## Footer Update

Don't forget to add these to `components/AppFooter.vue` under Additional Libraries section.

## Homepage Update

Add library cards to `pages/index.vue` in the libraries array with appropriate icons.

