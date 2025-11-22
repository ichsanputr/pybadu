<template>
  <div class="font-sans">
    <AppHeader :sticky="false" />
    <main>
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
defineOptions({
  name: 'LandingLayout'
})
</script>