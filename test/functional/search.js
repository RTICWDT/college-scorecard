var sauce = require('../sauce');

module.exports = {

  'search form exists on the home page': function(client) {
    return client.page.index()
      .navigate()
      .waitForElementPresent('@searchForm')
      .assert.visible('@searchForm');
  },

  'searching by name changes the URL appropriately': function(client) {
    var name = '@nameInput';
    return client.page.index()
      .navigate()
      .waitForElementVisible(name)
      .setValue(name, 'foo')
      .assert.value(name, 'foo')
      .submitForm(name)
      .assert.urlContains('?name=foo');
  },

  after: function(client) {
    client.end();
  },

  tearDown: sauce.reportPassed
};
