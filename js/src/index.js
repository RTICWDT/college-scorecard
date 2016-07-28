var formdb = require('formdb');

module.exports = function index() {

  var form = new formdb.Form('#search-form');
  picc.form.minifyQueryString(form);
  picc.form.autocompleteName('#search-form');

  picc.ready(function() {
    if (location.hash.length > 1) {
      var id = location.hash.substr(1);
      picc.ui.expandAccordions(function() {
        return this.id && this.id === id;
      });
      location.hash = '';
      location.hash = '#' + id;
    }
  });

};
