import { defineStore } from 'pinia'

function initializeGtag() {
  const { gtag, initialize } = useGtag()

  try {
    initialize()
    return gtag
  } catch (e) {
    console.error('[gtag] error', e)
    return null
  }
}

export const useAnalytics = defineStore('analytics', {
  state: () => ({
    gtag: initializeGtag(),
  }),

  getters: {
    // get
  },

  actions: {
    GATrackEvent(category, action, label = '') {
      try {
        if (typeof window !== 'undefined' && this.gtag) {
          if (process.env.NODE_ENV === 'production') {
            return console.info(`[gtag] event - Category: ${category}, Action: ${action}, Label: ${label || window.location.pathname}`);
          }

          this.gtag('event', action, {
            event_category: category,
            event_label: label || window.location.pathname
          })
        }
      } catch (e) {
        console.error('[gtag] event error', e)
      }
    },
  
    trackAccordion(accordion) {
      this.GATrackEvent('[Data] Expand Accordion', accordion)
    },
  
    transitionOutboundLink(event) {
      if (confirm("You are leaving the College Scorecard. \n\nThe U.S. Department of Education does not necessarily endorse the views expressed or the data and facts presented on this external site. \n\nLinks are provided by the institutions and are only updated about once a year. As such, over the course of the year, some links may break or websites may be taken offline.")) {
        let href = '(unknown)'
        if (event.target.className.match(/v-btn__content/)) {
          href = event.target.parentNode.href
        } else {
          href = event.target.href
        }

        this.GATrackEvent('External Link', href)
      } else {
        event.preventDefault()
      }
    },
  
    trackDownload(file) {
      this.GATrackEvent('Downloads', file)
    },
  
    trackShare(network) {
      this.GATrackEvent('Social Share', network)
    },
  
    trackOutcome(combo) {
      this.GATrackEvent('Outcome', 'Toggle', combo)
    },
  
    trackCompareList(list) {
      this.GATrackEvent('Comparison', 'School IDs', list)
    },
  
    trackNavigation(path) {
      this.GATrackEvent('Internal Link', path)
    },
  
    trackMultipleStates(states) {
      this.GATrackEvent('Multiple States', states)
    },
  },
})