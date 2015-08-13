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

    change();
  });

  form.on('change', change);

  form.on('submit', function(data, e) {
    change();
    e.preventDefault();
    return false;
  });

  picc.ui.expandAccordions(function() {
    var inputs = this.querySelectorAll('[name]');
    return [].some.call(inputs, function(input) {
      return query[input.name];
    });
  });

  function onChange() {
    var params = form.getData();

    // console.log('search params:', params);
    if (Array.isArray(params.state) && !params.state[0]) {
      delete params.state;
    }

    var query = picc.data.extend({}, params);

    // if the region is specified, add it either as a value or a
    // range with picc.data.rangify()
    if (query.region) {
      // FIXME: 'region_id' should be `picc.fields.REGION_ID`
      picc.data.rangify(query, 'region_id', query.region);
      delete query.region;
    }

    // if a size is specified, just pass it along as a range
    if (query.size) {
      // FIXME: 'size' should be `picc.fields.SIZE`
      query.size__range = query.size;
      delete query.size;
    }

    // set the predominant degree, which can be either a value or
    // a range (default: '2..3')
    if (query.degree) {
      // FIXME: when we have support for nested keys,
      // 'predominant' should be changed to
      // `picc.fields.PREDOMINANT_DEGREE`
      picc.data.rangify(query, 'predominant', query.degree);
      delete query.degree;
    }

    // only query the fields that we care about
    query.fields = [
      // basic display fields
      picc.fields.NAME,
      picc.fields.CITY,
      picc.fields.STATE,
      picc.fields.SIZE,
      // to get "public" or "private"
      picc.fields.OWNERSHIP,
      // to get the "four_year" or "lt_four_year" bit
      picc.fields.PREDOMINANT_DEGREE,
      // get both of the net price values
      picc.fields.NET_PRICE + '.public',
      picc.fields.NET_PRICE + '.private',
      // get both of the completion rate values
      picc.fields.COMPLETION_RATE + '.four_year',
      picc.fields.COMPLETION_RATE + '.lt_four_year',
      // this has no sub-fields
      picc.fields.MEDIAN_EARNINGS,
      // not sure if we need this, but let's get it anyway
      picc.fields.EARNINGS_GT_25K,
      // under investigation flag
      picc.fields.UNDER_INVESTIGATION
    ].join(',');

    var qs = querystring.stringify(params);
    qs = qs.replace(/^&/, '');
    // update the URL
    history.pushState(params, 'search', '?' + qs);

    if (req) req.cancel();

    resultsRoot.classList.add('js-loading');
    resultsRoot.classList.remove('js-loaded');
    resultsRoot.classList.remove('js-error');

    console.time && console.time('[load]');

    picc.API.search(query, function(error, data) {
      resultsRoot.classList.remove('js-loading');

      console.timeEnd && console.timeEnd('[load]');

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
