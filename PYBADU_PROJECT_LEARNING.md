# Pybadu Project - Deep Dive

## Overview

Pybadu is a web-based Python playground that lets users run Python code directly in their browser without any installation. It's built using Nuxt 3 (Vue.js framework) and uses Pyodide (WebAssembly) to execute Python code in the browser.

---

## Project Structure

### Main Components

**1. Pages (`/pages`)**
Each Python library has its own dedicated page (e.g., `matplotlib.vue`, `numpy.vue`, `pandas.vue`). These pages follow a consistent pattern:

- **Code Editor Section**: Where users write and run Python code
- **Information Section**: Details about the library, its features, and use cases
- **Examples**: Pre-built code examples users can load and learn from

**2. Shared Composable (`useLibraryPlayground.js`)**
This is the heart of the application - a reusable function that manages:
- File management (create, delete, rename files)
- Code execution via Pyodide worker
- Output display (text, images, errors)
- Local storage (auto-save code)
- Theme management (dark/light mode)
- Asset management (upload files/folders for use in code)

**3. Code Editor Component (`CodeEditor.vue`)**
The main UI component that provides:
- Monaco editor (VS Code-like editor) for writing code
- File tabs for multi-file projects
- Run button and controls
- Output panel for results
- Example selector
- Asset manager

**4. Pyodide Worker (`pyodide-worker.js`)**
A web worker that runs Python code in the background:
- Loads Pyodide (Python runtime)
- Installs required packages
- Executes Python code
- Handles matplotlib image generation
- Manages file system for assets

---

## How Pages Work

### Example: Matplotlib Page (`matplotlib.vue`)

**Structure:**
```vue
<template>
  <!-- Code Editor -->
  <CodeEditor 
    libraryName="Matplotlib"
    :examples="examples"
    ... />
  
  <!-- Information Section -->
  <LibraryInfoSection>
    <!-- Library description, features, use cases -->
  </LibraryInfoSection>
</template>
```

**Key Parts:**

1. **Examples Array**: Pre-written code snippets users can load
   - Basic Line Plot
   - Multiple Functions
   - Scatter Plot
   - Bar Chart
   - Histogram
   - 3D Surface Plot

2. **Default Code**: Starting code shown when page loads

3. **Setup Code**: Code that runs before user's code (imports, configuration)
   ```python
   import matplotlib
   import matplotlib.pyplot as plt
   import numpy as np
   matplotlib.use('Agg')  # For web display
   ```

4. **useLibraryPlayground Hook**: Connects everything together
   ```javascript
   const {
     files,           // Array of code files
     output,          // Execution results
     runCode,         // Function to execute code
     pyodideReady,    // Whether Python is loaded
     // ... more
   } = useLibraryPlayground({
     packageName: 'matplotlib',
     defaultCode,
     examples,
     setupCode
   })
   ```

### Example: NumPy Page (`numpy.vue`)

Similar structure but focused on numerical computing:
- Examples: Array basics, matrix operations, statistics, linear algebra
- Setup: Just imports NumPy
- Use cases: Scientific computing, data preprocessing, statistical analysis

### Example: Pandas Page (`pandas.vue`)

Focused on data analysis:
- Examples: DataFrames, data selection, grouping, merging, time series
- Setup: Imports Pandas
- Use cases: Data analysis, data science, business intelligence

---

## Key Features Explained

### 1. Multi-File Projects
Users can create up to 5 Python files in a single project:
- Each file has a tab
- Can switch between files
- Can delete files (but must keep at least one)
- Files are saved to browser's localStorage

### 2. Code Execution Flow

```
User clicks "Run"
    ↓
Code sent to Pyodide Worker
    ↓
Worker loads packages (if needed)
    ↓
Worker executes Python code
    ↓
Results sent back (text output, images, errors)
    ↓
Displayed in output panel
```

### 3. Matplotlib Image Handling
Special handling for matplotlib plots:
- Code uses `plt.show()` to generate plots
- Worker captures the plot as an image
- Image is sent back and displayed in output panel
- Supports multiple plots in one execution

### 4. Asset Management
Users can upload files/folders:
- Files stored in Pyodide's virtual file system
- Accessible in Python code via `/assets/` path
- Useful for data files, images, etc.
- Can create folders and organize files

### 5. Auto-Save
- Code automatically saved to localStorage
- Persists across page refreshes
- Each library has separate storage
- Files, code content saved (but not output)

### 6. Examples System
Each page has 6+ examples:
- Users can click to load example code
- Examples demonstrate library features
- Great for learning and quick starts

---

## Page Types

