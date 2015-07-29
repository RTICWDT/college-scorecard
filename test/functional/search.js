module.exports = {
  'search form exists on the home page': function(client) {
    client.page.index()
      .navigate()
      .waitForElementPresent('@searchForm')
      .assert.visible('@searchForm');
  },

  after: function(client) {
    client.end();
  }
};
