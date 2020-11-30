const assert = require('assert');
const BASE_URL = '/';

Feature('Page: Index');

// Scenario('Page renders without console errors', async (I) => {
//   I.amOnPage(BASE_URL);

//   let logs = await I.grabBrowserLogs();

//   let errors = logs.filter((obj) => {
//     return obj._type === 'error';
//   });

//   assert.equal(errors.length, 0);
// });

Scenario('Test Name Autocomplete', (I) => {
  I.amOnPage(BASE_URL);
  
  I.seeElement('#search-name-auto-complete');

  I.fillField('#search-name-auto-complete',"yale");
  
  I.wait(2);

  I.seeElement(locate('.name-complete-school-name').withText('Yale University'));

  I.click(locate('.name-complete-school-name').withText('Yale University'));

  I.seeInCurrentUrl('/search');
  I.seeInCurrentUrl('search=Yale%20University');
});

Scenario('Test Show Me Options: Simple Elements', (I) => {
  I.amOnPage(BASE_URL);

  I.click(locate('.v-tab').withText("Show Me Options"));
  
  I.seeElement(locate(".v-window-item").withText("Select one or more options to create a list of schools that fit your needs."));

  I.click("#canned-search-most-get-in");
  I.click('#canned-search-most-grad');
  I.click('#canned-search-degree-a');
  I.click('#canned-search-degree-b');
  I.click('#canned-search-degree-c');

  I.click(locate('#search-can-query-items-wrapper button'));
  I.wait(2);

  I.seeInCurrentUrl('/search');
  I.seeInCurrentUrl('completion_rate=0.5..');
  I.seeInCurrentUrl('acceptance=0.5..1');
  I.seeInCurrentUrl('cip4_degree=a&cip4_degree=b&cip4_degree=c');
});

Scenario('Test Show Me Options: Near Me', async (I) => {
  I.amOnPage('/');
  
  // Overwrite the location function
  I.executeScript( ()=>{
    navigator.geolocation.getCurrentPosition = function(success, failure) { 
      success({ coords: { 
          latitude: 35.906167, 
          longitude: -78.863741,

      }, timestamp: Date.now() }); 
    }
  });

  I.click(locate('.v-tab').withText("Show Me Options"));
  I.seeElement(locate(".v-window-item").withText("Select one or more options to create a list of schools that fit your needs."));
  I.click("#canned-search-near-me");
  I.click('#canned-search-submit');

  I.seeInCurrentUrl("lat=");
  I.seeInCurrentUrl('long=');
});

// Test click then remove Show Me Options.
Scenario('Test Show Me Options: Simple Elements', (I) => {
  I.amOnPage(BASE_URL);

  I.click(locate('.v-tab').withText("Show Me Options"));
  
  I.seeElement(locate(".v-window-item").withText("Select one or more options to create a list of schools that fit your needs."));

  I.click("#canned-search-most-get-in");
  I.click('#canned-search-most-grad');
  I.click('#canned-search-degree-a');
  I.click('#canned-search-degree-b');
  I.click('#canned-search-degree-c');

  // Remove some items.
  I.click('#canned-search-most-grad');
  I.click('#canned-search-degree-a');
  I.click('#canned-search-degree-b');

  I.click(locate('#search-can-query-items-wrapper button'));
  I.wait(2);

  I.seeInCurrentUrl('/search');
  I.seeInCurrentUrl('acceptance=0.5..1');
  I.seeInCurrentUrl('cip4_degree=c');

  I.dontSeeInCurrentUrl('completion_rate=0.5..');
  I.dontSeeInCurrentUrl('cip4_degree=a&cip4_degree=b');

});

Scenario('Test Custom Search', (I) => {
  I.amOnPage(BASE_URL);

  I.click(locate('.v-tab').withText("Search Schools"));
  I.click(locate('button').withText('Custom Search'));
  
  I.seeElement(locate(".v-window-item p").withText("Location"));
  I.click('#search-from-location-select');
  I.click(locate('.v-list-item__title').withText('ZIP Code'));
  I.fillField('#search-form-zip-text','27709');

  I.fillField('#search-form-fos-auto-complete','Architectur');
  I.click(locate('.v-list-item__title').withText('Architecture'));

  I.click('#search-form-fos-degree-c');
  I.click('#search-form-fos-degree-a');
  I.click('#search-form-fos-degree-b');

  I.click(locate("#search-submit-container button"));
  I.wait(2);

  I.seeInCurrentUrl('zip=27709&distance=10&cip4=0402&cip4_degree=c&cip4_degree=a&cip4_degree=b');
});
