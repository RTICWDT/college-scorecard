/* jshint esnext: true, maxlen: 120, noyield: true */
/* global browser */

var assert = require('assert');
var utils = require('./utils');

var schoolIDs = ['110635', '125170'];
var missingDataSchoolIds = ['439446', '457402'];
var schoolIDsByType = {
  'four_year': ['190150','199120'], // 4-year
  'two_year':['113634', '433174'], // 2-year
  'cert':['173416','204608'] // certificate
};

var getMeterClassForSchool = function*(meter, schoolID) {
  return browser.getAttribute(
    '.default-meters [data-school-id="'+schoolID+'"] picc-side-meter.' + meter, 'class');
};

var getKeyMetricIDsForType = function*(degree, schoolID) {
  var schoolIDs = yield browser
    .getAttribute('.default-meters .compare-container_group[data-pred-degree="'+degree+'"] [data-school-id]', 'data-school-id');

  return schoolIDs.every(function*(id) {
    return id === schoolID;
  });
};

var getMeterSchoolName = function*(schoolID) {
  return browser.getText('.default-meters [data-school-id="'+schoolID+'"] .side-meter figcaption [data-bind="name"]');
};

var getMeterHighlightForSchool = function*(meter, schoolID){
  return browser
    .waitForExist('.' +meter + ' [data-school-id="'+schoolID+'"]')
    .getAttribute('.' +meter + ' [data-school-id="'+schoolID+'"]', 'data-highlight' );
};

var visitComparePage = function*() {
   return yield browser.url('/compare');
};

var compareSchools = function*(schoolIDs) {
    schoolIDs.forEach(function*(id){
      yield selectCompareSchools(id);
    });

  yield visitComparePage();
  yield utils.getVisibleCompare();
};


