<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-[100] space-y-2">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'flex items-center space-x-3 px-4 py-3 rounded-lg shadow-lg border backdrop-blur-sm',
            'min-w-[300px] max-w-md',
            toast.type === 'success' 
              ? 'bg-green-50/90 dark:bg-green-900/30 border-green-200 dark:border-green-800'
              : toast.type === 'error'
                ? 'bg-red-50/90 dark:bg-red-900/30 border-red-200 dark:border-red-800'
                : toast.type === 'warning'
                  ? 'bg-yellow-50/90 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800'
                  : 'bg-blue-50/90 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800'
          ]"
        >
          <Icon 
            :icon="getIcon(toast.type)"
            :class="[
              'w-5 h-5 flex-shrink-0',
              toast.type === 'success' ? 'text-green-600 dark:text-green-400' :
              toast.type === 'error' ? 'text-red-600 dark:text-red-400' :
              toast.type === 'warning' ? 'text-yellow-600 dark:text-yellow-400' :
              'text-blue-600 dark:text-blue-400'
            ]"
          />
          <p :class="[
            'flex-1 text-sm font-medium',
            toast.type === 'success' ? 'text-green-800 dark:text-green-200' :
            toast.type === 'error' ? 'text-red-800 dark:text-red-200' :
            toast.type === 'warning' ? 'text-yellow-800 dark:text-yellow-200' :
            'text-blue-800 dark:text-blue-200'
          ]">
            {{ toast.message }}
          </p>
          <button
            @click="removeToast(toast.id)"
            :class="[
              'p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors',
              toast.type === 'success' ? 'text-green-600 dark:text-green-400' :
              toast.type === 'error' ? 'text-red-600 dark:text-red-400' :
              toast.type === 'warning' ? 'text-yellow-600 dark:text-yellow-400' :
              'text-blue-600 dark:text-blue-400'
            ]"
          >
            <Icon icon="ph:x" class="w-4 h-4" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { Icon } from '@iconify/vue'

defineOptions({
  name: 'Toast'
})

const props = defineProps({
  toasts: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['remove'])

function getIcon(type) {
  switch (type) {
    case 'success': return 'ph:check-circle'
    case 'error': return 'ph:x-circle'
    case 'warning': return 'ph:warning-circle'
    default: return 'ph:info'
  }
}

function removeToast(id) {
  emit('remove', id)
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100px) scale(0.8);
}
</style>

