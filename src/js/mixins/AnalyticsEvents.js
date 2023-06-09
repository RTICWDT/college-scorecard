export default {
    methods: {
        trackAccordion(accordion) {
            this.GATrackEvent('[Data] Expand Accordion', accordion);
        },
        trackOutboundLink(evt) {
            let href = '(unknown)';
            // handle case for v-btn
            if(evt.target.className.match(/v-btn__content/))
            {
                href = evt.target.parentNode.href;
            }
            else
            {
                href = evt.target.href;
            }
            this.GATrackEvent('external_link', href);

        },
        transitionOutboundLink(event) {
            if (confirm("You are leaving the College Scorecard. \n\nThe U.S. Department of Education does not necessarily endorse the views expressed or the data and facts presented on this external site. \n\nLinks are provided by the institutions and are only updated about once a year. As such, over the course of the year, some links may break or websites may be taken offline.")) {
                this.trackOutboundLink(event);
            }
            else {
                event.preventDefault();
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
        }
    }
}