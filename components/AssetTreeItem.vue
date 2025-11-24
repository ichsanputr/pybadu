<template>
  <div class="tree-item">
    <div :class="[
      'flex items-center space-x-2 py-1 px-2 rounded cursor-pointer group',
      'hover:bg-gray-100 dark:hover:bg-gray-700',
      isSelected 
        ? (theme === 'dark' ? 'bg-blue-900/30 border border-blue-600' : 'bg-blue-100 border border-blue-500')
        : ''
    ]" :style="{ paddingLeft: `${level * 16 + 8}px` }">
      <!-- File/Folder icon -->
      <Icon :icon="getItemIcon(item)"
            :class="['w-4 h-4 flex-shrink-0', 
              item.isDir 
                ? (theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600')
                : (theme === 'dark' ? 'text-gray-300' : 'text-gray-700')
            ]" />

      <!-- Name -->
      <span :class="['text-sm flex-1 truncate', theme === 'dark' ? 'text-gray-200' : 'text-gray-800']"
            @click="selectItem">
        {{ item.name }}
      </span>

      <!-- Size for files -->
      <span v-if="!item.isDir" :class="['text-xs', theme === 'dark' ? 'text-gray-400' : 'text-gray-600']">
        {{ formatBytes(item.size) }}
      </span>

      <!-- Delete button (always visible, beside size) -->
      <button @click.stop="$emit('delete', item.fullPath)"
              class="p-1 rounded transition-all
                     hover:bg-red-100 dark:hover:bg-red-500/20
                     text-red-600 dark:text-red-300"
              :title="'Delete ' + item.name">
        <Icon icon="ph:trash" class="w-3 h-3" />
      </button>

      <!-- Expand/collapse icon for directories (moved to the right) -->
      <button v-if="item.isDir" @click.stop="toggleExpanded(fullPath)"
              class="flex-shrink-0 w-4 h-4 flex items-center justify-center ml-1">
        <Icon :icon="isExpanded ? 'ph:caret-down' : 'ph:caret-right'"
              :class="['w-3 h-3', theme === 'dark' ? 'text-gray-400' : 'text-gray-600']" />
      </button>
    </div>

    <!-- Children for directories -->
    <div v-if="item.isDir && isExpanded" class="space-y-1">
      <AssetTreeItem
        v-for="child in children"
        :key="child.name"
        :item="child"
        :path="fullPath + '/' + child.name"
        :level="level + 1"
        :theme="theme"
        :selected-asset="selectedAsset"
        :expanded-paths="expandedPaths"
        :assets="assets"
        @toggle="$emit('toggle', $event)"
        @delete="$emit('delete', $event)"
        @select="$emit('select', $event)" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  level: {
    type: Number,
    default: 0
  },
  theme: {
    type: String,
    default: 'dark'
  },
  selectedAsset: {
    type: String,
    default: ''
  },
  expandedPaths: {
    type: Set,
    default: () => new Set()
  },
  assets: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['toggle', 'delete', 'select'])

const fullPath = computed(() => props.path)

const isExpanded = computed(() => props.expandedPaths.has(fullPath.value))

const isSelected = computed(() => props.selectedAsset === props.item.fullPath)

function toggleExpanded(path) {
  emit('toggle', path)
}

function selectItem() {
  // Emit select event
  emit('select', props.item.fullPath)
  
  // If it's a directory, also expand it
  if (props.item.isDir) {
    emit('toggle', fullPath.value)
  }
}

// Get direct children of this directory
const children = computed(() => {
  if (!props.item.isDir || !props.assets || !Array.isArray(props.assets)) return []

  const parentPath = props.item.fullPath
  
  // Find all assets that are direct children of this directory
  return props.assets
    .filter(asset => {
      // Asset should start with parent path + '/'
      const expectedPrefix = parentPath ? `${parentPath}/` : ''
      if (!asset.name.startsWith(expectedPrefix)) return false
      
      // Remove the prefix to get relative path
      const relativePath = asset.name.substring(expectedPrefix.length)
      
      // Should not contain further slashes (direct children only)
      return !relativePath.includes('/')
    })
    .map(asset => {
      const expectedPrefix = parentPath ? `${parentPath}/` : ''
      const relativePath = asset.name.substring(expectedPrefix.length)
      
      return {
        name: relativePath,
        isDir: asset.isDir,
        size: asset.size,
        fullPath: asset.name
      }
    })
})

function getItemIcon(item) {
  if (item.isDir) return 'ph:folder'

  const ext = item.name.toLowerCase().split('.').pop()
  const iconMap = {
    'py': 'simple-icons:python',
    'js': 'simple-icons:javascript',
    'ts': 'simple-icons:typescript',
    'html': 'simple-icons:html5',
    'css': 'simple-icons:css3',
    'json': 'simple-icons:json',
    'xml': 'ph:file-code',
    'txt': 'ph:file-text',
    'csv': 'ph:table',
    'png': 'ph:image',
    'jpg': 'ph:image',
    'jpeg': 'ph:image',
    'gif': 'ph:image',
    'svg': 'ph:image',
    'pdf': 'ph:file-pdf',
    'zip': 'ph:file-zip',
    'tar': 'ph:file-zip',
    'gz': 'ph:file-zip'
  }

  return iconMap[ext] || 'ph:file'
}

function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return ''
  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let unitIndex = 0
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  return `${size.toFixed(size < 10 && unitIndex > 0 ? 1 : 0)} ${units[unitIndex]}`
}
</script>

<style scoped>
.tree-item {
  user-select: none;
}
</style>