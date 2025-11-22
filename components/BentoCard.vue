<template>
  <div
    :class="cn(
      'group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-xl',
      'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800',
      'transform-gpu transition-all duration-300 ease-out hover:scale-[1.02]',
      className
    )"
  >
    <div>
      <div class="p-6">
        <div v-if="icon" class="mb-4 flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br" :class="iconBg">
          <Icon :icon="icon" class="w-6 h-6 text-white" />
        </div>
        <h3 class="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
          {{ name }}
        </h3>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          {{ description }}
        </p>
      </div>
    </div>
    <div v-if="cta" class="p-6 pt-0">
      <NuxtLink 
        :to="href" 
        class="inline-flex items-center text-sm font-medium text-python-blue-600 dark:text-python-blue-400 hover:text-python-blue-700 dark:hover:text-python-blue-300 transition-colors group"
      >
        {{ cta }}
        <Icon icon="ph:arrow-right" class="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </NuxtLink>
    </div>
    <div 
      v-if="background"
      class="pointer-events-none absolute inset-0 transform-gpu transition-opacity duration-300 group-hover:opacity-100 opacity-0"
    >
      <div :class="cn('absolute inset-0 bg-gradient-to-br', background)" />
    </div>
  </div>
</template>

<script setup>
import { cn } from '@/lib/utils'
import { Icon } from '@iconify/vue'

defineOptions({
  name: 'BentoCard'
})

defineProps({
  name: {
    type: String,
    required: true
  },
  className: {
    type: String,
    default: ''
  },
  background: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  iconBg: {
    type: String,
    default: 'from-blue-500 to-purple-600'
  },
  description: {
    type: String,
    default: ''
  },
  href: {
    type: String,
    default: '#'
  },
  cta: {
    type: String,
    default: ''
  }
})
</script>

