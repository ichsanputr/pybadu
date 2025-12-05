<template>
    <Transition name="fade">
        <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div
                class="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-md p-6 border border-gray-200 dark:border-gray-700 pointer-events-auto">
                <h3 class="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">{{ title }}</h3>
                <p v-if="message" class="text-sm text-gray-600 dark:text-gray-400 mb-4">{{ message }}</p>

                <input ref="inputRef" v-model="inputValue" @keydown.enter="submit" @keydown.esc="cancel" type="text"
                    class="w-full px-3 py-2 border rounded-md mb-4 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                    :placeholder="placeholder" />

                <div class="flex justify-end space-x-3">
                    <button @click="cancel"
                        class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                        Cancel
                    </button>
                    <button @click="submit"
                        class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md">
                        Save
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
    isOpen: Boolean,
    title: { type: String, default: 'Input Required' },
    message: { type: String, default: '' },
    placeholder: { type: String, default: 'Type here...' },
    defaultValue: { type: String, default: '' }
})

const emit = defineEmits(['submit', 'cancel', 'update:modelValue'])

const inputValue = ref('')
const inputRef = ref(null)

watch(() => props.isOpen, (newVal) => {
    if (newVal) {
        inputValue.value = props.defaultValue || ''
        nextTick(() => {
            inputRef.value?.focus()
            if (inputValue.value) {
                inputRef.value?.select()
            }
        })
    }
})

function submit() {
    emit('submit', inputValue.value)
}

function cancel() {
    emit('cancel')
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
