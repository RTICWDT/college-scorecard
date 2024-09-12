export default {
    methods: {
        trackAccordion(accordion) {
            this.GATrackEvent('[Data] Expand Accordion', accordion);
        },
        trackOutboundLink(href) {

            this.GATrackEvent('External Link', href);

        },
        transitionOutboundLink(event) {
            let href = '(unknown)';
            let host = '(unknown)';
            // handle case for v-btn
            if(event.target.className.match(/v-btn__content/))
            {
                href = event.target.parentNode.href;
                host = event.target.parentNode.host;
            }
            else
            {
                href = event.target.href;
                host = event.target.host;
            }

            const rootDomain = s => {
                const r =  /.*\.([^.]*[^0-9][^.]*\.[^.]*[^.0-9][^.]*$)/;
                return s.replace(r, '$1');
            };

            if (!rootDomain(host).endsWith('.gov')) {
                if (confirm("You are leaving the College Scorecard. \n\nThe U.S. Department of Education does not necessarily endorse the views expressed or the data and facts presented on this external site. \n\nLinks are provided by the institutions and are only updated about once a year. As such, over the course of the year, some links may break or websites may be taken offline.")) {
                    this.trackOutboundLink(href);
                }
                else {
                    event.preventDefault();
                }
            }
            else  {
                this.trackOutboundLink(href);
            }
            
          },        
        trackDownload(file) {
            this.GATrackEvent('Downloads', file);
        },
        trackShare(network){
            this.GATrackEvent('Social Share', network);
        },
        trackOutcome(combo){
            this.GATrackEvent('Outcome', 'Toggle', combo);
        },
        trackCompareList(list){
            this.GATrackEvent('Comparison', 'School IDs', list);
        },
        GATrackEvent(category, action, label = window.location.pathname) {
            try {
                gtag('event', action, { 'event_category' : category, 'event_label' : label });
            } catch (e) {
                console.error('[gtag] event error');
            }
        },
        trackNavigation(path) {
            this.GATrackEvent('Internal Link', path);
        },
        trackMultipleStates(states) {
            this.GATrackEvent('Multiple States', states);
        }
    }
}