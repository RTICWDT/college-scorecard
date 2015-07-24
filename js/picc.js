---
# // with frontmatter, we can use {{ variable }} template tags
---
(function(exports) {

  var picc = exports.picc = {};

  picc.BASE_URL = '{{ site.baseurl }}';

  picc.API = (function() {
    var API = {
      url: '{{ site.api.baseurl }}',
      key: '{{ site.api.key }}'
    };

    // use the staging API if we're on Federalist previewing
    // the staging branch
    if (location.hostname === 'federalist.18f.gov'
        && !!location.pathname.match(/\/staging\//)) {
      API.url = 'https://ccapi-open-staging.18f.gov/';
      API.key = '';
    }

    var schoolEndpoint = 'school/';
    var idField = 'id';

    API.get = function(uri, params, done) {
      // console.debug('[API] get("%s", %s)', uri, JSON.stringify(params));
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

    API.getAll = function(urls, done) {
      Object.keys(urls).forEach(function(key) {
        var url = urls[key];
        urls[key] = Array.isArray(url)
          ? function(done) {
            var method = url.shift();
            if (typeof method === 'string') {
              method = API[method];
            }
            url.push(done);
            return method.apply(API, url);
          }
          : function(done) {
            return API.get(url, done);
          };
      });
      // console.log('getAll:', urls);
      return async.parallel(urls, done);
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
    // TODO: rename 'aanapi' or 'aanapisi'
    // per <http://www2.ed.gov/programs/aanapi/index.html>
    aanipi:               'AANAPI',
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
        key = key
          ? picc.access(key)
          : function(v) { return v; };
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
        '1': 'Certificate',
        '2': '2-year',
        '3': '4-year',
        '4': 'Graduate'
      }, NA)),

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
      : getter(key);
  };

  function getter(key) {
    if (key.indexOf('.') > -1) {
      var bits = key.split('.');
      var len = bits.length;
      return function(d) {
        for (var i = 0; i < len; i++) {
          d = d[bits[i]];
        }
        return d;
      };
    }
    return function(d) { return d[key]; };
  }

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
        return this.getAttribute('data-' + stat);
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

  picc.access.retentionRate = function(d) {
    var designation = picc.access.yearDesignation(d);
    var partTimeShare = d.part_time_share[1] || d.part_time_share[2];
    var retention = d.retention_rate[designation];
    var partTimeRate = retention ? retention.part_time : 0;
    var fullTime = retention ? retention.full_time : 0;
    var size = d.size;
    return (
      (size * partTimeShare * partTimeRate) +
      ((size - size * partTimeShare) * fullTime)
    ) / size;
  };

  picc.access.specialDesignations = function(d) {
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

    return designations;
  };

  picc.access.programAreas = function(d, metadata) {
    if (!metadata) metadata = d.metadata;
    if (!metadata || !metadata.dictionary) return [];

    var dictionary = metadata.dictionary;
    return Object.keys(d.program_percentage || {})
      .map(function(key) {
        var value = d.program_percentage[key];
        var dictKey = 'program_percentage.' + key;
        var name = dictionary[dictKey]
          ? dictionary[dictKey].description
          : key;
        return {
          program:  name,
          percent:  value
        };
      });
  };

  picc.nullify = function(value) {
    return value === 'NULL' ? null : value;
  };

  /**
   * namespace for school-related stuff
   */
  picc.school = {};

  /**
   * common directives for school templates
   */
  picc.school.directives = (function() {
    var access = picc.access;
    var format = picc.format;

    var href = function(d) {
      var name = d.name.replace(/\W+/g, '-');
      return [
        picc.BASE_URL, '/school/?',
        d.id, '-', name
      ].join('');
    };

    return {
      title: {
        link: {
          text: 'name',
          '@href': href
        }
      },

      size_number:    format.number('size'),
      control:        format.control('ownership'),
      locale_name:    format.locale('locale'),
      years:          format.preddeg('common_degree'),
      size_category:  format.sizeCategory('size'),

      // this is a direct accessor because some designations
      // (e.g. `women_only`) are at the object root, rather than
      // nested in `minority_serving`.
      special_designations: access.specialDesignations,

      SAT_avg: function(d) {
        return picc.nullify(d.SAT_avg) || NA;
      },

      SAT_meter: {
        // TODO
      },

      ACT_meter: {
        // TODO
      },

      average_cost: format.dollars(access.netPrice),
      average_cost_meter: {
        '@max':     access.nationalStat('max', access.publicPrivate),
        '@average': access.nationalStat('median', access.publicPrivate),
        '@value':   access.netPrice,
        label:      format.dollars(access.nationalStat('median', access.publicPrivate)),
        '@title':   debugMeterTitle
      },

      // income level net price stats
      net_price_income1: format.dollars(access.netPriceByIncomeLevel('0-30000')),
      net_price_income2: format.dollars(access.netPriceByIncomeLevel('30001-48000')),
      net_price_income3: format.dollars(access.netPriceByIncomeLevel('48001-75000')),
      net_price_income4: format.dollars(access.netPriceByIncomeLevel('75001-110000')),
      net_price_income5: format.dollars(access.netPriceByIncomeLevel('110001-plus')),

      grad_rate: format.percent(access.completionRate),
      grad_rate_meter: {
        '@average': access.nationalStat('median', access.yearDesignation),
        '@value':   access.completionRate,
        label:      format.percent(function() {
          return this.getAttribute('average');
        }),
        '@title':   debugMeterTitle
      },

      average_salary: format.dollars(access.medianEarnings),
      average_salary_meter: {
        '@value': access.medianEarnings,
        label:    format.dollars(function() {
          return this.getAttribute('average');
        }),
        '@title': debugMeterTitle
      },

      repayment_rate_percent: format.percent('repayment_rate'),
      repayment_rate_meter: {
        '@value': 'repayment_rate',
        '@average': access.nationalStat('median'),
        label:    format.percent(function() {
          return this.getAttribute('average');
        })
      },

      average_total_debt: format.dollars('debt.median_completer_total'),
      average_monthly_loan_payment: format.dollars('debt.median_monthly_payment'),

      retention_rate_value: format.percent(picc.access.retentionRate),
      retention_rate_meter: {
        '@value': access.retentionRate,
        label:    format.percent(function() {
          return this.getAttribute('average');
        }),
        '@title': debugMeterTitle
      },

      available_programs: function(d) {
        var areas = access.programAreas(d);
        return areas
          .sort(function(a, b) {
            return d3.ascending(a.program, b.program);
          });
      },

      num_available_programs: format.number(function(d) {
        return access.programAreas(d).length;
      }),

      popular_programs: function(d) {
        var areas = access.programAreas(d);
        if (areas.length) {
          var total = d3.sum(areas, picc.access('percent'));
          var percent = format.percent();
          areas.forEach(function(d) {
            d.value = +d.percent / total;
            d.percent = percent(d.value);
          });
        }
        return areas
          .sort(function(a, b) {
            return d3.descending(a.value, b.value);
          })
          .slice(0, 5);
      },

      more_link: {
        '@href': href
      }
    };

    function debugMeterTitle(d) {
      return [
        'value: ', this.getAttribute('value'), '\n',
        'median: ', this.getAttribute('average')
      ].join('');
    }

  })();

})(this);
