var BASE_URL = 'http://localhost:4000/college-choice/';

module.exports = {
  'accordions are invisible by default': function(client) {
    client
      .url(BASE_URL)
      .waitForElementPresent('.picc-accordion', 1000)
      .assert.hidden('.picc-accordion [aria-hidden]');
  }
};
