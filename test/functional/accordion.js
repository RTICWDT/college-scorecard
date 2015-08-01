var sauce = require('../sauce');

module.exports = {

  before: function(client) {
    client.windowSize('current', 1024, 768);
  },

  'collapsed accordions have invisible content by default': function(client) {
    client.page.styleguide()
      .navigate()
      .waitForElementPresent('@collapsedAccordion')
      .assert.hidden('@collapsedAccordionContent');
  },

  'expanded accordions have visible content by default': function(client) {
    client.page.styleguide()
      .navigate()
      .waitForElementPresent('@expandedAccordion')
      .assert.visible('@expandedAccordionContent');
  },

  /*
  // FIXME: these don't work because Nightwatch/Selenium
  // can't find the trigger selectors???
  'expanded accordions should close when clicked': function(client) {
    client.page.styleguide()
      .navigate()
      .waitForElementPresent('@expandedAccordionTrigger')
      .waitForElementPresent('@expandedAccordionContent')
      .click('@expandedAccordionTrigger')
      .assert.hidden('@expandedAccordionContent');
  },

  'collapsed accordions should open when clicked': function(client) {
    client.page.styleguide()
      .navigate()
      .waitForElementPresent('@collapsedAccordion')
      .click('@collapsedAccordionTrigger')
      .assert.visible('@collapsedAccordionContent');
  },
  */

  after: function(client) {
    client.end();
  },

  tearDown: sauce.reportPassed
};
