/*global require, describe, it, browser */

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
  it('should contain all schools containing "Columbia"', function*() {
    yield utils.runSearch(function() {
      return browser
        .click('#school-name h1 a')
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

  it('should contain all schools containing "col"', function*() {
    yield utils.runSearch(function() {
      return browser
        .click('#school-name h1 a')
        .setValue('#name-school', 'col');
      });
    assert.equal(yield utils.getSearchCount(), results.spotChecks.allCol);
  });

  it('should contain no results for a nonsense word', function*() {
    yield utils.runSearch(function() {
      return browser
        .click('#school-name h1 a')
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
        .click('#school-location h1 a')
        .selectByValue('.multi-select_item .select-state', 'DE');
      });
    assert.equal(yield utils.getSearchCount(),
                 results.spotChecks.allInDelaware);
  });

  it('should contain all schools in DE & KY if selected', function*() {
    yield utils.runSearch(function() {
      return browser
        .click('#school-location h1 a')
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
        .click('#school-location h1 a')
        .selectByValue('.multi-select_item .select-region', '8');
      });
    assert.equal(yield utils.getSearchCount(), results.spotChecks.allInFarWest);
  });

  it('should contain all schools in Zip Code 10023', function*() {
    yield utils.runSearch(function() {
      return browser
        .click('#school-location h1 a')
        .setValue('#zip-code', '10023');
      });
    assert.equal(yield utils.getSearchCount(),
                 results.spotChecks.allIn10023NoRadius);
  });

  it('should contain all schools in 5 miles of Zip Code 10023', function*() {
    yield utils.runSearch(function() {
      return browser
        .click('#school-location h1 a')
        .setValue('#zip-code', '10023')
        .setValue('#search-radius', '5');
      });
    assert.equal(yield utils.getSearchCount(),
                 results.spotChecks.allIn10023Radius5);
  });

  it('should contain no results for zip code = 1089987987', function*() {
    yield utils.runSearch(function() {
      return browser
        .click('#school-location h1 a')
        .setValue('#zip-code', '1089987987');
      });
    assert.equal(yield utils.getSearchCount(), 0);
  });

  it('should contain no results for radius = 0890098', function*() {
    yield utils.runSearch(function() {
      return browser
        .click('#school-location h1 a')
        .setValue('#search-radius', '0890098');
      });
    assert.equal(yield utils.getSearchCount(), results.spotChecks.allSchools);
  });

  // Check include Online-Only isn't implemented 

  /*
    Size
  */
  it('should contain all small schools if selected', function*() {
    yield utils.runSearch(function() {
      return browser
        .click('#school-size h1 a')
        .execute(function() { 
          document.getElementById('size-small').click(); });
      });
    assert.equal(yield utils.getSearchCount(), results.spotChecks.allSmall);
  });

  it('should contain all medium schools if selected', function*() {
    yield utils.runSearch(function() {
      return browser
        .click('#school-size h1 a')
        .execute(function() {
          document.getElementById('size-medium').click(); });
      });
    assert.equal(yield utils.getSearchCount(), results.spotChecks.allMedium);
  });

  it('should contain all large schools if selected', function*() {
    yield utils.runSearch(function() {
      return browser
        .click('#school-size h1 a')
        .execute(function() {
          document.getElementById('size-large').click(); });
      });
    assert.equal(yield utils.getSearchCount(), results.spotChecks.allLarge);
  });

  it('should contain all small and large schools if selected', function*() {
    yield utils.runSearch(function() {
      return browser
        .click('#school-size h1 a')
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
      .click('#school-degree h1 a')
      .getText('#major-type option');
    assert.deepEqual(options, [ 'Any', 'Two-year (Associate\'s)',
                                'Four-year (Bachelor\'s)' ]);
  });

  it('should contain only associate degrees if selected', function*() {
    yield utils.runSearch(function() {
      return browser
        .click('#school-degree h1 a')
        .selectByVisibleText('#major-type', 'Two-year (Associate\'s)');
      });
    assert.equal(yield utils.getSearchCount(),
                 results.spotChecks.allAssociates);
  });

  it('should contain only bachelors degrees if selected', function*() {
    yield utils.runSearch(function() {
      return browser
        .click('#school-degree h1 a')
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
        .click('#search-form > fieldset:last-of-type h1 a')
        .execute(function() {
          document.getElementById('type-public').click(); });
      });
    assert.equal(yield utils.getSearchCount(), results.spotChecks.allPublic);
  });

  it('should contain only private schools if selected', function*() {
    yield utils.runSearch(function() {
      return browser
        .click('#search-form > fieldset:last-of-type h1 a')
        .execute(function() {
          document.getElementById('type-private').click(); });
      });
    assert.equal(yield utils.getSearchCount(),
                 results.spotChecks.allPrivateNonProfit);
  });

  it('should contain only for profit schools if selected', function*() {
    yield utils.runSearch(function() {
      return browser
        .click('#search-form fieldset:last-of-type h1 a')
        .execute(function() {
          document.getElementById('type-profit').click(); });
      });
    assert.equal(yield utils.getSearchCount(),
                 results.spotChecks.allPrivateForProfit);
  });
});
