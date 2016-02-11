/* jshint esnext: true */
/*global require, describe, it, browser */

var assert = require('assert');
var results = require('./resultData.json');
var utils = require('./utils');


var resultCountError = function(name, result, expected) {
  return name + ' result count is incorrect. Expected: ' +
         expected + ' Actual: ' + result;
};

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
        .click('#school-location h1 [aria-controls]')
        // select by text to ensure the text is the same
        .selectByVisibleText('.multi-select_item .select-state', state.name);
        // check selection by value to ensure that value & text are aligned
      var valueMatch = yield browser
        .isSelected('.multi-select_item .select-state [value="' +
                    state.code + '"]');
      yield browser
        .click('#search-submit');

      var result = yield utils.getSearchCount();
      assert.equal(result, state.count,
                   resultCountError(state.code, result, state.count));
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
        .click('#school-location h1 [aria-controls]')
        // select by text to ensure the text is the same
        .selectByVisibleText('.multi-select_item .select-region', region.name);
        // check selection by value to ensure that value & text are aligned
      var valueMatch = yield browser
        .isSelected('.multi-select_item .select-region [value="' +
                    region.code + '"]');
      yield browser
        .click('#search-submit');

      var result = yield utils.getSearchCount();
      assert.equal(result, region.count, 
                   resultCountError(region.code, result, region.count));
      assert(valueMatch, region.code + ' does not match ' + region.name);
    }
  });

  /*
    Programs/Degrees
  */

  var programSearch = function(programName) {
    return browser
      .click('#school-degree h1 [aria-controls]')
      .selectByVisibleText('#major', programName);
  };

  it('each program should include the correct count of schools', function*() {
    for (var index = 0; index < results.allSchoolsWithProgram.length; index++) {
      var program = results.allSchoolsWithProgram[index];
      yield utils.runSearch(programSearch, program.name);
      var result = yield utils.getSearchCount();
      assert.equal(result, program.count, 
                   resultCountError(program.name, result, program.count));
    }
  });

  /*
    Special Designation
  */

  var designationSearch = function(designation) {
    return browser
      .click('#search-form fieldset:last-of-type h1 [aria-controls]')
      .selectByVisibleText('#special', designation);
  };

  it('each designation should include the correct # of schools', function*() {
    for (var index = 0; index < results.specialDesignation.length; index++) {
      var program = results.specialDesignation[index];
      yield utils.runSearch(designationSearch, program.name);
      var result = yield utils.getSearchCount();
      assert.equal(result, program.count,
                   resultCountError(program.name, result, program.count));
    }
  });

  /*
    Religious Affiliation
  */
  it('each affiliation should include the correct # of schools', function*() {
    for (var index = 0; index < results.religiousAffiliation.length; index++) {
      var program = results.religiousAffiliation[index];
      yield browser
        .url('/')
        .click('#search-form fieldset:last-of-type h1 [aria-controls]')
        // select by text to ensure the text is the same
        .selectByVisibleText('#affiliation', program.name);
      var valueMatch = yield browser
        .isSelected('#affiliation [value="' + program.code + '"]');
      yield browser
        .click('#search-submit');

      var result = yield utils.getSearchCount();
      assert.equal(result, program.count,
                   resultCountError(program.name, result, program.count));
      assert(valueMatch, program.code + ' does not match ' + program.name);
    }
  });
});
