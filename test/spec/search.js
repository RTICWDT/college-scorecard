var assert = require('assert');
var results = require('./resultCounts');

/*global describe, it, browser */

var getResultCount = function() {
  return browser
    .waitForText('.results-main-alert .u-group_inline-left h1 span:first-child', 10000)
    .getText('.results-main-alert .u-group_inline-left h1 span:first-child');
}; 

describe('search', function() {

  it('should contain all schools with no search criteria', function*() {
    yield browser
      .url('/')
      .click('#search-submit');

    var result = yield getResultCount();
    assert.equal(result, results.resultCounts.allSchools);
  });

  /*
    Search By Name
  */
  it('should contain all schools containing "Columbia"', function*() {
    yield browser
      .url('/')
      .click('#school-name h1 a')
      .setValue('#name-school', 'Columbia')
      .click('#search-submit');

    var result = yield getResultCount();
    assert.equal(result, results.resultCounts.allColumbia);
    var names = yield browser.getText('.results-main-schools .results-card .results-card-headings h1 a.link');
    var startsWith = names.reduce(function(foundSoFar, name) {
      return foundSoFar + (name.startsWith('Columbia') ? 1 : 0); 
    }, 0);
    assert.equal(startsWith, results.resultCounts.allStartsWithColumbia);
  });

  it('should contain all schools containing "col"', function*() {
    yield browser
      .url('/')
      .click('#school-name h1 a')
      .setValue('#name-school', 'col')
      .click('#search-submit');

    var result = yield getResultCount();
    assert.equal(result, results.resultCounts.allCol);
  });

  it('should contain no results for a nonsense word', function*() {
    yield browser
      .url('/')
      .click('#school-name h1 a')
      .setValue('#name-school', 'nons%ense wo@d#')
      .click('#search-submit');

    var result = yield getResultCount();
    assert.equal(result, '0');
  });

  /*
    Search By Location 
  */
  it('should contain all schools in Delaware if selected', function*() {
    yield browser
      .url('/')
      .click('#school-location h1 a')
      .selectByValue('.multi-select_item .select-state', 'DE')
      .click('#search-submit');

    var result = yield getResultCount();
    assert.equal(result, results.resultCounts.allInDelaware);
  });

  it('should contain all schools in DE & KY if selected', function*() {
    yield browser
      .url('/')
      .click('#school-location h1 a')
      .selectByValue('.multi-select_item .select-state', 'DE')
      .click('button.button.button-add')
      .selectByValue('.multi-select_item + .multi-select_item .select-state', 'KY')
      .click('#search-submit');

    var result = yield getResultCount();
    assert.equal(result, results.resultCounts.allInDelawareKentucky);
  });

  it('should contain all schools in Far West region if selected', function*() {
    yield browser
      .url('/')
      .click('#school-location h1 a')
      .selectByValue('.multi-select_item .select-region', '8')
      .click('#search-submit');

    var result = yield getResultCount();
    assert.equal(result, results.resultCounts.allInFarWest);
  });

  it('should contain all schools in Zip Code 10023', function*() {
    yield browser
      .url('/')
      .click('#school-location h1 a')
      .setValue('#zip-code', '10023')
      .click('#search-submit');

    var result = yield getResultCount();
    assert.equal(result, results.resultCounts.allIn10023NoRadius);
  });

  it('should contain all schools within 5 miles of Zip Code 10023', function*() {
    yield browser
      .url('/')
      .click('#school-location h1 a')
      .setValue('#zip-code', '10023')
      .setValue('#search-radius', '5')
      .click('#search-submit');

    var result = yield getResultCount();
    assert.equal(result, results.resultCounts.allIn10023Radius5);
  });

  // CLARIFICATION: The spec says this should error, but it just returns 0 results?
  // Returns an error if you define a radius + bogus zip.
  it('should contain no results for zip code = 1089987987', function*() {
    yield browser
      .url('/')
      .click('#school-location h1 a')
      .setValue('#zip-code', '1089987987')
      .click('#search-submit');

    var result = yield getResultCount();
    assert.equal(result, '0');
  });

  // CLARIFICATION: The spec says this should error, but it just returns all results?
  it('should contain no results for radius = 0890098', function*() {
    yield browser
      .url('/')
      .click('#school-location h1 a')
      .setValue('#search-radius', '0890098')
      .click('#search-submit');

    var result = yield getResultCount();
    assert.equal(result, results.resultCounts.allSchools);
  });

  // CLARIFICATION: Check include Online-Only - where is that?
  // CLARIFICATION: Can only select one of the 3 at any given time: State, Region or Zip
  // How is this limited & what is expected? I just see 0 results.

  /*
    States
  */
  // CLARIFICATION 'FM', 'MP', and 'PW' don't exist
  it('each state should include the correct count of schools', function*() {
    for (var index = 0; index < results.allSchoolsInState.length; index++) {
      var state = results.allSchoolsInState[index];
      yield browser
        .url('/')
        .click('#school-location h1 a')
        // select by text to ensure the text is the same
        .selectByVisibleText('.multi-select_item .select-state', state.name);
        // check selection by value to ensure that value & text are aligned
      var valueMatch = yield browser
        .isSelected('.multi-select_item .select-state [value="' + state.code + '"]');
      yield browser
        .click('#search-submit');

      var result = yield getResultCount();
      assert.equal(result, state.count, state.code + ' result count is incorrect. Expected: ' + state.count + ' Actual: ' + result);
      assert(valueMatch, state.code + ' does not match ' + state.name);
    }
  });

  /*
    Regions 
  */
  it('each region should include the correct count of schools', function*() {
    for (var index = 0; index < results.allSchoolsInRegion.length; index++) {
      var region = results.allSchoolsInRegion[index];
      yield browser
        .url('/')
        .click('#school-location h1 a')
        // select by text to ensure the text is the same
        .selectByVisibleText('.multi-select_item .select-region', region.name);
        // check selection by value to ensure that value & text are aligned
      var valueMatch = yield browser
        .isSelected('.multi-select_item .select-region [value="' + region.code + '"]');
      yield browser
        .click('#search-submit');

      var result = yield getResultCount();
      assert.equal(result, region.count, region.name + ' result count is incorrect. Expected: ' + region.count + ' Actual: ' + result);
      assert(valueMatch, region.code + ' does not match ' + region.name);
    }
  });

  /*
    Size
  */
  it('should contain all small schools if selected', function*() {
    yield browser
      .url('/')
      .click('#school-size h1 a')
      .click('#size-small')
      .click('#search-submit');

    var result = yield getResultCount();
    assert.equal(result, results.resultCounts.allSmall);
  });

  it('should contain all medium schools if selected', function*() {
    yield browser
      .url('/')
      .click('#school-size h1 a')
      .click('#size-medium')
      .click('#search-submit');

    var result = yield getResultCount();
    assert.equal(result, results.resultCounts.allMedium);
  });

  it('should contain all large schools if selected', function*() {
    yield browser
      .url('/')
      .click('#school-size h1 a')
      .click('#size-large')
      .click('#search-submit');

    var result = yield getResultCount();
    assert.equal(result, results.resultCounts.allLarge);
  });

  it('should contain all small and large schools if selected', function*() {
    yield browser
      .url('/')
      .click('#school-size h1 a')
      .click('#size-small')
      .click('#size-large')
      .click('#search-submit');

    var result = yield getResultCount();
    assert.equal(result, results.resultCounts.allSmallAndLarge);
  });

  /*
    Programs/Degrees
  */
  it('each program should include the correct count of schools', function*() {
    for (var index = 0; index < results.allSchoolsWithProgram.length; index++) {
      var program = results.allSchoolsWithProgram[index];
      yield browser
        .url('/')
        .click('#school-degree h1 a')
        // select by text to ensure the text is the same
        .selectByVisibleText('#major', program.name)
        .click('#search-submit');

      var result = yield getResultCount();
      assert.equal(result, program.count, program.name + ' result count is incorrect. Expected: ' + program.count + ' Actual: ' + result);
    }
  });

  it('should only show any, bachelors, & associates as degree options', function*() {
    var options = yield browser
      .url('/')
      .click('#school-degree h1 a')
      .getText('#major-type option');
    assert.deepEqual(options, [ 'Any', 'Two-year (Associate\'s)', 'Four-year (Bachelor\'s)' ]);
  });

  it('should contain only associate degrees if selected', function*() {
    yield browser
      .url('/')
      .click('#school-degree h1 a')
      .selectByVisibleText('#major-type', 'Two-year (Associate\'s)')
      .click('#search-submit');

    var result = yield getResultCount();
    assert.equal(result, results.resultCounts.allAssociates);
  });

  it('should contain only bachelors degrees if selected', function*() {
    yield browser
      .url('/')
      .click('#school-degree h1 a')
      .selectByVisibleText('#major-type', 'Four-year (Bachelor\'s)')
      .click('#search-submit');

    var result = yield getResultCount();
    assert.equal(result, results.resultCounts.allBachelors);
  });

  /*
    Advanced Search
  */

  /*
    Institution Type
  */
  it('should contain only public schools if selected', function*() {
    yield browser
      .url('/')
      .click('#search-form > fieldset:last-of-type h1 a')
      .click('#type-public')
      .click('#search-submit');

    var result = yield getResultCount();
    assert.equal(result, results.resultCounts.allPublic);
  });

  it('should contain only private schools if selected', function*() {
    yield browser
      .url('/')
      .click('#search-form > fieldset:last-of-type h1 a')
      .click('#type-private')
      .click('#search-submit');

    var result = yield getResultCount();
    assert.equal(result, results.resultCounts.allPrivateNonProfit);
  });

  it('should contain only for profit schools if selected', function*() {
    yield browser
      .url('/')
      .click('#search-form fieldset:last-of-type h1 a')
      .click('#type-profit')
      .click('#search-submit');

    var result = yield getResultCount();
    assert.equal(result, results.resultCounts.allPrivateForProfit);
  });

  /*
    Special Designation
  */
  it('each special designation should include the correct count of schools', function*() {
    for (var index = 0; index < results.specialDesignation.length; index++) {
      var program = results.specialDesignation[index];
      yield browser
        .url('/')
        .click('#search-form fieldset:last-of-type h1 a')
        // select by text to ensure the text is the same
        .selectByVisibleText('#special', program.name)
        .click('#search-submit');

      var result = yield getResultCount();
      assert.equal(result, program.count, program.name + ' result count is incorrect. Expected: ' + program.count + ' Actual: ' + result);
    }
  });

  /*
    Religious Affiliation
  */
  it('each religious affiliation should include the correct count of schools', function*() {
    for (var index = 0; index < results.religiousAffiliation.length; index++) {
      var program = results.religiousAffiliation[index];
      yield browser
        .url('/')
        .click('#search-form fieldset:last-of-type h1 a')
        // select by text to ensure the text is the same
        .selectByVisibleText('#affiliation', program.name);
      var valueMatch = yield browser
        .isSelected('#affiliation [value="' + program.code + '"]');
      yield browser
        .click('#search-submit');

      var result = yield getResultCount();
      assert.equal(result, program.count, program.name + ' result count is incorrect. Expected: ' + program.count + ' Actual: ' + result);
      assert(valueMatch, program.code + ' does not match ' + program.name);
    }
  });
});
