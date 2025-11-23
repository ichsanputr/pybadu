<template>
  <div class="relative w-full max-w-4xl mx-auto">
    <div class="flex flex-col md:flex-row items-center gap-8 md:gap-12">
      <!-- Image Section -->
      <div class="relative w-48 h-48 md:w-64 md:h-64 flex-shrink-0">
        <TransitionGroup name="fade-rotate">
          <div
            v-for="(testimonial, index) in testimonials"
            v-show="index === activeIndex"
            :key="testimonial.name"
            class="absolute inset-0"
          >
            <img
              :src="testimonial.img"
              :alt="testimonial.name"
              class="w-full h-full rounded-2xl object-cover shadow-lg"
            />
          </div>
        </TransitionGroup>
      </div>

      <!-- Content Section -->
      <div class="flex-1 text-center md:text-left w-full">
        <div class="relative min-h-[200px] flex flex-col justify-center w-full">
          <TransitionGroup name="slide-fade">
            <div
              v-for="(testimonial, index) in testimonials"
              v-show="index === activeIndex"
              :key="testimonial.name"
              class="absolute inset-0 flex flex-col justify-center"
            >
              <p class="text-base md:text-xl lg:text-2xl font-medium text-gray-900 dark:text-white mb-6 leading-relaxed">
                "{{ testimonial.quote }}"
              </p>
              <div>
                <p class="font-bold text-base md:text-lg text-gray-900 dark:text-white">
                  {{ testimonial.name }}
                </p>
                <p class="text-sm md:text-base text-gray-600 dark:text-gray-400">
                  {{ testimonial.role }}
                </p>
              </div>
            </div>
          </TransitionGroup>
        </div>

        <!-- Navigation -->
        <div class="flex items-center justify-center md:justify-start gap-4 mt-8">
          <button
            @click="prev"
            class="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Previous testimonial"
          >
            <Icon icon="ph:caret-left" class="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>

          <div class="flex gap-2">
            <button
              v-for="(_, index) in testimonials"
              :key="index"
              @click="goTo(index)"
              :class="[
                'w-2 h-2 rounded-full transition-all',
                index === activeIndex
                  ? 'w-8 bg-python-blue-600'
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
              ]"
              :aria-label="`Go to testimonial ${index + 1}`"
            />
          </div>

          <button
            @click="next"
            class="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Next testimonial"
          >
            <Icon icon="ph:caret-right" class="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'

defineOptions({
  name: 'TestimonialSlider'
})

const props = defineProps({
  testimonials: {
    type: Array,
    required: true,
    default: () => []
  },
  autoRotate: {
    type: Boolean,
    default: true
  },
  duration: {
    type: Number,
    default: 5
  }
})

const activeIndex = ref(0)
let interval = null

function next() {
  activeIndex.value = (activeIndex.value + 1) % props.testimonials.length
}

function prev() {
  activeIndex.value = activeIndex.value === 0 
    ? props.testimonials.length - 1 
    : activeIndex.value - 1
}

function goTo(index) {
  activeIndex.value = index
}

onMounted(() => {
  if (props.autoRotate && props.testimonials.length > 1) {
    interval = setInterval(() => {
      next()
    }, props.duration * 1000)
  }
})

onUnmounted(() => {
  if (interval) {
    clearInterval(interval)
  }
})
</script>

<style scoped>
.fade-rotate-enter-active,
.fade-rotate-leave-active {
  transition: all 0.6s ease;
}

.fade-rotate-enter-from {
  opacity: 0;
  transform: rotate(-5deg) scale(0.9);
}

.fade-rotate-leave-to {
  opacity: 0;
  transform: rotate(5deg) scale(0.9);
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>

