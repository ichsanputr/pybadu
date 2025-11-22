<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <main class="flex-1">
      <slot />
    </main>
  </div>
</template>

<script setup>
defineOptions({
  name: 'DefaultLayout'
})
</script>