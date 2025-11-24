<template>
  <div>
    <div class="min-h-screen">
      <CodeEditor
        libraryName="Jinja2"
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
        @saveToStorage="saveToStorage"
      />
    </div>

    <LibraryInfoSection>
      <div class="text-center mb-12">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Online Python Jinja2 Compiler
        </h1>

        <div class="max-w-4xl mx-auto text-left space-y-6 text-gray-700 dark:text-gray-300">
          <p class="text-base md:text-lg leading-relaxed">
            Jinja2 is the battle-tested templating engine used across Flask, Ansible, Pelican, and countless internal tooling workflows. It provides a powerful expression language, filters, macros, template inheritance, and sandboxing so you can generate HTML, Markdown, emails, or any text-based artifact with clean, maintainable templates.[^1]
          </p>

          <p class="text-base md:text-lg leading-relaxed">
            This compiler brings the full Jinja2 runtime into the browser so you can prototype templates, test filters, and iterate on macros without spinning up a local server. Load Template objects from strings, register custom filters, render blocks with inheritance, and inspect the generated text instantly—ideal for polishing snippets before integrating them into an app or automation pipeline.
          </p>

          <p class="text-base md:text-lg leading-relaxed">
            Included examples cover the essentials: rendering context variables, control flow, loops with built-in variables, filters, macros, inheritance, and custom environment configuration. Adapt them to validate email layouts, DSL docs, configuration files, static site fragments, or template-driven CLI output.
          </p>

          <h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Who Should Use This</h3>
          <ul class="list-disc list-inside space-y-2 text-base md:text-lg ml-4">
            <li>Flask or FastAPI developers designing HTML/JSON templates</li>
            <li>Platform engineers building Jinja-powered automation (e.g., Ansible)</li>
            <li>Technical writers generating docs or email campaigns from data</li>
            <li>Students learning template inheritance and macro composition</li>
            <li>Anyone needing a quick sandbox to experiment with Jinja expressions</li>
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
  name: 'Jinja2Playground'
})

definePageMeta({
  layout: 'library'
})

useHead({
  title: 'Online Python Jinja2 Compiler',
  meta: [
    { name: 'description', content: 'Prototype Jinja2 templates directly in your browser. Render variables, use filters, macros, and inheritance with Pyodide-powered Python.' },
    { name: 'keywords', content: 'jinja2, template engine, python templates, flask templates, online python compiler, pyodide' },
    { name: 'author', content: 'Pybadu' },
    { property: 'og:title', content: 'Online Python Jinja2 Compiler' },
    { property: 'og:description', content: 'Prototype Jinja2 templates directly in your browser' },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/pybadu.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Online Python Jinja2 Compiler' },
    { name: 'twitter:description', content: 'Prototype Jinja2 templates directly in your browser' },
    { name: 'twitter:image', content: '/pybadu.png' }
  ]
})

const examples = [
  {
    title: 'Render Context Variables',
    code: `from jinja2 import Template

tmpl = Template("Hello {{ name }}!")
print(tmpl.render(name="Pybadu"))`
  },
  {
    title: 'Loops And Conditionals',
    code: `from jinja2 import Template

source = """
{% for user in users %}
- {{ loop.index }}. {{ user.name }}{% if user.active %} ✅{% endif %}
{% endfor %}
"""

tmpl = Template(source)
print(tmpl.render(users=[{"name": "Ava", "active": True}, {"name": "Noah", "active": False}]))`
  },
  {
    title: 'Filters And Default Values',
    code: `from jinja2 import Template

tmpl = Template("{{ title|upper }} — {{ desc|default('N/A') }}")
print(tmpl.render(title="jinja2", desc=None))`
  },
  {
    title: 'Macros For Reusable Blocks',
    code: `from jinja2 import Template

source = """
{% macro badge(status) -%}
<span class="badge badge-{{ status }}">{{ status|capitalize }}</span>
{%- endmacro %}

{{ badge('success') }} {{ badge('danger') }}
"""

print(Template(source).render())`
  },
  {
    title: 'Inheritance Example',
    code: `from jinja2 import Environment, DictLoader

env = Environment(loader=DictLoader({
    "base.html": "<title>{% block title %}{% endblock %}</title><body>{% block body %}{% endblock %}</body>",
    "child.html": "{% extends 'base.html' %}{% block title %}Dashboard{% endblock %}{% block body %}Hello{% endblock %}"
}))

tmpl = env.get_template("child.html")
print(tmpl.render())`
  },
  {
    title: 'Custom Filter Registration',
    code: `from jinja2 import Environment

env = Environment()
env.filters["obfuscate"] = lambda text: "*" * len(text)

tmpl = env.from_string("API Key: {{ key|obfuscate }}")
print(tmpl.render(key="SECRET-12345"))`
  }
]

const defaultCode = `from jinja2 import Template

tmpl = Template("Hello {{ name }}")
print(tmpl.render(name="Ichsan"))`

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
  packageName: 'jinja2',
  defaultCode,
  examples,
  additionalPackages: [],
  setupCode: `
from jinja2 import Template, Environment, DictLoader
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

