
Feature('Page test: Search.  In depth test of search functionality.');

// TODO - Create a constants page.
const BASE_SEARCH = '/search/?';

// Test school result card.
  // Flag
  // Icons
  // Add to compare.
  // Check tooltip

// Page Functions

// Search Form Items
  // Clear
  // Sort
  // Share
  // Pagination
  // Result Count.

// Compare Drawer


Scenario('Visit root page and see all major page components', (I) => {
  I.amOnPage(BASE_SEARCH);

  // Just waiting a bit for page load.
  I.wait(2);
  
  I.see("Results",'p');
  
  // TODO - Update buttons ID and test.
  
  I.seeElement("#search-result-info-count");

  I.seeElement(".search-result-card");

  I.seeElement(".searchSidebar");

  I.seeElement("#compare-header");
});
