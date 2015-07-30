module.exports = {
  'search form exists on the home page': function(client) {
    return client.page.index()
      .navigate()
      .waitForElementPresent('@searchForm')
      .assert.visible('@searchForm');
  },

  /*
  'search form exists on the search page': function(client) {
    return client.page.search()
      .navigate()
      .waitForElementPresent('@searchForm')
      .assert.visible('@searchForm');
  },
  */

  after: function(client) {
    client.end();
  }
};
