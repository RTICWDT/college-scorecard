var sauce = require('../sauce');

module.exports = {

  'search form exists on the home page': function(client) {
    return client.page.index()
      .navigate()
      .waitForElementPresent('@searchForm')
      .assert.visible('@searchForm');
  },

  /*
  'searching by name changes the URL appropriately': function(client) {
    var input = '@nameInput';
    var page = client.page.index()
      .navigate();
    client.waitForDocumentReady();
    page
      .setValue(input, 'foo')
      .assert.value(input, 'foo')
      .submitForm(input)
      .assert.urlContains('?name=foo');
  },
  */

  /*
  'searching by state changes the URL': function(client) {
    var page = client.page.index()
      .navigate();
    client.waitForDocumentReady();
    var input = '@stateInput';
    var value = 'CA';
    page
      .click('@locationExpandButton')
      .setValue(input, value);
    page
      .assert.value(input, value)
      .submitForm(input)
      .assert.urlContains('?state=' + value);
  },
  */

  after: function(client) {
    client.end();
  },

  tearDown: sauce.reportPassed
};
