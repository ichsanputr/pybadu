<template>
  <!-- Backdrop -->
  <Teleport to="body">
    <div 
      v-show="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
      @click="handleBackdropClick"
    >
      <!-- Dialog Container -->
      <div 
        ref="dialogRef"
        @click.stop
        :class="[
          'relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border transition-all duration-300 transform',
          'animate-in fade-in-0 zoom-in-95 duration-300',
          isDark ? 'border-gray-800' : 'border-gray-200',
          sizeClasses
        ]"
        style="animation-fill-mode: both;"
      >
        <!-- Header -->
        <div v-if="title || $slots.header" :class="[
          'flex items-center justify-between p-6 border-b',
          isDark ? 'border-gray-800' : 'border-gray-200'
        ]">
          <div class="flex items-center space-x-3">
            <div v-if="icon" :class="[
              'w-10 h-10 rounded-full flex items-center justify-center',
              iconVariant === 'success' ? 'bg-green-100 dark:bg-green-900/30' :
              iconVariant === 'error' ? 'bg-red-100 dark:bg-red-900/30' :
              iconVariant === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
              'bg-blue-100 dark:bg-blue-900/30'
            ]">
              <Icon :icon="icon" :class="[
                'w-5 h-5',
                iconVariant === 'success' ? 'text-green-600 dark:text-green-400' :
                iconVariant === 'error' ? 'text-red-600 dark:text-red-400' :
                iconVariant === 'warning' ? 'text-yellow-600 dark:text-yellow-400' :
                'text-blue-600 dark:text-blue-400'
              ]" />
            </div>
            <div>
              <h3 v-if="title" :class="[
                'text-lg font-semibold',
                isDark ? 'text-white' : 'text-gray-900'
              ]">
                {{ title }}
              </h3>
              <p v-if="subtitle" :class="[
                'text-sm',
                isDark ? 'text-gray-400' : 'text-gray-600'
              ]">
                {{ subtitle }}
              </p>
            </div>
          </div>
          
          <button
            v-if="closable"
            @click="$emit('update:modelValue', false)"
            :class="[
              'p-2 rounded-lg transition-colors',
              isDark 
                ? 'hover:bg-gray-800 text-gray-400 hover:text-gray-200' 
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            ]"
          >
            <Icon icon="ph:x" class="w-5 h-5" />
          </button>
        </div>

        <!-- Content -->
        <div :class="[
          'p-6',
          !title && !$slots.header ? 'pt-6' : '',
          !$slots.footer && !showDefaultActions ? 'pb-6' : ''
        ]">
          <slot />
        </div>

        <!-- Footer -->
        <div v-if="$slots.footer || showDefaultActions" :class="[
          'flex justify-end space-x-3 p-6 border-t',
          isDark ? 'border-gray-800' : 'border-gray-200'
        ]">
          <slot name="footer">
            <template v-if="showDefaultActions">
              <button
                v-if="showCancel"
                @click="$emit('cancel')"
                :class="[
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  isDark
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                ]"
              >
                {{ cancelText }}
              </button>
              <button
                @click="$emit('confirm')"
                :class="[
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  variant === 'destructive' 
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                ]"
              >
                {{ confirmText }}
              </button>
            </template>
          </slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, watch, ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  iconVariant: {
    type: String,
    default: 'info', // 'info', 'success', 'error', 'warning'
    validator: (value) => ['info', 'success', 'error', 'warning'].includes(value)
  },
  size: {
    type: String,
    default: 'md', // 'sm', 'md', 'lg', 'xl'
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  },
  variant: {
    type: String,
    default: 'default', // 'default', 'destructive'
    validator: (value) => ['default', 'destructive'].includes(value)
  },
  closable: {
    type: Boolean,
    default: true
  },
  closeOnBackdrop: {
    type: Boolean,
    default: true
  },
  showDefaultActions: {
    type: Boolean,
    default: false
  },
  showCancel: {
    type: Boolean,
    default: true
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  theme: {
    type: String,
    default: 'dark'
  }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

// Use theme from prop passed by parent (which gets it from composable theme toggle)
const isDark = computed(() => props.theme === 'dark')

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'max-w-sm w-full mx-4'
    case 'md':
      return 'max-w-md w-full mx-4'
    case 'lg':
      return 'max-w-lg w-full mx-4'
    case 'xl':
      return 'max-w-xl w-full mx-4'
    default:
      return 'max-w-md w-full mx-4'
  }
})

function handleBackdropClick() {
  if (props.closeOnBackdrop) {
    emit('update:modelValue', false)
  }
}

// Handle ESC key
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'
  } else {
    document.removeEventListener('keydown', handleEscape)
    document.body.style.overflow = ''
  }
})

function handleEscape(e) {
  if (e.key === 'Escape' && props.closable) {
    emit('update:modelValue', false)
  }
}
</script>

<style>
@keyframes fade-in-0 {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes zoom-in-95 {
  from {
    transform: scale(0.95);
  }
  to {
    transform: scale(1);
  }
}

.animate-in {
  animation-duration: 150ms;
  animation-timing-function: ease-out;
  animation-fill-mode: both;
}

.fade-in-0 {
  animation-name: fade-in-0;
}

.zoom-in-95 {
  animation-name: zoom-in-95;
}

.duration-300 {
  animation-duration: 300ms;
}
</style>