/* jshint esnext: true, maxlen: 120, noyield: true */
/* global browser */

var assert = require('assert');
var utils = require('./utils');

describe('compare', function() {

  after(function() {
    browser.localStorage('DELETE');
  });

  it('should navigate to compare page from search results accordion link and display selected schools', function*() {

    yield utils.runSearch();
    yield utils.getVisibleResults();

    var schoolOne = '.school.results-card:nth-child(1) .button-compare_schools';
    var compareOne = '.selected-school_average-cost_group:nth-child(1) figcaption span';

    var schoolTwo = '.school.results-card:nth-child(2) .button-compare_schools';
    var compareTwo = '.selected-school_average-cost_group:nth-child(2) figcaption span';

    var schoolOneName = yield browser
        .getAttribute(schoolOne, 'data-school-name');

    var schoolTwoName = yield browser
        .getAttribute(schoolTwo, 'data-school-name');

    var sortedSchools = [schoolOneName, schoolTwoName];

    sortedSchools.sort(function(a, b){
      return (a.toLowerCase() < b.toLowerCase()) ? -1
        : (a.toLowerCase() > b.toLowerCase()) ? 1
        : 0;
    });


    yield browser
      .click(schoolOne);

    yield browser
      .click(schoolTwo);

    yield browser
      .click('#compare_schools-edit');

    yield browser
      .click('#compare-link');

    yield utils.getVisibleCompare();

    var compareOneName = yield browser
      .element(compareOne)
      .getText();

    var compareTwoName = yield browser
      .element(compareTwo)
      .getText();

    assert.equal(sortedSchools[0], compareOneName);
    assert.equal(sortedSchools[1], compareTwoName);

  });

});