<template>
    <div
        :class="['flex items-center px-2 py-1 border-b text-sm relative', theme === 'light' ? 'bg-gray-50 border-gray-300' : 'bg-gray-800 border-gray-700']">
        <div v-for="menu in menuItems" :key="menu.name" class="relative">
            <button
                :class="['px-3 py-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded', theme === 'light' ? 'text-gray-800' : 'text-gray-200']"
                @click.stop="toggleMenu(menu.name)">
                {{ menu.name }}
            </button>

            <!-- Dropdown Menu -->
            <div v-if="activeMenu === menu.name && menu.items"
                :class="['absolute top-full left-0 mt-1 w-56 rounded shadow-lg border z-50', theme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-800 border-gray-700']"
                @click.stop>
                <div v-for="item in menu.items" :key="item.name" :class="[
                    item.name === '---' ? 'border-t my-1' : 'px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700',
                    theme === 'light' ? item.name === '---' ? 'border-gray-200' : 'text-gray-800' : item.name === '---' ? 'border-gray-700' : 'text-gray-200'
                ]" @click="item.name !== '---' && handleMenuItem(item.action)">
                    <div v-if="item.name !== '---'" class="flex items-center justify-between">
                        <span>{{ item.name }}</span>
                        <Icon v-if="item.checked" icon="ph:check" class="w-4 h-4" />
                        <span v-if="item.shortcut" class="text-xs opacity-60 ml-4">{{ item.shortcut }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'

const props = defineProps({
    theme: { type: String, required: true },
    activeMenu: { type: String, default: null },
    menuItems: { type: Array, required: true }
})

const emit = defineEmits(['toggle-menu', 'menu-action'])

function toggleMenu(menuName) {
    emit('toggle-menu', menuName)
}

function handleMenuItem(action) {
    emit('menu-action', action)
}
</script>
