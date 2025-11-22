<template>
  <div>
    <HeroSection />
    <LibraryShowcase />
  </div>
</template>

<script setup>
import HeroSection from '~/components/landing/HeroSection.vue'
import LibraryShowcase from '~/components/landing/LibraryShowcase.vue'

// Use landing layout
definePageMeta({
  layout: 'landing'
})

// SEO Meta
useHead({
  title: 'Pybadu – Dedicated Python Library Playground',
  meta: [
    {
      name: 'description',
      content: 'Pybadu is a specialized Python library playground powered by Pyodide WebAssembly. Experience dedicated compilers for NumPy, Pandas, Matplotlib, SciPy, Scikit-learn, and more directly in your browser. Part of the BudiBadu ecosystem.'
    },
    {
      name: 'keywords', 
      content: 'python, pyodide, numpy, pandas, matplotlib, scipy, scikit-learn, online python, browser python, budibadu, pybadu'
    },
    {
      property: 'og:title',
      content: 'Pybadu – Dedicated Python Library Playground'
    },
    {
      property: 'og:type',
      content: 'website'
    },
    {
      property: 'og:description',
      content: 'Specialized Python library playground with dedicated compilers for each library. Run NumPy, Pandas, Matplotlib and more in your browser.'
    },
    {
      property: 'og:url',
      content: 'https://pybadu.com'
    }
  ]
})
</script>