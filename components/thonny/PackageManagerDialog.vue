<template>
    <Transition name="fade">
        <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <!-- Modal Content -->
            <div
                class="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl p-6 border border-gray-200 dark:border-gray-700 pointer-events-auto flex flex-col h-[600px]">

                <!-- Header -->
                <div class="flex items-center justify-between mb-4 flex-shrink-0">
                    <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Manage Packages</h3>
                    <button @click="close" class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                        <Icon icon="ph:x" class="w-6 h-6" />
                    </button>
                </div>

                <!-- Search Row -->
                <div class="flex space-x-2 mb-4 flex-shrink-0">
                    <div class="relative flex-1">
                        <Icon icon="ph:magnifying-glass"
                            class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input v-model="searchQuery" @keydown.enter="handleSearch" type="text"
                            placeholder="Search PyPI packages..."
                            class="w-full pl-10 pr-4 py-2 border rounded-md bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    <button @click="handleSearch"
                        class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center shadow-sm font-medium">
                        Search PyPI
                    </button>
                </div>

                <!-- Main Content Grid -->
                <div class="grid grid-cols-12 gap-6 flex-1 min-h-0">

                    <!-- Left Col: Default/Standard Packages List -->
                    <div
                        class="col-span-5 flex flex-col border rounded-md border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div
                            class="bg-gray-100 dark:bg-gray-750 px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                            <h4 class="font-medium text-gray-700 dark:text-gray-300 text-sm">Standard Pyodide Packages
                            </h4>
                        </div>
                        <div class="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-2">
                            <ul class="space-y-1">
                                <li v-for="pkg in filteredStandardPackages" :key="pkg.name" @click="selectPackage(pkg)"
                                    :class="['px-3 py-2 rounded cursor-pointer text-sm flex items-center justify-between group transition-colors',
                                        selectedPackage?.name === pkg.name
                                            ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800']">
                                    <span class="font-medium truncate">{{ pkg.name }}</span>
                                    <Icon icon="ph:caret-right"
                                        class="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </li>
                            </ul>
                        </div>
                    </div>

                    <!-- Right Col: Package Details -->
                    <div
                        class="col-span-7 flex flex-col border rounded-md border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden relative">
                        <!-- Details Content -->
                        <div v-if="selectedPackage" class="flex flex-col h-full p-6 overflow-y-auto">
                            <!-- Package Header -->
                            <div class="flex items-start justify-between mb-4">
                                <div>
                                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white break-all">{{
                                        selectedPackage.name }}</h2>
                                    <p class="text-sm text-gray-500 mt-1" v-if="selectedPackage.version">Latest: {{
                                        selectedPackage.version }}</p>
                                </div>
                                <div class="flex items-center space-x-2">
                                    <span v-if="installedVersion"
                                        class="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">Installed:
                                        {{ installedVersion }}</span>
                                    <span v-else
                                        class="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full font-medium">Not
                                        Installed</span>
                                </div>
                            </div>

                            <!-- Description -->
                            <div class="mb-6 prose prose-sm dark:prose-invert max-w-none">
                                <p class="text-gray-600 dark:text-gray-300">
                                    {{ selectedPackage.summary || 'No description available.' }}
                                </p>
                            </div>

                            <!-- Action Area -->
                            <div class="mt-auto pt-6 border-t border-gray-100 dark:border-gray-700">
                                <!-- Status Messages -->
                                <div v-if="statusMessage" :class="['mb-4 p-3 rounded-md text-sm flex items-start',
                                    statusType === 'error' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700']">
                                    <Icon :icon="statusType === 'error' ? 'ph:warning-circle' : 'ph:info'"
                                        class="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                                    <span>{{ statusMessage }}</span>
                                </div>

                                <!-- Install/Remove Button -->
                                <button v-if="installedVersion" @click="remove" :disabled="isProcessing"
                                    class="w-full py-2.5 rounded-md font-medium text-white shadow transition-all
                                    bg-red-600 hover:bg-red-700 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center">
                                    <Icon v-if="isProcessing" icon="ph:spinner" class="animate-spin w-5 h-5 mr-2" />
                                    <span>{{ isProcessing ? 'Removing...' : 'Remove Package' }}</span>
                                </button>
                                <button v-else @click="install" :disabled="isProcessing"
                                    class="w-full py-2.5 rounded-md font-medium text-white shadow transition-all
                                    bg-blue-600 hover:bg-blue-700 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center">
                                    <Icon v-if="isProcessing" icon="ph:spinner" class="animate-spin w-5 h-5 mr-2" />
                                    <span>{{ isProcessing ? 'Installing...' : 'Install Package' }}</span>
                                </button>

                                <p class="text-xs text-center text-gray-400 mt-2">
                                    Note: Only pure Python wheels supported in Pyodide.
                                </p>
                            </div>
                        </div>

                        <!-- Empty State -->
                        <div v-else
                            class="flex flex-col items-center justify-center h-full text-gray-400 p-8 text-center">
                            <Icon icon="ph:package" class="w-16 h-16 mb-4 opacity-20" />
                            <h3 class="text-lg font-medium text-gray-500 mb-1">Select a Package</h3>
                            <p class="text-sm">Choose a standard package from the list or search PyPI directly.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
    isOpen: Boolean,
    installPackage: Function,
    removePackage: Function,
    getInstalledPackages: Function
})

