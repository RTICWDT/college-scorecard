'use strict';

if (typeof window !== 'undefined') {
  // aight, for polyfilling common JS APIs
  require('aight');
  // web components
  require('./components');

  var typeahead = require("typeahead.js-browserify");
  typeahead.loadjQueryPlugin(); //attach jQuery
}

var querystring = require('querystring');
var d3 = require('d3');
var async = require('async');
var formdb = require('formdb');
var jQuery = require("jquery");

// create the global picc namespace
var picc = {};

// common error messages
picc.errors = {
  NO_SCHOOL_ID: 'No school ID was provided.',
  NO_SUCH_SCHOOL: 'No school found.'
};

// race-ethnicity labels
picc.RACE_ETHNICITY_LABELS = {
  aian:                   'American Indian/Alaska Native',
  asian:                  'Asian',
  asian_pacific_islander: 'Asian/Pacific Islander',
  black:                  'Black',
  black_non_hispanic:     'Black non-Hispanic',
  hispanic:               'Hispanic',
  nhpi:                   'Native Hawaiian/Pacific Islander',
  non_resident_alien:     'Non-resident alien',
  two_or_more:            'Two or more races',
  unknown:                'Unknown',
  white:                  'White',
  white_non_hispanic:     'White non-Hispanic',
};

/**
 * picc.API is a singleton object with methods to query the open-data-maker
 * JSON API. Its base URL (`picc.API.url`) and API key (`picc.API.key`) are
 * filled in by Jekyll.
 *
 * All of the API's methods are asynchronous, and use "error-first"
 * (Node.js-style) callbacks:
 *
 * @example
 * picc.API.get('school', {id: 100}, function(error, res) {
 *   // error is an XMLHttpRequest object
 *   if (error) return alert("Error: " + error.responseText);
 *   console.log('got data:', res);
 * });
 *
 */
picc.API = (function() {
  var API = {
    url: '/api/v1/',
    key: ''
  };

  // local alias for errors
  var errors = picc.errors;

  // the API endpoint (URI) at which to find school data
  var schoolEndpoint = 'schools/';

  // the school's primary key field
  var idField = 'id';

  /**
   * get an endpoint with optional query string parameters, and call the
   * `callback` function when the response is completed.
   *
   * @param {String}          uri       the URI to request, relative to
   *                                    `picc.API.url`
   * @param {String|Object?}  params    query string
   * @param {Function}        callback  the error-first callback:
   *                                    `callback(error, response)`
   * @return {Object} the d3.xhr() wrapper object
   */
  API.get = function(uri, params, done) {
    // console.info('[API] get("%s", %s)', uri, JSON.stringify(params));
    if (arguments.length === 2) {
      done = params;
      params = addAPIKey({});
    } else if (params) {
      params = addAPIKey(params);
    }
    if (params) uri = join([uri, params], '?');
    var url = API.url ? join([API.url, uri], '/') : uri;
    console.info('[API] get: "%s"', url);
    return d3.json(url, function(error, data) {
      if (data && data.errors && data.errors.length) {
        error = data.errors[0];
      }
      return done(error, data);
    });
  };

  /**
   * Generate an endpoint function that hits a fixed URI.
   *
   * @example
   * API.search = API.endpoint('search/');
   *
   * @param {String}    uri
   * @return {Function} a function that calls `picc.API.get(uri)` with the
   *                    provided parameters and callback.
   */
  API.endpoint = function(uri) {
    return function endpoint(params, done) {
      return API.get(uri, params, done);
    };
  };

  // the search endpoint
  API.search = API.endpoint(schoolEndpoint);

  /**
   * A helper function to get data for a single school.
   *
   * @param {String|Number} id  the school primary key identifier
   * @param {Function} callback the callback function, as in
   *                            `picc.API.get()`, that receives a single
   *                            school's data as its second parameter on
   *                            success.
   */
  API.getSchool = function(id, done) {
    var params = {};
    params[idField] = id;
    return API.get(schoolEndpoint, params, function(error, res) {
      var meta = res.metadata || res;
      if (error || !meta.total) {
        return done(error
          ? error.responseText || error || errors.NO_SUCH_SCHOOL
          : errors.NO_SUCH_SCHOOL);
      } else if (res.total > 1) {
        console.warn('More than one school found for ID: "' + id + '"');
      }
      return done(null, res.results[0]);
    });
  };

  /**
   * Get multiple URIs specified as an object, and call the `callback`
   * function with a similarly structured object containing data for each
   * URI.
   *
   * @example
   * picc.API.getAll({
   *   metadata: 'data.json',
   *   school: [picc.API.getSchool, 100]
   * }, function(error, data) {
   *   console.log('got metadata:', data.metadata);
   *   console.log('got school:', data.school);
   * });
   *
   * @param {Object}    urls      a map of properties to either URIs or
   *                              Arrays, in which the first element is the
   *                              function to call and the rest are arguments.
   * @param {Function}  callback  the callback function:
   *                              `callback(error, data)`
   */
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

  /**
   * add the API key (if set) to either an object or string of query
   * parameters, and return the parameters as a query string.
   *
   * @param {String|Object} params
   * @return {String}
   */
  function addAPIKey(params) {
    var param = 'api_key';
    if (typeof params === 'object') {
      if (API.key) params[param] = API.key;
      // collapse arrays into comma-separated strings
      // per the API
      collapseArrays(params);
      params = querystring.stringify(params);
    } else if (API.key) {
      params += ['&', param, '=', API.key].join('');
    }
    return params;
  }

  /**
   * Join an array of strings with a `glue` string and de-dupe repeated glue
   * strings.
   *
   * @param {Array} list
   * @param {String} glue
   * @return {String}
   */
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

  /**
   * Iterate over the keys of an `object` and replace any that have Array
   * values with strings joined with `glue`.
   *
   * @param {Object} obj
   * @param {String?} glue
   * @return {Object} the original object
   */
  function collapseArrays(obj, glue) {
    if (!glue) glue = ',';
    for (var key in obj) {
      if (Array.isArray(obj[key])) {
        obj[key] = obj[key].join(glue);
      }
    }
    return obj;
  }

  return API;
})();

