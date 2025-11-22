<template>
  <span
    v-for="meteor in meteors"
    :key="meteor.id"
    :class="cn('pointer-events-none absolute size-0.5 rotate-[215deg] animate-meteor rounded-full bg-slate-500 shadow-[0_0_0_1px_#ffffff10]', className)"
    :style="{
      top: `${meteor.top}px`,
      left: `${meteor.left}%`,
      animationDelay: `${meteor.delay}s`,
      animationDuration: `${meteor.duration}s`,
    }"
  >
    <div
      class="pointer-events-none absolute top-1/2 -z-10 h-px w-[50px] -translate-y-1/2 bg-gradient-to-r from-slate-500 to-transparent"
    />
  </span>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { cn } from '@/lib/utils'

defineOptions({
  name: 'Meteor'
})

const props = defineProps({
  number: {
    type: Number,
    default: 20
  },
  className: {
    type: String,
    default: ''
  }
})

const meteors = ref([])

onMounted(() => {
  meteors.value = Array.from({ length: props.number }, (_, i) => ({
    id: i,
    top: Math.floor(Math.random() * 400) - 400,
    left: Math.floor(Math.random() * 100),
    delay: Math.random() * 1 + 0.2,
    duration: Math.floor(Math.random() * 8 + 2)
  }))
})
</script>

<style>
@keyframes meteor {
  0% {
    transform: rotate(215deg) translateX(0);
    opacity: 1;
  }
  70% {
    opacity: 1;
  }
  100% {
    transform: rotate(215deg) translateX(-500px);
    opacity: 0;
  }
}

.animate-meteor {
  animation: meteor linear infinite;
}
</style>

