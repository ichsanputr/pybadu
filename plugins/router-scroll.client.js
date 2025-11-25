// Router scroll behavior plugin for smooth scrolling
export default defineNuxtPlugin((nuxtApp) => {
  // Watch for route changes and smooth scroll to top
  nuxtApp.hook('app:page:transition:finish', () => {
    // Smooth scroll to top after page transition completes
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  })
})

