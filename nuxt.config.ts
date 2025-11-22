// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  devServer: {
    port: 3000,
  },
  modules: [
    '@vueuse/nuxt'
  ],
  css: [
    "~/assets/css/main.css",
  ],
  runtimeConfig: {
    public: {
      siteUrl: 'http://localhost:3000',
    }
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'en'
      },
      title: 'Pybadu - Python Fiddle',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: 'Python Fiddle - Run Python code in your browser with Pyodide' },
        { 'http-equiv': 'Cross-Origin-Opener-Policy', content: 'same-origin' },
        { 'http-equiv': 'Cross-Origin-Embedder-Policy', content: 'require-corp' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ],
      script: [
        {
          src: 'https://cdn.jsdelivr.net/pyodide/v0.29.0/full/pyodide.js',
          async: true,
          crossorigin: 'anonymous'
        }
      ]
    }
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  compatibilityDate: '2024-10-22'
});