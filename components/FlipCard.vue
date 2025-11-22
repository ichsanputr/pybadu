<template>
  <div
    :class="cn('group h-60 w-full [perspective:1000px]', props.class)"
    @mouseenter="isFlipped = true"
    @mouseleave="isFlipped = false"
  >
    <div
      :class="cn(
        'relative h-full w-full rounded-xl transition-all duration-500 [transform-style:preserve-3d]',
        isFlipped && rotate === 'y' && '[transform:rotateY(180deg)]',
        isFlipped && rotate === 'x' && '[transform:rotateX(180deg)]'
      )"
    >
      <!-- Front -->
      <div class="absolute inset-0 h-full w-full rounded-xl [backface-visibility:hidden]">
        <slot />
      </div>

      <!-- Back -->
      <div
        :class="cn(
          'absolute inset-0 h-full w-full rounded-xl [backface-visibility:hidden]',
          rotate === 'y' && '[transform:rotateY(180deg)]',
          rotate === 'x' && '[transform:rotateX(180deg)]'
        )"
      >
        <slot name="back" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { cn } from '@/lib/utils'

defineOptions({
  name: 'FlipCard'
})

const props = defineProps({
  class: {
    type: String,
    default: ''
  },
  rotate: {
    type: String,
    default: 'y',
    validator: (value) => ['x', 'y'].includes(value)
  }
})

const isFlipped = ref(false)
</script>

