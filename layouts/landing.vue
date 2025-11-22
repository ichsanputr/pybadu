<template>
  <div class="font-sans">
    <AppHeader :sticky="false" :transparent="true" />
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