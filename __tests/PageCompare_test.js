const assert = require('assert');
const BASE_URL = "/compare/";

// Used during tests
const SCHOOL_URL_ARRAY = [
  '/school/?166027-Harvard-University',
  '/school/?130794-Yale-University',
  '/school/?243744-Stanford-University'
];

Feature('Page: Comapre');

// Page loads with no console errors
Scenario('Page renders search form with no compare items, no console errors', async (I) => {
  I.amOnPage(BASE_URL);

  let errors = await I.grabAndFilterConsole('error');
  assert.equal(errors.length, 0);

  // See search form
  I.see('No schools selected to compare','h1');
});

Scenario('Add items to local storage, see chart elements, expand all, no console errors', async (I) => {
  // Add items to compare;
  I.amOnPage(BASE_URL);
  
  I.executeScript(() => {
    localStorage.setItem('compare-schools',JSON.stringify([
      {
        schoolName: "Yale University",
        schoolId: "130794"
      },{
        schoolName: "Harvard-University",
        schoolId: "166027"
      }
    ]));
  });

  // Refresh to pick up new local storage
  I.refreshPage();

  I.see("Average Annual Cost",'h2');

  // Expand all and render charts
  I.click(locate('.v-btn.v-btn--contained').withText('Expand All'));

  // See no errors
  let errors = await I.grabAndFilterConsole('error');
  assert.equal(errors.length, 0);
});