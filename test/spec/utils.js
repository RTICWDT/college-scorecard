/* jshint esnext: true */
/* global exports, browser */
exports.getSearchCount = function*() {
  var value = yield browser
    .waitForExist(
      '.results-main-alert .u-group_inline-left h1 span:first-child', 5000)
    .waitUntil(function() {
      return this.getText(
        '.results-main-alert .u-group_inline-left h1 span:last-child').then(function(text) {
          return text === 'Results' || text === 'Result';
      });
    })
    .getText('.results-main-alert .u-group_inline-left h1 span:first-child');
  return parseInt(value.replace(/,/g, ''), 10);
};

exports.runSearch = function*(ops, argument) {
  yield browser
    .url('/');
  if (typeof ops === 'function') {
    yield ops(argument);
  }
  yield browser.click('#search-submit');
};