// this is our "n/a" string that we display for null numeric values
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
    var round = false;
    if (typeof fmt === 'string') {
      round = !!fmt.match(/d$/);
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
        if (empty && value === '' || isNaN(String(value))) {
          return empty.call(d);
        }
        if (round) value = Math.round(value);
        return fmt.call(d, value, key);
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
      key = picc.access(key);
      if (!plural) plural = singular + 's';
      return function(d) {
        return key.call(this, d) == 1 ? singular : plural;
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
      '2': 'Private',
      '3': 'For-Profit'
    }, 'control unknown')),

    controlClass: formatter(map({
      '1': 'icon-public',
      '2': 'icon-private',
      '3': 'icon-profit'
    }, '')),

    // format.preddeg('deg')({deg: 2}) === '2-year'
    // format.preddeg('deg')({deg: 3}) === '4-year'
    preddeg: formatter(map({
      //'1': 'Certificate',
      '2': '2',
      '3': '4',
      //'4': 'Graduate'
    }, '')),

    empty: function(key) {
      key = picc.access(key);
      return function(d) {
        return !key.call(this, d);
      };
    },

    notEmpty: function(key) {
      key = picc.access(key);
      return function(d) {
        return !!key.call(this, d);
      };
    },

    sizeCategory: formatter(range([
      [0, 2000, 'Small'],
      [2000, 15000, 'Medium'],
      [15000, Infinity, 'Large']
    ]), 'size unknown'),

    sizeCategoryClass: formatter(range([
      [0, 2000, 'icon-small'],
      [2000, 15000, 'icon-medium'],
      [15000, Infinity, 'icon-large']
    ]), ''),

    // format.locale('locale')({locale: 11}) === 'City: Large'
    locale: formatter(map({
      // '11': 'City: Large',
      // '12': 'City: Midsize',
      // '13': 'City: Small',
      // '21': 'Suburb: Large',
      // '22': 'Suburb: Midsize',
      // '23': 'Suburb: Small',
      // '31': 'Town: Fringe',
      // '32': 'Town: Distant',
      // '33': 'Town: Remote',
      // '41': 'Rural: Fringe',
      // '42': 'Rural: Distant',
      // '43': 'Rural: Remote'
      '11': 'City',
      '12': 'City',
      '13': 'City',
      '21': 'Suburban',
      '22': 'Suburban',
      '23': 'Suburban',
      '31': 'Town',
      '32': 'Town',
      '33': 'Town',
      '41': 'Rural',
      '42': 'Rural',
      '43': 'Rural'
    }, 'locale unknown')),

    localeClass: formatter(map({
      '11': 'icon-city',
      '12': 'icon-city',
      '13': 'icon-city',
      '21': 'icon-suburban',
      '22': 'icon-suburban',
      '23': 'icon-suburban',
      '31': 'icon-town',
      '32': 'icon-town',
      '33': 'icon-town',
      '41': 'icon-rural',
      '42': 'icon-rural',
      '43': 'icon-rural'
    }, '')),

    href: function(key) {
      key = picc.access(key);
      return function(d) {
        var url = key.call(this, d);
        if (!url) return null;
        else if (String(url).indexOf('http') !== 0) {
          return 'http://' + url;
        } else {
          return url;
        }
      };
    },

  };
})();


picc.fields = {
  ID:                   'id',
  NAME:                 'school.name',
  CITY:                 'school.city',
  STATE:                'school.state',
  ZIP_CODE:             'school.zip',

  SCHOOL_URL:           'school.school_url',

  LOCATION:             'location',
  OWNERSHIP:            'school.ownership',
  LOCALE:               'school.locale',
  REGION_ID:            'school.region_id',

  RELIGIOUS:            'school.religious_affiliation',
  OPERATING:            'school.operating',

  SIZE:                 '2013.student.size',
  ONLINE_ONLY:          'school.online_only',

  WOMEN_ONLY:           'school.women_only',
  MEN_ONLY:             'school.men_only',
  MINORITY_SERVING:     'school.minority_serving',

  PREDOMINANT_DEGREE:   'school.degrees_awarded.predominant',
  HIGHEST_DEGREE:   'school.degrees_awarded.highest',
  UNDER_INVESTIGATION:  'school.under_investigation',

  // net price
  NET_PRICE:            '2013.cost.avg_net_price.overall',
  NET_PRICE_BY_INCOME:  '2013.cost.net_price',

  // completion rate
  COMPLETION_RATE:      '2013.completion.rate_suppressed.overall',

  RETENTION_RATE:       '2013.student.retention_rate',

  REPAYMENT_RATE:       '2013.repayment.3_yr_repayment_suppressed.overall',

  AVERAGE_TOTAL_DEBT:   '2013.aid.median_debt_suppressed.completers.overall',
  MONTHLY_LOAN_PAYMENT: '2013.aid.median_debt_suppressed.completers.monthly_payments',

  AID_PERCENTAGE:       '2013.aid.federal_loan_rate',
  PELL_PERCENTAGE:      '2013.aid.pell_grant_rate',

  MEDIAN_EARNINGS:      '2011.earnings.10_yrs_after_entry.median',

  EARNINGS_GT_25K:      '2011.earnings.6_yrs_after_entry.percent_greater_than_25000',

  PROGRAM_PERCENTAGE:   '2013.academics.program_percentage',
  PROGRAM_OFFERED:      '2013.academics.program',
  DEGREE_OFFERED:       '2013.academics.program_available',

  PART_TIME_SHARE:      '2013.student.part_time_share',
  FEMALE_SHARE:         '2013.student.demographics.female_share',
  RACE_ETHNICITY:       '2013.student.demographics.race_ethnicity',
  AGE_ENTRY:            '2013.student.demographics.age_entry',

  ACT_25TH_PCTILE:      '2013.admissions.act_scores.25th_percentile.cumulative',
  ACT_75TH_PCTILE:      '2013.admissions.act_scores.75th_percentile.cumulative',
  ACT_MIDPOINT:         '2013.admissions.act_scores.midpoint.cumulative',

  SAT_CUMULATIVE_AVERAGE:   '2013.admissions.sat_scores.average.overall',

  SAT_READING_25TH_PCTILE:  '2013.admissions.sat_scores.25th_percentile.critical_reading',
  SAT_READING_75TH_PCTILE:  '2013.admissions.sat_scores.75th_percentile.critical_reading',
  SAT_READING_MIDPOINT:     '2013.admissions.sat_scores.midpoint.critical_reading',

  SAT_MATH_25TH_PCTILE:     '2013.admissions.sat_scores.25th_percentile.math',
  SAT_MATH_75TH_PCTILE:     '2013.admissions.sat_scores.75th_percentile.math',
  SAT_MATH_MIDPOINT:        '2013.admissions.sat_scores.midpoint.math',

  SAT_WRITING_25TH_PCTILE:  '2013.admissions.sat_scores.25th_percentile.writing',
  SAT_WRITING_75TH_PCTILE:  '2013.admissions.sat_scores.75th_percentile.writing',
  SAT_WRITING_MIDPOINT:     '2013.admissions.sat_scores.midpoint.writing',

  NET_PRICE_CALC_URL:       'school.price_calculator_url'
};