const emit = defineEmits(['close'])

// State
const searchQuery = ref('')
const selectedPackage = ref(null)
const isProcessing = ref(false)

// Standard Pyodide Packages Source (Subset of common ones) (Truncated for brevity, but I just need to change the state variable name)
// No, I can't truncate because I'm replacing a specific part. I will assume the previous tool call modified the template but the script part needs update now.

// Let's scroll down to where `isInstalling` is defined and used.
// It is around line 140.

// Re-reading Step 20 output to find line numbers.
// isInstalling is at line 140.
// install() function is at line 223.
// watch is at line 249.

// I will replace from line 129 to 256 to cover all usages and the prop definition.
// Wait, that's too much. The standardPackages array is huge (lines 146-166 and replaced in step 52 with ~200 lines).
// I should avoid replacing the big array if possible.
// `isInstalling` is defined at line 140.
// `install` function uses it.
// `watch` uses it.

// I will do multiple chunks.

// Chunk 1: Props and Reactivity
// Chunk 2: Functions install/remove/watch

// Actually, I can just replace the specific lines if I'm careful.
// But `standardPackages` is in the middle.
// I will use `replace_file_content` for the script part, carefully avoiding the array.

// Chunk 1: Props and State definition (lines 129-144)
// Chunk 2: install/remove functions and watchers (lines 223+)

// Wait, I can't add `remove` function easily without seeing where to put it.
// I'll put it after `install` function.

// Let's target lines 223 to the end of script.
// But `install` uses `isInstalling`.
// And I need to rename definition of `isInstalling` at line 140.

// Let's do it in 3 chunks.
// 1. Props (129-133)
// 2. State (140)
// 3. Functions (223-256)

// Wait, `replace_file_content` doesn't support multiple non-contiguous chunks in one call?
// "Use this tool ONLY when you are making a SINGLE CONTIGUOUS block of edits".
// I MUST use `multi_replace_file_content` or make separate calls.
// The instructions say: "If you are making edits to multiple non-adjacent lines, use the multi_replace_file_content tool instead."
// So I will use `multi_replace_file_content`.

// Chunk 1: Update props
// Chunk 2: Update state name
// Chunk 3: Update `install` function and add `remove` function.
// Chunk 4: Update `watch` function.

// Wait, I need to check where `standardPackages` ends.
// In the original file it ended at 166. After my update it ended much later.
// `filteredStandardPackages` computed prop starts after `standardPackages`.

// I will proceed with `multi_replace_file_content`.
const statusMessage = ref('')
const statusType = ref('info')
const installedPackagesMap = ref(new Map())

