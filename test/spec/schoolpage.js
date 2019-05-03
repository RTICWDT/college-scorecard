/* jshint esnext: true, maxlen: 120, noyield: true */
/* global browser */

var assert = require('assert');

var loadSchoolUrl = function(school) {
  return browser
    .url('/school/?' + school)
    .waitForVisible('.show-loading', null, true);
};

var getBanners = function() {
  return browser.getText(
    '.school-heading .school-special_designation li.special');
};

var getSchoolName = function() {
  return browser.getText('.school-heading h1');
};

var getIcon = function() {
  return browser.getAttribute(
    '.school-heading .school-key_figures li', 'class');
};

var toggleSchoolCompare = function*(url, selector, clicks) {
    yield loadSchoolUrl(url);

    for (var i = 0; i < clicks; i++) {
       yield browser.click(selector);

    }
    return browser.getAttribute(selector, 'aria-pressed');
};

var getMeterClass = function(meter) {
  return browser.getAttribute(
    '.school-meters picc-meter.' + meter, 'class');
};

var checkBanner = function*(urls, banner) {
  urls.forEach(function*(url) {
    yield loadSchoolUrl(url);
    var banners = yield getBanners();
    var name = yield getSchoolName();
    var found = banners.indexOf(banner) >= 0;
    assert(found, name + ' did not contain the ' + banner + ' banner.');
  });
};

var checkIcon = function*(urls, icon) {
  urls.forEach(function*(url) {
    yield loadSchoolUrl(url);
    var icons = yield getIcon();
    var name = yield getSchoolName();
    var found = icons.indexOf(icon) >= 0;
    assert(found, name + ' did not contain the ' + icon + ' icon.');
  });
};

var checkProgramLength = function*(urls, programLength) {
  var selector = '.school-heading .school-key_figures li span.school-key_figures-year';
  urls.forEach(function*(url) {
    yield loadSchoolUrl(url);
    var len = yield browser.getText(selector);
    assert.equal(programLength, len);
  });
};

var isAccordionExpanded = function(selector) {
  return browser.getAttribute(selector, 'aria-expanded');
};

var toggleAccordion = function(selector) {
  return browser
    .click(selector + ' h1 [aria-controls]')
    .getAttribute(selector, 'aria-expanded');
};

