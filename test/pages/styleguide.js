module.exports = {
  url: function() {
    return this.api.launchUrl + 'styleguide/';
  },

  elements: {
    expandedAccordion:          'aria-accordion[aria-expanded="true"]',
    expandedAccordionContent:   'aria-accordion[aria-expanded="true"] div',
    expandedAccordionTrigger:   'aria-accordion[aria-expanded="true"] [aria-controls]',
    collapsedAccordion:         'aria-accordion[aria-expanded="false"]',
    collapsedAccordionContent:  'aria-accordion[aria-expanded="false"] div',
    collapsedAccordionTrigger:  'aria-accordion[aria-expanded="false"] [aria-controls]',
  },

  sections: {
  }
};
