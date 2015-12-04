exports.getSearchCount = function*() {
  var value = yield browser
    .pause(500)
    .waitForText('.results-main-alert .u-group_inline-left h1 span:first-child', 10000)
    .getText('.results-main-alert .u-group_inline-left h1 span:first-child');
  return parseInt(value.replace(/,/g, ""), 10);
};

exports.runSearch = function*(ops) {
  yield browser
    .url('/');
  if (typeof ops === 'function') {
    yield ops();
  }
  yield browser.click('#search-submit');
};
