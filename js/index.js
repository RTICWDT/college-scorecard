(function(exports) {

  var form = new formdb.Form('#search-form');
  picc.form.minifyQueryString(form);

  if (location.hash.length > 1) {
    var id = location.hash.substr(1);
    picc.ui.expandAccordions(function() {
      return this.id && this.id === id;
    });
    location.hash = '';
    location.hash = '#' + id;
  }

})(this);
