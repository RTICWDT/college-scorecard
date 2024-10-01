export function useAnalytics() {
  const router = useRouter()

  const GATrackEvent = (category, action, label = '') => {
    try {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', action, { 'event_category': category, 'event_label': label || window.location.pathname })
      }
    } catch (e) {
      console.error('[gtag] event error', e)
    }
  }

  const trackAccordion = (accordion) => {
    GATrackEvent('[Data] Expand Accordion', accordion)
  }

  const trackOutboundLink = (evt) => {
    let href = '(unknown)'
    if (evt.target.className.match(/v-btn__content/)) {
      href = evt.target.parentNode.href
    } else {
      href = evt.target.href
    }
    GATrackEvent('External Link', href)
  }

  const transitionOutboundLink = (event) => {
    if (confirm("You are leaving the College Scorecard. \n\nThe U.S. Department of Education does not necessarily endorse the views expressed or the data and facts presented on this external site. \n\nLinks are provided by the institutions and are only updated about once a year. As such, over the course of the year, some links may break or websites may be taken offline.")) {
      trackOutboundLink(event)
    } else {
      event.preventDefault()
    }
  }

  const trackDownload = (file) => {
    GATrackEvent('Downloads', file)
  }

  const trackShare = (network) => {
    GATrackEvent('Social Share', network)
  }

  const trackOutcome = (combo) => {
    GATrackEvent('Outcome', 'Toggle', combo)
  }

  const trackCompareList = (list) => {
    GATrackEvent('Comparison', 'School IDs', list)
  }

  const trackNavigation = (path) => {
    GATrackEvent('Internal Link', path)
  }

  const trackMultipleStates = (states) => {
    GATrackEvent('Multiple States', states)
  }

  return {
    trackAccordion,
    trackOutboundLink,
    transitionOutboundLink,
    trackDownload,
    trackShare,
    trackOutcome,
    trackCompareList,
    trackNavigation,
    trackMultipleStates,
    GATrackEvent
  }
}