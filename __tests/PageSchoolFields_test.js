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
Scenario('Visit page and see all page components', (I) => {
  I.amOnPage(BASE_URL);

  I.seeElement('#school-field-fos-degree');
  I.click('#school-field-fos-degree');
  I.seeElement('.v-list.v-sheet.v-sheet--tile');

  I.wait(5);

});

// Click select and filter

// Test Compare