describe('school page', function() {
  /*
    Banners & Iconography
  */

  it('should contain the private icon if it is private school', function*() {
    yield checkIcon(['196431-Talmudical-Seminary-Oholei-Torah',
                     '104665-Frank-Lloyd-Wright-School-of-Architecture'],
                    'icon-private');
  });

  it('should have for profit icon if it is a for profit school', function*() {
    yield checkIcon(['449339-American-Public-University-System'],
                    'icon-profit');
  });

  it('should have public icon if it is a for public school', function*() {
    yield checkIcon(
      ['416801-The-University-of-Texas-MD-Anderson-Cancer-Center'],
      'icon-public');
  });

  it('should have four-year icon if it has a four year program', function*() {
    yield checkProgramLength(
      ['416801-The-University-of-Texas-MD-Anderson-Cancer-Center',
       '449339-American-Public-University-System',
       '104665-Frank-Lloyd-Wright-School-of-Architecture'],
      4);
  });

  it('should have two-year icon if it has a two year program', function*() {
    yield checkProgramLength(['167525-Quincy-College',
                              '192961-Memorial-School-of-Nursing'],
                             2);
  });

  it('should contain the black school banner if school qualifies', function*() {
    yield checkBanner(['101587-University-of-West-Alabama'],
                      'Predominantly Black Institution');
  });

  it('should contain the tribal banner if the school qualifies', function*() {
    yield checkBanner(['434016-Little-Priest-Tribal-College',
                       '180160-Chief-Dull-Knife-College'],
                      'Tribal College and University');
  });

  it('should contain the men only banner if the school qualifies', function*() {
    yield checkBanner(['196431-Talmudical-Seminary-Oholei-Torah'],
                      'Men-Only');
  });

  it('should contain the women only banner if school qualifies', function*() {
    yield checkBanner(['206349-Ursuline-College'],
                      'Women-Only');
  });

  it('should contain the asian american banner if it qualifies', function*() {
    yield checkBanner(
      ['240736-American-Samoa-Community-College',
       '110617-California-State-University-Sacramento'],
     'Asian American and Native American Pacific Islander-Serving Institution');
  });

  it('should contain the "investigation" banner if it needs it', function*() {
    var urls = ['481252-Ultrasound-Medical-Institute',
                '446163-Community-Christian-College',
                '443049-Faith-Evangelical-College-Seminary',
                '139287-Carver-Bible-College',
                '434016-Little-Priest-Tribal-College'];
    var selector = '.school-heading div.investigation-major-wrapper';
    urls.forEach(function*(url) {
      yield loadSchoolUrl(url);
      var value = yield browser.getAttribute(selector, 'aria-hidden');
      assert.equal(value, false);
    });
  });

  it('should display the religious affiliation if specified', function*() {
    yield checkBanner(['219639-Baptist-Memorial-College-of-Health-Sciences'],
                      'Baptist');
  });

  it('should contain the city icon if it is an urban school', function*() {
    yield checkIcon(
      ['192961-Memorial-School-of-Nursing',
       '416801-The-University-of-Texas-MD-Anderson-Cancer-Center'],
      'icon-city');
  });

  it('should contain the town icon if it is an small city school', function*() {
    yield checkIcon(['449339-American-Public-University-System'],
                    'icon-town');
  });

  it('should contain the suburban icon if it is suburban school', function*() {
    yield checkIcon(['206349-Ursuline-College',
                     '167525-Quincy-College'],
                    'icon-suburban');
  });

  it('should contain the rural icon if it is a rural school', function*() {
    yield checkIcon(['101587-University-of-West-Alabama',
                     '104665-Frank-Lloyd-Wright-School-of-Architecture'],
                    'icon-rural');
  });

  it('should contain the small icon if it is a small school', function*() {
    yield checkIcon(
      ['192961-Memorial-School-of-Nursing',
       '416801-The-University-of-Texas-MD-Anderson-Cancer-Center'],
      'icon-small');
  });

  it('should contain the medium icon if it is a medium school', function*() {
    yield checkIcon(['167525-Quincy-College'],
                    'icon-medium');
  });

  it('should contain the large icon if it is a large school', function*() {
    yield checkIcon(['449339-American-Public-University-System'],
                    'icon-large');
  });

  /*
    Key Metrics
   */

  it('should have "Data not available" warnings for key metrics', function*() {
     var urls = ['416801-The-University-of-Texas-MD-Anderson-Cancer-Center',
         '104665-Frank-Lloyd-Wright-School-of-Architecture'];
     var meters = ['earnings', 'cost', 'graduation'];
     urls.forEach(function*(url) {
         yield loadSchoolUrl(url);
         meters.forEach(function*(meter) {
             var meterResult = yield getMeterClass(meter);
             var name = yield getSchoolName();
             assert(meterResult.indexOf('no_data') > -1,
                 name + ' has data for ' + meter);
         });
     });
  });

  it('should display key metric figures if data is present', function*() {
     var urls = ['204176-Mount-Carmel-College-of-Nursing',
                     '204635-Ohio-Northern-University'];
     var meters = ['earnings', 'cost', 'graduation'];

     urls.forEach(function*(url) {
       yield loadSchoolUrl(url);
       meters.forEach(function*(meter) {
          var meterResult = yield getMeterClass(meter);
          var name = yield getSchoolName();
            assert(meterResult.indexOf('no_data') === -1, name + ' has no data for ' + meter);
         });
  
      });
  });

  /*
    Compare School
   */

  it('should add aria-pressed attribute on school compare button when clicked', function*() {
      var isFavorite = yield toggleSchoolCompare('167525-Quincy-College', '.button-compare_schools', 1);
      var name = yield getSchoolName();
      assert(isFavorite, name + ' was added as a compare school' );

      // cleanup
      yield toggleSchoolCompare('167525-Quincy-College', '.button-compare_schools', 1);
  });

    it('should remove aria-pressed attribute on school compare button on subsequent click', function*() {
        var isFavorite = yield toggleSchoolCompare('449339-American-Public-University-System', '.button-compare_schools', 2);
        var name = yield getSchoolName();
        assert( isFavorite, false, name + ' was removed as a compare school' );
    });

  /*
    Cost Section
  */

  it('should expand Costs section when the heading is clicked', function*() {
    yield loadSchoolUrl('204635-Ohio-Northern-University');
    assert.equal(yield isAccordionExpanded('#cost'), 'false');
    assert.equal(yield toggleAccordion('#cost'), 'true');
  });

  it('should hide Costs when heading is clicked and it is open', function*() {
    yield loadSchoolUrl('204635-Ohio-Northern-University');
    assert.equal(yield toggleAccordion('#cost'), 'true');
    assert.equal(yield isAccordionExpanded('#cost'), 'true');
    assert.equal(yield toggleAccordion('#cost'), 'false');
  });

  it('should show Cost of Largest Programs for Program Reporter schools', function*() {
    yield loadSchoolUrl('452948-Galen-College-of-Nursing-Cincinnati');
    yield toggleAccordion('#cost');
    var isHidden = yield browser
      .getAttribute('#costs-content [data-bind="program_reporter_hidden"]', 'aria-hidden');
    assert(isHidden, 'Average Annual Cost was not hidden on program reporter school page');
    var isShown = yield browser
      .getAttribute('#costs-content [data-bind="program_reporter_shown"]', 'aria-hidden');
    assert(isShown, 'Cost of Largest Programs was not shown on a program reporter school page');
  });

  it('should hide Cost of Largest Programs for non-program reporter schools', function*() {
    yield loadSchoolUrl('204635-Ohio-Northern-University');
    yield toggleAccordion('#cost')
    var isHidden = yield browser
      .getAttribute('#costs-content [data-bind="program_reporter_shown"]', 'aria-hidden');
    assert(isHidden, 'Cost of Largest Programs was not hidden on non-program reporter school page');
    var isShown = yield browser
      .getAttribute('#costs-content [data-bind="program_reporter_hidden"]', 'aria-hidden');
    assert(isShown, 'Average Annual Cost was hidden on a non-program reporter school page');
  });

  it('should show the aria-tabs selected tab content', function*() {
    yield loadSchoolUrl('452948-Galen-College-of-Nursing-Cincinnati');
    yield toggleAccordion('#cost');
    var activeTabPanel = yield browser.getAttribute('#costs-content .tablist [aria-selected="true"]', "aria-controls");
    var isHidden = yield browser.getAttribute('#costs-content [id="'+ activeTabPanel +'"]', 'aria-hidden');
    assert(!isHidden, 'The active aria-tab should display it\'s corresponding tabpanel');
  });

  it('should hide the aria-tabs for a non-selected tab content', function*() {
    yield loadSchoolUrl('452948-Galen-College-of-Nursing-Cincinnati');
    yield toggleAccordion('#cost');
    var nonActiveTabPanel = yield browser.getAttribute('#costs-content .tablist [aria-selected="false"]', "aria-controls");
    var isHidden = yield browser.getAttribute('#costs-content [id="'+ nonActiveTabPanel +'"]', 'aria-hidden');
    assert(isHidden, 'The non-active aria-tab should not display it\'s corresponding tabpanel');
  });

  it('should toggle the aria-tabs on click of non-selected tab', function*() {
    yield loadSchoolUrl('452948-Galen-College-of-Nursing-Cincinnati');
    yield toggleAccordion('#cost');
    var selector = '#costs-content .tablist [aria-selected="false"]';
    var selector2 = '#costs-content .tablist [aria-selected="true"]';
    var nonActiveTab = yield browser.element(selector);
    var nonActiveTabPanel = yield browser.getAttribute(selector, 'aria-controls');
    yield browser.click(selector);
    var isHidden = yield browser.getAttribute('#costs-content [id="'+ nonActiveTabPanel +'"]', 'aria-hidden');
    assert(!isHidden, 'The active aria-tab did not display it\'s corresponding tabpanel');
    yield browser.click(selector);
    isHidden = yield browser.getAttribute('#costs-content [id="'+ nonActiveTabPanel +'"]', 'aria-hidden');
    assert(isHidden, 'The de-selected aria-tab did not hide it\'s corresponding tabpanel');
    var activeTabPanel = yield browser.getAttribute(selector2, 'aria-controls');
    isHidden = yield browser.getAttribute('#costs-content [id="'+ activeTabPanel +'"]', 'aria-hidden');
    assert(!isHidden, 'The active aria-tab did not display it\'s corresponding tabpanel');
  });

  /* 
    Financial Aid & Debt Section
  */
 
  it('should expand Financial Aid & Debt when heading is clicked', function*() {
    yield loadSchoolUrl('204635-Ohio-Northern-University');
    assert.equal(yield isAccordionExpanded('#finaid'), 'false');
    assert.equal(yield toggleAccordion('#finaid'), 'true');
  });

  it('should hide Financial Aid when the it is clicked and open', function*() {
    yield loadSchoolUrl('204635-Ohio-Northern-University');
    assert.equal(yield toggleAccordion('#finaid'), 'true');
    assert.equal(yield isAccordionExpanded('#finaid'), 'true');
    assert.equal(yield toggleAccordion('#finaid'), 'false');
  });

  xit('should redirect to FAFSA app if "Start My App" clicked', function*() {
    yield loadSchoolUrl('204635-Ohio-Northern-University');
    yield toggleAccordion('#finaid');
    yield browser.click('#finaid div.school-callout a').pause(500);
    var tabs = yield browser.getTabIds();
    assert.equal(tabs.length, 2);
    var url = yield browser.switchTab(tabs[1]).getUrl();
    assert.equal(url, 'https://fafsa.ed.gov/spa/fafsa');
    // cleanup
    yield browser.switchTab(tabs[0]);
  });

  /*
    Graduation & Retention
  */

  it('should expand Graduation when the heading is clicked', function*() {
    yield loadSchoolUrl('204635-Ohio-Northern-University');
    assert.equal(yield isAccordionExpanded('#graduation'), 'false');
    assert.equal(yield toggleAccordion('#graduation'), 'true');
  });

  it('should hide Graduation when it is clicked and open', function*() {
    yield loadSchoolUrl('204635-Ohio-Northern-University');
    assert.equal(yield toggleAccordion('#graduation'), 'true');
    assert.equal(yield isAccordionExpanded('#graduation'), 'true');
    assert.equal(yield toggleAccordion('#graduation'), 'false');
  });

  xit('should show Retention Rate data for certain schools', function*() {
  });

  xit('should show Retention Rate as "No Data Available" for schools without it', function*() {
  });

  it('should show <4-year retention rate if 4-year rate is unavailable', function*() {
    yield loadSchoolUrl('452948-Galen-College-of-Nursing-Cincinnati');
    assert.equal(yield toggleAccordion('#graduation'), 'true');

    var meterClass = yield browser.getAttribute('#retention-meter', 'class');
    // console.log('meter class:', meterClass);
    assert.equal(meterClass.indexOf('no_data'), -1);
  });

  /*
    Earnings After School Section
  */

  it('should expand Earnings After School when it is clicked', function*() {
    yield loadSchoolUrl('204635-Ohio-Northern-University');
    assert.equal(yield isAccordionExpanded('#earnings'), 'false');
    assert.equal(yield toggleAccordion('#earnings'), 'true');
  });

  it('should hide Earnings when it is clicked and open', function*() {
    yield loadSchoolUrl('204635-Ohio-Northern-University');
    assert.equal(yield toggleAccordion('#earnings'), 'true');
    assert.equal(yield isAccordionExpanded('#earnings'), 'true');
    assert.equal(yield toggleAccordion('#earnings'), 'false');
  });

  /*
   Student Body Section 
  */

  it('should expand Student Body section when it is clicked', function*() {
    yield loadSchoolUrl('204635-Ohio-Northern-University');
    assert.equal(yield isAccordionExpanded('#demographics'), 'false');
    assert.equal(yield toggleAccordion('#demographics'), 'true');
  });

  it('should hide Student Body when it is clicked and open', function*() {
    yield loadSchoolUrl('204635-Ohio-Northern-University');
    assert.equal(yield toggleAccordion('#demographics'), 'true');
    assert.equal(yield isAccordionExpanded('#demographics'), 'true');
    assert.equal(yield toggleAccordion('#demographics'), 'false');
  });

  /* 
    SAT/ACT Section
  */

  it('should expand SAT/ACT section when the heading is clicked', function*() {
    yield loadSchoolUrl('204635-Ohio-Northern-University');
    assert.equal(yield isAccordionExpanded('#selectivity'), 'false');
    assert.equal(yield toggleAccordion('#selectivity'), 'true');
  });

  it('should hide SAT/ACT when it is clicked and open', function*() {
    yield loadSchoolUrl('204635-Ohio-Northern-University');
    assert.equal(yield toggleAccordion('#selectivity'), 'true');
    assert.equal(yield isAccordionExpanded('#selectivity'), 'true');
    assert.equal(yield toggleAccordion('#selectivity'), 'false');
  });

  it('should have "Data missing" messages for SAT, if missing', function*() {
    var urls = ['416801-The-University-of-Texas-MD-Anderson-Cancer-Center',
                '104665-Frank-Lloyd-Wright-School-of-Architecture'];
    urls.forEach(function*(url) {
      yield loadSchoolUrl(url);
      yield toggleAccordion('#selectivity');
      var vals = yield browser
        .getAttribute('#selectivity-content figure+p.no-data', 'aria-hidden');
      var name = yield getSchoolName();
      var allFalse = vals.every(function(value) { return value === ''; });
      assert(allFalse, 'SAT/ACT Data figures are visible for ' + name);
    });
  });

  it('should display SAT/ACT figures, if the data is present', function*() {
    var urls = ['204635-Ohio-Northern-University',
                '206349-Ursuline-College'];
    urls.forEach(function*(url) {
      yield loadSchoolUrl(url);
      yield toggleAccordion('#selectivity');
      var vals = yield browser
        .getAttribute('#selectivity-content figure', 'aria-hidden');
      var name = yield getSchoolName();
      var allFalse = vals.every(function(value) { return value === ''; });
      assert(allFalse, 'SAT/ACT figures are not visible for ' + name);
    });
  });

  /*
   Academic Programs Section 
  */

  it('should expand Academic Programs when it is clicked', function*() {
    yield loadSchoolUrl('204635-Ohio-Northern-University');
    assert.equal(yield isAccordionExpanded('#academics'), 'false');
    assert.equal(yield toggleAccordion('#academics'), 'true');
  });

  it('should hide Academic Programs when it is clicked and open', function*() {
    yield loadSchoolUrl('204635-Ohio-Northern-University');
    assert.equal(yield toggleAccordion('#academics'), 'true');
    assert.equal(yield isAccordionExpanded('#academics'), 'true');
    assert.equal(yield toggleAccordion('#academics'), 'false');
  });

  // This is MUCH uglier than I like, but I wasn't able to find a cleaner way
  //  of determining if an element is actually visible, given that it is part
  //  of a element with overview:scroll.
  it('the last program in a scrolling section should be visible', function*() {
    yield loadSchoolUrl('201645-Case-Western-Reserve-University');
    assert.equal(yield toggleAccordion('#academics'), 'true');

    var lastProgramPreScroll = yield browser
      .getLocation('#academics ul.school-long_list li:last-of-type span');

    yield browser
      .execute(function() {
        var element = document.getElementsByClassName('school-long_list')[0];
        element.scrollTop += element.scrollHeight;
      })
      .pause(5000);

    var lastProgramPostScroll = yield browser
      .getLocation('#academics ul.school-long_list li:last-of-type span');
    var listSize = yield browser
      .getElementSize('#academics ul.school-long_list');
    var listLocation = yield browser
      .getLocation('#academics ul.school-long_list');
    var listBound = listLocation.y + listSize.height;

    assert(lastProgramPreScroll.y > listBound,
           'Last element was in view before scroll.');
    assert(lastProgramPostScroll.y < listBound,
           'Last element was not in view after scroll.');
  });

  it('lists percentages among popular programs', function*() {
    yield loadSchoolUrl('110583-California-State-University-Long-Beach');
    assert.equal(yield toggleAccordion('#academics'), 'true');
    var text = yield browser
      .getText('#academics [data-bind=popular_programs]');
    assert(text.match(/\bBusiness, Management, Marketing, and Related Support Services \(\d+%\)/), // jshint ignore:line
           'no "Business Management" percentage found in: ' + text);
  });

  it('shows "Education" among the list of offered programs', function*() {
    yield loadSchoolUrl('110583-California-State-University-Long-Beach');
    assert.equal(yield toggleAccordion('#academics'), 'true');
    var html = yield browser
      .getHTML('#academics [data-bind=available_programs]');
    assert(html.match(/\bEducation\b/),
           'no "Education" item found in program listing');
  });

  it('lists "Hispanic" among race/ethnicity values at UC Long Beach', function*() {
    yield loadSchoolUrl('110583-California-State-University-Long-Beach');
    assert.equal(yield toggleAccordion('#demographics'), 'true');
    var text = yield browser
      .getText('#demographics .bar-hispanic .label');
    assert.equal(text, 'Hispanic');
  });

});
