<template>
  <!-- Square format - no format, layout, or responsive attributes -->
  <ins
    v-if="isBudibadu && kind === 'square'"
    ref="adRef"
    class="adsbygoogle"
    :style="computedStyle"
    :data-ad-client="client"
    :data-ad-slot="adSlot"
  ></ins>
  <!-- Auto/Default format - with all attributes -->
  <ins
    v-else-if="isBudibadu"
    ref="adRef"
    class="adsbygoogle"
    :style="style"
    :data-ad-client="client"
    :data-ad-slot="adSlot"
    :data-ad-format="format"
    :data-ad-layout="adLayout"
    :data-full-width-responsive="responsive"
  ></ins>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'

defineOptions({ name: 'AdsenseBlock' })

const props = defineProps({
  client: { type: String, required: true },
  adSlot: { type: String, required: true },
  format: { type: String, default: 'auto' },
  adLayout: { type: String, default: null },
  responsive: { type: String, default: 'true' },
  style: { type: [String, Object], default: null },
  kind: { type: String, default: 'auto' } // 'auto' or 'square'
})

const adRef = ref(null)
let pushed = false

// ✅ Only render if domain host is budibadu.com
const isBudibadu = computed(() => {
  if (typeof window === 'undefined') return false
  return window.location.hostname === 'budibadu.com'
})

// Computed style for square format
const computedStyle = computed(() => {
  if (props.kind === 'square') {
    return props.style || 'display:inline-block;width:300px;height:300px'
  }
  return props.style
})

function waitForAdsense() {
  return new Promise(resolve => {
    const check = () => {
      if (window.adsbygoogle && window.adsbygoogle.push) resolve()
      else setTimeout(check, 100)
    }
    check()
  })
}

async function waitForWidth(el, maxTries = 50) {
  let tries = 0
  while (tries < maxTries) {
    const rect = el.getBoundingClientRect()
    if (rect.width > 0) return rect.width
    await new Promise(r => setTimeout(r, 100))
    tries++
  }
  return 0
}

onMounted(async () => {
  if (!isBudibadu.value || typeof window === 'undefined' || pushed) return
  await waitForAdsense()
  await nextTick()

  const el = adRef.value
  if (!el) return

  const width = await waitForWidth(el)
  console.log('📏 Final AdSense width before push:', width)

  if (width === 0) {
    console.warn('⚠️ Skipping AdSense push — element width is still 0')
    return
  }

  try {
    (window.adsbygoogle = window.adsbygoogle || []).push({})
    pushed = true
    console.log('✅ AdSense ad rendered successfully')
  } catch (err) {
    console.warn('AdSense push error:', err)
  }
})
</script>

<style scoped>
</style>

