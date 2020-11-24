const assert = require('assert');
const BASE_URL = "/school/?130794-Yale-University";

Feature('Page: School');

// Check console for errors.
// Scenario('Page renders without console errors', async (I) => {
//   I.amOnPage(BASE_URL);

//   let logs = await I.grabBrowserLogs();

//   let errors = logs.filter((obj) => {
//     return obj._type === 'error';
//   });

//   assert.equal(errors.length, 0);
// });

// Share School
Scenario('Visit page and see all major page components.', (I) => {
  I.amOnPage(BASE_URL);

  // Title Bar with buttons exist.
  I.seeElement(locate('#school-sub-nav-header a').withText('Back to search'));
  I.seeElement(locate('#school-sub-nav-header button').withText('Compare'));
  I.seeElement(locate('#school-sub-nav-header button').withText('Share'));

  // General School Info
  I.see('Yale University','h1');
  I.seeElement('.location');
  I.seeElement('.population');
  I.seeElement('.school-url');

  // School Icons
  I.seeElement(locate('.school-key_figures li.icon-four').withText('Year'));
  I.seeElement(locate('.school-key_figures li.icon-private').withText('Private'));
  I.seeElement(locate('.school-key_figures li.icon-city').withText('City'));
  I.seeElement(locate('.school-key_figures li.icon-medium').withText('Medium'));

  //Hero Stats
  I.seeElement('#school-completion-rate-bar canvas#horizontalbar-chart');
  I.seeElement('#school-salary-after-complete .range-container .range-chart');
  I.seeElement(locate('#school-avg-cost h2').at(2));

  // Check number of expansion panels.
  I.seeNumberOfVisibleElements(".v-expansion-panel",7);
  I.click(locate('.v-expansion-panel').at('2'));
  I.seeElement('#costs-content');

  // Sidebar conent
  I.seeElement(locate('#school-name-auto-complete'));
  I.see('Learn More About Paying for College','h2');
});

//  Test Compare
Scenario('Visit page and test compare functionality', (I) => {
  I.amOnPage(BASE_URL);

  I.click(locate('#school-sub-nav-header button').withText('Compare'));
  I.wait(1);
  //I.seeElement('#compare-header');
  //I.click('#compare-header');
  I.seeElement('#compare-schools-content');
  I.seeElement(locate('#compare-schools-content label').withText('Yale University'));
});