### Library Pages (Most Common)
- `matplotlib.vue` - Data visualization
- `numpy.vue` - Scientific computing
- `pandas.vue` - Data analysis
- `scikit-learn.vue` - Machine learning
- `networkx.vue` - Graph analysis
- `sympy.vue` - Symbolic math
- And 30+ more libraries

**Pattern**: All follow the same structure with:
- CodeEditor component
- Library-specific examples
- Library-specific setup code
- Information section

### Special Pages

**`index.vue`** - Landing page
- Hero section with animated background
- Library showcase (flip cards)
- Features section
- Testimonials
- Call-to-action

**`list.vue`** - All compilers listing
- Search functionality
- Categorized libraries
- Links to all compiler pages

**`about.vue`** - About page
- Project information
- Features overview

**`share.vue`** - Code sharing
- Share code snippets
- Generate shareable links

---

## Technical Details

### Pyodide Integration
- Pyodide runs Python in WebAssembly
- Packages loaded from CDN
- Worker pattern prevents blocking main thread
- Singleton worker shared across pages (performance)

### Monaco Editor
- VS Code's editor in the browser
- Syntax highlighting for Python
- Code completion
- Dark/light theme support

### State Management
- Vue 3 Composition API
- Reactive state with `ref()` and `computed()`
- Local storage for persistence
- No external state management library needed

### Performance Optimizations
- Global Pyodide worker (not recreated per page)
- Package caching (don't reload if already loaded)
- Lazy loading of components
- Code splitting

---

## User Flow Example

**Scenario: User wants to create a matplotlib plot**

1. User visits `/matplotlib`
2. Page loads, Pyodide initializes in background
3. User sees default code (simple sine wave plot)
4. User can:
   - Edit the code
   - Load an example
   - Create new files
   - Upload data files
5. User clicks "Run"
6. Code executes in worker
7. Plot image appears in output panel
8. Code auto-saves to localStorage
9. User can share code or continue editing

---

## Library-Specific Configurations

Each library page configures:

**Package Name**: Which Python package to load
```javascript
packageName: 'matplotlib'
```

**Additional Packages**: Extra packages needed
```javascript
additionalPackages: ['numpy']  // For matplotlib
```

**Setup Code**: Pre-execution code
```javascript
setupCode: `
import matplotlib.pyplot as plt
import numpy as np
matplotlib.use('Agg')
`
```

**Examples**: Library-specific examples
- Matplotlib: Plotting examples
- NumPy: Array operations
- Pandas: Data manipulation
- Scikit-learn: ML models

---

## File Organization

```
pybadu/
├── pages/
│   ├── index.vue          # Landing page
│   ├── list.vue           # All compilers list
│   ├── matplotlib.vue      # Matplotlib compiler
│   ├── numpy.vue          # NumPy compiler
│   ├── pandas.vue         # Pandas compiler
│   └── ...                # 30+ more library pages
├── components/
│   ├── CodeEditor.vue     # Main editor component
│   ├── LibraryInfoSection.vue
│   └── ...
├── composables/
│   └── useLibraryPlayground.js  # Core logic
├── layouts/
│   └── library.vue        # Layout for compiler pages
└── public/
    └── workers/
        └── pyodide-worker.js   # Python execution worker
```

---

## Key Design Decisions

1. **One Page Per Library**: Each library gets its own URL and page
   - Better SEO
   - Shareable links
   - Clear separation

2. **Shared Composable**: Reusable logic across all pages
   - DRY principle
   - Consistent behavior
   - Easier maintenance

3. **Worker Pattern**: Python runs in background thread
   - Doesn't block UI
   - Better performance
   - Can handle long-running code

4. **Local Storage**: Auto-save without backend
   - No server needed
   - Works offline
   - Fast and simple

5. **Monaco Editor**: Professional code editing
   - Familiar to developers
   - Rich features
   - Great UX

---

## Adding a New Library Page

To add a new library compiler:

1. Create new page: `pages/newlibrary.vue`
2. Copy structure from existing page (e.g., `numpy.vue`)
3. Configure:
   - `packageName`: 'newlibrary'
   - `examples`: Add 6+ examples
   - `defaultCode`: Starting code
   - `setupCode`: Imports and setup
4. Add to `list.vue` for discovery
5. Update `index.vue` if it's a featured library

The shared `useLibraryPlayground` composable handles everything else!

---

## Summary

Pybadu is a well-structured application that:
- Provides dedicated environments for 30+ Python libraries
- Runs Python code in the browser using WebAssembly
- Offers a professional code editing experience
- Auto-saves work locally
- Supports multi-file projects
- Includes learning examples for each library
- Works entirely client-side (no backend needed for execution)

The architecture is modular and scalable, making it easy to add new libraries while maintaining consistency across all compiler pages.

