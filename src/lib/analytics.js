const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID

// Injects gtag.js once, only if a Measurement ID is configured — so builds
// without one (e.g. local dev) never load or send anything to Google.
export const initAnalytics = () => {
  if (!MEASUREMENT_ID || typeof window === 'undefined') return

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  function gtag() {
    window.dataLayer.push(arguments)
  }
  window.gtag = gtag

  gtag('js', new Date())
  // Sends its own initial page_view — trackPageView below handles every
  // route change after that, since GA doesn't see React Router navigation.
  gtag('config', MEASUREMENT_ID)
}

export const trackPageView = (path) => {
  if (!MEASUREMENT_ID || typeof window.gtag !== 'function') return
  window.gtag('event', 'page_view', { page_path: path })
}
