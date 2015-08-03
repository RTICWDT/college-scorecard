module.exports = {
  url: function() {
    return this.api.launchUrl + 'styleguide/';
  },

  elements: {
    expandedAccordion:          'aria-accordion[aria-expanded="true"]',
    expandedAccordionContent:   'aria-accordion[aria-expanded="true"] .content',
    expandedAccordionTrigger:   'aria-accordion[aria-expanded="true"] .trigger',
    collapsedAccordion:         'aria-accordion[aria-expanded="false"]',
    collapsedAccordionContent:  'aria-accordion[aria-expanded="false"] .content',
    collapsedAccordionTrigger:  'aria-accordion[aria-expanded="false"] .trigger',
  },

  sections: {
  }
};
