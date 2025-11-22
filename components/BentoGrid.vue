<template>
  <div :class="cn('grid w-full grid-cols-3 gap-4', className)">
    <slot />
  </div>
</template>

<script setup>
import { cn } from '@/lib/utils'

defineOptions({
  name: 'BentoGrid'
})

defineProps({
  className: {
    type: String,
    default: ''
  }
})
</script>

