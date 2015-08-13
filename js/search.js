(function(exports) {

  var resultsRoot = document.querySelector('.search-results');
  var form = new formdb.Form('#search-form');
  var query = querystring.parse(location.search.substr(1));
  // the current outbound request
  var req;

  var change = picc.debounce(onChange, 100);

  picc.ready(function() {
    // console.warn('setting form data...', query);
    // console.log('states:', form.get('state'));
    form.setData(query);
    // console.log('states:', form.getInputsByName('state'), form.get('state'));

    change(form.getData());
  });

  form.on('change', change);

  form.on('submit', function(data, e) {
    change(data);
    e.preventDefault();
    return false;
  });

  picc.ui.expandAccordions(function() {
    var inputs = this.querySelectorAll('[name]');
    return [].some.call(inputs, function(input) {
      return query[input.name];
    });
  });

  function onChange(params) {
    // console.log('search params:', params);
    if (Array.isArray(params.state) && !params.state[0]) {
      delete params.state;
    }
    var qs = querystring.stringify(params);
    // update the URL
    history.pushState(params, 'search', '?' + qs);

    if (req) req.cancel();

    resultsRoot.classList.add('js-loading');
    resultsRoot.classList.remove('js-loaded');
    resultsRoot.classList.remove('js-error');

    picc.API.search(params, function(error, data) {
      resultsRoot.classList.remove('js-loading');

      if (error) {
        resultsRoot.classList.add('js-error');
        return showError(error);
      }

      resultsRoot.classList.add('js-loaded');

      var format = picc.format;

      console.log('loaded schools:', data);

      console.time && console.time('[render]');

      // render the basic DOM template for each school
      tagalong(resultsRoot, data, {
        results_word: format.plural('total', 'Result'),
        results_total: format.number('total', '0')
      });

      var resultsList = resultsRoot.querySelector('.schools-list');
      tagalong(resultsList, data.results, picc.school.directives);

      console.timeEnd && console.timeEnd('[render]');
    });
  }

  function showError(error) {
    console.error('error:', error);
    var message = resultsRoot.querySelector('.error-message');
    message.textContent = String(error.responseText || 'There was an unexpected API error.');
  }

})(this);
