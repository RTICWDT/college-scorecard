var assert = require('assert');

module.exports = {
  url: function() {
    return this.api.launchUrl + 'search/';
  },

  commands: [{

    submitSearch: function() {
      return this.waitForElementPresent('@searchSubmit')
        .click('@searchSubmit')
        .waitForElementNotPresent('@searchSubmit');
    },

    assertResultsCount: function(count) {
      var client = this;
      var selector = '[data-bind="results_total"]';
      return this.execute(function(selector, count) {
        return document.querySelector(selector).textContent;
      }, [selector, count], function(text) {
        assert.equal(text.replace(/[^\d]+/g), String(count));
      });
    }

  }],

  elements: {
    searchForm: {selector: '#search-form'},
    searchSubmit: {selector: '#search-submit'},
    nameInput: {selector: 'input[name="name"]'}
  },

  sections: {
    search: {
      selector: 'section.search_form'
    }
  }
};
