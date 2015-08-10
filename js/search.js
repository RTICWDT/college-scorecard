(function(exports) {

  var resultsRoot = document.querySelector('.search-results');
  var form = new formdb.Form('#search-form');
  var query = querystring.parse(location.search.substr(1));
  // the current outbound request
  var req;

  picc.ready(function() {
    // console.warn('setting form data...', query);
    // console.log('states:', form.get('state'));
    form.setData(query);
    // console.log('states:', form.getInputsByName('state'), form.get('state'));

    onChange(form.getData());
  });

  form.on('change', picc.debounce(onChange, 200));

  form.on('submit', function(data, e) {
    onChange(data);
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
    if (Array.isArray(params.state) && !params.state[0]) {
      delete params.state;
    }
    var qs = querystring.stringify(params);
    // update the URL
    history.pushState(params, 'search', '?' + qs);

    if (req) req.cancel();

    resultsRoot.classList.add('js-loading');
    picc.API.search(params, function(error, data) {
      resultsRoot.classList.remove('hidden');
      resultsRoot.classList.remove('js-loading');

      if (error) {
        return showError(error);
      }

      var format = picc.format;

      console.log('loaded schools:', data);
      resultsRoot.classList.add('js-loaded');

      console.time('[render]');

      console.time('[render] template');
      // render the basic DOM template for each school
      tagalong(resultsRoot, data, {
        results_word: format.plural('total', 'Result'),
        results_total: format.number('total', '0')
      });

      var resultsList = resultsRoot.querySelector('.schools-list');
      tagalong(resultsList, data.results, picc.school.directives);

      console.timeEnd('[render] template');

      console.timeEnd('[render]');
    });
  }

  function showError(error) {
    console.error('error:', error);
    resultsRoot.classList.add('js-error');
    var message = resultsRoot.querySelector('.error-message');
    message.textContent = String(error.responseText || 'There was an unexpected API error.');
  }

})(this);