// Standard Pyodide Packages Source (Subset of common ones)
const standardPackages = [
    { name: 'affine', version: '2.4.0', summary: 'Matrices describing affine transformation of the plane' },
    { name: 'aiohappyeyeballs', version: '2.6.1', summary: 'Happy Eyeballs for asyncio' },
    { name: 'aiohttp', version: '3.11.13', summary: 'Async http client/server framework' },
    { name: 'aiosignal', version: '1.3.2', summary: 'A list of registered asynchronous callbacks' },
    { name: 'altair', version: '5.5.0', summary: 'Declarative statistical visualization library' },
    { name: 'annotated-types', version: '0.7.0', summary: 'Reusable constraint types to use with typing.Annotated' },
    { name: 'anyio', version: '4.9.0', summary: 'High level compatibility layer for multiple asynchronous event loop implementations' },
    { name: 'apsw', version: '3.50.4.0', summary: 'Another Python SQLite Wrapper' },
    { name: 'argon2-cffi', version: '23.1.0', summary: 'Argon2 for Python' },
    { name: 'argon2-cffi-bindings', version: '21.2.0', summary: 'Low-level CFFI bindings for Argon2' },
    { name: 'asciitree', version: '0.3.3', summary: 'Draws ASCII trees' },
    { name: 'astropy', version: '7.0.1', summary: 'Community-developed python astronomy tools' },
    { name: 'astropy-iers-data', version: '0.2025.3.10.0.29.26', summary: 'IERS Earth Rotation and Leap Second tables for astropy' },
    { name: 'asttokens', version: '3.0.0', summary: 'Annotate AST trees with source code positions' },
    { name: 'async-timeout', version: '5.0.1', summary: 'Timeout context manager for asyncio programs' },
    { name: 'atomicwrites', version: '1.4.1', summary: 'Atomic file writes' },
    { name: 'attrs', version: '25.2.0', summary: 'Classes Without Boilerplate' },
    { name: 'audioop-lts', version: '0.2.1', summary: 'LTS port of audioop' },
    { name: 'autograd', version: '1.7.0', summary: 'Efficiently computes derivatives of numpy code' },
    { name: 'awkward-cpp', version: '47', summary: 'CPU kernels and compiled extensions for Awkward Array' },
    { name: 'b2d', version: '0.7.4', summary: 'Python bindings for Box2D' },
    { name: 'bcrypt', version: '4.3.0', summary: 'Modern password hashing for your software and your servers' },
    { name: 'beautifulsoup4', version: '4.13.3', summary: 'Screen-scraping library' },
    { name: 'bilby.cython', version: '0.5.3', summary: 'Optimized cython implementations for bilby' },
    { name: 'biopython', version: '1.85', summary: 'Tools for biological computation' },
    { name: 'bitarray', version: '3.7.1', summary: 'A robust, high-performance optimization library' },
    { name: 'bitstring', version: '4.3.1', summary: 'Simple construction, analysis, and modification of binary data' },
    { name: 'bleach', version: '6.2.0', summary: 'An easy safelist-based HTML-sanitizing tool' },
    { name: 'blosc2', version: '3.5.1', summary: 'Python wrapper for the C-Blosc2 library' },
    { name: 'bokeh', version: '3.6.3', summary: 'Interactive plots and applications in the browser' },
    { name: 'boost-histogram', version: '1.6.1', summary: 'The Boost::Histogram Python wrappers' },
    { name: 'brotli', version: '1.1.0', summary: 'Python bindings for the Brotli compression library' },
    { name: 'cachetools', version: '5.5.2', summary: 'Extensible memoizing collections and decorators' },
    { name: 'casadi', version: '3.7.0', summary: 'Symbolic framework for numeric optimization' },
    { name: 'cbor-diag', version: '1.0.1', summary: 'Parse and produces CBOR diagnostic notation' },
    { name: 'certifi', version: '2025.8.3', summary: 'Python package for providing Mozilla\'s CA Bundle' },
    { name: 'cffi', version: '1.17.1', summary: 'Foreign Function Interface for Python calling C code' },
    { name: 'cffi_example', version: '0.1', summary: 'Example CFFI package' },
    { name: 'cftime', version: '1.6.4.post1', summary: 'Time-handling functionality from netcdf4-python' },
    { name: 'charset-normalizer', version: '3.4.3', summary: 'The Real First Universal Charset Detector' },
    { name: 'clarabel', version: '0.11.0', summary: 'Clarabel solver' },
    { name: 'click', version: '8.3.0', summary: 'Composable command line interface toolkit' },
    { name: 'cligj', version: '0.7.2', summary: 'Click params for GeoJSON' },
    { name: 'clingo', version: '5.8.0', summary: 'A grounder and solver for logic programs' },
    { name: 'cloudpickle', version: '3.1.1', summary: 'Extended pickling support for Python objects' },
    { name: 'cmyt', version: '2.0.2', summary: 'A collection of Matplotlib colormaps from the yt project' },
    { name: 'cobs', version: '1.2.1', summary: 'Consistent Overhead Byte Stuffing' },
    { name: 'colorspacious', version: '1.1.2', summary: 'A powerful, accurate, and easy-to-use Python library for doing colorspace conversions' },
    { name: 'contourpy', version: '1.3.1', summary: 'Python library for calculating contours of 2D quadrilateral grids' },
    { name: 'coolprop', version: '6.6.0', summary: 'Open-source thermodynamic and transport property database' },
    { name: 'coverage', version: '7.6.12', summary: 'Code coverage measurement for Python' },
    { name: 'cramjam', version: '2.10.0rc1', summary: 'Thin Python bindings to de/compression algorithms in Rust' },
    { name: 'crc32c', version: '2.7.1', summary: 'CRC32C implementation exposed to Python' },
    { name: 'cryptography', version: '46.0.1', summary: 'cryptography is a package which provides cryptographic recipes and primitives' },
    { name: 'css-inline', version: '0.16.0', summary: 'High-performance CSS inlining' },
    { name: 'cssselect', version: '1.3.0', summary: 'cssselect parses CSS3 Selectors and translates them to XPath 1.0' },
    { name: 'cvxpy-base', version: '1.6.3', summary: 'A Python-embedded modeling language for convex optimization problems' },
    { name: 'cycler', version: '0.12.1', summary: 'Composable style cycles' },
    { name: 'cysignals', version: '1.12.3', summary: 'Interrupt and signal handling for Cython' },
    { name: 'cytoolz', version: '1.0.1', summary: 'Cython implementation of Toolz: High performance functional data analysis' },
    { name: 'decorator', version: '5.2.1', summary: 'Dynamically alter the signature of a function' },
    { name: 'demes', version: '0.2.3', summary: 'Tools for working with Demes Demographic Models' },
    { name: 'deprecation', version: '2.1.0', summary: 'A library to handle automated deprecations' },
    { name: 'diskcache', version: '5.6.3', summary: 'Disk Cache -- Disk and file backed persistent cache' },
    { name: 'distlib', version: '0.3.9', summary: 'Distribution utilities' },
    { name: 'distro', version: '1.9.0', summary: 'Distro - an OS platform information API' },
    { name: 'docutils', version: '0.21.2', summary: 'Docutils is a modular system for processing documentation' },
    { name: 'donfig', version: '0.8.1.post1', summary: 'Configuration logic for Python packages' },
    { name: 'ewah_bool_utils', version: '1.2.2', summary: 'EWAH Bool Array Utils' },
    { name: 'exceptiongroup', version: '1.2.2', summary: 'Backport of PEP 654 (exception groups)' },
    { name: 'executing', version: '2.2.0', summary: 'Get the currently executing AST node of a frame, and other information' },
    { name: 'fastapi', version: '0.116.1', summary: 'FastAPI framework, high performance, easy to learn, fast to code, ready for production' },
    { name: 'fastcan', version: '0.4.1', summary: 'FastCAN - Fast Canonicalization of SMILES' },
    { name: 'fastparquet', version: '2024.11.0', summary: 'Python support for Parquet file format' },
    { name: 'fiona', version: '1.9.5', summary: 'Fiona reads and writes geospatial data files' },
    { name: 'fonttools', version: '4.56.0', summary: 'Tools to manipulate font files' },
    { name: 'freesasa', version: '2.2.1', summary: 'Calculate solvent accessible surface areas of protein molecules' },
    { name: 'frozenlist', version: '1.6.0', summary: 'A list-like structure which implements collections.abc.MutableSequence' },
    { name: 'fsspec', version: '2025.3.2', summary: 'File-system specification' },
    { name: 'future', version: '1.0.0', summary: 'Clean single-source support for Python 3 and 2' },
    { name: 'galpy', version: '1.10.2', summary: 'Galactic Dynamics in Python' },
    { name: 'gmpy2', version: '2.1.5', summary: 'GMP/MPIR, MPFR, and MPC interface to Python' },
    { name: 'gsw', version: '3.6.19', summary: 'Gibbs SeaWater Oceanographic Package of TEOS-10' },
    { name: 'h11', version: '0.14.0', summary: 'A pure-Python, bring-your-own-I/O implementation of HTTP/1.1' },
    { name: 'h3', version: '4.2.2', summary: 'Python bindings for H3, a hierarchical hexagonal geospatial indexing system' },
    { name: 'h5py', version: '3.13.0', summary: 'Read and write HDF5 files from Python' },
    { name: 'highspy', version: '1.11.0', summary: 'Python interface to HiGHS' },
    { name: 'html5lib', version: '1.1', summary: 'HTML parser based on the WHATWG HTML specification' },
    { name: 'httpcore', version: '1.0.7', summary: 'A minimal low-level HTTP client' },
    { name: 'httpx', version: '0.28.1', summary: 'A next generation HTTP client for Python' },
    { name: 'idna', version: '3.10', summary: 'Internationalized Domain Names in Applications (IDNA)' },
    { name: 'igraph', version: '0.11.8', summary: 'High performance graph data structures and algorithms' },
    { name: 'imageio', version: '2.37.0', summary: 'Library for reading and writing a wide range of image, video, scientific, and volumetric data formats' },
    { name: 'imgui-bundle', version: '1.92.4', summary: 'ImGui Bundle: Dear ImGui, ImPlot, ImGuiColorTextEdit, ImGuiNodeEditor, etc.' },
    { name: 'iminuit', version: '2.30.1', summary: 'Jupyter-friendly Python interface for Minuit2' },
    { name: 'iniconfig', version: '2.1.0', summary: 'iniconfig: brain-dead simple config-ini parsing' },
    { name: 'inspice', version: '1.6.4.1', summary: 'SPICE toolkit for Python' },
    { name: 'ipython', version: '9.0.2', summary: 'IPython: Productive Interactive Computing' },
    { name: 'jedi', version: '0.19.2', summary: 'An autocompletion tool for Python that can be used for text editors' },
    { name: 'jinja2', version: '3.1.6', summary: 'A very fast and expressive template engine' },
    { name: 'jiter', version: '0.9.0', summary: 'Fast iterable JSON parser' },
    { name: 'joblib', version: '1.4.2', summary: 'Lightweight pipelining in Python' },
    { name: 'jsonpatch', version: '1.33', summary: 'Applying JSON Patch documents to JSON documents' },
    { name: 'jsonpointer', version: '3.0.0', summary: 'Identify specific values in a JSON document' },
    { name: 'jsonschema', version: '4.23.0', summary: 'An implementation of JSON Schema validation for Python' },
    { name: 'jsonschema-specifications', version: '2024.10.1', summary: 'The JSON Schema meta-schemas and vocabularies, exposed as a Registry' },
    { name: 'kiwisolver', version: '1.4.8', summary: 'A fast implementation of the Cassowary constraint solver' },
    { name: 'lakers-python', version: '0.6.0', summary: 'Python bindings for Lakers' },
    { name: 'lazy-loader', version: '0.4', summary: 'Populate library namespace without incurring immediate import costs' },
    { name: 'lazy-object-proxy', version: '1.10.0', summary: 'A fast and thorough lazy object proxy' },
    { name: 'libcst', version: '1.6.0', summary: 'A concrete syntax tree with deep support for modifications' },
    { name: 'lightgbm', version: '4.6.0', summary: 'LightGBM Python Package' },
    { name: 'logbook', version: '1.8.0', summary: 'A logging replacement for Python' },
    { name: 'lxml', version: '6.0.2', summary: 'Powerful and Pythonic XML processing library' },
    { name: 'lz4', version: '4.4.4', summary: 'LZ4 Bindings for Python' },
    { name: 'markupsafe', version: '3.0.2', summary: 'Safely add untrusted strings to HTML/XML markup' },
    { name: 'matplotlib', version: '3.8.4', summary: 'Plotting library for Python' },
    { name: 'matplotlib-inline', version: '0.1.7', summary: 'Inline Matplotlib backend for Jupyter Notebooks' },
    { name: 'memory-allocator', version: '0.1.4', summary: 'An extension class to allocate memory easily with Cython' },
    { name: 'micropip', version: '0.11.0', summary: 'Package installer for Pyodide' },
    { name: 'mmh3', version: '5.1.0', summary: 'Python wrapper for MurmurHash3' },
    { name: 'more-itertools', version: '10.6.0', summary: 'More routines for operating on iterables, beyond itertools' },
    { name: 'mpmath', version: '1.3.0', summary: 'Python library for arbitrary-precision floating-point arithmetic' },
    { name: 'msgpack', version: '1.1.1', summary: 'MessagePack (de)serializer' },
    { name: 'msgspec', version: '0.19.0', summary: 'A fast JSON/MessagePack/Struct library' },
    { name: 'msprime', version: '1.3.3', summary: 'A library for simulating coalescent histories' },
    { name: 'multidict', version: '6.6.4', summary: 'multidict implementation' },
    { name: 'munch', version: '4.0.0', summary: 'A dot-accessible dictionary (a la JavaScript objects)' },
    { name: 'mypy', version: '1.15.0', summary: 'Optional static typing for Python' },
    { name: 'narwhals', version: '1.46.0', summary: 'Extremely lightweight compatibility layer for dataframes' },
    { name: 'ndindex', version: '1.9.2', summary: 'A Python library for manipulating indices of n-dimensional arrays' },
    { name: 'netcdf4', version: '1.7.2', summary: 'Provides an object-oriented python interface to the netCDF version 4 library' },
    { name: 'networkx', version: '3.4.2', summary: 'Python package for creating and manipulating complex networks' },
    { name: 'newick', version: '1.9.0', summary: 'A python module to read and write the Newick format' },
    { name: 'nh3', version: '0.2.21', summary: 'Python binding for ammonia HTML sanitizer' },
    { name: 'nlopt', version: '2.9.1', summary: 'Library for nonlinear optimization' },
    { name: 'nltk', version: '3.9.1', summary: 'Natural Language Toolkit' },
    { name: 'numcodecs', version: '0.13.1', summary: 'A Python package providing buffer compression and transformation codecs' },
    { name: 'numpy', version: '2.2.5', summary: 'Fundamental package for scientific computing' },
    { name: 'openai', version: '1.68.2', summary: 'Python client library for the OpenAI API' },
    { name: 'opencv-python', version: '4.11.0.86', summary: 'Wrapper package for OpenCV python bindings' },
    { name: 'optlang', version: '1.8.3', summary: 'Formulate optimization problems using SymPy' },
    { name: 'orjson', version: '3.10.16', summary: 'Fast, correct Python JSON library supporting dataclasses, datetimes, and numpy' },
    { name: 'packaging', version: '24.2', summary: 'Core utilities for Python packages' },
    { name: 'pandas', version: '2.3.2', summary: 'Data structures for data analysis, time series, and statistics' },
    { name: 'parso', version: '0.8.4', summary: 'A Python parser that supports error recovery and round-tripping' },
    { name: 'patsy', version: '1.0.1', summary: 'A Python package for describing statistical models' },
    { name: 'pcodec', version: '0.3.3', summary: 'Lossless compression for numerical data' },
    { name: 'peewee', version: '3.17.9', summary: 'a small, expressive orm' },
    { name: 'pi-heif', version: '0.21.0', summary: 'Python interface for libheif' },
    { name: 'pillow', version: '11.3.0', summary: 'Python Imaging Library' },
    { name: 'pillow-heif', version: '1.1.0', summary: 'Python interface for libheif' },
    { name: 'pkgconfig', version: '1.5.5', summary: 'Interface to the pkg-config command line tool' },
    { name: 'platformdirs', version: '4.3.6', summary: 'A small Python module for determining appropriate platform-specific dirs' },
    { name: 'pluggy', version: '1.5.0', summary: 'plugin and hook calling mechanisms for python' },
    { name: 'ply', version: '3.11', summary: 'Python Lex-Yacc' },
    { name: 'pplpy', version: '0.8.10', summary: 'Python interface to the ppl library' },
    { name: 'primecountpy', version: '0.1.1', summary: 'Python interface to primecount' },
    { name: 'prompt_toolkit', version: '3.0.50', summary: 'Library for building powerful interactive command lines in Python' },
    { name: 'propcache', version: '0.3.0', summary: 'Property cache' },
    { name: 'protobuf', version: '6.31.1', summary: 'Protocol Buffers' },
    { name: 'pure-eval', version: '0.2.3', summary: 'Safely evaluate AST nodes without side effects' },
    { name: 'py', version: '1.11.0', summary: 'library with cross-python path, ini-parsing, io, code, log facilities' },
    { name: 'pyclipper', version: '1.3.0.post6', summary: 'Cython wrapper for the C++ Clipper library' },
    { name: 'pycparser', version: '2.22', summary: 'C parser in Python' },
    { name: 'pycryptodome', version: '3.21.0', summary: 'Cryptographic library for Python' },
    { name: 'pydantic', version: '2.10.6', summary: 'Data validation and settings management using python type hints' },
    { name: 'pydantic-core', version: '2.27.2', summary: 'Core validation logic for pydantic' },
    { name: 'pyerfa', version: '2.0.1.5', summary: 'Python bindings for ERFA' },
    { name: 'pygame-ce', version: '2.5.6.dev2', summary: 'Pygame Community Edition' },
    { name: 'pygments', version: '2.19.1', summary: 'Pygments is a syntax highlighting package written in Python' },
    { name: 'pyheif', version: '0.8.0', summary: 'Python 3.6+ interface to libheif library' },
    { name: 'pyiceberg', version: '0.9.0', summary: 'Python implementation for Apache Iceberg' },
    { name: 'pyinstrument', version: '5.0.1', summary: 'Call stack profiler for Python' },
    { name: 'pylimer-tools', version: '0.3.11', summary: 'Tools for Pylimer' },
    { name: 'pymupdf', version: '1.26.3', summary: 'Python bindings for the MuPDF library' },
    { name: 'pynacl', version: '1.5.0', summary: 'Python binding to the Networking and Cryptography (NaCl) library' },
    { name: 'pyodide-http', version: '0.2.2', summary: 'Patching urllib/requests for Pyodide' },
    { name: 'pyodide-unix-timezones', version: '1.0.0', summary: 'Unix timezones for Pyodide' },
    { name: 'pyparsing', version: '3.2.1', summary: 'Python parsing module' },
    { name: 'pyrsistent', version: '0.20.0', summary: 'Persistent/Functional/Immutable data structures' },
    { name: 'pysam', version: '0.23.0', summary: 'A python module for reading and treating SAM/BAM/CRAM files' },
    { name: 'pyshp', version: '2.3.1', summary: 'Pure Python read/write support for ESRI Shapefile format' },
    { name: 'pytaglib', version: '3.0.1', summary: 'Python audio tagging library' },
    { name: 'pytest', version: '8.3.5', summary: 'pytest: simple powerful testing with Python' },
    { name: 'pytest-asyncio', version: '0.25.3', summary: 'Pytest support for asyncio' },
    { name: 'pytest-benchmark', version: '4.0.0', summary: 'A py.test fixture for benchmarking code' },
    { name: 'pytest-httpx', version: '0.30.0', summary: 'Send responses to httpx' },
    { name: 'python-calamine', version: '0.5.3', summary: 'Python bindings for Calamine' },
    { name: 'python-dateutil', version: '2.9.0.post0', summary: 'Extensions to the standard Python datetime module' },
    { name: 'python-flint', version: '0.8.0', summary: 'Python bindings for Flint' },
    { name: 'python-magic', version: '0.4.27', summary: 'File type identification using libmagic' },
    { name: 'python-sat', version: '1.8.dev23', summary: 'A collection of SAT solvers for Python' },
    { name: 'python-solvespace', version: '3.0.8', summary: 'Python bindings for Solvespace' },
    { name: 'pytz', version: '2025.2', summary: 'World timezone definitions, modern and historical' },
    { name: 'pywavelets', version: '1.8.0', summary: 'PyWavelets, wavelet transform module' },
    { name: 'pyxel', version: '1.9.10', summary: 'A retro game engine for Python' },
    { name: 'pyxirr', version: '0.10.6', summary: 'Rust-powered XIRR and IRR calculation' },
    { name: 'pyyaml', version: '6.0.2', summary: 'YAML parser and emitter for Python' },
    { name: 'rasterio', version: '1.4.3', summary: 'Fast and direct raster I/O for use with Numpy and SciPy' },
    { name: 'rateslib', version: '2.1.1', summary: 'A fixed income library for Python' },
    { name: 'rebound', version: '4.4.7', summary: 'An N-body integrator for gravitational dynamics' },
    { name: 'reboundx', version: '4.4.1', summary: 'Additional features for REBOUND' },
    { name: 'referencing', version: '0.36.2', summary: 'JSON Referencing + Pointer resolution' },
    { name: 'regex', version: '2024.11.6', summary: 'Alternative regular expression module, to replace re' },
    { name: 'requests', version: '2.32.4', summary: 'Python HTTP for Humans (Patched for Pyodide)' },
    { name: 'retrying', version: '1.3.4', summary: 'Simplify the task of adding retry behavior' },
    { name: 'rich', version: '13.9.4', summary: 'Rich text and beautiful formatting in the terminal' },
    { name: 'river', version: '0.22.0', summary: 'Online machine learning in Python' },
    { name: 'robotraconteur', version: '1.2.6', summary: 'Robot Raconteur communication library' },
    { name: 'rpds-py', version: '0.27.0', summary: 'Python bindings to Rust\'s persistent data structures' },
    { name: 'ruamel.yaml', version: '0.18.10', summary: 'ruamel.yaml is a YAML parser/emitter' },
    { name: 'rustworkx', version: '0.17.1', summary: 'A high performance graph library for Python' },
    { name: 'scikit-image', version: '0.25.2', summary: 'Image processing routines for SciPy' },
    { name: 'scikit-learn', version: '1.7.0', summary: 'Machine learning library' },
    { name: 'scipy', version: '1.14.1', summary: 'Scientific Library for Python' },
    { name: 'screed', version: '1.1.3', summary: 'short read sequence dictionary' },
    { name: 'setuptools', version: '76.0.0', summary: 'Easily download, build, install, upgrade, and uninstall Python packages' },
    { name: 'shapely', version: '2.0.7', summary: 'Manipulation and analysis of geometric objects' },
    { name: 'simplejson', version: '3.20.1', summary: 'Simple, fast, extensible JSON encoder/decoder' },
    { name: 'sisl', version: '0.16.2', summary: 'Scientific software for manipulating and analyzing data structures' },
    { name: 'six', version: '1.17.0', summary: 'Python 2 and 3 compatibility utilities' },
    { name: 'smart-open', version: '7.1.0', summary: 'Utils for streaming large files (S3, HDFS, gzip, bz2...)' },
    { name: 'sniffio', version: '1.3.1', summary: 'Sniff out which async library your code is running under' },
    { name: 'sortedcontainers', version: '2.4.0', summary: 'Python sorted container types' },
    { name: 'soundfile', version: '0.12.1', summary: 'An audio library based on libsndfile, CFFI and NumPy' },
    { name: 'soupsieve', version: '2.6', summary: 'A modern CSS selector implementation for Beautiful Soup' },
    { name: 'sourmash', version: '4.8.14', summary: 'Tools for comparing DNA sequences with MinHash sketches' },
    { name: 'soxr', version: '0.5.0.post1', summary: 'High quality, one-dimensional sample-rate conversion' },
    { name: 'sparseqr', version: '1.2', summary: 'Sparse QR decomposition' },
    { name: 'sqlalchemy', version: '2.0.39', summary: 'Database Abstraction Library' },
    { name: 'stack-data', version: '0.6.3', summary: 'Extract data from stack frames' },
    { name: 'starlette', version: '0.47.2', summary: 'The little ASI framework that shines' },
    { name: 'statsmodels', version: '0.14.4', summary: 'Statistical computations and models for Python' },
    { name: 'strictyaml', version: '1.7.3', summary: 'Strict, typesafe YAML parser' },
    { name: 'svgwrite', version: '1.4.3', summary: 'A Python library to create SVG drawings' },
    { name: 'swiglpk', version: '5.0.12', summary: 'GLPK wrapper for Python' },
    { name: 'sympy', version: '1.13.3', summary: 'Computer algebra system (CAS) in Python' },
    { name: 'tblib', version: '3.0.0', summary: 'Traceback serialization library' },
    { name: 'termcolor', version: '2.5.0', summary: 'ANSII Color formatting for output in terminal' },
    { name: 'texttable', version: '1.7.0', summary: 'Module for creating simple ASCII tables' },
    { name: 'texture2ddecoder', version: '1.0.5', summary: 'Texture2D Decoder' },
    { name: 'threadpoolctl', version: '3.5.0', summary: 'threadpoolctl' },
    { name: 'tiktoken', version: '0.9.0', summary: 'tiktoken is a fast BPE tokeniser' },
    { name: 'tomli', version: '2.2.1', summary: 'A lil\' TOML parser' },
    { name: 'tomli-w', version: '1.2.0', summary: 'A lil\' TOML writer' },
    { name: 'toolz', version: '1.0.0', summary: 'List processing tools and functional utilities' },
    { name: 'tqdm', version: '4.67.1', summary: 'Fast, Extensible Progress Meter' },
    { name: 'traitlets', version: '5.14.3', summary: 'Configuration system for Python applications' },
    { name: 'traits', version: '7.0.2', summary: 'Explicitly typed attributes for Python' },
    { name: 'tree-sitter', version: '0.23.2', summary: 'Python bindings to the Tree-sitter parsing library' },
    { name: 'tree-sitter-go', version: '0.23.3', summary: 'Go grammar for tree-sitter' },
    { name: 'tree-sitter-java', version: '0.23.4', summary: 'Java grammar for tree-sitter' },
    { name: 'tree-sitter-python', version: '0.23.4', summary: 'Python grammar for tree-sitter' },
    { name: 'tskit', version: '0.6.4', summary: 'The tree sequence toolkit' },
    { name: 'typing-extensions', version: '4.15.0', summary: 'Backported and Experimental Type Hints for Python 3.8+' },
    { name: 'tzdata', version: '2025.2', summary: 'Provider of IANA time zone data' },
    { name: 'ujson', version: '5.11.0', summary: 'Ultra fast JSON encoder and decoder for Python' },
    { name: 'uncertainties', version: '3.2.2', summary: 'Transparent calculations with uncertainties on the quantities involved' },
    { name: 'unyt', version: '3.0.3', summary: 'Handle, manipulate, and convert data with units' },
    { name: 'urllib3', version: '2.5.0', summary: 'HTTP library with thread-safe connection pooling, file post, and more' },
    { name: 'vega-datasets', version: '0.9.0', summary: 'A Python package for offline access to Vega datasets' },
    { name: 'vrplib', version: '2.0.1', summary: 'A library for reading and writing VRPLIB instances' },
    { name: 'wcwidth', version: '0.2.13', summary: 'Measures the displayed width of unicode strings in a terminal' },
    { name: 'webencodings', version: '0.5.1', summary: 'Character encoding aliases for legacy web content' },
    { name: 'wordcloud', version: '1.9.4', summary: 'A little word cloud generator in Python' },
    { name: 'wrapt', version: '1.17.2', summary: 'Module for decorators, wrappers and monkey patching' },
    { name: 'xarray', version: '2025.9.0', summary: 'N-D labeled arrays and datasets in Python' },
    { name: 'xgboost', version: '2.1.4', summary: 'Scalable, Portable and Distributed Gradient Boosting' },
    { name: 'xlrd', version: '2.0.1', summary: 'Library for developers to extract data from Microsoft Excel (tm) spreadsheet files' },
    { name: 'xxhash', version: '3.5.0', summary: 'Python binding for xxHash' },
    { name: 'xyzservices', version: '2025.1.0', summary: 'Source of XYZ tiles providers' },
    { name: 'yarl', version: '1.18.3', summary: 'Yet another URL library' },
    { name: 'yt', version: '4.4.0', summary: 'An analysis and visualization toolkit for volumetric data' },
    { name: 'zengl', version: '2.7.1', summary: 'Self-contained high-performance rendering library' },
    { name: 'zfpy', version: '1.0.1', summary: 'Python interface to zfp compression library' },
    { name: 'zstandard', version: '0.23.0', summary: 'Zstandard bindings for Python' }
].sort((a, b) => a.name.localeCompare(b.name))

