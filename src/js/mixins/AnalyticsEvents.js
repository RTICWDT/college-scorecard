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

            

            if (confirm("You are leaving the College Scorecard. \n\nThe U.S. Department of Education does not necessarily endorse the views expressed or the data and facts presented on this external site. \n\nLinks are provided by the institutions and are only updated about once a year. As such, over the course of the year, some links may break or websites may be taken offline.")) {
                this.GATrackEvent('Outbound Links', href);
            }
            else {
                evt.preventDefault();
            }
        },
        transitionOutboundLink(event, url) {
            //this.$store.commit("setOutboundUrl", url)
            event.preventDefault();
            if (confirm("You are leaving the College Scorecard. \n\nThe U.S. Department of Education does not necessarily endorse the views expressed or the data and facts presented on this external site. \n\nLinks are provided by the institutions and are only updated about once a year. As such, over the course of the year, some links may break or websites may be taken offline.")) {
                this.trackOutboundLink(event);
                window.location.replace(url);
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
            if (window.ga) {
                try {
                    ga('send', 'event', category, action, label);
                } catch (e) {
                    console.error('[ga] event error');
                }
            } else {
                console.log('GA Event: [' + category + ', ' + action + ', ' + label + ']');
            }
        }
    }
}