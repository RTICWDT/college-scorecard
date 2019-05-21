/* jshint esnext: true, maxlen: 120, noyield: true */
/* global browser */

var assert = require('assert');
var results = require('./resultData.json');
var utils = require('./utils');

describe('search', function() {

  it('should contain all schools with no search criteria', function*() {
    yield utils.runSearch();
    assert.equal(yield utils.getSearchCount(), results.spotChecks.allSchools);
  });

  /*
    Search By Name
  */
  xit('should contain all schools containing "Columbia"', function*() {
    yield utils.runSearch(function() {
      return browser
        .click('#school-name h1 [aria-controls]')
        .setValue('#name-school', 'Columbia');
      });
    assert.equal(yield utils.getSearchCount(), results.spotChecks.allColumbia);
    var names = yield browser.getText(
      '.results-main-schools .results-card .results-card-headings h1 a.link');
    var startsWith = names.reduce(function(foundSoFar, name) {
      return foundSoFar + (name.startsWith('Columbia') ? 1 : 0); 
    }, 0);
    assert.equal(startsWith, results.spotChecks.allStartsWithColumbia);
  });

  xit('should contain all schools containing "col"', function*() {
    yield utils.runSearch(function() {
      return browser
        .click('#school-name h1 [aria-controls]')
        .setValue('#name-school', 'col');
      });
    assert.equal(yield utils.getSearchCount(), results.spotChecks.allCol);
  });

  it('should contain no results for a nonsense word', function*() {
    yield utils.runSearch(function() {
      return browser
        .click('#school-name h1 [aria-controls]')
        .setValue('#name-school', 'nons%ense wo@d#');
      });
    assert.equal(yield utils.getSearchCount(), 0);
  });

  /*
    Search By Location 
  */
  it('should contain all schools in Delaware if selected', function*() {
    yield utils.runSearch(function() {
      return browser
        .click('#school-location h1 [aria-controls]')
        .selectByValue('.multi-select_item .select-state', 'DE');
      });
    assert.equal(yield utils.getSearchCount(),
                 results.spotChecks.allInDelaware);
  });

  it('should contain all schools in DE & KY if selected', function*() {
    yield utils.runSearch(function() {
      return browser
        .click('#school-location h1 [aria-controls]')
        .selectByValue('.multi-select_item .select-state', 'DE')
        .click('button.button.button-add')
        .selectByValue('.multi-select_item + .multi-select_item .select-state',
                       'KY');
      });
    assert.equal(yield utils.getSearchCount(),
                 results.spotChecks.allInDelawareKentucky);
  });

  it('should contain all schools in Far West region if selected', function*() {
    yield utils.runSearch(function() {
      return browser
        .click('#school-location h1 [aria-controls]')
        .selectByValue('.multi-select_item .select-region', '8');
      });
    assert.equal(yield utils.getSearchCount(), results.spotChecks.allInFarWest);
  });

  xit('should contain all schools in Zip Code 10023', function*() {
    yield utils.runSearch(function() {
      return browser
        .click('#school-location h1 [aria-controls]')
        .setValue('#zip-code', '10023');
      });
    assert.equal(yield utils.getSearchCount(),
                 results.spotChecks.allIn10023NoRadius);
  });

  xit('should contain all schools in 5 miles of Zip Code 10023', function*() {
    yield utils.runSearch(function() {
      return browser
        .click('#school-location h1 [aria-controls]')
        .setValue('#zip-code', '10023')
        .setValue('#search-radius', '5');
      });
    assert.equal(yield utils.getSearchCount(),
                 results.spotChecks.allIn10023Radius5);
  });

  xit('should contain no results for zip code = 1089987987', function*() {
    yield utils.runSearch(function() {
      return browser
        .click('#school-location h1 [aria-controls]')
        .setValue('#zip-code', '1089987987');
      });
    assert.equal(yield utils.getSearchCount(), 0);
  });

  it('should contain no results for radius = 0890098', function*() {
    yield utils.runSearch(function() {
      return browser
        .click('#school-location h1 [aria-controls]')
        .setValue('#search-radius', '0890098');
      });
    assert.equal(yield utils.getSearchCount(), results.spotChecks.allSchools);
  });

  /*
    Size
  */
  it('should contain all small schools if selected', function*() {
    yield utils.runSearch(function() {
      return browser
        .click('#school-size h1 [aria-controls]')
        .execute(function() { 
          document.getElementById('size-small').click(); });
      });
    assert.equal(yield utils.getSearchCount(), results.spotChecks.allSmall);
  });

  it('should contain all medium schools if selected', function*() {
    yield utils.runSearch(function() {
      return browser
        .click('#school-size h1 [aria-controls]')
        .execute(function() {
          document.getElementById('size-medium').click(); });
      });
    assert.equal(yield utils.getSearchCount(), results.spotChecks.allMedium);
  });

  it('should contain all large schools if selected', function*() {
    yield utils.runSearch(function() {
      return browser
        .click('#school-size h1 [aria-controls]')
        .execute(function() {
          document.getElementById('size-large').click(); });
      });
    assert.equal(yield utils.getSearchCount(), results.spotChecks.allLarge);
  });

  it('should contain all small and large schools if selected', function*() {
    yield utils.runSearch(function() {
      return browser
        .click('#school-size h1 [aria-controls]')
        .execute(function() {
          document.getElementById('size-small').click(); })
        .execute(function() {
          document.getElementById('size-large').click(); });
        });
    assert.equal(yield utils.getSearchCount(),
                 results.spotChecks.allSmallAndLarge);
  });

  it('should only show any, certificates, bachelors, associates as options', function*() {
    var options = yield browser
      .url('/')
      .click('#school-degree h1 [aria-controls]')
      .getText('#major-type option');
    assert.deepEqual(options, [ 'Any', 'Certificate', 'Two-year (Associate\'s)',
                                'Four-year (Bachelor\'s)' ]);
  });

  it('should contain only certificate degrees if selected', function*() {
    yield utils.runSearch(function() {
      return browser
        .click('#school-degree h1 [aria-controls]')
        .selectByVisibleText('#major-type', 'Certificate');
    });
    assert.equal(yield utils.getSearchCount(),
      results.spotChecks.allCertificates);
  });

  it('should contain only associate degrees if selected', function*() {
    yield utils.runSearch(function() {
      return browser
        .click('#school-degree h1 [aria-controls]')
        .selectByVisibleText('#major-type', 'Two-year (Associate\'s)');
      });
    assert.equal(yield utils.getSearchCount(),
                 results.spotChecks.allAssociates);
  });

  it('should contain only bachelors degrees if selected', function*() {
    yield utils.runSearch(function() {
      return browser
        .click('#school-degree h1 [aria-controls]')
        .selectByVisibleText('#major-type', 'Four-year (Bachelor\'s)');
      });
    assert.equal(yield utils.getSearchCount(), results.spotChecks.allBachelors);
  });

  /*
    Advanced Search
  */

  /*
    Institution Type
  */
  it('should contain only public schools if selected', function*() {
    yield utils.runSearch(function() {
      return browser
        .click('#search-form > .controls-container > fieldset:last-of-type h1 [aria-controls]')
        .execute(function() {
          document.getElementById('type-public').click(); });
      });
    assert.equal(yield utils.getSearchCount(), results.spotChecks.allPublic);
  });

  it('should contain only private schools if selected', function*() {
    yield utils.runSearch(function() {
      return browser
        .click('#search-form > .controls-container > fieldset:last-of-type h1 [aria-controls]')
        .execute(function() {
          document.getElementById('type-private').click(); });
      });
    assert.equal(yield utils.getSearchCount(),
                 results.spotChecks.allPrivateNonProfit);
  });

  it('should contain only for profit schools if selected', function*() {
    yield utils.runSearch(function() {
      return browser
        .click('#search-form > .controls-container > fieldset:last-of-type h1 [aria-controls]')
        .execute(function() {
          document.getElementById('type-profit').click(); });
      });
    assert.equal(yield utils.getSearchCount(),
                 results.spotChecks.allPrivateForProfit);
  });

  it('should return autocomplete results after typing 3 reasonable characters', function*() {

    var nameInput = yield browser
      .url('/')
      .click('#school-name h1 [aria-controls]')
      .setValue('#name-school', 'Uni');

    var doesExist = yield browser.waitForExist('#name-content .tt-dataset > .tt-suggestion > .tt-highlight');

    assert.equal(doesExist, true);
  });

  it('should return autocomplete results when reasonable letters were typed', function*() {

    var nameInput = yield browser
      .url('/')
      .click('#school-name h1 [aria-controls]')
      .setValue('#name-school', 'Berkeley');

    var actualText = yield browser.waitForExist('#name-content .tt-dataset > .tt-suggestion > .tt-highlight')
        .getText('#name-content .tt-dataset > .tt-suggestion > .tt-highlight');

    assert.equal(actualText[0], 'Berkeley');
  });

  it('should contain no autocomplete results for a nonsense word', function*() {

    var nameInput = yield browser
      .url('/')
      .click('#school-name h1 [aria-controls]')
      .setValue('#name-school', 'San Francisco')
      .setValue('#name-school', 'nons%ense wo@d#');

    var doesExist = yield browser.waitForExist('#name-content .tt-empty .tt-dataset');

    assert.equal(doesExist, true);
  });

  // compare schools toggles on search results page
  after(function*() {
    browser.localStorage('DELETE');
  });

  it('should add aria-pressed attribute on school compare button when clicked', function*() {
    yield utils.runSearch();
    yield utils.getVisibleResults();

    var schoolSelector = '.school.results-card:first-child .button-compare_schools';

    var ariaPressed = yield browser
      .click(schoolSelector)
      .getAttribute(schoolSelector, 'aria-pressed');

    assert(ariaPressed, true);
  });

  it('should remove aria-pressed attribute on the previously clicked school compare button when clicked again', function*() {

    yield utils.getVisibleResults();

    var schoolSelector = '.school.results-card:first-child .button-compare_schools';

    var ariaPressed = yield browser
      .click(schoolSelector)
      .getAttribute(schoolSelector, 'aria-pressed');

    assert(ariaPressed, false);
  });

  it('should add schools to compare school toggle accordion when school compare button is clicked', function*(){
    yield utils.runSearch();
    yield utils.getVisibleResults();

    var schoolSelector = '.school.results-card:first-child .button-compare_schools';

    var schoolId = yield browser
      .click(schoolSelector)
      .getAttribute(schoolSelector, 'data-school-id');

    var matchSchoolId = yield browser
      .click('#compare_schools-edit')
      .getAttribute('#edit-compare-list li label:first-child', 'data-school-id');

    assert.equal(schoolId, matchSchoolId);
  });

  it('should remove schools from compare school toggle accordion when school compare button is clicked again', function*(){
    yield utils.getVisibleResults();

    var schoolSelector = '.school.results-card:first-child .button-compare_schools';

    yield browser
      .click(schoolSelector);

    yield browser
      .click('#compare_schools-edit');

    var checkboxes = yield browser
      .execute(function(){
        return document.querySelectorAll('#edit-compare-list li');
      });

    assert.equal(checkboxes.value.length, 0);
  });

  it('should increment the selected compare school counter bubble when a school is added', function*(){
    yield utils.runSearch();
    yield utils.getVisibleResults();

    var schoolSelector = '.school.results-card:first-child .button-compare_schools';

    var counterBefore = yield browser
      .getText('[aria-controls="compare_schools-content"] [data-counter="compare"]');

    yield browser
      .click(schoolSelector)
      .getAttribute(schoolSelector, 'aria-pressed');

    var counterAfter = yield browser
      .getText('[aria-controls="compare_schools-content"] [data-counter="compare"]');

    assert.equal(counterBefore + 1, +counterAfter);
  });

  it('should decrement the selected compare school counter bubble when a school is removed', function*(){
    yield utils.getVisibleResults();

    var schoolSelector = '.school.results-card:first-child .button-compare_schools';

    var counterBefore = yield browser
      .getText('[aria-controls="compare_schools-content"] [data-counter="compare"]');

    yield browser
      .click(schoolSelector)
      .getAttribute(schoolSelector, 'aria-pressed');

    var counterAfter = yield browser
      .getText('[aria-controls="compare_schools-content"] [data-counter="compare"]');

    assert.equal(counterBefore - 1, +counterAfter);
  });

  it('should allow selecting up to ten (10) schools maximum', function*(){
    yield utils.runSearch();
    yield utils.getVisibleResults();

    yield browser
      .execute(function(){
        var cardButtons = [].slice.call(document.querySelectorAll('.results-card button.button-compare_schools'));

        for (var i=0;i < 11; i++) {
          cardButtons[i].click();
        }
      });

    var counterAfter = yield browser
      .getText('[aria-controls="compare_schools-content"] [data-counter="compare"]');

    assert.equal(+counterAfter, 10);
  });
});
