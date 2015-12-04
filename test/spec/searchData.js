/*global require, describe, it, browser */

var assert = require('assert');
var results = require('./resultData.json');
var utils = require('./utils');

describe('search', function() {

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

      var result = yield utils.getSearchCount();
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

      var result = yield utils.getSearchCount();
      assert.equal(result, region.count, region.name + ' result count is incorrect. Expected: ' + region.count + ' Actual: ' + result);
      assert(valueMatch, region.code + ' does not match ' + region.name);
    }
  });

  /*
    Programs/Degrees
  */
  it('each program should include the correct count of schools', function*() {
    for (var index = 0; index < results.allSchoolsWithProgram.length; index++) {
      var program = results.allSchoolsWithProgram[index];
      yield utils.runSearch(function() { return browser
                                     .click('#school-degree h1 a')
                                     .selectByVisibleText('#major', program.name)
                                 });
      var result = yield utils.getSearchCount();
      assert.equal(result, program.count, program.name + ' result count is incorrect. Expected: ' + program.count + ' Actual: ' + result);
    }
  });

  /*
    Special Designation
  */
  it('each special designation should include the correct count of schools', function*() {
    for (var index = 0; index < results.specialDesignation.length; index++) {
      var program = results.specialDesignation[index];
      yield utils.runSearch(function() { return browser
                                   .click('#search-form fieldset:last-of-type h1 a')
                                   .selectByVisibleText('#special', program.name)
                                 });
      var result = yield utils.getSearchCount();
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

      var result = yield utils.getSearchCount();
      assert.equal(result, program.count, program.name + ' result count is incorrect. Expected: ' + program.count + ' Actual: ' + result);
      assert(valueMatch, program.code + ' does not match ' + program.name);
    }
  });
});