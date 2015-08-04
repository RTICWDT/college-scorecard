var sauce = require('../sauce');

module.exports = {

  before: function(client) {
    client.windowSize('current', 1024, 768);
  },

  'loads accordion elements': function(client) {
    client.page.styleguide()
      .navigate();
    client
      .waitForDocumentReady()
      .execute(function() {
        var accordion = document.querySelector('aria-accordion[aria-expanded="true"]');
        return accordion ? accordion.expanded : null;
      }, [], function(result) {
        client.assert.equal(result.value, true);
      });
  },

  'open accordions should close when clicked': function(client) {
    var page = client.page.styleguide()
      .navigate();
    client.waitForDocumentReady();
    page
      .click('@openAccordionTrigger')
      .assert.hidden('@openAccordionContent');
  },

  'closed accordions should open when clicked': function(client) {
    var page = client.page.styleguide()
      .navigate()
    client.waitForDocumentReady();
    page
      .click('@closedAccordionTrigger')
      .assert.visible('@closedAccordionContent');
  },

  'closed accordions have invisible content by default': function(client) {
    client.page.styleguide()
      .navigate()
      .waitForElementPresent('@closedAccordion')
      .assert.hidden('@closedAccordionContent');
  },

  'open accordions have visible content by default': function(client) {
    client.page.styleguide()
      .navigate()
      .waitForElementPresent('@openAccordion')
      .assert.visible('@openAccordionContent');
  },

  after: function(client) {
    client.end();
  },

  tearDown: sauce.reportPassed
};
