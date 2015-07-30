var search = require('./search');
var extend = require('extend');

module.exports = {
  url: function() {
    return this.api.launchUrl;
  },

  // include search elements on the index
  elements: extend(search.elements, {
  }),

  // include search sections on the index
  sections: extend(search.sections, {
  })
};