const filteredStandardPackages = computed(() => {
    return standardPackages
})

const installedVersion = computed(() => {
    if (!selectedPackage.value) return null
    return installedPackagesMap.value.get(selectedPackage.value.name.toLowerCase()) || null
})

// Actions
function selectPackage(pkg) {
    selectedPackage.value = { ...pkg }
    statusMessage.value = ''
    statusType.value = 'info'
}

async function handleSearch() {
    if (!searchQuery.value.trim()) return

    const queryName = searchQuery.value.trim()
    isProcessing.value = true
    statusMessage.value = `Searching for ${queryName}...`
    statusType.value = 'info'
    selectedPackage.value = null

    try {
        // 1. Check Standard List first (Local)
        const standardMatch = standardPackages.find(p => p.name.toLowerCase() === queryName.toLowerCase())
        if (standardMatch) {
            selectPackage(standardMatch)
            return
        }

        // 2. Fetch from PyPI
        const response = await fetch(`https://pypi.org/pypi/${queryName}/json`)
        if (!response.ok) {
            throw new Error('Package not found')
        }
        const data = await response.json()

        selectedPackage.value = {
            name: data.info.name,
            summary: data.info.summary || 'No description available',
            version: data.info.version
        }
        statusMessage.value = ''
    } catch (e) {
        statusMessage.value = `Package '${queryName}' not found on PyPI.`
        statusType.value = 'error'
        selectedPackage.value = null
    } finally {
        isProcessing.value = false
    }
}

