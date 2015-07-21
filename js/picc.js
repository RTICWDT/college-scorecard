---
# // with frontmatter, we can use {{ variable }} template tags
---
(function(exports) {

  var picc = exports.picc = {};

  picc.API = (function() {
    var API = {
      url: '{{ site.api.baseurl }}',
      key: '{{ site.api.key }}'
    };

    var schoolEndpoint = 'school/';
    var idField = 'id';

    API.get = function(uri, params, done) {
      console.debug('[API] get("%s", %s)', uri, JSON.stringify(params));
      if (arguments.length === 2) {
        done = params;
      } else if (params) {
        if (typeof params === 'object') {
          if (API.key) params.api_key = API.key;
          params = querystring.stringify(params);
        } else if (API.key) {
          params += '&api_key=' + API.key;
        }
        uri = join([uri, params], '?');
      }
      var url = join([API.url, uri], '/');
      console.debug('[API] get: "%s"', url);
      return d3.json(url, done);
    };

    API.load = function(uri, done) {
      var ext = uri.split('.').pop();
      var load = d3[ext || 'json'];
      return load(uri, done);
    };

    API.endpoint = function(uri) {
      return function endpoint(params, done) {
        return API.get(uri, params, done);
      };
    };

    API.search = API.endpoint(schoolEndpoint);

    API.getSchool = function(id, done) {
      var data = {};
      data[idField] = id;
      return API.get(schoolEndpoint, data, function(error, res) {
        if (error || !res.total) {
          return done(error.responseText || 'No such school found.');
        } else if (res.total > 1) {
          console.warn('More than one school found for ID: "' + id + '"');
        }
        return done(null, res.results[0]);
      });
    };

    function join(list, glue) {
      for (var i = 0; i < list.length; i++) {
        var str = String(list[i]);
        if (str.charAt(0) === glue) {
          list[i] = str.substr(1);
        } else if (str.charAt(str.length - 1) === glue) {
          list[i] = str.substr(0, str.length - 1);
        }
      }
      return list.join(glue);
    }

    return API;
  })();

  /*
   * This is a dictionary for the various "special designation"
   * columns. The race/ethnicity ones are all nested under the
   * `minority_serving` property, whereas the `women_only` and
   * `men_only` are top-level properties of each school API response
   * object.
   */
  var SPECIAL_DESIGNATIONS = {
    aanipi:               'Alaskan American/Native Indian/Pacific Islander',
    hispanic:             'Hispanic',
    historically_black:   'Historically Black',
    predominantly_black:  'Predominantly Black',
    tribal:               'Tribal',
    women_only:           'Women Only',
    men_only:             'Men Only'
  };

  var NA = '--';

  /**
   * This is our format generator. Its methods are format generators for
   * specific types of values, and they take a key in the data object to
   * format. For instance:
   *
   * @example
   * var formatFoo = format.percent('foo');
   * formatFoo({foo: 0.5}) -> '50%'
   */
  picc.format = (function() {
    var formatter = function(fmt, _empty) {
      if (typeof fmt === 'string') {
        fmt = d3.format(fmt);
      }
      return function(key, empty) {
        empty = empty || _empty;
        if (typeof empty === 'string') {
          empty = d3.functor(empty);
        }
        key = picc.access(key);
        return function(d) {
          var value = key.call(this, d);
          return ((!value || isNaN(value)) && empty)
            ? empty.call(d)
            : fmt.call(d, +value, key);
        };
      };
    };

    var map = function(keys, fallback) {
      return function(key) {
        return keys[key] || fallback;
      };
    };

    var range = function(ranges) {
      var len = ranges.length;
      var i;
      return function(value) {
        value = +value;
        for (i = 0; i < len; i++) {
          var range = ranges[i];
          if (value >= range[0] && value < range[1]) {
            return range[2];
          }
        }
      };
    };

    return {
      // format.dollars('x')({x: 1000}) === '$1,000'
      dollars: formatter('$,d', NA),
      // format.percent('y')({x: 1000}) === '$1,000'
      percent: formatter('%.0f', NA),
      number: formatter(',d', NA),

      // format.plural('x', 'foo')({x: 1}) === 'foo'
      // format.plural('x', 'foo')({x: 2}) === 'foos'
      plural: function(key, singular, plural) {
        if (!plural) plural = singular + 's';
        return function(d) {
          return d[key] == 1 ? singular : plural;
        };
      },

      // format.map('x', {1: 'a'})({x: 1}) === 'a'
      map: function(key, values, empty) {
        return formatter(map(values))
          .call(this, key, empty);
      },

      // format.control('control')({control: 1}) === 'Public'
      // format.control('control')({control: 2}) === 'Private non-profit'
      control: formatter(map({
        '1': 'Public',
        '2': 'Private non-profit',
        '3': 'Private for-profit'
      }, 'control unknown')),

      // format.preddeg('deg')({deg: 2}) === '2-year'
      // format.preddeg('deg')({deg: 3}) === '4-year'
      preddeg: formatter(map({
        '2': '2-year',
        '3': '4-year',
        // '4': '???'
      }, 'other degree designation')),

      sizeCategory: formatter(range([
        [0, 2000, 'Small'],
        [2000, 15000, 'Medium'],
        [15000, Infinity, 'Large']
      ]), 'size unknown'),

      // format.locale('locale')({locale: 11}) === 'City: Large'
      locale: formatter(map({
        '11': 'City: Large',
        '12': 'City: Midsize',
        '13': 'City: Small',
        '21': 'Suburb: Large',
        '22': 'Suburb: Midsize',
        '23': 'Suburb: Small',
        '31': 'Town: Fringe',
        '32': 'Town: Distant',
        '33': 'Town: Remote',
        '41': 'Rural: Fringe',
        '42': 'Rural: Distant',
        '43': 'Rural: Remote'
      }, 'locale unknown'))

    };
  })();

  picc.access = function(key) {
    return (typeof key === 'function')
      ? key
      : function(d) { return d[key]; };
  };

  picc.access.publicPrivate = function(d) {
    switch (+d.ownership) {
      case 1: // public
        return 'public';

      case 2: // private
      case 3:
        return 'private';
    }
    return null;
  };

  picc.access.nationalStat = function(stat, suffix) {
    if (suffix) {
      suffix = picc.access(suffix);
      return function(d) {
        var key = suffix.apply(this, arguments);
        return this.getAttribute([
          'data', stat, key
        ].join('-'));
      };
    } else {
      return function() {
        return this.getAttribute('data-' + key);
      };
    }
  };

  picc.access.netPrice = function(d) {
    var key = picc.access.publicPrivate(d);
    return key
      ? d.avg_net_price
        ? picc.nullify(d.avg_net_price[key])
        : picc.nullify(d.net_price[key].average)
      : null;
  };

  picc.access.netPriceByIncomeLevel = function(level) {
    return function(d) {
      var key = picc.access.publicPrivate(d);
      return d.net_price
        ? picc.nullify(d.net_price[key].by_income_level[level])
        : null;
    };
  };

  picc.access.yearDesignation = function(d) {
    switch (d.common_degree) {
      case '2': // 2-year (AKA less than 4-year)
        return 'lt_four_year';
      case '3': // 4-year
        return 'four_year';
    }
    // FIXME
    return 'other';
  };

  picc.access.medianEarnings = function(d) {
    return picc.nullify(d.median_earnings);
  };

  picc.access.completionRate = function(d) {
    var designation = picc.access.yearDesignation(d);
    return designation
      ? picc.nullify(d.completion_rate[designation])
      : null;
  };

  picc.access.specialDesignation = function(d) {
    var designations = [];

    if (+d.women_only) {
      designations.push(SPECIAL_DESIGNATIONS.women_only);
    } else if (+d.men_only) {
      designations.push(SPECIAL_DESIGNATIONS.men_only);
    }

    if (d.minority_serving) {
      for (var key in SPECIAL_DESIGNATIONS) {
        if (+d.minority_serving[key]) {
          designations.push(SPECIAL_DESIGNATIONS[key]);
        }
      }
    }

    return designations.join(', ');
  };

  picc.nullify = function(value) {
    return value === 'NULL' ? null : value;
  };

})(this);
