const OPEN = 'aria-accordion.default_open';
const CLOSED = 'aria-accordion.default_closed';

module.exports = {
  url: function() {
    return this.api.launchUrl + 'styleguide/';
  },

  elements: {
    openAccordion:          OPEN,
    openAccordionContent:   OPEN + ' .content',
    openAccordionTrigger:   OPEN + ' .trigger',
    closedAccordion:        CLOSED,
    closedAccordionContent: CLOSED + ' .content',
    closedAccordionTrigger: CLOSED + ' .trigger',
  },

  sections: {
  }
};
