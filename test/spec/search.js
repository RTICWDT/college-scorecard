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

  it('should only show any, bachelors, associates as options', function*() {
    var options = yield browser
      .url('/')
      .click('#school-degree h1 [aria-controls]')
      .getText('#major-type option');
    assert.deepEqual(options, [ 'Any', 'Two-year (Associate\'s)',
                                'Four-year (Bachelor\'s)' ]);
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
        .click('#search-form > fieldset:last-of-type h1 [aria-controls]')
        .execute(function() {
          document.getElementById('type-public').click(); });
      });
    assert.equal(yield utils.getSearchCount(), results.spotChecks.allPublic);
  });

  it('should contain only private schools if selected', function*() {
    yield utils.runSearch(function() {
      return browser
        .click('#search-form > fieldset:last-of-type h1 [aria-controls]')
        .execute(function() {
          document.getElementById('type-private').click(); });
      });
    assert.equal(yield utils.getSearchCount(),
                 results.spotChecks.allPrivateNonProfit);
  });

  it('should contain only for profit schools if selected', function*() {
    yield utils.runSearch(function() {
      return browser
        .click('#search-form fieldset:last-of-type h1 [aria-controls]')
        .execute(function() {
          document.getElementById('type-profit').click(); });
      });
    assert.equal(yield utils.getSearchCount(),
                 results.spotChecks.allPrivateForProfit);
  });
});

describe('autocomplete', function() {

  it('should return results after typing 3 reasonable characters', function*() {

    var nameInput = yield browser
        .url('/')
        .click('#school-name h1 [aria-controls]')
        .setValue('#name-school', 'Uni');

    var doesExist = yield browser.waitForExist('#name-content .tt-dataset > .tt-suggestion > .tt-highlight');

    assert.equal(doesExist, true);


  });

  it('should return results when reasonable letters were typed', function*() {

    var nameInput = yield browser
        .url('/')
        .click('#school-name h1 [aria-controls]')
        .setValue('#name-school', 'Berkeley');

    var doesExist = yield browser.waitForExist('#name-content .tt-dataset > .tt-suggestion > .tt-highlight');

    var actualText = yield browser.getText('#name-content .tt-dataset > .tt-suggestion > .tt-highlight');

    assert.equal(actualText[0], 'Berkeley');

  });

  it('should contain no results for a nonsense word', function*() {

    var nameInput = yield browser
        .url('/')
        .click('#school-name h1 [aria-controls]')
        .setValue('#name-school', 'nons%ense wo@d#');

    // forcing a pause as to simulate a search due to .tt-empty class added before any response
    var doesExist = yield browser.pause(3000).waitForExist('#name-content .tt-empty .tt-dataset');

    assert.equal(doesExist, true);

  });

});
