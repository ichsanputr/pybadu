<template>
  <div class="sm:min-h-screen">
    <slot />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useHead } from '#app'

defineOptions({
  name: 'LibraryLayout'
})

// Add inline script to apply dark theme immediately (before any rendering)
useHead({
  script: [
    {
      innerHTML: `
        (function() {
          if (typeof document !== 'undefined') {
            document.documentElement.classList.add('dark');
          }
        })();
      `,
      type: 'text/javascript'
    }
  ]
})

// Also ensure dark theme is applied on mount
onMounted(() => {
  if (process.client) {
    document.documentElement.classList.add('dark')
  }
})
</script>

