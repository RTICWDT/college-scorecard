
Feature('Ensure that all pages render and mount to window.');

Scenario('Visit /', (I) => {
  I.amOnPage('/');
  // Check for Mounted
  I.seeElement('.v-application');
  // Check for page element.
  I.see('FIND THE RIGHT FIT.','h1');
});

Scenario('Visit /search', (I) => {
  I.amOnPage('/search');
  // Check for Mounted
  I.seeElement('.v-application');
  // I.wait(2);
  // Check for page element.
  I.see('Results','p');
});

// School Pages
Scenario('Visit /school', (I) => {
  I.amOnPage('/school/?130794-Yale-University');
  // Check for Mounted
  I.seeElement('.v-application');
  // I.wait(2);
  // Check for page element.
  I.see('Yale University','h1');
});

Scenario('Visit school/fields', (I) => {
  I.amOnPage('/school/fields/?130794-Yale-University');
  // Check for Mounted
  I.seeElement('.v-application');
  // I.wait(2);
  // Check for page element.
  I.see('All Fields of Study Offered at Yale University','h1');
});

// Data Pages
Scenario('Visit /data/home', (I) => {
  I.amOnPage('/data/home');
  // Check for Mounted
  I.seeElement('.v-application');
  // Check for page element.
  I.see('Download the Data','h2');
});

Scenario('Visit /data/data-documentation', (I) => {
  I.amOnPage('/data/data-documentation/');
  // Check for Mounted
  I.seeElement('.v-application');
  // Check for page element.
  I.see('Data Documentation','h1');
});

Scenario('Visit /data/changelog', (I) => {
  I.amOnPage('/data/changelog');
  // Check for Mounted
  I.seeElement('.v-application');
  // Check for page element.
  I.see('Change Log','h1');
});

Scenario('Visit /data/glossary', (I) => {
  I.amOnPage('/data/glossary');
  // Check for Mounted
  I.seeElement('.v-application');
  // Check for page element.
  I.see('Glossary','h1');
});

// Compare Page
Scenario('Visit /compare', (I) => {
  I.amOnPage('/compare');
  // Check for Mounted
  I.seeElement('.v-application');
  // Check for page element.
  I.see('No schools selected to compare','h1');
});