picc.access = function(key) {
  return (typeof key === 'function')
    ? key
    : getter(key);
};

function getter(key) {
  if (typeof key !== 'string') {
    return function(d) { return d[key]; };
  }
  if (key.indexOf('.') > -1) {
    var bits = key.split('.');
    var len = bits.length;
    return function(d) {
      if (key in d) return d[key];
      for (var i = 0; i < len; i++) {
        d = d[bits[i]];
        if (d === null || d === undefined) return d;
      }
      return d;
    };
  }
  return function(d) { return d[key]; };
}

/**
 * This is a function composer for nested field accessors. It
 * takes an arbitrary number of arugments that may be strings,
 * integers or functions; the latter of which is evaluated to
 * get a *key* into the current nested object. E.g.:
 *
 * @example
 * var f = picc.access.composed('foo', picc.access.yearDesignation);
 * assert.equal({common_degree: '2', {foo: {lt_four_year: 1}}}, 1);
 * assert.equal({common_degree: '3', {foo: {four_year: 1}}}, 1);
 *
 * @argument ... key
 * @return {*}
 */
picc.access.composed = function(key0, key1, key2) {
  var keys = [].slice.call(arguments);
  var len = keys.length;
  return function nested(d) {

    var _keys = keys.map(function(key) {
      return (typeof key === 'function')
        ? key.call(this, d)
        : key;
    }, this);

    var _key = _keys.join('.');
    // console.log('_key:', _key);
    if (_key in d) return d[_key];

    var value = d;
    for (var i = 0; i < len; i++) {
      var key = keys[i];
      if (typeof key === 'function') {
        key = key.call(this, d);
        if (key === null) return key;
      }
      value = getter(key)(value);
      if (value === undefined || value === null) break;
    }
    return value;
  };
};

picc.access.publicPrivate = function(d) {
  var ownership = picc.access(picc.fields.OWNERSHIP)(d);
  switch (+ownership) {
    case 1: // public
      return 'public';

    case 2: // private
    case 3:
      return 'private';
  }
  return null;
};

