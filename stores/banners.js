// stores/banner.js
export const useBannerStore = defineStore('banner', {
  state: () => ({
    isWebinarBannerVisible: true
  }),
  
  actions: {
    initializeBannerState() {
      // Check localStorage on initialization
      if (import.meta.client) {
        const stored = localStorage.getItem('webinarBannerHidden')
        if (stored === 'true') {
          this.isWebinarBannerVisible = false
        }
      }
    },
    
    hideBanner() {
      this.isWebinarBannerVisible = false
      // Persist to localStorage
      if (import.meta.client) {
        localStorage.setItem('webinarBannerHidden', 'true')
      }
    },
    
    showBanner() {
      this.isWebinarBannerVisible = true
      // Remove from localStorage
      if (import.meta.client) {
        localStorage.removeItem('webinarBannerHidden')
      }
    }
  }
})