var loadSchoolUrl = function*(school) {
  yield browser.url('/school/?' + school);
  return yield browser.waitForExist('.js-loaded');
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

describe('compare page ', function(){

  after(function*(){
    browser.localStorage('DELETE');
  });

  it('should have "Data not available" warnings', function*() {
    var meters = ['earnings', 'cost', 'graduation'];

    yield loadSchoolUrl(missingDataSchoolIds[0]);
    yield browser.click('.button-compare_schools');

    yield loadSchoolUrl(missingDataSchoolIds[1]);
    yield browser.click('.button-compare_schools');

    yield visitComparePage();
    yield utils.getVisibleCompare();

    schoolIDs.forEach(function*(id){
      meters.forEach(function*(mtr){
        var meterResult = yield getMeterClassForSchool(mtr, id);
        var name = yield getMeterSchoolName(id);
        assert(meterResult.indexOf('no_data') > -1, name + ' has data for ' + mtr);
      });
    });

    // unselect schools
    yield selectCompareSchools(missingDataSchoolIds[0]);
    yield selectCompareSchools(missingDataSchoolIds[1]);
  });

  it('should display key metric figures', function*() {
    var meters = ['earnings', 'cost', 'graduation'];

    yield loadSchoolUrl(schoolIDs[0]);
    yield browser.click('.button-compare_schools');

    yield loadSchoolUrl(schoolIDs[1]);
    yield browser.click('.button-compare_schools');

    yield browser.url('/compare');
    yield utils.getVisibleCompare();

    schoolIDs.forEach(function*(id){
      meters.forEach(function*(mtr){
        var meterResult = yield getMeterClassForSchool(mtr, id);
        var name = yield getMeterSchoolName(id);
        assert(meterResult.indexOf('no_data') === -1, name + ' has no data for ' + mtr);
      })
    });

    // unselect schools
    yield selectCompareSchools(schoolIDs[0]);
    yield selectCompareSchools(schoolIDs[1]);

  });

  /* compare school toggles / school selection functionality */
  it('should be navigated by dropdown link and show selected schools to compare', function*() {
    yield utils.runSearch();
    yield utils.getVisibleResults();

    var schoolOne = '.school.results-card:nth-child(1) .button-compare_schools';
    var compareOne = '.selected-school_average-cost_group:nth-child(1) figcaption [data-bind="name"]';

    var schoolTwo = '.school.results-card:nth-child(3) .button-compare_schools';
    var compareTwo = '.selected-school_average-cost_group:nth-child(2) figcaption [data-bind="name"]';

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

    // cleanup
    yield browser.url('/search');
    yield utils.getVisibleResults();
    yield browser
      .click(schoolOne);

    yield browser
      .click(schoolTwo);
  });

  it('should expand College Information section when the heading is clicked', function*() {
    yield selectCompareSchools(schoolIDs[0]);
    yield selectCompareSchools(schoolIDs[1]);
    yield browser.url('/compare');
    yield utils.getVisibleCompare();

    assert.equal(yield isAccordionExpanded('#school'), 'false');
    assert.equal(yield toggleAccordion('#school'), 'true');
  });

  it('should hide College Information section when heading is clicked and it is open', function*() {
    assert.equal(yield toggleAccordion('#school'), 'false');
    assert.equal(yield isAccordionExpanded('#school'), 'false');
  });

  it('should display race/ethnicity selection by chosen race/ethnicity', function*() {

    var options = [
      'aian',
      'asian',
      // 'asian_pacific_islander',
      'black',
      // 'black_non_hispanic',
      'hispanic',
      'nhpi',
      'non_resident_alien',
      'two_or_more',
      'unknown',
      'white',
      // 'white_non_hispanic'
    ];

    // open College Information accordion
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

    }
  });

  it('should expand Cost Accordion section when the heading is clicked', function*() {
    assert.equal(yield isAccordionExpanded('#cost'), 'false');
    assert.equal(yield toggleAccordion('#cost'), 'true');
  });

  it('should hide Cost Accordion section when heading is clicked and it is open', function*() {
    assert.equal(yield toggleAccordion('#cost'), 'false');
    assert.equal(yield isAccordionExpanded('#cost'), 'false');
  });

  it('should display By Family Income Category metrics by selected family income range', function*() {

    yield compareSchools(schoolIDs);

    var options = [
      'net_price_income1',
      'net_price_income2',
      'net_price_income3',
      'net_price_income4',
      'net_price_income5',
    ];

    yield browser
      .click('#cost h1 [aria-controls]');

    for(var i=0;i<options.length;i++) {
      yield browser
        .selectByValue('#net_price_income', options[i]).pause(500);

      // Test meter 2
      meterAttr = yield browser.getAttribute('.section-card_container-compare.net-price-income [data-school-id="'+schoolIDs[1]+'"] picc-side-meter', 'data-'+options[i]);
      meterVal = yield browser.getAttribute('.section-card_container-compare.net-price-income [data-school-id="'+schoolIDs[1]+'"] picc-side-meter', 'value');
      barVal = yield browser.getText('.section-card_container-compare.net-price-income [data-school-id="'+schoolIDs[1]+'"] .picc-side-meter-val');

      // this is necessary because for whatever reason an undefined attribute value
      // is '' for a data-<attribute> but `NaN` for the value attribute
      if (isNaN(meterAttr)) meterAttr = '';
      if (isNaN(meterVal)) meterVal = '';
      if (meterVal === '' && !barVal) barVal = '$0';

      assert.equal(meterAttr, meterVal);
      assert.equal('$'+(+meterVal).toLocaleString('en'), barVal);
    }

  });

  it('should expand Financial Aid & Debt Accordion section when the heading is clicked', function*() {
    assert.equal(yield isAccordionExpanded('#finaid'), 'false');
    assert.equal(yield toggleAccordion('#finaid'), 'true');
  });

  it('should hide Financial Aid & Debt Accordion section when heading is clicked and it is open', function*() {
    assert.equal(yield toggleAccordion('#finaid'), 'false');
    assert.equal(yield isAccordionExpanded('#finaid'), 'false');
  });

  it('should Graduation & Retention Accordion expand section when the heading is clicked', function*() {
    assert.equal(yield isAccordionExpanded('#graduation'), 'false');
    assert.equal(yield toggleAccordion('#graduation'), 'true');
  });

  it('should hide Graduation & Retention Accordion section when heading is clicked and it is open', function*() {
    assert.equal(yield toggleAccordion('#graduation'), 'false');
    assert.equal(yield isAccordionExpanded('#graduation'), 'false');
  });

  it('should expand Earnings After School Accordion section when the heading is clicked', function*() {
    assert.equal(yield isAccordionExpanded('#earnings'), 'false');
    assert.equal(yield toggleAccordion('#earnings'), 'true');
  });

  it('should hide Earnings After School Accordion section when heading is clicked and it is open', function*() {
    assert.equal(yield toggleAccordion('#earnings'), 'false');
    assert.equal(yield isAccordionExpanded('#earnings'), 'false');
  });


  it('should add [aria-pressed="true"] to the selected school highlight button', function*(){
    var highlighted = yield browser
      .click('#compare_schools-edit h1 [aria-controls]')
      .click('.button-highlight_schools[data-school-id="'+schoolIDs[0]+'"]') // first click - on
      .waitForExist('.button-highlight_schools[data-school-id="'+schoolIDs[0]+'"][aria-pressed="true"]') // space out subsequent clicks
      .getAttribute('.button-highlight_schools[data-school-id="'+schoolIDs[0]+'"]', 'aria-pressed');
    assert.equal(highlighted, 'true');
  });

  it('should toggle back to [aria-pressed="false"] on the subsequent click on the selected school highlight button', function*(){
    // compare and highlight dropdown still open
    var highlighted = yield browser
      .click('.button-highlight_schools[data-school-id="'+schoolIDs[0]+'"]') // second click - off
      .getAttribute('.button-highlight_schools[data-school-id="'+schoolIDs[0]+'"]', 'aria-pressed');
    assert.equal(highlighted, 'false');
  });

  it('should toggle a previously highlighted school selection off when a different school is selected', function*(){
    // compare and highlight dropdown still open
    var highlighted = yield browser
      .click('.button-highlight_schools[data-school-id="'+schoolIDs[0]+'"]') // first school click - on
      .waitForExist('.button-highlight_schools[data-school-id="'+schoolIDs[0]+'"][aria-pressed="true"]') // space out subsequent clicks
      .click('.button-highlight_schools[data-school-id="'+schoolIDs[1]+'"]') // second school click - on
      .getAttribute('.button-highlight_schools[data-school-id="'+schoolIDs[0]+'"]', 'aria-pressed');
    assert.equal(highlighted, 'false');
  });

  it('should highlight corresponding selected school in the Average Cost main meter', function*(){
    // test school #1
    // compare and highlight dropdown still open
    yield browser
      .click('.button-highlight_schools[data-school-id="'+schoolIDs[0]+'"]');

    var highlighted = yield getMeterHighlightForSchool('average-cost', schoolIDs[0]);
    assert.equal(highlighted[0], 'true');

  });

  it('should highlight corresponding selected school in the Grad Rate main meter', function*(){

    // test school #2
    // compare and highlight dropdown still open
    yield browser
      .click('.button-highlight_schools[data-school-id="'+schoolIDs[1]+'"]');

    var highlighted = yield getMeterHighlightForSchool('grad-rate', schoolIDs[1]);
    assert.equal(highlighted[0], 'true');
  });

  it('should highlight corresponding selected school in the Salary Earnings main meter', function*(){
    // test school #1
    // compare and highlight dropdown still open
    yield browser
      .click('.button-highlight_schools[data-school-id="'+schoolIDs[0]+'"]');

    var highlighted = yield getMeterHighlightForSchool('average-salary', schoolIDs[0]);
    assert.equal(highlighted[0], 'true');
  });

  it('should highlight corresponding selected school in the Full Time percent meter in College Information accordion', function*(){
    // test school #2
    // compare and highlight dropdown still open
    yield browser
      .click('.button-highlight_schools[data-school-id="'+schoolIDs[1]+'"]');

    yield toggleAccordion('#school');

    var highlighted = yield getMeterHighlightForSchool('school-summary', schoolIDs[1]);
    assert.equal(highlighted, 'true');
  });

  it('should highlight corresponding selected school in the Socio-Economic Diversity meter in College Information accordion', function*(){
    // test school #1
    yield browser
      .click('#compare_schools-edit h1 [aria-controls]')
      .click('.button-highlight_schools[data-school-id="'+schoolIDs[0]+'"]');

    yield toggleAccordion('#school');

    var highlighted = yield getMeterHighlightForSchool('school-diversity', schoolIDs[0]);
    assert.equal(highlighted, 'true');
  });

  it('should highlight corresponding selected school in the Race/Ethnicity meter in College Information accordion', function*(){
    // test school #2
    yield browser
      .click('#compare_schools-edit h1 [aria-controls]')
      .click('.button-highlight_schools[data-school-id="'+schoolIDs[1]+'"]');

    yield toggleAccordion('#school');

    var highlighted = yield getMeterHighlightForSchool('race-ethnicity', schoolIDs[1]);
    assert.equal(highlighted, 'true');
  });

  it('should highlight corresponding selected school in the Average Cost meter in Costs accordion', function*(){
    // test school #1
    yield browser
      .click('#compare_schools-edit h1 [aria-controls]')
      .click('.button-highlight_schools[data-school-id="'+schoolIDs[0]+'"]');

    yield toggleAccordion('#cost');

    var highlighted = yield getMeterHighlightForSchool('avg-cost', schoolIDs[0]);
    assert.equal(highlighted, 'true');
  });

  it('should highlight corresponding selected school in the By Family Income cost meter in Costs accordion', function*(){
    // test school #2
    yield browser
      .click('#compare_schools-edit h1 [aria-controls]')
      .click('.button-highlight_schools[data-school-id="'+schoolIDs[1]+'"]');

    yield toggleAccordion('#cost');

    var highlighted = yield getMeterHighlightForSchool('net-price-income', schoolIDs[1]);
    assert.equal(highlighted, 'true');
  });

  it('should highlight corresponding selected school in the Students Paying Down Their Debt meter in Financial Aid & Debt accordion', function*(){

    // test school #1
    yield browser
      .click('#compare_schools-edit h1 [aria-controls]')
      .click('.button-highlight_schools[data-school-id="'+schoolIDs[0]+'"]');

    yield toggleAccordion('#finaid');

    var highlighted = yield getMeterHighlightForSchool('repayment-rate', schoolIDs[0]);
    assert.equal(highlighted, 'true');
  });

  it('should highlight corresponding selected school in the Total Typical Debt meter in Financial Aid & Debt accordion', function*(){
    // test school #2
    yield browser
      .click('#compare_schools-edit h1 [aria-controls]')
      .click('.button-highlight_schools[data-school-id="'+schoolIDs[1]+'"]');

    yield toggleAccordion('#finaid');

    var highlighted = yield getMeterHighlightForSchool('avg-debt', schoolIDs[1]);
    assert.equal(highlighted, 'true');
  });

  it('should highlight corresponding selected school in the Students Receiving Federal Loans meter in Financial Aid & Debt accordion', function*(){
    // test school #1
    yield browser
      .click('#compare_schools-edit h1 [aria-controls]')
      .click('.button-highlight_schools[data-school-id="'+schoolIDs[0]+'"]');

    yield toggleAccordion('#finaid');

    var highlighted = yield getMeterHighlightForSchool('student-aid', schoolIDs[0]);
    assert.equal(highlighted, 'true');
  });

  it('should highlight corresponding selected school in the Typical Monthly Loan Payment meter in Financial Aid & Debt accordion', function*(){
    // test school #2
    yield browser
      .click('#compare_schools-edit h1 [aria-controls]')
      .click('.button-highlight_schools[data-school-id="'+schoolIDs[1]+'"]');

    yield toggleAccordion('#finaid');

    var highlighted = yield getMeterHighlightForSchool('avg-loan-payment', schoolIDs[1]);
    assert.equal(highlighted, 'true');
  });

  it('should highlight corresponding selected school in the Graduation Rate meter in Graduation & Retention accordion', function*(){
    // test school #1
    yield browser
      .click('#compare_schools-edit h1 [aria-controls]')
      .click('.button-highlight_schools[data-school-id="'+schoolIDs[0]+'"]');

    yield toggleAccordion('#graduation');

    var highlighted = yield getMeterHighlightForSchool('completion-rate', schoolIDs[0]);
    assert.equal(highlighted, 'true');
  });

  it('should highlight corresponding selected school in the Students Who Return After Their First Year meter in Graduation & Retention accordion', function*(){
    // test school #2
    yield browser
      .click('#compare_schools-edit h1 [aria-controls]')
      .click('.button-highlight_schools[data-school-id="'+schoolIDs[1]+'"]');

    yield toggleAccordion('#graduation');

    var highlighted = yield getMeterHighlightForSchool('grad-retention', schoolIDs[1]);
    assert.equal(highlighted, 'true');
  });

  it('should highlight corresponding selected school in the Salary After Attending meter in Earnings After School accordion', function*(){
    // test school #1
    yield browser
      .click('#compare_schools-edit h1 [aria-controls]')
      .click('.button-highlight_schools[data-school-id="'+schoolIDs[0]+'"]');

    yield toggleAccordion('#earnings');

    var highlighted = yield getMeterHighlightForSchool('avg-salary', schoolIDs[0]);
    assert.equal(highlighted, 'true');

    //cleanup
    yield selectCompareSchools(schoolIDs[0]);
    yield selectCompareSchools(schoolIDs[1]);
  });

  xit('should highlight corresponding selected school in the Percentage Earning Above High School Grad meter in Earnings After School accordion', function*(){
    yield browser
      .click('#compare_schools-edit h1 [aria-controls]');

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

    //cleanup
    // yield browser.click('#compare_schools-edit h1 [aria-controls]');
    yield selectCompareSchools(schoolIDs[0]);
    yield selectCompareSchools(schoolIDs[1]);
  });

  it('should group schools based on predominant degree', function*(){

    yield selectCompareSchools(schoolIDsByType['four_year'][0]);
    yield selectCompareSchools(schoolIDsByType['two_year'][0]);
    yield selectCompareSchools(schoolIDsByType['cert'][0]);

    yield visitComparePage();
    yield utils.getVisibleCompare();

    var degrees = Object.keys(schoolIDsByType);

    // checks each school is in the group specified by predominant degree
    for(var i = 1; i <= degrees.length; i++) {
      var type;
      switch(i) {
        case 1:
          type = 'cert';
          break;
        case 2:
          type = 'two_year';
          break;
        case 3:
          type = 'four_year';
          break;
      }
      var isSchoolInSection = yield getKeyMetricIDsForType(i, schoolIDsByType[type][0]);
      assert.equal(isSchoolInSection, true);
    }

    //cleanup
    yield selectCompareSchools(schoolIDsByType['four_year'][0]);
    yield selectCompareSchools(schoolIDsByType['two_year'][0]);
    yield selectCompareSchools(schoolIDsByType['cert'][0]);
  });

  it('should hide the 4-year predominant degree group when there are no representative schools', function*(){

    yield selectCompareSchools(schoolIDsByType['two_year'][0]);
    yield selectCompareSchools(schoolIDsByType['cert'][0]);

    yield visitComparePage();
    yield utils.getVisibleCompare();

    var sections = ['.compare-container_group[data-pred-degree="3"] > [data-bind="compare_group"]'];

    yield browser.selectorExecute(sections, function(groups){
      return groups.every(function*(g) {
          return g.getAttribute('aria-hidden');
      });
    }).then(function(allHidden) {
      assert.equal(allHidden, true, '4-year predominant degree group was not hidden.');
    });

    //cleanup
    yield selectCompareSchools(schoolIDsByType['two_year'][0]);
    yield selectCompareSchools(schoolIDsByType['cert'][0]);

  });

  it('should hide the 2-year predominant degree group when there are no representative schools', function*(){

    yield selectCompareSchools(schoolIDsByType['four_year'][0]);
    yield selectCompareSchools(schoolIDsByType['cert'][0]);

    yield visitComparePage();
    yield utils.getVisibleCompare();

    var sections = ['.compare-container_group[data-pred-degree="2"] > [data-bind="compare_group"]'];

    yield browser.selectorExecute(sections, function(groups){
      return groups.every(function*(g) {
        return g.getAttribute('aria-hidden');
      });
    }).then(function(allHidden) {
      assert.equal(allHidden, true, '2-year predominant degree group was not hidden.');
    });

    //cleanup
    yield selectCompareSchools(schoolIDsByType['four_year'][0]);
    yield selectCompareSchools(schoolIDsByType['cert'][0]);

  });

  it('should hide the certificate predominant degree group when there are no representative schools', function*(){

    yield selectCompareSchools(schoolIDsByType['four_year'][0]);
    yield selectCompareSchools(schoolIDsByType['two_year'][0]);

    yield visitComparePage();
    yield utils.getVisibleCompare();

    var sections = ['.compare-container_group[data-pred-degree="1"] > [data-bind="compare_group"]'];

    yield browser.selectorExecute(sections, function(groups){
      return groups.every(function*(g) {
        return g.getAttribute('aria-hidden');
      });
    }).then(function(allHidden) {
      assert.equal(allHidden, true, 'certificate predominant degree group was not hidden.');
    });

    //cleanup
    yield selectCompareSchools(schoolIDsByType['four_year'][0]);
    yield selectCompareSchools(schoolIDsByType['two_year'][0]);

  });

  it('should only remove the degree type group when multiple representative schools are all removed', function*() {

    yield selectCompareSchools(schoolIDsByType['four_year'][0]);
    yield selectCompareSchools(schoolIDsByType['four_year'][1]);

    yield selectCompareSchools(schoolIDsByType['two_year'][0]);
    yield selectCompareSchools(schoolIDsByType['two_year'][1]);

    yield selectCompareSchools(schoolIDsByType['cert'][0]);
    yield selectCompareSchools(schoolIDsByType['cert'][1]);

    yield visitComparePage();
    yield utils.getVisibleCompare();

    // test 4-year still visible
    yield browser
      .click('#compare_schools-edit h1 [aria-controls]')
      .click('.edit-compare-list-item .checkbox[data-school-id="'+schoolIDsByType['four_year'][0]+'"]').pause(250); // removes only one 4yr

    var sections = ['.compare-container_group[data-pred-degree="3"] > [data-bind="compare_group"]'];

    yield browser.selectorExecute(sections, function(groups) {
      return groups.every(function*(g) {
        return g.getAttribute('aria-hidden') === false;
      });
    }).then(function(allVisible) {
      assert.equal(allVisible, true, '4-year predominant degree group was not visible.');
    });

    // test 4-year now hidden
    yield browser
      .click('.edit-compare-list-item .checkbox[data-school-id="'+schoolIDsByType['four_year'][1]+'"]').pause(250); // removes the other 4yr

    sections = ['.compare-container_group[data-pred-degree="3"] > [data-bind="compare_group"]'];

    yield browser.selectorExecute(sections, function(groups) {
      return groups.every(function*(g) {
        return g.getAttribute('aria-hidden');
      });
    }).then(function(allHidden) {
      assert.equal(allHidden, true, '4-year predominant degree group was not hidden.');
    });

    // test 2-year still visible
    yield browser
      .click('.edit-compare-list-item .checkbox[data-school-id="'+schoolIDsByType['two_year'][0]+'"]').pause(250); // removes only one 2yr

    sections = ['.compare-container_group[data-pred-degree="2"] > [data-bind="compare_group"]'];

    yield browser.selectorExecute(sections, function(groups) {
      return groups.every(function*(g) {
        return g.getAttribute('aria-hidden') === false;
      });
    }).then(function(allVisible) {
      assert.equal(allVisible, true, '2-year predominant degree group was not visible.');
    });

    // test 2-year now hidden
    yield browser
      .click('.edit-compare-list-item .checkbox[data-school-id="'+schoolIDsByType['two_year'][1]+'"]').pause(250); // removes the other 2yr

    sections = ['.compare-container_group[data-pred-degree="2"] > [data-bind="compare_group"]'];

    yield browser.selectorExecute(sections, function(groups) {
      return groups.every(function*(g) {
        return g.getAttribute('aria-hidden');
      });
    }).then(function(allHidden) {
      assert.equal(allHidden, true, '2-year predominant degree group was not hidden.');
    });

    // test cert group still visible
    yield browser
      .click('.edit-compare-list-item .checkbox[data-school-id="'+schoolIDsByType['cert'][0]+'"]').pause(250); // removes only one cert

    sections = ['.compare-container_group[data-pred-degree="1"] > [data-bind="compare_group"]'];

    yield browser.selectorExecute(sections, function(groups) {
      return groups.every(function*(g) {
        return g.getAttribute('aria-hidden') === false;
      });
    }).then(function(allVisible) {
      assert.equal(allVisible, true, 'Certificate predominant degree group was not visible.');
    });

    // test cert group now hidden
    yield browser
      .click('.edit-compare-list-item .checkbox[data-school-id="'+schoolIDsByType['cert'][1]+'"]').pause(250); // hides the other cert

    sections = ['.compare-container_group[data-pred-degree="1"] > [data-bind="compare_group"]'];

    yield browser.selectorExecute(sections, function(groups) {
      return groups.every(function*(g) {
        return g.getAttribute('aria-hidden');
      });
    }).then(function(allHidden) {
      assert.equal(allHidden, true, 'Certificate predominant degree group was not hidden.');
    });

  });
  
});
