<template>
  <div class="font-sans">
    <AppHeader />
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