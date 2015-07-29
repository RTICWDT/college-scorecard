module.exports = {
  'accordions are invisible by default': function(client) {
    // there's guaranteed to be an accordion on the
    // styleguide page
    client.page.styleguide()
      .navigate()
      .waitForElementPresent('.picc-accordion')
      .assert.hidden('.picc-accordion [aria-hidden]');
  },

  after: function(client) {
    client.end();
  }
};
