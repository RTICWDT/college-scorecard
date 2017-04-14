/* jshint esnext: true, maxlen: 120, noyield: true */
/* global browser */

var assert = require('assert');
var utils = require('./utils');

var getMeterClassForSchool = function*(meter, schoolID) {
  return browser.getAttribute(
    '.default-meters [data-school-id="'+schoolID+'"] picc-side-meter.' + meter, 'class');
};

var getMeterSchoolName = function*(schoolID) {
  return browser.getText('.default-meters [data-school-id="'+schoolID+'"] .side-meter figcaption [data-bind="name"]');
};

var getMeterHighlightForSchool = function*(meter, schoolID){
  return browser.getAttribute('.' +meter + ' [data-school-id="'+schoolID+'"]', 'data-highlight' );
};

var visitComparePage = function*() {
  yield browser
    .url('/compare');
};

var compareSchools = function*(schoolIDs) {

    for(var i=0; i< schoolIDs.length; i++) {
      yield selectCompareSchools(schoolIDs[i]);
    }
    yield visitComparePage();
    yield utils.getVisibleCompare();
};


var loadSchoolUrl = function*(school) {
  return browser
    .url('/school/?' + school)
    .waitForVisible('.show-loading', null, true);
};

var selectCompareSchools = function*(schoolID) {
  yield loadSchoolUrl(schoolID);
  return yield browser.click('.button-compare_schools');
};

var isAccordionExpanded = function(selector) {
  return browser.getAttribute(selector, 'aria-expanded');
};

var toggleAccordion = function(selector) {
  return browser
    .click(selector + ' h1 [aria-controls]')
    .getAttribute(selector, 'aria-expanded');
};

describe('compare page key metrics', function(){


  describe('for schools with null key metrics', function() {

    after(function() {
      browser.localStorage('DELETE');
    });

    it('should have "Data not available" warnings', function*() {
      var schoolIDs = ['439446', '457402'];
      var meters = ['earnings', 'cost', 'graduation'];

     yield compareSchools(schoolIDs);

      for(var i=0;i < schoolIDs.length;i++) {
        for (var j=0;j < meters.length;j++){
          var meterResult = yield getMeterClassForSchool(meters[j], schoolIDs[i]);
          var name = yield getMeterSchoolName(schoolIDs[i]);
          assert(meterResult.indexOf('no_data') > -1, name + ' has data for ' + meters[j]);
        };
      };
    });

  });

  describe('for schools with key metrics available', function() {

    after(function() {
      browser.localStorage('DELETE');
    });

    it('should display key metric figures', function*() {
      var schoolIDs = ['110635', '125170'];
      var meters = ['earnings', 'cost', 'graduation'];
      yield compareSchools(schoolIDs);

      for(var i=0;i < schoolIDs.length;i++) {
        for (var j=0;j < meters.length;j++){
          var meterResult = yield getMeterClassForSchool(meters[j], schoolIDs[i]);
          var name = yield getMeterSchoolName(schoolIDs[i]);
          assert(meterResult.indexOf('no_data') === -1, name + ' has no data for ' + meters[j]);
        };
      };
    });
  });

});


