(function(exports) {

  var resultsRoot = document.querySelector('.search-results');
  var form = new formdb.Form('#search-form');
  var query = querystring.parse(location.search.substr(1));

  // the current outbound request
  var req;

  // "incremental" updates will only hide the list of schools, and
  // not any of the other elements (results total, sort, pages)
  var incremental = false;

  // the maximum # of page links to show
  var MAX_PAGES = 6;

  var change = picc.debounce(onChange, 100);

  picc.ready(function() {
    // console.warn('setting form data...', query);
    // console.log('states:', form.get('state'));
    form.setData(query);
    // console.log('states:', form.getInputsByName('state'), form.get('state'));

    change();
  });

  form.on('change', change);

  // sort is an "incremental" update
  form.on('change:sort', function() {
    console.log('change sort!');
    incremental = true;
  });

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
      picc.data.rangify(query, picc.fields.REGION_ID, query.region);
      delete query.region;
    }

    // if a size is specified, just pass it along as a range
    if (query.size) {
      picc.data.rangify(query, picc.fields.SIZE, query.size);
      delete query.size;
    }

    // set the predominant degree, which can be either a value or
    // a range (default: '2..3')
    if (query.degree) {
      picc.data.rangify(query, picc.fields.PREDOMINANT_DEGREE, query.degree);
      delete query.degree;
    }

    // only query the fields that we care about
    query.fields = [
      // we need the id to link it
      picc.fields.ID,
      // basic display fields
      picc.fields.NAME,
      picc.fields.CITY,
      picc.fields.STATE,
      picc.fields.SIZE,
      // to get "public" or "private"
      picc.fields.OWNERSHIP,
      // to get the "four_year" or "lt_four_year" bit
      picc.fields.PREDOMINANT_DEGREE,
      // get all of the net price values
      picc.fields.NET_PRICE_ROOT + '.overall',
      picc.fields.NET_PRICE_ROOT + '.public',
      picc.fields.NET_PRICE_ROOT + '.private',
      // get all of the completion rate values
      picc.fields.COMPLETION_RATE + '.overall',
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
    qs = qs.replace(/&{2,}/g, '&');
    // update the URL
    history.pushState(params, 'search', '?' + qs);

    if (req) req.cancel();

    var list = d3.select(resultsRoot)
      .select('[data-bind="results"]');

    if (incremental) {
      list.classed('hidden', true);
    } else {
      resultsRoot.classList.add('js-loading');
      resultsRoot.classList.remove('js-loaded');
      resultsRoot.classList.remove('js-error');
    }

    var paginator = resultsRoot.querySelector('.pagination');
    paginator.classList.toggle('show-loading', incremental);

    console.time && console.time('[load]');

    picc.API.search(query, function(error, data) {
      resultsRoot.classList.remove('js-loading');
      list.classed('hidden', false);

      paginator.classList.remove('show-loading');
      incremental = false;

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

      var page = +params.page || 0;
      var total = data.total;
      var perPage = data.per_page;

      var pages = getPages(total, perPage, page);

      tagalong(paginator, {
        pages: pages
      }, {
        pages: {
          '@data-index': function(d) {
            return String(d.index);
          },
          '@class': function(d) {
            return d.index === page
              ? 'pagination-page_selected'
              : d.arrow ? 'pagination-arrow' : null;
          },
          link: {
            text: 'page',
            '@data-page': function(d) {
              return String(d.index);
            },
            '@href': function(d) {
              return d.index === page
                ? null
                : d.index === false
                  ? null
                  : '?' + querystring.stringify(picc.data.extend({}, params, {page: d.index}));
            }
          }
        }
      });

      var pageLinks = d3.selectAll('a.select-page')
        .on('click', function() {
          d3.event.preventDefault();

          var _page = this.getAttribute('data-page');
          if (_page === 'false') return;

          pageLinks.each(function() {
            var p = this.getAttribute('data-page');
            var selected = p == _page;
            this.parentNode.classList
              .toggle('pagination-page_selected', selected);
            // console.log('selected?', p, page, selected, '->', this.parentNode);
          });

          form.set('page', _page);
          incremental = true;
          change();
        });

      var resultsList = resultsRoot.querySelector('.schools-list');
      tagalong(resultsList, data.results, picc.school.directives);

      console.timeEnd && console.timeEnd('[render]');
    });
  }

  function getPages(total, perPage, page) {

    var numPages = Math.ceil(total / perPage);
    var previous = false;
    var next = false;

    if (numPages > MAX_PAGES) {
      var end = Math.min(page + MAX_PAGES, numPages);
      var start = end - MAX_PAGES;
      // console.log('pages: %d -> %d', start, end);
      pages = d3.range(start, start + MAX_PAGES);
      previous = start > 0;
      next = end < numPages;
    } else {
      pages = d3.range(0, numPages);
    }

    // console.log('pages:', numPages, '->', pages);

    pages = pages.map(function(page) {
      return {
        page: page + 1,
        index: page
      };
    });

    if (previous) {
      var first = pages[0];
      pages.unshift({
        index: first.index - 1,
        page: '<',
        arrow: true
      });
      if (first.index > 1) {
        pages.unshift({
          index: 0,
          page: '<<',
          arrow: true
        });
      }
    }
    if (next) {
      var last = pages[pages.length - 1];
      pages.push({
        index: last.index + 1,
        page: '>',
        arrow: true
      });
      if (last.index < numPages - 1) {
        pages.push({
          index: numPages - 1,
          page: '>>',
          arrow: true
        });
      }
    }

    return pages;
  }

  function showError(error) {
    console.error('error:', error);
    var message = resultsRoot.querySelector('.error-message');
    message.textContent = String(error.responseText || 'There was an unexpected API error.');
  }

})(this);