async function loadInstalledPackages() {
    if (!props.getInstalledPackages) return
    try {
        const pkgs = await props.getInstalledPackages()
        // Format: ["name==version", ...]
        const map = new Map()
        pkgs.forEach(p => {
            const parts = p.split('==')
            if (parts.length === 2) {
                map.set(parts[0].toLowerCase(), parts[1])
            } else {
                map.set(p.toLowerCase(), 'Installed')
            }
        })
        installedPackagesMap.value = map
    } catch (e) {
        console.error("Failed to load installed packages", e)
    }
}

async function install() {
    if (!selectedPackage.value || isProcessing.value || !props.installPackage) return

    const pkgName = selectedPackage.value.name
    isProcessing.value = true
    statusMessage.value = `Installing ${pkgName}... Please wait.`
    statusType.value = 'info'

    try {
        await props.installPackage(pkgName)
        statusMessage.value = `Successfully installed ${pkgName}.`
        statusType.value = 'success'
        await loadInstalledPackages()
    } catch (e) {
        statusMessage.value = `Failed to install ${pkgName}. It might not be available as a pure Python wheel.`
        statusType.value = 'error'
    } finally {
        isProcessing.value = false
    }
}

async function remove() {
    if (!selectedPackage.value || isProcessing.value || !props.removePackage) return

    const pkgName = selectedPackage.value.name
    isProcessing.value = true
    statusMessage.value = `Removing ${pkgName}... Please wait.`
    statusType.value = 'info'

    try {
        await props.removePackage(pkgName)
        statusMessage.value = `Successfully removed ${pkgName}.`
        statusType.value = 'success'
        await loadInstalledPackages()
    } catch (e) {
        statusMessage.value = `Failed to remove ${pkgName}.`
        statusType.value = 'error'
    } finally {
        isProcessing.value = false
    }
}

function close() {
    emit('close')
}

// Watchers
watch(() => props.isOpen, (newVal) => {
    if (newVal) {
        loadInstalledPackages()
        searchQuery.value = ''
        selectedPackage.value = null
        statusMessage.value = ''
        isProcessing.value = false
    }
})

// Utils
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
