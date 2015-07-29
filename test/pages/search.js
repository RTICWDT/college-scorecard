var searchCommands = {
  submitSearch: function() {
    return this.waitForElementPresent('@searchSubmit', 5000)
      .click('@searchSubmit');
  }
};

module.exports = {
  url: function() {
    return this.api.launchUrl + 'search/';
  },

  commands: [searchCommands],

  elements: {
    searchForm: {
      selector: '#search-form'
    },
    searchSubmit: {
      selector: '#search-submit'
    },
    nameInput: 'input[name="name"]'
  },

  sections: {
    search: {
      selector: 'section.search_form'
    }
  }
};