/* compare school toggles / school selection functionality */
describe('navigation to compare page', function() {

  after(function() {
    browser.localStorage('DELETE');
  });

  it('should display selected schools to compare', function*() {

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

describe('Accordion section', function(){

  after(function() {
    browser.localStorage('DELETE');
  });

  describe('for College Information', function() {

    it('should expand section when the heading is clicked', function*() {
      assert.equal(yield isAccordionExpanded('#school'), 'false');
      assert.equal(yield toggleAccordion('#school'), 'true');
    });

    it('should hide section when heading is clicked and it is open', function*() {
      assert.equal(yield toggleAccordion('#school'), 'false');
      assert.equal(yield isAccordionExpanded('#school'), 'false');
    });

    describe('race/ethnicity charts', function*() {

      var schoolIDs = ['110635', '125170'];

      yield compareSchools(schoolIDs);

      var options = [
        'aian',
        'asian',
        'asian_pacific_islander',
        'black',
        'black_non_hispanic',
        'hispanic',
        'nhpi',
        'non_resident_alien',
        'two_or_more',
        'unknown',
        'white',
        'white_non_hispanic'
      ];

      it('should display metrics by chosen race/ethnicity', function*() {

        yield browser
          .click('#school h1 [aria-controls]');
        for(var i=0;i<options.length;i++) {
          yield browser
            .selectByValue('#race_ethnicity', options[i]).pause(500);

          // Test meter 1
          var meterAttr = yield browser.getAttribute('.section-card_container-compare.race-ethnicity [data-school-id="'+schoolIDs[0]+'"] picc-side-meter', 'data-'+options[i]);
          var meterVal = yield browser.getAttribute('.section-card_container-compare.race-ethnicity [data-school-id="'+schoolIDs[0]+'"] picc-side-meter', 'value');
          var barVal = yield browser.getText('.section-card_container-compare.race-ethnicity [data-school-id="'+schoolIDs[0]+'"] .picc-side-meter-val');
          // this is necessary because for whatever reason an undefined attribute value
          // is '' for a data-<attribute> but `NaN` for the value attribute
          if (meterAttr === 'NaN') meterAttr = '';
          if (meterVal === 'NaN') meterVal = '';

          assert.equal(meterAttr, meterVal);

          // check that the bar value is represented as the percent formatted meter value ("0.0455" -> "5%")
          if (meterVal >= 0.005) {
            assert.equal((+meterVal * 100).toFixed(0)+'%', barVal);
          } else if (meterVal) {
            assert.equal('<1%', barVal);
          }

          // Test meter 2
          meterAttr = yield browser.getAttribute('.section-card_container-compare.race-ethnicity [data-school-id="'+schoolIDs[1]+'"] picc-side-meter', 'data-'+options[i]);
          meterVal = yield browser.getAttribute('.section-card_container-compare.race-ethnicity [data-school-id="'+schoolIDs[1]+'"] picc-side-meter', 'value');
          barVal = yield browser.getText('.section-card_container-compare.race-ethnicity [data-school-id="'+schoolIDs[1]+'"] .picc-side-meter-val');

          // this is necessary because for whatever reason an undefined attribute value
          // is '' for a data-<attribute> but `NaN` for the value attribute
          if (meterAttr === 'NaN') meterAttr = '';
          if (meterVal === 'NaN') meterVal = '';

          assert.equal(meterAttr, meterVal);

          // check that the bar value is represented as the percent formatted meter value ("0.0455" -> "5%")
          if (meterVal >= 0.005) {
            assert.equal((+meterVal * 100).toFixed(0)+'%', barVal);
          } else if (meterVal) {
            assert.equal('<1%', barVal);
          }

        }
      });
    });
  });

  describe('for Cost', function() {

    it('should expand section when the heading is clicked', function*() {
      assert.equal(yield isAccordionExpanded('#cost'), 'false');
      assert.equal(yield toggleAccordion('#cost'), 'true');
    });

    it('should hide section when heading is clicked and it is open', function*() {
      assert.equal(yield toggleAccordion('#cost'), 'false');
      assert.equal(yield isAccordionExpanded('#cost'), 'false');
    });

    describe('by family income charts', function*(){

      var schoolIDs = ['110635', '125170'];
      yield compareSchools(schoolIDs);

      var options = [
        'net_price_income1',
        'net_price_income2',
        'net_price_income3',
        'net_price_income4',
        'net_price_income5',
      ];

      it('should display metrics by selected family income range', function*() {
        yield browser
          .click('#cost h1 [aria-controls]');
        for(var i=0;i<options.length;i++) {
          yield browser
            .selectByValue('#net_price_income', options[i]).pause(500);

          // Test meter 1
          var meterAttr = yield browser.getAttribute('.section-card_container-compare.net-price-income [data-school-id="'+schoolIDs[0]+'"] picc-side-meter', 'data-'+options[i]);
          var meterVal = yield browser.getAttribute('.section-card_container-compare.net-price-income [data-school-id="'+schoolIDs[0]+'"] picc-side-meter', 'value');
          var barVal = yield browser.getText('.section-card_container-compare.net-price-income [data-school-id="'+schoolIDs[0]+'"] .picc-side-meter-val');

          assert.equal(meterAttr, meterVal);
          assert.equal('$'+(+meterVal).toLocaleString('en'), barVal);

          // Test meter 2
          meterAttr = yield browser.getAttribute('.section-card_container-compare.net-price-income [data-school-id="'+schoolIDs[1]+'"] picc-side-meter', 'data-'+options[i]);
          meterVal = yield browser.getAttribute('.section-card_container-compare.net-price-income [data-school-id="'+schoolIDs[1]+'"] picc-side-meter', 'value');
          barVal = yield browser.getText('.section-card_container-compare.net-price-income [data-school-id="'+schoolIDs[1]+'"] .picc-side-meter-val');

          assert.equal(meterAttr, meterVal);
          assert.equal('$'+(+meterVal).toLocaleString('en'), barVal);
        }

      });
    });
  });

  describe('for Financial Aid & Debt', function() {

    it('should expand section when the heading is clicked', function*() {
      assert.equal(yield isAccordionExpanded('#finaid'), 'false');
      assert.equal(yield toggleAccordion('#finaid'), 'true');
    });

    it('should hide section when heading is clicked and it is open', function*() {
      assert.equal(yield toggleAccordion('#finaid'), 'false');
      assert.equal(yield isAccordionExpanded('#finaid'), 'false');
    });


  });

  describe('for Graduation & Retention', function() {

    it('should expand section when the heading is clicked', function*() {
      assert.equal(yield isAccordionExpanded('#graduation'), 'false');
      assert.equal(yield toggleAccordion('#graduation'), 'true');
    });

    it('should hide section when heading is clicked and it is open', function*() {
      assert.equal(yield toggleAccordion('#graduation'), 'false');
      assert.equal(yield isAccordionExpanded('#graduation'), 'false');
    });

  });

  describe('for Earnings After School', function() {

    it('should expand section when the heading is clicked', function*() {
      assert.equal(yield isAccordionExpanded('#earnings'), 'false');
      assert.equal(yield toggleAccordion('#earnings'), 'true');
    });

    it('should hide section when heading is clicked and it is open', function*() {
      assert.equal(yield toggleAccordion('#earnings'), 'false');
      assert.equal(yield isAccordionExpanded('#earnings'), 'false');
    });

  });

});

describe('highlight', function(){

  after(function() {
    browser.localStorage('DELETE');
  });

  it('should add [aria-pressed="true"] to the selected school highlight button', function*(){

    browser.localStorage('DELETE');
    var schoolIDs = ['110635', '125170'];
    yield compareSchools(schoolIDs);

    var highlighted = yield browser
      .click('#compare_schools-edit h1 [aria-controls]')
      .click('.button-highlight_schools[data-school-id="'+schoolIDs[0]+'"]')
      .getAttribute('.button-highlight_schools[data-school-id="'+schoolIDs[0]+'"]', 'aria-pressed');

    assert.equal(highlighted, 'true');
  });

  it('should toggle back to [aria-pressed="false"] on the subsequent click on the selected school highlight button', function*(){

    browser.localStorage('DELETE');
    var schoolIDs = ['110635', '125170'];
    yield compareSchools(schoolIDs);

    var highlighted = yield browser
      .click('#compare_schools-edit h1 [aria-controls]')
      .click('.button-highlight_schools[data-school-id="'+schoolIDs[0]+'"]') // first click - on
      .click('.button-highlight_schools[data-school-id="'+schoolIDs[0]+'"]') // second click - off
      .getAttribute('.button-highlight_schools[data-school-id="'+schoolIDs[0]+'"]', 'aria-pressed');

    assert.equal(highlighted, 'false');
  });

  it('should toggle a previously highlighted school selection off when a different school is selected', function*(){
    browser.localStorage('DELETE');
    var schoolIDs = ['110635', '125170'];
    yield compareSchools(schoolIDs);

    var highlighted = yield browser
      .click('#compare_schools-edit h1 [aria-controls]')
      .click('.button-highlight_schools[data-school-id="'+schoolIDs[0]+'"]') // first school click - on
      .click('.button-highlight_schools[data-school-id="'+schoolIDs[1]+'"]') // second school click - on
      .getAttribute('.button-highlight_schools[data-school-id="'+schoolIDs[0]+'"]', 'aria-pressed');

    assert.equal(highlighted, 'false');
  });


  describe('selected school in each section', function(){

    var schoolIDs = ['110635', '125170'];

    before(function*() {
      browser.localStorage('DELETE');
      yield compareSchools(schoolIDs);
      yield browser
        .click('#compare_schools-edit h1 [aria-controls]');
    });


    it('should highlight corresponding Average Cost main meter', function*(){

      // test school #1
      yield browser
        .click('.button-highlight_schools[data-school-id="'+schoolIDs[0]+'"]');

      var highlighted = yield getMeterHighlightForSchool('average-cost', schoolIDs[0]);
      assert.equal(highlighted[0], 'true');

      // test school #2
      yield browser
        .click('.button-highlight_schools[data-school-id="'+schoolIDs[1]+'"]');

      highlighted = yield getMeterHighlightForSchool('average-cost', schoolIDs[1]);
      assert.equal(highlighted[0], 'true');
    });

    it('should highlight corresponding Grad Rate main meter', function*(){

      // test school #1
      yield browser
        .click('.button-highlight_schools[data-school-id="'+schoolIDs[0]+'"]');

      var highlighted = yield getMeterHighlightForSchool('grad-rate', schoolIDs[0]);
      assert.equal(highlighted[0], 'true');

      // test school #2
      yield browser
        .click('.button-highlight_schools[data-school-id="'+schoolIDs[1]+'"]');

      highlighted = yield getMeterHighlightForSchool('grad-rate', schoolIDs[1]);
      assert.equal(highlighted[0], 'true');
    });

    it('should highlight corresponding Salary Earnings main meter', function*(){

      // test school #1
      yield browser
        .click('.button-highlight_schools[data-school-id="'+schoolIDs[0]+'"]');

      var highlighted = yield getMeterHighlightForSchool('average-salary', schoolIDs[0]);
      assert.equal(highlighted[0], 'true');

      // test school #2
      yield browser
        .click('.button-highlight_schools[data-school-id="'+schoolIDs[1]+'"]');

      highlighted = yield getMeterHighlightForSchool('average-salary', schoolIDs[1]);
      assert.equal(highlighted[0], 'true');
    });

    it('should highlight corresponding Full Time percent meter in College Information accordion', function*(){

      // test school #1
      yield browser
        .click('.button-highlight_schools[data-school-id="'+schoolIDs[0]+'"]');

      yield toggleAccordion('#school');

      var highlighted = yield getMeterHighlightForSchool('school-summary', schoolIDs[0]);
      assert.equal(highlighted, 'true');

      // test school #2
      yield browser
        .click('#compare_schools-edit h1 [aria-controls]')
        .click('.button-highlight_schools[data-school-id="'+schoolIDs[1]+'"]');

      yield toggleAccordion('#school');

      highlighted = yield getMeterHighlightForSchool('school-summary', schoolIDs[1]);
      assert.equal(highlighted, 'true');
    });

    it('should highlight corresponding Socio-Economic Diversity meter in College Information accordion', function*(){

      // test school #1
      yield browser
        .click('#compare_schools-edit h1 [aria-controls]')
        .click('.button-highlight_schools[data-school-id="'+schoolIDs[0]+'"]');

      yield toggleAccordion('#school');

      var highlighted = yield getMeterHighlightForSchool('school-diversity', schoolIDs[0]);
      assert.equal(highlighted, 'true');

      // test school #2
      yield browser
        .click('#compare_schools-edit h1 [aria-controls]')
        .click('.button-highlight_schools[data-school-id="'+schoolIDs[1]+'"]');

      yield toggleAccordion('#school');

      highlighted = yield getMeterHighlightForSchool('school-diversity', schoolIDs[1]);
      assert.equal(highlighted, 'true');
    });

    it('should highlight corresponding Race/Ethnicity meter in College Information accordion', function*(){

      // test school #1
      yield browser
        .click('#compare_schools-edit h1 [aria-controls]')
        .click('.button-highlight_schools[data-school-id="'+schoolIDs[0]+'"]');

      yield toggleAccordion('#school');

      var highlighted = yield getMeterHighlightForSchool('race-ethnicity', schoolIDs[0]);
      assert.equal(highlighted, 'true');

      // test school #2

      yield browser
        .click('#compare_schools-edit h1 [aria-controls]')
        .click('.button-highlight_schools[data-school-id="'+schoolIDs[1]+'"]');

      yield toggleAccordion('#school');

      highlighted = yield getMeterHighlightForSchool('race-ethnicity', schoolIDs[1]);
      assert.equal(highlighted, 'true');
    });

    it('should highlight corresponding Average Cost meter in Costs accordion', function*(){

      // test school #1
      yield browser
        .click('#compare_schools-edit h1 [aria-controls]')
        .click('.button-highlight_schools[data-school-id="'+schoolIDs[0]+'"]');

      yield toggleAccordion('#cost');

      var highlighted = yield getMeterHighlightForSchool('avg-cost', schoolIDs[0]);
      assert.equal(highlighted, 'true');

      // test school #2

      yield browser
        .click('#compare_schools-edit h1 [aria-controls]')
        .click('.button-highlight_schools[data-school-id="'+schoolIDs[1]+'"]');

      yield toggleAccordion('#cost');

      highlighted = yield getMeterHighlightForSchool('avg-cost', schoolIDs[1]);
      assert.equal(highlighted, 'true');
    });

    it('should highlight corresponding By Family Income cost meter in Costs accordion', function*(){

      // test school #1
      yield browser
        .click('#compare_schools-edit h1 [aria-controls]')
        .click('.button-highlight_schools[data-school-id="'+schoolIDs[0]+'"]');

      yield toggleAccordion('#cost');

      var highlighted = yield getMeterHighlightForSchool('net-price-income', schoolIDs[0]);
      assert.equal(highlighted, 'true');

      // test school #2

      yield browser
        .click('#compare_schools-edit h1 [aria-controls]')
        .click('.button-highlight_schools[data-school-id="'+schoolIDs[1]+'"]');

      yield toggleAccordion('#cost');

      highlighted = yield getMeterHighlightForSchool('net-price-income', schoolIDs[1]);
      assert.equal(highlighted, 'true');
    });

    it('should highlight corresponding Students Paying Down Their Debt meter in Financial Aid & Debt accordion', function*(){

      // test school #1
      yield browser
        .click('#compare_schools-edit h1 [aria-controls]')
        .click('.button-highlight_schools[data-school-id="'+schoolIDs[0]+'"]');

      yield toggleAccordion('#finaid');

      var highlighted = yield getMeterHighlightForSchool('repayment-rate', schoolIDs[0]);
      assert.equal(highlighted, 'true');

      // test school #2
      yield browser
        .click('#compare_schools-edit h1 [aria-controls]')
        .click('.button-highlight_schools[data-school-id="'+schoolIDs[1]+'"]');

      yield toggleAccordion('#finaid');

      highlighted = yield getMeterHighlightForSchool('repayment-rate', schoolIDs[1]);
      assert.equal(highlighted, 'true');
    });

    it('should highlight corresponding Total Typical Debt meter in Financial Aid & Debt accordion', function*(){

      // test school #1
      yield browser
        .click('#compare_schools-edit h1 [aria-controls]')
        .click('.button-highlight_schools[data-school-id="'+schoolIDs[0]+'"]');

      yield toggleAccordion('#finaid');

      var highlighted = yield getMeterHighlightForSchool('avg-debt', schoolIDs[0]);
      assert.equal(highlighted, 'true');

      // test school #2
      yield browser
        .click('#compare_schools-edit h1 [aria-controls]')
        .click('.button-highlight_schools[data-school-id="'+schoolIDs[1]+'"]');

      yield toggleAccordion('#finaid');

      highlighted = yield getMeterHighlightForSchool('avg-debt', schoolIDs[1]);
      assert.equal(highlighted, 'true');
    });

    it('should highlight corresponding Students Receiving Federal Loans meter in Financial Aid & Debt accordion', function*(){

      // test school #1
      yield browser
        .click('#compare_schools-edit h1 [aria-controls]')
        .click('.button-highlight_schools[data-school-id="'+schoolIDs[0]+'"]');

      yield toggleAccordion('#finaid');

      var highlighted = yield getMeterHighlightForSchool('student-aid', schoolIDs[0]);
      assert.equal(highlighted, 'true');

      // test school #2
      yield browser
        .click('#compare_schools-edit h1 [aria-controls]')
        .click('.button-highlight_schools[data-school-id="'+schoolIDs[1]+'"]');

      yield toggleAccordion('#finaid');

      highlighted = yield getMeterHighlightForSchool('student-aid', schoolIDs[1]);
      assert.equal(highlighted, 'true');
    });

    it('should highlight corresponding Typical Monthly Loan Payment meter in Financial Aid & Debt accordion', function*(){

      // test school #1
      yield browser
        .click('#compare_schools-edit h1 [aria-controls]')
        .click('.button-highlight_schools[data-school-id="'+schoolIDs[0]+'"]');

      yield toggleAccordion('#finaid');

      var highlighted = yield getMeterHighlightForSchool('avg-loan-payment', schoolIDs[0]);
      assert.equal(highlighted, 'true');

      // test school #2
      yield browser
        .click('#compare_schools-edit h1 [aria-controls]')
        .click('.button-highlight_schools[data-school-id="'+schoolIDs[1]+'"]');

      yield toggleAccordion('#finaid');

      highlighted = yield getMeterHighlightForSchool('avg-loan-payment', schoolIDs[1]);
      assert.equal(highlighted, 'true');
    });

    it('should highlight corresponding Graduation Rate meter in Graduation & Retention accordion', function*(){

      // test school #1
      yield browser
        .click('#compare_schools-edit h1 [aria-controls]')
        .click('.button-highlight_schools[data-school-id="'+schoolIDs[0]+'"]');

      yield toggleAccordion('#graduation');

      var highlighted = yield getMeterHighlightForSchool('completion-rate', schoolIDs[0]);
      assert.equal(highlighted, 'true');

      // test school #2
      yield browser
        .click('#compare_schools-edit h1 [aria-controls]')
        .click('.button-highlight_schools[data-school-id="'+schoolIDs[1]+'"]');

      yield toggleAccordion('#graduation');

      highlighted = yield getMeterHighlightForSchool('completion-rate', schoolIDs[1]);
      assert.equal(highlighted, 'true');
    });

    it('should highlight corresponding Students Who Return After Their First Year meter in Graduation & Retention accordion', function*(){

      // test school #1
      yield browser
        .click('#compare_schools-edit h1 [aria-controls]')
        .click('.button-highlight_schools[data-school-id="'+schoolIDs[0]+'"]');

      yield toggleAccordion('#graduation');

      var highlighted = yield getMeterHighlightForSchool('grad-retention', schoolIDs[0]);
      assert.equal(highlighted, 'true');

      // test school #2
      yield browser
        .click('#compare_schools-edit h1 [aria-controls]')
        .click('.button-highlight_schools[data-school-id="'+schoolIDs[1]+'"]');

      yield toggleAccordion('#graduation');

      highlighted = yield getMeterHighlightForSchool('grad-retention', schoolIDs[1]);
      assert.equal(highlighted, 'true');
    });

    it('should highlight corresponding Salary After Attending meter in Earnings After School accordion', function*(){

      // test school #1
      yield browser
        .click('#compare_schools-edit h1 [aria-controls]')
        .click('.button-highlight_schools[data-school-id="'+schoolIDs[0]+'"]');

      yield toggleAccordion('#earnings');

      var highlighted = yield getMeterHighlightForSchool('avg-salary', schoolIDs[0]);
      assert.equal(highlighted, 'true');

      // test school #2
      yield browser
        .click('#compare_schools-edit h1 [aria-controls]')
        .click('.button-highlight_schools[data-school-id="'+schoolIDs[1]+'"]');

      yield toggleAccordion('#earnings');

      highlighted = yield getMeterHighlightForSchool('avg-salary', schoolIDs[1]);
      assert.equal(highlighted, 'true');
    });

    it('should highlight corresponding Percentage Earning Above High School Grad meter in Earnings After School accordion', function*(){

      // test school #1
      yield browser
        .click('#compare_schools-edit h1 [aria-controls]')
        .click('.button-highlight_schools[data-school-id="'+schoolIDs[0]+'"]');

      yield toggleAccordion('#earnings');

      var highlighted = yield getMeterHighlightForSchool('advantage-rate', schoolIDs[0]);
      assert.equal(highlighted, 'true');

      // test school #2
      yield browser
        .click('#compare_schools-edit h1 [aria-controls]')
        .click('.button-highlight_schools[data-school-id="'+schoolIDs[1]+'"]');

      yield toggleAccordion('#earnings');

      highlighted = yield getMeterHighlightForSchool('advantage-rate', schoolIDs[1]);
      assert.equal(highlighted, 'true');
    });
  });
});
