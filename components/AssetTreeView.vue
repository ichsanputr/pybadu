<template>
  <div class="asset-tree-view">
    <div class="space-y-1">
      <!-- Root items directly -->
      <AssetTreeItem
        v-for="item in rootItems"
        :key="item.name"
        :item="item"
        :path="'/' + item.name"
        :level="0"
        :theme="theme"
        :selected-asset="selectedAsset"
        :expanded-paths="expandedPaths"
        :assets="assets"
        @toggle="toggleExpanded"
        @delete="$emit('delete', $event)"
        @select="$emit('select', $event)" />
    </div>

    <!-- Empty state -->
    <div v-if="!assets.length" class="text-center py-4 text-sm text-gray-500">
      <Icon icon="ph:folder" :class="['w-8 h-8 mx-auto mb-2 opacity-50', theme === 'dark' ? 'text-gray-400' : 'text-gray-600']" />
      <p :class="theme === 'dark' ? 'text-gray-400' : 'text-gray-600'">No assets uploaded yet</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import AssetTreeItem from './AssetTreeItem.vue'

const props = defineProps({
  assets: {
    type: Array,
    default: () => []
  },
  theme: {
    type: String,
    default: 'dark'
  },
  selectedAsset: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['delete', 'select'])

const expandedPaths = ref(new Set()) // Start with no paths expanded

function toggleExpanded(path) {
  if (expandedPaths.value.has(path)) {
    expandedPaths.value.delete(path)
  } else {
    expandedPaths.value.add(path)
  }
}

// Group items by their parent path
const groupedItems = computed(() => {
  const groups = {}
  if (!props.assets || !Array.isArray(props.assets)) return groups
  
  props.assets.forEach(item => {
    const parts = item.name.split('/')
    let currentPath = ''

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]
      const parentPath = currentPath
      currentPath = currentPath ? `${currentPath}/${part}` : part

      if (!groups[parentPath]) {
        groups[parentPath] = []
      }

      // Only add if not already present
      const existing = groups[parentPath].find(x => x.name === part)
      if (!existing) {
        groups[parentPath].push({
          name: part,
          isDir: i < parts.length - 1 || item.isDir,
          size: item.size,
          fullPath: item.name
        })
      }
    }
  })
  return groups
})

const rootItems = computed(() => {
  return groupedItems.value[''] || []
})
</script>

<style scoped>
.asset-tree-view {
  font-size: 14px;
}

.tree-item {
  user-select: none;
}
</style>