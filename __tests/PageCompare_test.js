const assert = require('assert');
const BASE_URL = "/compare/";

Feature('Page: Compare');

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
  
  I.fillLocalStorage('compare-schools',[
    {
      schoolName: "Yale University",
      schoolId: "130794"
    },{
      schoolName: "Harvard-University",
      schoolId: "166027"
    }
  ]);

  // Refresh to pick up new local storage
  I.refreshPage();

  I.see("Average Annual Cost",'h2');

  // Expand all and render charts
  I.click(locate('.v-btn.v-btn--contained').withText('Expand All'));
  I.wait(2);

  // See no errors
  let errors = await I.grabAndFilterConsole('error');
  assert.equal(errors.length, 0);
});
