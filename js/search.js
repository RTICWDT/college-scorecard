(function(exports) {

  var resultsRoot = document.querySelector('.search-results');
  var query = location.search;
  if (!query) {
    resultsRoot.classList.add('empty');
    return;
  }

  // TODO: include formdb, querystring, and tagalong
  var form = new formdb.Form('#search-form');
  var data = querystring.parse(query.substr(1));
  console.debug('[search] form data:', data);
  form.setData(data);

  var directives = {};
  resultsRoot.classList.add('loading');

  API.search(data, function(error, res) {
    resultsRoot.classList.remove('loading');
    if (error) {
      return showError(error);
    }
    resultsRoot.classList.add('loaded');
    var list = resultsRoot.querySelector('.results-list');
    tagalong(list, res.results, directives);
  });

  function showError(error) {
    resultsRoot.classList.add('error');
    resultsRoot.querySelector('.error').textContent = error;
  }

})(this);
