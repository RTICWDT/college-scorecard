let assert = require('assert');
const BASE_URL = '/search/?';

Feature('Page: Search');

// Scenario('Page renders without console errors', async (I) => {
//   I.amOnPage(BASE_URL);

//   let logs = await I.grabBrowserLogs();

//   let errors = logs.filter((obj) => {
//     return obj._type === 'error';
//   });

//   assert.equal(errors.length, 0);
// });

Scenario('Visit root page and see all major page components', (I) => {
  I.amOnPage(BASE_URL);

  // Check for major page components.
  I.see("Results",'p');
  I.seeElement("#search-result-info-count");
  I.seeElement(".search-result-card");
  I.seeElement(".searchSidebar");
});

Scenario('Vist root search and clear, sort, share and pagination', async (I) =>{
  let testURLString = 'size=small&control=public&locale=city';

  I.amOnPage(BASE_URL + "size=small&control=public&locale=city");

  // Click to hide search form.
  I.click(locate(".search-result-container"));

  // Test Clear
  I.click('#search-button-clear');
  I.wait(2);
  I.dontSeeInCurrentUrl(testURLString);

  I.seeAttributesOnElements('#search-form-size-small',{'aria-checked':'false'});
  I.seeAttributesOnElements('#search-form-type-public',{'aria-checked':'false'});
  I.seeAttributesOnElements('#search-form-locale-city',{'aria-checked':'false'});

  // Test Sort
  I.click('#search-button-sort');
  I.click(locate(".v-list-item__title").withText("Name"));
  I.wait(2);
  I.seeInCurrentUrl("sort=name:asc");
  
  // Get the first letter of the first result.
  let firstLetterOfFirstResult = await I.executeScript(function() {
    return document.querySelectorAll('.search-result-card')[0].querySelector('.nameLink').innerText[0];
  });

  // Test Assertion of first resu
assert.equal(firstLetterOfFirstResult,'A');
});

Scenario('Click items in search and get updated results.', async(I) => {
  I.amOnPage(BASE_URL);

  // Add all sliders.
  I.fillField('#search-form-completion-rate-field','50');
  I.fillField('#search-form-avg-net-price-field','10');
  I.fillField('#search-form-sat-math-field','500');
  I.fillField('#search-form-sat-read-field','500');
  I.fillField('#search-form-act-field','20');
  I.fillField('#search-form-acceptance-field','50');

  I.click('#search-form-size-small');
  I.click('#search-form-type-public');
  I.click('#search-form-locale-city');

  I.wait(2);
  
  // Test URL
  let url = await I.grabCurrentUrl();
  
  I.seeInCurrentUrl('completion_rate=0.5..');
  I.seeInCurrentUrl('avg_net_price=..10000');
  I.seeInCurrentUrl('sat_math=..500');
  I.seeInCurrentUrl('sat_read=..500');
  I.seeInCurrentUrl('act=..20');
  I.seeInCurrentUrl('acceptance=0.5..1');

  I.seeInCurrentUrl('size=small');
  I.seeInCurrentUrl('control=public');
  I.seeInCurrentUrl('locale=city');
});

Scenario('Populate form based on URL data.', async (I) =>{
  I.amOnPage(BASE_URL + "size=small&control=public&locale=city");

  I.seeAttributesOnElements('#search-form-size-small',{'aria-checked':'true'});
  I.seeAttributesOnElements('#search-form-type-public',{'aria-checked':'true'});
  I.seeAttributesOnElements('#search-form-locale-city',{'aria-checked':'true'});

});

// Test Compare Functionality.
Scenario('Add schools to compare, Items appear in compare drawer, Remove from compare.', async (I) =>{
  I.amOnPage(BASE_URL);

  // Click to close search window.
  I.click(locate(".search-result-container"));
  
  // Add items to compare search
  I.click(locate(".search-result-card button").at(1));
  // I.click(locate(".search-result-card button").at(2));
  
  // Wait for compare element to show in DOM.
  I.waitForElement('#compare-header',2);
  
  // Show Modal
  I.click('#compare-header');
  I.waitForElement("#compare_schools-content",2);

  // // Check total number of compare schools.
  // I.seeNumberOfElements(locate('#compare_schools-content input'),2);
  
  // // Remove from compare
  // I.click(locate('#compare_schools-content input').first());
  
  // // Correct number compare schools.
  // I.seeNumberOfElements(locate('#compare_schools-content input'),1);
});