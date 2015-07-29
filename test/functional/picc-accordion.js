var BASE_URL = 'http://localhost:4000/college-choice/';
var DEFAULT_TIMEOUT = 10000;

module.exports = {
  'accordions are invisible by default': function(client) {
    client
      .url(BASE_URL)
      .waitForElementPresent('.picc-accordion', DEFAULT_TIMEOUT)
      .assert.hidden('.picc-accordion [aria-hidden]');
  }
};
