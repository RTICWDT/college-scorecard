
const BASE_URL = "/school/?130794-Yale-University";

Feature('Page Test: School. Indepth testing of the school page.');

// Check console for errors.

// Add to compare
  // See compare drawer

// Share School

// See all major top items: School title, Address, Icons, Maps, Grad rate, Salary, AVG cost.

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

  // See map with path
  I.seeElement(locate('.leaflet-zoom-animated path'));

  //Hero Stats
  I.seeElement('#school-completion-rate-donut canvas#doughnut-chart');
  I.seeElement('#school-salary-after-complete .range-container .range-chart');
  I.seeElement(locate('#school-avg-cost h2').at(2));

  // Check number of expansion panels.
  I.seeNumberOfVisibleElements(".v-expansion-panel",7);
  I.click(locate('.v-expansion-panel').at('1'));
  I.seeElement('#costs-content');

  // Sidebar conent
  I.seeElement(locate('#school-name-auto-complete'));
  I.see('Learn More About Paying for College','h2');
});