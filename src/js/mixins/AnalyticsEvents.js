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
            this.GATrackEvent('Outbound Links', href);
        },
        transitionOutboundLink(event, url) {
            this.$store.commit("setOutboundUrl", url)
            this.trackOutboundLink(event)
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