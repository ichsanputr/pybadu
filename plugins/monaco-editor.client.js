import { install as VueMonacoEditorPlugin } from '@guolao/vue-monaco-editor'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueMonacoEditorPlugin, {
    paths: {
      vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs'
    },
    globalOptions: {
      fontSize: 16,
      fontFamily: 'Consolas, "Courier New", monospace',
      lineHeight: 24
    }
  })
})