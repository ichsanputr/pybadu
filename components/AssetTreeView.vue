<template>
  <div class="asset-tree-view">
    <div class="space-y-1">
      <!-- Root items directly -->
      <AssetTreeItem
        v-for="item in rootItems"
        :key="item.name"
        :item="item"
        :path="item.name"
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
    <div v-if="!assets.length" :class="[
      'text-center p-4 my-5 rounded-lg',
      theme === 'dark'
        ? 'bg-gray-800/20'
        : 'bg-gray-50/50'
    ]">
      <div class="flex flex-col items-center justify-center space-y-2">
        <Icon icon="ph:folder" :class="['w-8 h-8', theme === 'dark' ? 'text-gray-500' : 'text-gray-400']" />
        <div :class="['text-sm font-medium', theme === 'dark' ? 'text-gray-400' : 'text-gray-600']">No assets uploaded yet</div>
        <div :class="['text-xs', theme === 'dark' ? 'text-gray-500' : 'text-gray-500']">Upload files to get started</div>
      </div>
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

// Group items by their parent path - simplified approach
const groupedItems = computed(() => {
  const groups = {}
  if (!props.assets || !Array.isArray(props.assets)) return groups
  
  // Initialize root group
  groups[''] = []
  
  props.assets.forEach(item => {
    // For each asset, add it to its parent group
    const parts = item.name.split('/')
    const parentPath = parts.length > 1 ? parts.slice(0, -1).join('/') : ''
    const itemName = parts[parts.length - 1]
    
    if (!groups[parentPath]) {
      groups[parentPath] = []
    }
    
    // Only add if not already present
    const existing = groups[parentPath].find(x => x.name === itemName)
    if (!existing) {
      groups[parentPath].push({
        name: itemName,
        isDir: item.isDir,
        size: item.size,
        fullPath: item.name
      })
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