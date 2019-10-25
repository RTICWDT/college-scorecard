
Feature('Page test: Search.  In depth test of search functionality.');

// TODO - Create a constants page.
const BASE_SEARCH = '/search/?';

// Test school result card - This might be better handled with a unit test.
  // Flag
  // Icons
  // Add to compare.
  // Check tooltip

// Page Functions
  // URL to fill form.

// Search Page Items
  // Clear
  // Sort
  // Share
  // Pagination
  // Result Count.

// Compare Drawer

Scenario('Visit root page and see all major page components', (I) => {
  I.amOnPage(BASE_SEARCH);
  
  // Check for major page components.
  I.see("Results",'p');
  I.seeElement("#search-result-info-count");
  I.seeElement(".search-result-card");
  I.seeElement(".searchSidebar");
});

// Test: Click items in search form, get results that match.
  // ensure URL is updated
  Scenario('Click items in search and get updated results.', async(I) => {
    I.amOnPage(BASE_SEARCH);

    I.fillField('#search-form-completion-rate-field','50');
    I.fillField('#search-form-acceptance-field','50');
    I.wait(1);

    let url = await I.grabCurrentUrl();
    console.log(`Current URL is [${url}]`);

  });


// Test: Grab items from the URL and fill form.

// Test: Paginate through results.

// Test: Click to add to compare
  // Compare exists,
  // Has correct elements