picc.access.yearDesignation = function(d) {
  var degree = picc.access(picc.fields.PREDOMINANT_DEGREE)(d);
  switch (+degree) {
    case 2: // 2-year (AKA less than 4-year)
      return 'lt_four_year';
    case 3: // 4-year
      return 'four_year';
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

picc.access.netPrice = picc.access.composed(
  picc.fields.NET_PRICE
);

picc.access.netPriceByIncomeLevel = function(level) {
  return picc.access.composed(
    picc.fields.NET_PRICE_BY_INCOME,
    picc.access.publicPrivate,
    'by_income_level',
    level
  );
};


/*
// XXX this version of the median earnings accessor stringifies a
// numeric earnings value so that the old version of tagalong
// we're using doesn't treat 0 as empty
picc.access.earningsMedian = function(d) {
  var value = picc.access(picc.fields.MEDIAN_EARNINGS)(d);
  return typeof value === 'number'
    ? String(value)
    : value;
};
*/

picc.access.earningsMedian = picc.access.composed(
  picc.fields.MEDIAN_EARNINGS
);

picc.access.earnings25k = picc.access.composed(
  picc.fields.EARNINGS_GT_25K
);

picc.access.completionRate = picc.access.composed(
  picc.fields.COMPLETION_RATE
);

picc.access.partTimeShare = picc.access.composed(
  picc.fields.PART_TIME_SHARE
);

// only use full-time retention rate, branching on year designation
picc.access.retentionRate = function(d) {
  var retention = picc.access(picc.fields.RETENTION_RATE)(d);
  /* jshint ignore:start */
  return retention.four_year.full_time || retention.lt_four_year.full_time;
  /* jshint ignore:end */
};

picc.access.size = picc.access.composed(
  picc.fields.SIZE
);

picc.access.location = picc.access(picc.fields.LOCATION);

/**
 * Returns an array of special designation strings for a given school object.
 *
 * @param {Object} school the school data object
 * @return {Array} an array of human-readable strings
 */
picc.access.specialDesignations = function(d) {
  var designations = [];
  var SPECIAL_DESIGNATIONS = picc.SPECIAL_DESIGNATIONS || {};

  if (+picc.access(picc.fields.WOMEN_ONLY)(d)) {
    designations.push(SPECIAL_DESIGNATIONS.women_only);
  } else if (+picc.access(picc.fields.MEN_ONLY)(d)) {
    designations.push(SPECIAL_DESIGNATIONS.men_only);
  }

  var religious = picc.access(picc.fields.RELIGIOUS)(d);
  if (religious in picc.RELIGIOUS_AFFILIATIONS_BY_NUMBER) {
    designations.push(picc.RELIGIOUS_AFFILIATIONS_BY_NUMBER[religious]);
  }

  var minorityServing = picc.access(picc.fields.MINORITY_SERVING)(d);
  if (minorityServing) {
    for (var key in SPECIAL_DESIGNATIONS) {
      if (+minorityServing[key]) {
        designations.push(SPECIAL_DESIGNATIONS[key]);
      }
    }
  }

  return designations;
};

/**
 * Returns an array of program areas for a given school object from the API.
 *
 * @param {Object}  school  the school data object
 * @param {String?} field   the optional field in which to look for program
 *                          areas.
 * @return {Array}  an Array of Objects, each with `program` (the name) and
 *                  `value` (a decimal number or string representing its
 *                  share of student enrollment) properties.
 */
picc.access.programAreas = function(d, field) {
  if (!field) {
    field = picc.fields.PROGRAM_OFFERED + '.degree';
  }

  var programs = picc.access(field)(d);
  if (!programs) {
    return [];
  }

  return Object.keys(programs)
    .map(function(key) {
      var value = programs[key];
      var name = picc.PROGRAM_NAMES[key];
      return {
        program: name,
        value: +value
      };
    })
    .filter(function(d) {
      return d.value > 0;
    });
};

/**
 * @param {*} value
 * @return {*} `null` if `value === "NULL"`, otherwise the value as-is.
 */
picc.nullify = function(value) {
  return value === 'NULL' ? null : value;
};

picc.template = function(template) {
  template = String(template);
  return function(data) {
    return template.replace(/{\s*(\w+)\s*}/g, function(_k, key) {
      return picc.access(key)(data);
    });
  };
};

picc.template.resolve = function(template, data) {
  return picc.template(template).call(this, data);
};

// namespace for school-related stuff
picc.school = {};

/**
 * Common directives for school templates, for use with tagalong.
 */
picc.school.directives = (function() {
  var access = picc.access;
  var format = picc.format;
  var percent = format.percent();
  var fields = picc.fields;

  var href = function(d) {
    var name = access(fields.NAME)(d);
    name = name ? name.replace(/\W+/g, '-') : '(unknown)';
    return [
      picc.BASE_URL, '/school/?',
      d.id, '-', name
    ].join('');
  };

  var underInvestigation = {
    '@aria-hidden': function(d) {
      var flag = access(fields.UNDER_INVESTIGATION)(d);
      return +flag !== 1;
    }
  };

  var years = format.preddeg(fields.PREDOMINANT_DEGREE);

  return {
    title: {
      link: {
        text: access(fields.NAME),
        '@href': href
      }
    },

    school_link: {
      '@href':  format.href(fields.SCHOOL_URL),
      text: function(d) {
        var url = picc.access(fields.SCHOOL_URL)(d);
        if (!url) return url;
        // grab the domain, strip the leading "www."
        return url.split('/').shift().replace(/^www\./, '');
      }
    },

    share_link: {
      '@href': function(d) {
        return picc.template.resolve(
          this.getAttribute('data-href'),
          {url: encodeURIComponent(document.location.href)}
        );
      }
    },

    response_link: {
      '@href': function(d) {
        var href = format.href(fields.SCHOOL_URL)(d);
        if (href) {
          var suffix = '/CollegeScorecard';
          if (href.substr(-1) === '/') {
            href += suffix.substr(1);
          } else {
            href += suffix;
          }
          return href;
        }
        return '';
      }
    },

    name:           access(fields.NAME),
    city:           access(fields.CITY),
    state:          access(fields.STATE),

    under_investigation: underInvestigation,

    // FIXME this is a hack to deal with the issue of tagalong
    // not applying a directive to multiple elements
    under_investigation2: underInvestigation,

    size_number:    format.number(fields.SIZE),
    control: {
      '@class': format.controlClass(fields.OWNERSHIP),
      value: format.control(fields.OWNERSHIP)
    },
    locale_name: {
      '@class': format.localeClass(fields.LOCALE),
      value: format.locale(fields.LOCALE)
    },

    years: {
      '@class': function(d) {
        return years(d) ? 'n-year' : 'certificate';
      },
      number: years,
      label: function(d) {
        return years(d) ? 'Year' : 'Certificate';
      }
    },

    size_category: {
      '@class': format.sizeCategoryClass(fields.SIZE),
      value: format.sizeCategory(fields.SIZE)
    },

    // this is a direct accessor because some designations
    // (e.g. `women_only`) are at the object root, rather than
    // nested in `minority_serving`.
    special_designations: access.specialDesignations,

    average_cost: format.dollars(access.netPrice),
    average_cost_meter: {
      // '@max':     access.nationalStat('max', access.publicPrivate),
      // '@average': access.nationalStat('median', access.publicPrivate),
      '@value':   access.netPrice,
      label:      format.dollars(function() { return this.average; })
    },

    // income level net price stats
    net_price_income1: format.dollars(access.netPriceByIncomeLevel('0-30000')),
    net_price_income2: format.dollars(access.netPriceByIncomeLevel('30001-48000')),
    net_price_income3: format.dollars(access.netPriceByIncomeLevel('48001-75000')),
    net_price_income4: format.dollars(access.netPriceByIncomeLevel('75001-110000')),
    net_price_income5: format.dollars(access.netPriceByIncomeLevel('110001-plus')),

    advantage_rate: format.percent(fields.EARNINGS_GT_25K),

    grad_rate: format.percent(access.completionRate),
    grad_rate_meter: {
      // '@average': access.nationalStat('median', access.yearDesignation),
      '@value':   access.completionRate,
      label:      format.percent(function() { return this.average; })
    },

    average_salary: format.dollars(access.earningsMedian),
    average_salary_meter: {
      '@value': access.earningsMedian,
      // '@average': access.nationalStat('median', access.yearDesignation),
      label:    format.dollars(function() { return this.average; })
    },

    repayment_rate_percent: format.percent(fields.REPAYMENT_RATE),
    repayment_rate_meter: {
      '@value': access(fields.REPAYMENT_RATE),
      // '@average': access.nationalStat('median', access.yearDesignation),
      label:    format.percent(function() { return this.average; })
    },

    average_total_debt: format.dollars(fields.AVERAGE_TOTAL_DEBT),
    average_monthly_loan_payment: format.dollars(fields.MONTHLY_LOAN_PAYMENT),

    federal_aid_percentage: format.percent(fields.AID_PERCENTAGE),
    pell_grant_percentage: format.percent(fields.PELL_PERCENTAGE),

    earnings_gt_25k: format.percent(access.earnings25k),
    earnings_gt_25k_meter: {
      '@value': access.earnings25k,
      label:    format.percent(function() { return this.average; })
    },

    retention_rate_value: format.percent(access.retentionRate),
    retention_rate_meter: {
      '@value': access.retentionRate,
      label:    format.percent(function() { return this.average; })
    },

    full_time_percent: format.number(function(d) {
      var pt = access.partTimeShare(d);
      return pt === null ? null : 100 * (1 - pt);
    }),

    part_time_percent: format.number(function(d) {
      var pt = access.partTimeShare(d);
      return pt === null ? null : 100 * pt;
    }),

    gender_values: function(d) {
      var female = access(fields.FEMALE_SHARE)(d);
      if (female === null) return [];
      female = +female;
      return [
        {label: 'Female', value: female, percent: percent(female)},
        {label: 'Male', value: 1 - female, percent: percent(1 - female)}
      ];
    },

    race_ethnicity_values: function(d) {
      var values = access(fields.RACE_ETHNICITY)(d);
      if (!values) return [];
      return Object.keys(values)
        .map(function(key) {
          var value = picc.nullify(values[key]);
          var label = picc.RACE_ETHNICITY_LABELS[key] || key;
          return {
            key:      key,
            label:    label,
            value:    value,
            percent:  value >= .005
              ? percent(value)
              : '<1%'
          };
        })
        .filter(function(d) {
          return d.value > 0;
        });
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
      var areas = access.programAreas(d, fields.PROGRAM_PERCENTAGE);
      // copy the "value" key to "percent"
      areas.forEach(function(d) {
        d.percent = d.value > 0.005
          ? percent(d.value)
          : '<1%';
      });
      return areas
        .sort(function(a, b) {
          return d3.descending(a.value, b.value);
        })
        .slice(0, 5);
    },

    programs_plural: format.plural(function(d) {
      return access.programAreas(d).length;
    }, 'Program'),

    age_entry: function(d) {
      var age = picc.access(fields.AGE_ENTRY)(d);
      return age ? age : NA;
    },

    more_link: {
      '@href': href
    },

    act_scores_visible: {
      '@aria-hidden': format.empty(fields.ACT_MIDPOINT),
    },
    act_scores_invisible: {
      '@aria-hidden': format.notEmpty(fields.ACT_MIDPOINT),
    },
    act_scores: {
      '@lower': access(fields.ACT_25TH_PCTILE),
      '@upper': access(fields.ACT_75TH_PCTILE),
      // '@middle': access(fields.ACT_MIDPOINT),
    },

    sat_reading_scores_visible: {
      '@aria-hidden': format.empty(fields.SAT_READING_MIDPOINT),
    },
    sat_reading_scores_invisible: {
      '@aria-hidden': format.notEmpty(fields.SAT_READING_MIDPOINT),
    },
    sat_reading_scores: {
      '@lower': access(fields.SAT_READING_25TH_PCTILE),
      '@upper': access(fields.SAT_READING_75TH_PCTILE),
      // '@middle': access(fields.SAT_READING_MIDPOINT),
    },

    sat_math_scores_visible: {
      '@aria-hidden': format.empty(fields.SAT_MATH_MIDPOINT),
    },
    sat_math_scores_invisible: {
      '@aria-hidden': format.notEmpty(fields.SAT_MATH_MIDPOINT),
    },
    sat_math_scores: {
      '@lower': access(fields.SAT_MATH_25TH_PCTILE),
      '@upper': access(fields.SAT_MATH_75TH_PCTILE),
      // '@middle': access(fields.SAT_MATH_MIDPOINT),
    },

    sat_writing_scores_visible: {
      '@aria-hidden': format.empty(fields.SAT_WRITING_MIDPOINT),
    },
    sat_writing_scores_invisible: {
      '@aria-hidden': format.notEmpty(fields.SAT_WRITING_MIDPOINT),
    },
    sat_writing_scores: {
      '@lower': access(fields.SAT_WRITING_25TH_PCTILE),
      '@upper': access(fields.SAT_WRITING_75TH_PCTILE),
      // '@middle': access(fields.SAT_WRITING_MIDPOINT),
    },

    net_price_calculator: {
      '@href': format.href(fields.NET_PRICE_CALC_URL)
    }
  };

})();


// form utilities
picc.form = {};

/**
 * These are mappings of values for common form fields from
 * URL- (and human-) friendly values to ones that the API
 * recognizes.
 */
picc.form.mappings = {
  sort: {
    advantage:          picc.fields.EARNINGS_GT_25K,
    salary:             picc.fields.MEDIAN_EARNINGS,
    name:               picc.fields.NAME,
    size:               picc.fields.SIZE,
    avg_net_price:      picc.fields.NET_PRICE,
    completion_rate:    picc.fields.COMPLETION_RATE,
  },

  control: {
    'public': 1,
    'private': 2,
    'profit': 3
  },

  size: {
    small:  '..1999',
    medium: '2000..15000',
    large:  '15001..'
  },

  degree: {
    a: '2',
    b: '3'
  }
};

/**
 * Adds a "submit" listener to the provided formdb.Form instance (or CSS
 * selector) that intercepts its data, formats it as a querystring, then does
 * a client-side redirect with window.location, effectively removing the
 * query string parameters for empty inputs.
 *
 * @param {String|Object} form  the form CSS selector or `formdb.Form`
 *                              instance.
 * @return {Object} the `formdb.Form` instance.
 */
picc.form.minifyQueryString = function(form) {

  // allow form to be a CSS selector
  if (typeof form !== 'object') {
    form = new formdb.Form(form);
  }

  form.on('submit', function(data, e) {
    var url = [
        form.element.action,
        querystring.stringify(data)
      ]
      .join('?')
      .replace('?&', '?')
      .replace(/&{2,}/g, '&')
      .replace(/&$/, '');

    window.location = url;
    e.preventDefault();
    return false;
  });

  return form;
};

/**
 *
 */
picc.form.prepareParams = (function() {
  var fields = picc.fields;

  var alias = {
    name:                 fields.NAME,

    // slider ranges
    avg_net_price:        fields.NET_PRICE + '__range',
    completion_rate:      fields.COMPLETION_RATE + '__range',
    median_earnings:      fields.MEDIAN_EARNINGS + '__range',
    monthly_payments:     fields.MONTHLY_LOAN_PAYMENT + '__range',

    religious:            fields.RELIGIOUS,

    // special designations: women/men only, minority groups
    serving: function(query, value, key) {
      var field = [fields.MINORITY_SERVING, value].join('.');
      switch (value) {
        case 'men_only':
          field = fields.MEN_ONLY;
          break;
        case 'women_only':
          field = fields.WOMEN_ONLY;
          break;
      }
      query[field] = 1;
      delete query[key];
    },

    state:                fields.STATE,

    zip: function(query, value, key) {
      // if there is no distance query, use the fully-qualified zip code
      // field to match schools in that zip
      if (!query.distance) {
        query[fields.ZIP_CODE] = value;
        delete query[key];
      }
      // (the default will submit `zip=x&distance=y`,
      // which is what the API expects)
    },

    control: function(query, value, key) {
      value = mapControl(value);
      picc.data.rangify(query, fields.OWNERSHIP, value);
      delete query[key];
    },

    region: function(query, value, key) {
      picc.data.rangify(query, fields.REGION_ID, value);
      delete query[key];
    },

    sort: function(query, value, key) {
      var bits = String(value).split(':');
      value = bits[0];
      bits[0] = picc.form.mappings.sort[value];
      if (!bits[0]) {
        console.warn('unmapped sort value:', value);
        bits[0] = value;
      }
      query[key] = bits.join(':');
    },

    major: function(query, value, key) {
      var subfield = 'degree';
      // XXX query.degree *may* have been mapped with mapDegree(),
      // so we switch on either the input values or the output values
      switch (query.degree) {
        case 'a':
        case '2':
          subfield = 'assoc';
          break;
        case 'b':
        case '3':
          subfield = 'bachelors';
          break;
      }
      var k = [fields.PROGRAM_OFFERED, subfield, value].join('.');
      query[k + '__range'] = '1..';
      delete query[key];
    },

    size: function(query, value, key) {
      value = mapSize(value);
      query[picc.fields.SIZE + '__range'] = Array.isArray(value)
        ? value.join(',')
        : value;
      delete query[key];
    },

    degree: function(query, value, key) {
      if (value === 'a') {
        query[picc.fields.DEGREE_OFFERED + '.assoc'] = true;
      } else if (value === 'b') {
        query[picc.fields.DEGREE_OFFERED + '.bachelors'] = true;
      }
      delete query[key];
    },

    // XXX: this is only used for testing
    under_investigation:  picc.fields.UNDER_INVESTIGATION,
  };

  // map a size or array of sizes to API-friendly range values
  function mapSize(value) {
    if (Array.isArray(value)) {
      return value.map(mapSize);
    }
    return picc.form.mappings.size[value];
  }

  // map a degree string ('', 'a' or 'b') or array of strings to an
  // API-friendly "predominant degree" range value
  function mapDegree(value) {
    if (Array.isArray(value)) {
      return value.map(mapDegree);
    }
    return picc.form.mappings.degree[value];
  }

  function mapControl(value) {
    if (Array.isArray(value)) {
      return value.map(mapControl);
    }
    return picc.form.mappings.control[value];
  }

  // returns true if a value is an empty string, null, undefined, or an array
  // with an empty 0 index value
  function empty(value) {
    return value === ''
        || value === null
        || value === undefined
        || (Array.isArray(value) && empty(value[0]));
  }

  return function prepareParams(params) {

    var query = picc.data.extend({}, params);

    // only get open schools
    query[fields.OPERATING] = 1;

    // ignore distance if no zip is provided
    if (query.distance && !query.zip) {
      console.warn('distance provided without zip; ignoring', query);
      delete query.distance;
    }

    // by default, filter out schools for which school.size is null
    // with a numeric range query
    if (!query.size) {
      query[fields.SIZE + '__range'] = '0..';
    }

    /*
    // if "online" is truthy, then we should *include* online schools,
    // which means not filtering on that field
    if (query.online) {
    } else {
      // otherwise (if query.online is falsy), filter by fields.ONLINE_ONLY=0
      query[fields.ONLINE_ONLY] = 0;
    }
    delete query.online;
    */

    if (!query.degree) {
      query[fields.DEGREE_OFFERED + '.assoc_or_bachelors'] = true;
    }

    for (var key in query) {
      var v = query[key];

      // delete empty keys
      if (empty(v)) {
        delete query[key];
        continue;
      }

      var k = alias[key];
      switch (typeof k) {
        case 'function':
          k(query, v, key);
          break;

        case 'string':
          query[k] = v;
          delete query[key];
          break;
      }
    }

    for (key in query) {
      if (query[key] === null || query[key] === undefined) {
        delete query[key];
      }
    }

    // set the predominant degree to range '1..3' because ED expert guidance
    query[picc.fields.PREDOMINANT_DEGREE + '__range'] = '1..3';

    // set the highest degree to range '2..4' to exclude certificate only schools
    query[picc.fields.HIGHEST_DEGREE + '__range'] = '2..4';

    return query;
  };

})();


// UI tools
picc.ui = {};

/**
 * Expand all of the accordions on the page (or only those matching the
 * provided selector) according to an `expanded` value or function.
 *
 * @param {String?} selector  an optional CSS selector to find accordions.
 *                            The default is `"aria-accordion"`.
 * @param {Boolean|Function} expanded a value or function that should return
 *                                    `true` for expanded accordions, and
 *                                    `false` otherwise.
 */
picc.ui.expandAccordions = function(selector, expanded) {
  if (arguments.length === 1) {
    expanded = selector;
    selector = null;
  }
  if (!selector) {
    selector = 'aria-accordion';
  }
  expanded = d3.functor(expanded);
  return d3.selectAll(selector)
    .filter(function() {
      return !!expanded.apply(this, arguments);
    })
    .property('expanded', true);
};

/**
 * Calls the `callback` function immediately if `document.readyState ===
 * 'complete'`, otherwise calls it when the window dispatches a `load` event.
 *
 * @param {Function} callback
 * @return {Boolean} `true` if called immediately, `false` otherwise.
 */
picc.ready = function(callback) {
  if (document.readyState === 'complete') {
    callback();
    return true;
  } else {
    window.addEventListener('load', callback);
    return false;
  }
};

/**
 * A function debouncer. This returns a function that will call `fn` after
 * `delay` milliseconds, and will squash previous calls to avoid race
 * conditions. In this example, the `update` function will only be called
 * once, 100ms later:
 *
 * @example
 * var deferredUpdate = picc.debounce(update, 100);
 * deferredUpdate();
 * deferredUpdate();
 *
 * @param {Function} fn   the function to call
 * @param {Number} delay  the call delay in milliseconds
 * @return {Function}     the wrapped function, which returns a
 *                        `setTimeout()` identifier for canceling.
 */
picc.debounce = function(fn, delay) {
  var timeout;
  return function() {
    var context = this;
    var args = arguments;
    clearTimeout(timeout);
    return timeout = setTimeout(function() {
      fn.apply(context, args);
    }, delay);
  };
};

/**
* Debounced version of the picc.API.search function, used to debounce
* autocomplete API requests for the school name field on the search form
*/
picc.API.debounced_search = picc.debounce(picc.API.search, 200);

/**
 * This is an event delegation helper that allows us to listen for events on
 * a parent element and call the handler iff (if and only if) the qualify
 * function returns true for the event's target element.
 *
 * The advantage of this approach is that we don't have to add listeners to
 * specific elements, which means that we don't have to add and remove
 * listeners whenever templated elements are added and removed from the DOM.
 *
 * We use this to implement tooltips by listening for mouseenter/mouseleave
 * and focus/blur events on the body and only calling the event handler if
 * the target element has an aria-describedy attribute that begins with
 * "tip-".
 *
 * @example
 * picc.delegate(document.body, function(target) {
 *   return target.hasAttribute('data-alert');
 * }, 'click', function(e) {
 *   alert(e.target.getAttribute('data-alert'));
 * });
 *
 * @argument {Element} root       the top-most element at which events should
 *                                be captured
 * @argument {Function} qualify   this function should return `true` for a
 *                                given element if the handler is to be called
 * @argument {*} event            the event or events to listen for, which
 *                                can be specified as a string (single event),
 *                                an Array (multiple events), or an Object
 *                                mapping event types to listeners.
 * @return {Object|Function}      the delegated event listener(s), which you
 *                                can pass to `root.removeEventListener()`.
 *                                The structure matches that of the `event`
 *                                parameter.
 */
picc.delegate = function(root, qualify, event, listener) { if
  (Array.isArray(event)) {
    return event.map(function(e) {
      return picc.delegate(root, qualify, e, listener);
    });
  }

  if (typeof event === 'object') {
    var listeners = {};
    for (var e in event) {
      listeners[e] = picc.delegate(root, qualify, e, event[e]);
    }
    return listeners;
  }

  var _listener = function(e) {
    if (qualify.call(e.target, e)) {
      listener.call(e.target, e);
    }
  };
  root.addEventListener(event, _listener, true);
  return listener;
};

// data tools
picc.data = {};

picc.data.extend = function(obj, a, b) {
  for (var i = 1, len = arguments.length; i < len; i++) {
    var arg = arguments[i];
    if (typeof arg === 'object') {
      for (var key in arg) obj[key] = arg[key];
    }
  }
  return obj;
};

picc.data.rangify = function(obj, key, values) {
  if (Array.isArray(values)) {
    switch (values.length) {
      case 0:
        values = '';
        break;
      case 1:
        values = values[0];
        break;
    }
  }

  if (!Array.isArray(values)) {
    values = String(values);
    if (values.indexOf('..') > -1) {
      obj[key + '__range'] = values;
    } else if (values) {
      obj[key] = values;
    }
    return obj;
  }

  values = values.map(Number)
    .sort(d3.ascending);

  var range = [values.shift()];
  var ranges = [range];
  while (values.length) {
    var value = values.shift();
    var previous = range[range.length - 1];
    if (value === previous + 1) {
      range.push(value);
    } else {
      ranges.push(range = [value]);
    }
  }

  obj[key + '__range'] = ranges.map(function(range, i) {
    var min = range.shift();
    var max = range.length ? range.pop() : min;
    if (min === max) {
      switch (i) {
        case 0:
          return '..' + min;
        case ranges.length - 1:
          return max + '..';
      }
    }
    return [min, max].join('..');
  }).join(',');

  return obj;
};

picc.data.selectKeys = function(obj, keys) {
  var copy = {};
  keys.forEach(function(key) {
    if (key in obj) {
      copy[key] = obj[key];
    } else {
      console.warn('no such key in source object:', key, obj);
    }
  });
  return copy;
};

/**
 * Tooltip helper functions.
 */
picc.tooltip = {

  /**
   * This is an hover/focus event listener that will attach the corresponding
   * tooltip to this element's tooltip-target.
   */
  show: function showTooltip(e) {
    clearTimeout(this.__tooltipShowTimeout);

    var tooltip = this.tooltip;
    if (!tooltip) {
      tooltip = document.getElementById(this.getAttribute('aria-describedby'));
      if (!tooltip) {
        return console.warn('no tooltip found for:', this);
      }
      this.tooltip = tooltip;
    }

    var parent = this;
    var ref = this.querySelector('.tooltip-target') || this;
    var show = function() {
      // console.log('show tooltip:', this, tooltip);
      tooltip.setAttribute('aria-hidden', false);
      var click;
      // d3 makes this a lot simpler with exclusive listeners
      var win = d3.select(window)
        .on('click.tooltip', click = function(e) {
          win.on('click.tooltip', null);
          if (parent.contains(tooltip)) {
            picc.tooltip.hide.call(parent, e);
          } else {
            console.warn('ignoring click on unowned tooltip:', parent, tooltip);
          }
        }, true);
      picc.tooltip.constrain(tooltip, ref);
    };

    if (e.type === 'click') {
      show();
    } else {
      this.__tooltipShowTimeout = setTimeout(show, 200);
    }
  },

  /**
   * This is an leave/blur event listener that will hide the attached
   * tooltip, but leave it in place for debugging.
   */
  hide: function hideTooltip() {
    clearTimeout(this.__tooltipShowTimeout);
    if (!this.tooltip) return;
    this.tooltip.setAttribute('aria-hidden', true);
    if (this.tooltip.originalParent) {
      this.tooltip.originalParent.appendChild(this.tooltip);
    }
    this.tooltip = null;
  },

  toggle: function toggleTooltip(e) {
    if (this.tooltip && this.tooltip.getAttribute('aria-hidden') !== 'false') {
      picc.tooltip.hide.call(this, e);
    } else {
      picc.tooltip.show.call(this, e);
    }
  },

  /**
   * This helper function positions the tooltip relative to its target
   * parent by measuring the size of both and their position relative to the
   * viewport (`window.innerWidth` and `window.innerHeight`) so that the
   * tooltip's content (`.tooltip-content`) can be shifted left, right, up or
   * down accordingly.
   */
  constrain: function(tooltip, parent) {
    // remove the tooltip so we can accurately calculate
    // the outer element's size
    if (parent === tooltip.parentNode) {
      parent.removeChild(tooltip);
    } else {
      tooltip.originalParent = tooltip.parentNode;
    }

    var content = tooltip.querySelector('.tooltip-content') || tooltip;
    content.style.removeProperty('left');

    var outer = parent.getBoundingClientRect();
    parent.appendChild(tooltip);

    var rect = content.getBoundingClientRect();

    var margin = 10;
    var offsetWidth = (rect.width - outer.width) / 2;
    var halfWidth = rect.width / 2;
    var bump = -halfWidth;

    var left = outer.left - offsetWidth;
    var leftEdge = margin / 2;
    var right = outer.right + offsetWidth;
    var rightEdge = window.innerWidth - margin * 2;

    if (right > rightEdge) {
      bump -= right - rightEdge;
    } else if (left < leftEdge) {
      bump += leftEdge - left;
    }

    if (bump) {
      content.style.left = Math.round(bump) + 'px';
    } else {
      content.style.removeProperty('left');
    }

    var bottom = outer.bottom + rect.height;
    var above = bottom > window.innerHeight;
    tooltip.classList.toggle('tooltip_above', above);
    tooltip.classList.toggle('tooltip_below', !above);
  }
};

/**
 * page-specific functions
 */
picc.pages = {
  index: require('./index'),
  search: require('./search'),
  school: require('./school')
};


// only do this stuff in the browser
if (typeof document !== 'undefined') {

  /**
   * add event listeners for the tooltips by listening for mouseenter,
   * mouseleave, focus and blur events on elements that have an
   * aria-describedby attribute that begins with "tip-".
   */
  picc.ready(function() {
    var described = 'aria-describedby';
    picc.delegate(
      document.body,
      // if the element matches '[aria-describedby^="tip-"]'
      function() {
        return this.hasAttribute(described)
            && this.getAttribute(described).match(/^tip-/);
      },
      // XXX this is a *very* rudimentary way to detect whether the browser
      // supports touch events.
      document.body.ontouchstart
        // with touch enabled, only show on focus/blur and click/tap
        ? {
          focus:      picc.tooltip.show,
          blur:       picc.tooltip.hide,
          click:      picc.tooltip.toggle
        }
        // otherwise, show on enter/leave and focus/blur
        : {
          mouseenter: picc.tooltip.show,
          mouseleave: picc.tooltip.hide,
          focus:      picc.tooltip.show,
          blur:       picc.tooltip.hide,
        }
    );
  });

  // set the "dragging" class when the mouse is down
  d3.select(document)
    .on('mousedown', function(e) {
      clearTimeout(this.__dragTimeout);
      var body = this.body;
      this.__dragTimeout = setTimeout(function() {
        // console.info('+ drag');
        body.classList.add('dragging');
      }, 100);
    })
    .on('mouseup', function(e) {
      clearTimeout(this.__dragTimeout);
      // console.info('- drag');
      this.body.classList.remove('dragging');
    })
    .on('click', function(e) {
      clearTimeout(this.__dragTimeout);
      // console.info('- drag');
      this.body.classList.remove('dragging');
    });

  /**
   * Adds listener and attaches autocomplete/dropdown functionality
   * to the name field in the form with given selector. Called on
   * both index and search pages.
   *
   * @param {String} form selector
   */
  picc.form.autocompleteName = function(formSelector) {
    var field = jQuery(formSelector).find('#name-school');

    field.typeahead({
      minLength: 3,
      highlight: true,
      hint: false
    }, {
      name: 'schools',
      limit: 10, //limit high to counteract typeahead.js bug
      display: picc.fields.NAME,
      source: function(q, syncResults, asyncResults) {
        //fashion basic query object to pass to API.search
        var query = { fields: picc.fields.NAME, per_page: 5 }
        query[picc.fields.NAME] = q;
        query = picc.form.prepareParams(query);

        //uses debounced search call to avoid API spam
        picc.API.debounced_search(query, function(error, data) {
          if (error) { return {}; }
          asyncResults(data.results);
        });
      }
    });
  };
}

module.exports = picc;
