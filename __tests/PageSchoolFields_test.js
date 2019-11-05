const assert = require('assert');
const BASE_URL = "/school/fields/?130794-Yale-University";

Feature('Page Test: School Fields. Indepth testing of school fields page');

// Page loads without console errors
Scenario('Page renders without console errors', async (I) => {
  I.amOnPage(BASE_URL);

  let logs = await I.grabBrowserLogs();

  let errors = logs.filter((obj) => {
    return obj._type === 'error';
  });

  assert.equal(errors.length, 0);
});

// See all major page components
Scenario('Visit page and see all page components', async (I) => {
  I.amOnPage(BASE_URL);

  I.seeElement('#school-field-fos-degree');
  // Click Degree level
  I.click('#school-field-fos-degree');
  // See Options within degree filter
  I.seeElement('.v-list.v-sheet.v-sheet--tile');
  I.seeElement('.v-list-item.v-list-item--link');
  // Close Select Menu
  I.pressKey("Escape");

  // Expansion Panels (Degrees)
  I.seeElement('.v-expansion-panel');
});

// Click select and filter
Scenario('Test Filter Degree Level', async (I) => {
  I.amOnPage(BASE_URL);

  I.click('#school-field-fos-degree');
  I.click(locate('.v-list-item__title').withText("Bachelor's Degree"));
  // I.click(locate('.v-list-item__title').withText("Bachelor's Degree"));
  // I.wait(10);

  // Test all filtered degree items to ensure that all items are correctly filtered
  let allDegreeAppendMatch = await I.executeScript(() =>{
    // Fetch all items
    let allDegreeHeaders = Array.from(document.querySelectorAll('.school-fields-fos-degree-title'));

    // Filter match strings
    let matchedDegreeHeaders = allDegreeHeaders.filter((value) => {
      let checkAppendStringRegex = RegExp(/\bBachelor's Degree\b/);
      return value.innerHTML.match(checkAppendStringRegex);
    });

    if(matchedDegreeHeaders.length === allDegreeHeaders.length){
      return true;
    }else{
      return false;
    }
  });
  // All displayed FOS degree data matches expected pattern
  assert.equal(allDegreeAppendMatch,true);
});

// Test Compare
Scenario('Visit page and test compare functionality', (I) => {
  I.amOnPage(BASE_URL);

  I.click(locate('.school-heading button').withText('Compare'));
  I.wait(1);
  I.seeElement('#compare-header');
  I.click('#compare-header');
  I.seeElement('#compare_schools-content');
  I.seeElement(locate('#compare_schools-content label').withText('Yale University'));
});