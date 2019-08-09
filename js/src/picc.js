'use strict';

if (typeof window !== 'undefined') {
  // for polyfilling common JS APIs
  require('aight');
  require('element-closest');
  require('element-dataset').default();

  // web components
  if(!window.customElements) {
    // polyfill custom elements v1
    require('document-register-element');
  }
  require('./components');
  var tagalong = require('./tagalong');
  var jQuery = require("jquery");
  var typeahead = require("typeahead.js-browserify");
  typeahead.loadjQueryPlugin(); //attach jQuery
}

var querystring = require('querystring');
var d3 = require('d3');
var async = require('async');
var formdb = require('formdb');

// create the global picc namespace
var picc = {};

// common error messages
picc.errors = {
  NO_SCHOOL_ID: 'No school ID was provided.',
  NO_SUCH_SCHOOL: 'No school found.',
  NO_SCHOOLS_TO_COMPARE: 'No schools selected to compare.'
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
   * @param {String|Number} id - The school primary key identifier
   * @param {object}  params - Optional query params to append to the school's query;
   *                            most useful for a `fields` query
   * @param {Function} done - The callback function, as in
   *                            `picc.API.get()`, that receives a single
   *                            school's data as its second parameter on
   *                            success.
   */
  API.getSchool = function(id, params, done) {
    var queryParams = {};
    if (arguments.length === 2) {
      done = params;
    } else if (arguments.length === 3) {
      queryParams = picc.data.extend(queryParams, params);
    }
    queryParams[idField] = id;
    return API.get(schoolEndpoint, queryParams, function(error, res) {
      if (error || !res.metadata.total) {
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
    var round = false,
        percent = false;
    if (typeof fmt === 'string') {
      round = !!fmt.match(/d$/);
      percent = !round;
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
        if (percent) {
          // percentage rounding fix
          value = Math.round(parseFloat(value*100).toPrecision(12)) / 100;
        }
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
  // OPEID8:               'ope8_id',
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

  SIZE:                 'latest.student.size',
  ONLINE_ONLY:          'school.online_only',
  MAIN:                 'school.main_campus',
  BRANCHES:             'school.branches',

  WOMEN_ONLY:           'school.women_only',
  MEN_ONLY:             'school.men_only',
  MINORITY_SERVING:     'school.minority_serving',

  PREDOMINANT_DEGREE:   'school.degrees_awarded.predominant',
  HIGHEST_DEGREE:       'school.degrees_awarded.highest',
  UNDER_INVESTIGATION:  'school.under_investigation',
  AID_ELIGIBILITY:      'school.title_iv.eligibility_type',

  // net price
  NET_PRICE:            'latest.cost.avg_net_price.overall',
  NET_PRICE_BY_INCOME:  'latest.cost.net_price',

  // completion rate
  COMPLETION_RATE:      'latest.completion.rate_suppressed.overall',

  RETENTION_RATE:       'latest.student.retention_rate_suppressed',

  REPAYMENT_RATE:       'latest.repayment.3_yr_repayment_suppressed.overall',

  AVERAGE_TOTAL_DEBT:   'latest.aid.median_debt_suppressed.completers.overall',
  MONTHLY_LOAN_PAYMENT: 'latest.aid.median_debt_suppressed.completers.monthly_payments',

  AID_PERCENTAGE:       'latest.aid.federal_loan_rate',
  PELL_PERCENTAGE:      'latest.aid.pell_grant_rate',

  MEDIAN_EARNINGS:      'latest.earnings.10_yrs_after_entry.median',

  EARNINGS_GT_25K:      'latest.earnings.6_yrs_after_entry.percent_greater_than_25000',

  PROGRAM_PERCENTAGE:   'latest.academics.program_percentage',
  PROGRAM_OFFERED:      'latest.academics.program',
  DEGREE_OFFERED:       'latest.academics.program_available',

  PART_TIME_SHARE:      'latest.student.part_time_share',
  FEMALE_SHARE:         'latest.student.demographics.female_share',
  RACE_ETHNICITY:       'latest.student.demographics.race_ethnicity',
  AGE_ENTRY:            'latest.student.demographics.age_entry',

  ACT_25TH_PCTILE:      'latest.admissions.act_scores.25th_percentile.cumulative',
  ACT_75TH_PCTILE:      'latest.admissions.act_scores.75th_percentile.cumulative',
  ACT_MIDPOINT:         'latest.admissions.act_scores.midpoint.cumulative',

  SAT_CUMULATIVE_AVERAGE:   'latest.admissions.sat_scores.average.overall',

  SAT_READING_25TH_PCTILE:  'latest.admissions.sat_scores.25th_percentile.critical_reading',
  SAT_READING_75TH_PCTILE:  'latest.admissions.sat_scores.75th_percentile.critical_reading',
  SAT_READING_MIDPOINT:     'latest.admissions.sat_scores.midpoint.critical_reading',

  SAT_MATH_25TH_PCTILE:     'latest.admissions.sat_scores.25th_percentile.math',
  SAT_MATH_75TH_PCTILE:     'latest.admissions.sat_scores.75th_percentile.math',
  SAT_MATH_MIDPOINT:        'latest.admissions.sat_scores.midpoint.math',

  SAT_WRITING_25TH_PCTILE:  'latest.admissions.sat_scores.25th_percentile.writing',
  SAT_WRITING_75TH_PCTILE:  'latest.admissions.sat_scores.75th_percentile.writing',
  SAT_WRITING_MIDPOINT:     'latest.admissions.sat_scores.midpoint.writing',

  NET_PRICE_CALC_URL:       'school.price_calculator_url',

  // program reporters
  PROGRAM_REPORTER_OFFERED: 'latest.academics.program_reporter.programs_offered',
  PROGRAG_REPORTER_CIP:     'cip_6_digit',
  PROGRAM_REPORTER_COST:    'latest.cost.program_reporter',
  PROGRAM_REPORTER_PROGRAM: 'latest.academics.program_reporter',
};

picc.programReporterCip = {
  1: 'program_1',
  2: 'program_2',
  3: 'program_3',
  4: 'program_4',
  5: 'program_5',
  6: 'program_6'
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

picc.access.branchCampus = function(d) {
  var branch_count = picc.access(picc.fields.BRANCHES)(d);
  return +branch_count > 1;
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

picc.access.raceEthnicityValueByKey = function(key) {
  return picc.fields.RACE_ETHNICITY + '.' + key;
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
  if (retention) {
    var fourYear = retention.four_year.full_time_pooled;
    return (fourYear || fourYear === 0) ? fourYear : retention.lt_four_year.full_time_pooled;
  }
  // data result key may be a full path dotted-string
  retention = picc.access(picc.fields.RETENTION_RATE + ".four_year.full_time_pooled")(d);
  return ( retention || retention === 0) ? retention : picc.access(picc.fields.RETENTION_RATE + ".lt_four_year.full_time_pooled")(d) ;
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

picc.access.isProgramReporter = function(d) {
  return picc.access(picc.fields.PROGRAM_REPORTER_OFFERED)(d);
}

picc.access.largestProgramsReported = function(d, basis) {

  if (!picc.access.isProgramReporter) return [];

  if(!basis) {
    basis = 'full_program';
  }

  const otherBasis = (basis === 'full_program') ? 'annualized' : 'full_program';

  return Object.entries(picc.programReporterCip).map(item => {
    let program = picc.access.composed(
      picc.fields.PROGRAM_REPORTER_PROGRAM,
      item[1],
      picc.fields.PROGRAG_REPORTER_CIP,
      'title'
    )(d);

    if (program) {
      program = program.replace(/\//g," / "); // space out slash so we can break word on mobile
    }

    const cost = picc.access.composed(
      picc.fields.PROGRAM_REPORTER_COST,
      item[1],
      picc.fields.PROGRAG_REPORTER_CIP,
      basis
    )(d);

    const costDollar = picc.format.dollars()(cost);

    const otherCost = picc.access.composed(
      picc.fields.PROGRAM_REPORTER_COST,
      item[1],
      picc.fields.PROGRAG_REPORTER_CIP,
      otherBasis
    )(d);

    const otherCostDollar = picc.format.dollars()(otherCost);

    const costs = {
      [basis]: costDollar,
      [otherBasis]: otherCostDollar
    };

    const isYearLong = (cost === otherCost);

    const duration = picc.access.composed(
      picc.fields.PROGRAM_REPORTER_PROGRAM,
      item[1],
      picc.fields.PROGRAG_REPORTER_CIP,
      'avg_month_completion'
    )(d);

    return {
      program,
      cost: costDollar,
      costs,
      duration,
      isYearLong,
      basis
    }
  }).filter(item => item.program);
};

picc.access.largestProgramReported = function(d) {

  let largestProgram = picc.access.largestProgramsReported(d).shift();
  if (!largestProgram) return;

  // the net price is always the cost of the largest program for program-reporter schools,
  // which includes living expenses
  const cost = picc.format.dollars(picc.access.netPrice)(d);

  const costDescription = largestProgram.isYearLong
    ? `for a ${largestProgram.duration}-month program`
    : `per year on average`;

  return {
    ...largestProgram,
    cost,
    costDescription
  };
};

picc.access.awardLevels = function(d, preddegree) {
  // return values are whether the institution offers other kind of degrees/certs than the predominant degree
  // if they do we return the glossary term key to display or false to disable the tooltip
  switch(preddegree) {
    case 1:
      return (picc.access(picc.fields.DEGREE_OFFERED + '.assoc_or_bachelors')(d)) ? 'certificate' : false;
    case 2:
      return (picc.access(picc.fields.DEGREE_OFFERED + '.certificate')(d) || picc.access(picc.fields.DEGREE_OFFERED + '.bachelors')(d)) ? '2-year' : false;
    case 3:
      return (picc.access(picc.fields.DEGREE_OFFERED + '.certificate')(d) || picc.access(picc.fields.DEGREE_OFFERED + '.assoc')(d)) ? '4-year' : false;
  }
  return false;
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

  // binds data to select-controlled value
  var raceEthnicity = function(d) {
    var select = document.getElementById('race_ethnicity');
    var selectValue = (select) ? access(picc.access.raceEthnicityValueByKey(select.value))(d) : null;
    return (selectValue >= .005 || selectValue === 0) ? format.percent('selectValue')({'selectValue':selectValue}) : (selectValue) ? '<1%' : 'No Data Available';
  };

  // binds data to select-controlled value
  var netPricebyIncomeLevelValue = function(d) {
    var select = document.getElementById('net_price_income');
    return (select) ? picc.school.directives[select.value].call(this, d) : null;
  };

  var years = format.preddeg(fields.PREDOMINANT_DEGREE);

  var meterMedian = function(el, degreeType) {

    // simply using the overall national median per ED
    return el.getAttribute('median');

    // switch(degreeType) {
    //   case 3:
    //     return el.getAttribute('data-median-four_year');
    //   case 2:
    //     return el.getAttribute('data-median-two_year');
    //   case 1:
    //     return el.getAttribute('data-median-cert');
    // }
  };

  var medianLine = {
    '@style': function() {
      var type = this.getAttribute('data-meter');
      // var medianType = this.getAttribute('data-median');
      var medianType = 'median';
      var meter = this.closest('.compare-container_group').querySelector('[data-bind="'+type+'"]');

      if (!meter) { return ''; }

      var min = meter.getAttribute('min') || 0;
      var max = meter.getAttribute('max') || 1;
      var median = meter.getAttribute(medianType);

      var scale = function(v) {
        return (v - min) / (max - min) * 100;
      };
      var value = Math.max(min, Math.min(+median, max));
      var right = Math.max(0, value);

      // median lines are better represented
      // when dollars fixedTo `1`, percentages to `0`
      var fixNum = (max  > 1) ? 1 : 0;

      var style = '';
      style +='right:'+ (100 - scale(right)).toFixed(fixNum) + '%;';
      return style;
    },
    label: {
      text: function() {
        var type = this.closest('[data-meter]').getAttribute('data-meter');
        // var medianType = this.closest('[data-median]').getAttribute('data-median');
        var medianType = 'median';
        var meter = this.closest('.compare-container_group').querySelector('[data-bind="' + type + '"]');
        if (!meter) { return ''; }
        switch (type) {
          case 'average_cost_meter':
          case 'average_salary_meter':
          case 'average_total_debt_meter':
          case 'average_monthly_loan_payment_meter':
            return format.dollars( function() { return meter.getAttribute(medianType); })(medianType);
          case 'grad_rate_meter':
          case 'repayment_rate_meter':
          case 'retention_rate_meter':
            return format.percent(function () { return meter.getAttribute(medianType); })(medianType);
          default:
            return meter.median;
        }
      }
    }
  };

  var searchShareLink = {
    '@href': function(d) {
      return picc.template.resolve(
        this.getAttribute('data-href'),
        {url: encodeURIComponent(document.location.href)}
      );
    }
  };

  var schoolShareLink = {
    '@href': function(d) {
      return picc.template.resolve(
        this.getAttribute('data-href'),
        {url: encodeURIComponent(document.location.href)}
      );
    }
  };

  var compareShareLink = {
    '@href': function(d) {
      return picc.template.resolve(
        this.getAttribute('data-href'),
        {
          url: (function() {
            var qs =  querystring.parse(decodeURIComponent(location.search.substr(1)));
            var share = [];
            var schools = (qs['s[]']) ? qs['s[]'] : picc.school.selection.all(picc.school.selection.LSKey);

            if (schools) {
              share = schools.map(function(item) {
                if (item.schoolId) {
                  item = item.schoolId;
                }
                return encodeURIComponent('s[]=' +item.replace('/^[0-9]/', ''));
              });
            }

            // older IE
            if (!window.location.origin) {
              window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
            }
            return encodeURIComponent(window.location.origin + window.location.pathname + '?'+share.join('&'));
          })()

        }
      );
    }
  };

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
        // grab the domain, strip the leading http(s) protocol and "www."
        return url
          .replace(/^https?:\/\//i, "") // remove protocol
          .split('/') // explode the url
          .shift() // grab first segment (the domain)
          .replace(/^www\./, ''); // remove www.
      }
    },

    search_share_link_fb: searchShareLink,
    search_share_link_twt: searchShareLink,
    search_share_link_li: searchShareLink,
    search_share_link_mail: searchShareLink,

    school_share_link_fb: schoolShareLink,
    school_share_link_twt: schoolShareLink,
    school_share_link_li: schoolShareLink,
    school_share_link_mail: schoolShareLink,

    compare_share_link_fb: compareShareLink,
    compare_share_link_twt: compareShareLink,
    compare_share_link_li: compareShareLink,
    compare_share_link_mail: compareShareLink,


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

    compare_group:  {
      '@aria-hidden': function(d) {
        return !(this.querySelector('[data-bind="school_section"]'));
      }
    },

    school_container: function(d) {
        // hack for tagalong not allowing binding to direct child template element
        this.setAttribute('data-school-id', access(fields.ID)(d));
        this.setAttribute('data-compare', (picc.school.selection.isSelected(access(fields.ID)(d), picc.school.selection.LSKey) >= 0));
        return null;
    },

    selected_school: {
      '@aria-pressed': function(d) {
         return (picc.school.selection.isSelected(access(fields.ID)(d), picc.school.selection.LSKey) >= 0);
      },
      '@data-school': function(d) {
        return picc.school.selection.LSKey;
      },
      '@data-school-id': function(d) {
        return access(fields.ID)(d);
      },
      '@data-school-name': function(d) {
        return access(fields.NAME)(d);
      },
      '@aria-describedby': function(d) {
        return (picc.school.selection.all(picc.school.selection.LSKey).length > 9 &&
                picc.school.selection.isSelected(access(fields.ID)(d), picc.school.selection.LSKey) === -1)
                  ? 'tip-compare-max'
                  : 'tip-compare-add';
      }
    },

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

    branch_campus: {
      '@data-definition': function(d) {
        return (picc.access.branchCampus(d)) ? 'branch' : 'default';
      }
    },

    program_reporter_tip: {
      '@data-definition': function(d) {
        return picc.access.isProgramReporter(d) ? 'program_reporter' : 'default';
      }
    },

    ogc_tip: {
      '@data-definition': function(d) {
        let opeflag = access(picc.fields.AID_ELIGIBILITY)(d);
        if(opeflag === 8) return 'flag8';
        else if(opeflag === 3) return 'flag3';
        else if(opeflag > 3 && opeflag < 8) return 'default';
      }
    },

    program_reporter_hidden: {
      '@aria-hidden':  function(d) {
        return access.isProgramReporter(d) ? 'true' : 'false';
      }
    },

    program_reporter_shown: {
      '@aria-hidden': function(d) {
        return access.isProgramReporter(d) ? 'false' : 'true';
      }
    },

    no_finaid_shown: {
      '@aria-hidden': function(d) {
        return access(picc.fields.AID_ELIGIBILITY)(d) >= 3 ? 'false' : 'true';
      }
    },
    
    no_finaid_hidden: {
      '@aria-hidden': function(d) {
        return access(picc.fields.AID_ELIGIBILITY)(d) >= 3 ? 'true' : 'false';
      }
    },


    program_reporter_class: {
      '@class': function(d) {
        return access.isProgramReporter(d) ? 'centered': 'school-two_col-left centered';
      }
    },

    program_reporter_number_of_programs: access.isProgramReporter,

    program_reporter_total: function(d) {
      return access.largestProgramsReported(d, 'full_program');
    },

    program_reporter_per_year: function(d) {
      return access.largestProgramsReported(d, 'annualized');
    },

    program_reporter_largest: access.largestProgramReported,

    award_level: {
        '@data-definition': function (d) {
          var offersMultipleAwards = picc.access.awardLevels(d, picc.access(picc.fields.PREDOMINANT_DEGREE)(d));
          if (offersMultipleAwards) {
            return offersMultipleAwards;
          } else {
            this.removeAttribute('aria-describedby');
            this.removeAttribute('tabindex');
            return null;
          }
        }
    },

    // program reporters dont have an accurate net price to display
    average_cost: function(d) {
      return !(access.isProgramReporter(d)) ? format.dollars(access.netPrice)(d) : '--';
    },

    average_cost_meter: {
      '@value': function(d) {
        return !(access.isProgramReporter(d)) ? access(picc.fields.NET_PRICE)(d) : null;
      },
      '@degree': access(fields.PREDOMINANT_DEGREE),
      label: format.dollars(function(d) {
        return meterMedian(this, access(fields.PREDOMINANT_DEGREE)(d));
      }),
      'picc-side-meter-val': function(d) {
        return !(access.isProgramReporter(d)) ? format.dollars(access.netPrice)(d): '--';
      }
    },

    // on the compare screen we draw the vertical `median_line`
    // for the current meter group across multiple school picc-side-meter's.
    // depending on the meter, we format the median label accordingly ($,%, etc)
    /**  median_line: medianLine, */
    // pred_degree: function() {
    //   return this.querySelector('[data-school-preddeg]').getAttribute('data-school-preddeg');
    // },

    // income level net price stats
    net_price_income1: format.dollars(access.netPriceByIncomeLevel('0-30000')),
    net_price_income2: format.dollars(access.netPriceByIncomeLevel('30001-48000')),
    net_price_income3: format.dollars(access.netPriceByIncomeLevel('48001-75000')),
    net_price_income4: format.dollars(access.netPriceByIncomeLevel('75001-110000')),
    net_price_income5: format.dollars(access.netPriceByIncomeLevel('110001-plus')),
    net_price_income_meter: {
      '@data-net_price_income1': access.netPriceByIncomeLevel('0-30000'),
      '@data-net_price_income2': access.netPriceByIncomeLevel('30001-48000'),
      '@data-net_price_income3': access.netPriceByIncomeLevel('48001-75000'),
      '@data-net_price_income4': access.netPriceByIncomeLevel('75001-110000'),
      '@data-net_price_income5': access.netPriceByIncomeLevel('110001-plus'),
      '@value':   function() {
        var select = document.getElementById('net_price_income');
        return this.getAttribute('data-'+select.value);
      },
      'picc-side-meter-val': function(d) {
        return netPricebyIncomeLevelValue(d);
      }
    },

    net_price_income_val: function(d) {
      return netPricebyIncomeLevelValue(d);
    },
    advantage_rate: format.percent(fields.EARNINGS_GT_25K),
    advantage_rate_meter: {
      '@value':   access.earnings25k,
      '@degree': access(fields.PREDOMINANT_DEGREE),
      label:      format.percent(function(d) {
        return meterMedian(this, access(fields.PREDOMINANT_DEGREE)(d));
      }),
      'picc-side-meter-val': format.percent(fields.EARNINGS_GT_25K)
    },

    grad_rate: format.percent(access.completionRate),
    grad_rate_meter: {
      '@value':   access.completionRate,
      '@degree': access(fields.PREDOMINANT_DEGREE),
      label:      format.percent(function(d) {
        return meterMedian(this, access(fields.PREDOMINANT_DEGREE)(d));
      }),
      'picc-side-meter-val': format.percent(access.completionRate)
    },

    average_salary: format.dollars(access.earningsMedian),
    average_salary_meter: {
      '@value': access.earningsMedian,
      '@degree': access(fields.PREDOMINANT_DEGREE),
      label:    format.dollars(function(d) {
        return meterMedian(this, access(fields.PREDOMINANT_DEGREE)(d));
      }),
      'picc-side-meter-val': format.dollars(access.earningsMedian)
    },

    repayment_rate_percent: format.percent(fields.REPAYMENT_RATE),
    repayment_rate_meter: {
      '@value': access(fields.REPAYMENT_RATE),
      '@degree': access(fields.PREDOMINANT_DEGREE),
      label:    format.percent(function(d) {
        return meterMedian(this, access(fields.PREDOMINANT_DEGREE)(d));
      }),
      'picc-side-meter-val': format.percent(fields.REPAYMENT_RATE)
    },

    average_total_debt: format.dollars(fields.AVERAGE_TOTAL_DEBT),
    average_total_debt_meter: {
      '@value': access(fields.AVERAGE_TOTAL_DEBT),
      '@degree': access(fields.PREDOMINANT_DEGREE),
      label:    format.dollars(function(d) {
        return meterMedian(this, access(fields.PREDOMINANT_DEGREE)(d));
      }),
      'picc-side-meter-val': format.dollars(fields.AVERAGE_TOTAL_DEBT)
    },

    average_monthly_loan_payment: format.dollars(fields.MONTHLY_LOAN_PAYMENT),
    average_monthly_loan_payment_meter: {
      '@value': access(fields.MONTHLY_LOAN_PAYMENT),
      '@degree': access(fields.PREDOMINANT_DEGREE),
      label:    format.dollars(function(d) {
        return meterMedian(this, access(fields.PREDOMINANT_DEGREE)(d));
      }),
      'picc-side-meter-val': function(d) {
        return (format.dollars(fields.MONTHLY_LOAN_PAYMENT)(d)) +'/mo'
      }
    },

    federal_aid_percentage: format.percent(fields.AID_PERCENTAGE),
    federal_aid_meter: {
      '@value': access(fields.AID_PERCENTAGE),
      '@degree': access(fields.PREDOMINANT_DEGREE),
      label:    format.percent(function(d) {
        return meterMedian(this, access(fields.PREDOMINANT_DEGREE)(d));
      }),
      'picc-side-meter-val': format.percent(fields.AID_PERCENTAGE)
    },

    pell_grant_percentage: format.percent(fields.PELL_PERCENTAGE),
    pell_grant_meter: {
      '@value': access(fields.PELL_PERCENTAGE),
      '@degree': access(fields.PREDOMINANT_DEGREE),
      label:    format.percent(function(d) {
        return meterMedian(this, access(fields.PREDOMINANT_DEGREE)(d));
      }),
      'picc-side-meter-val': format.percent(fields.PELL_PERCENTAGE)
    },

    earnings_gt_25k: format.percent(access.earnings25k),
    earnings_gt_25k_meter: {
      '@value': access.earnings25k,
      '@degree': access(fields.PREDOMINANT_DEGREE),
      label:    format.percent(function(d) {
        return meterMedian(this, access(fields.PREDOMINANT_DEGREE)(d));
      }),
      'picc-side-meter-val': format.percent(access.earnings25k)
    },

    retention_rate_value: format.percent(access.retentionRate),
    retention_rate_meter: {
      '@value': access.retentionRate,
      '@degree': access(fields.PREDOMINANT_DEGREE),
      label:    format.percent(function(d) {
        return meterMedian(this, access(fields.PREDOMINANT_DEGREE)(d));
      }),
      'picc-side-meter-val': format.percent(access.retentionRate),
    },

    full_time_value: {

      '@value': function(d) {
        var pt = access.partTimeShare(d);
        return pt === null ? null : 1 - pt;
      },
      'average': function(d) {
        var pt = access.partTimeShare(d);
        return pt === null ? null : 1 - pt;
      },
      'picc-side-meter-val': format.percent(function(d) {
        var pt = access.partTimeShare(d);
        return pt === null ? null : (1 - pt);
      }),

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
          return picc.RACE_ETHNICITY_LABELS[d.key] && d.value > 0;
        });
    },

    race_ethnicity_meter: {
      '@data-aian': access.raceEthnicityValueByKey('aian'),
      '@data-asian': access.raceEthnicityValueByKey('asian'),
      '@data-black': access.raceEthnicityValueByKey('black'),
      '@data-hispanic': access.raceEthnicityValueByKey('hispanic'),
      '@data-nhpi': access.raceEthnicityValueByKey('nhpi'),
      '@data-non_resident_alien': access.raceEthnicityValueByKey('non_resident_alien'),
      '@data-two_or_more': access.raceEthnicityValueByKey('two_or_more'),
      '@data-unknown': access.raceEthnicityValueByKey('unknown'),
      '@data-white': access.raceEthnicityValueByKey('white'),
      // no longer used data vars
      // '@data-white_non_hispanic': access.raceEthnicityValueByKey('white_non_hispanic'),
      // '@data-asian_pacific_islander': access.raceEthnicityValueByKey('asian_pacific_islander'),
      // '@data-black_non_hispanic': access.raceEthnicityValueByKey('black_non_hispanic'),
      '@value': function() {
        var select = document.getElementById('race_ethnicity');
        return this.getAttribute('data-'+select.value);
      },
      'picc-side-meter-val': function(d) {
        return raceEthnicity(d);
      }
    },

    race_ethnicity_val: function(d) {
      return raceEthnicity(d);
    },


    available_programs: function(d) {
      var areas = access.programAreas(d, fields.PROGRAM_OFFERED + '.degree_or_certificate');
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
      'name2': access(fields.NAME)
    },
    act_scores: {
      '@lower': access(fields.ACT_25TH_PCTILE),
      '@upper': access(fields.ACT_75TH_PCTILE),
      // '@middle': access(fields.ACT_MIDPOINT),
    },
    act_25: access(fields.ACT_25TH_PCTILE),
    act_75: access(fields.ACT_75TH_PCTILE),

    sat_reading_scores_visible: {
      '@aria-hidden': format.empty(fields.SAT_READING_MIDPOINT),
    },
    sat_reading_scores_invisible: {
      '@aria-hidden': format.notEmpty(fields.SAT_READING_MIDPOINT),
      'name2': access(fields.NAME)
    },
    sat_reading_scores: {
      '@lower': access(fields.SAT_READING_25TH_PCTILE),
      '@upper': access(fields.SAT_READING_75TH_PCTILE),
      // '@middle': access(fields.SAT_READING_MIDPOINT),
    },
    sat_reading_25: access(fields.SAT_READING_25TH_PCTILE),
    sat_reading_75: access(fields.SAT_READING_75TH_PCTILE),

    sat_math_scores_visible: {
      '@aria-hidden': format.empty(fields.SAT_MATH_MIDPOINT),
    },
    sat_math_scores_invisible: {
      '@aria-hidden': format.notEmpty(fields.SAT_MATH_MIDPOINT),
      'name2': access(fields.NAME)
    },
    sat_math_scores: {
      '@lower': access(fields.SAT_MATH_25TH_PCTILE),
      '@upper': access(fields.SAT_MATH_75TH_PCTILE),
      // '@middle': access(fields.SAT_MATH_MIDPOINT),
    },
    sat_math_25: access(fields.SAT_MATH_25TH_PCTILE),
    sat_math_75: access(fields.SAT_MATH_75TH_PCTILE),

    sat_writing_scores_visible: {
      '@aria-hidden': format.empty(fields.SAT_WRITING_MIDPOINT),
    },
    sat_writing_scores_invisible: {
      '@aria-hidden': format.notEmpty(fields.SAT_WRITING_MIDPOINT),
      'name2': access(fields.NAME)
    },
    sat_writing_scores: {
      '@lower': access(fields.SAT_WRITING_25TH_PCTILE),
      '@upper': access(fields.SAT_WRITING_75TH_PCTILE),
      // '@middle': access(fields.SAT_WRITING_MIDPOINT),
    },
    sat_writing_25: access(fields.SAT_WRITING_25TH_PCTILE),
    sat_writing_75: access(fields.SAT_WRITING_75TH_PCTILE),

    net_price_calculator: {
      '@href': format.href(fields.NET_PRICE_CALC_URL)
    }
  };

})();

/**
 * School selection utils for checking state, saving schools, and rendering toggles & links
 */
picc.school.selection = {

    LSKey: 'compare-schools',

    all: function (key) {
      return JSON.parse(window.localStorage.getItem(key)) || [];
    },

    isSelected: function (id, key) {
      return (picc.school.selection.all(key).map(function(fav){
        return +fav.schoolId;
      }).indexOf(id));
    },

    showMaxSelected: function() {

      var compareBtns = [].slice.call(document.querySelectorAll('button.button-compare_schools:not([aria-pressed="true"])'));
      for(var i=0; i<compareBtns.length;i++) {
        compareBtns[i].setAttribute('aria-describedby', 'tip-compare-max');
      }

    },

    hideMaxSelected: function() {
      var compareBtns = [].slice.call(document.querySelectorAll('button.button-compare_schools'));
      for(var i=0; i<compareBtns.length;i++) {
        compareBtns[i].setAttribute('aria-describedby', 'tip-compare-add' );
      }
    },

    toggle: function (e, el) {

      if (!el) {
        el = (e.target.parentElement.hasAttribute('data-school-id')) ? e.target.parentElement : e.target;
      }
      var dataset = el.dataset;
      var collection = dataset.school;
      var isSelected = picc.school.selection.isSelected(+dataset.schoolId, collection);
      var selectedSchools = picc.school.selection.all(collection);
      var selectedCard = document.querySelector('.school.results-card[data-school-id="'+dataset.schoolId+'"]');

      if (isSelected >= 0) {

        if (selectedSchools.length === 10) {
          picc.school.selection.hideMaxSelected();
        }

        // remove school from collection
        selectedSchools.splice(isSelected, 1);
        // save the new collection
        window.localStorage.setItem(collection, JSON.stringify(selectedSchools));
        // toggle the compare button
        picc.school.selection.toggleBtn(el,false);
          // highlight the card if visible on page
        picc.school.selection.toggleCard(selectedCard, false);
        // compare schools page we need to remove highlighted sections on toggle remove school
        if (el.previousElementSibling && el.previousElementSibling.hasAttribute('data-highlight-btn')) {
          picc.school.selection.highlightRemove(dataset.schoolId);
        }
      } else {

        if (selectedSchools.length < 10) {
          // add school to collection
          selectedSchools.push(dataset);
          picc.school.selection.toggleBtn(el, true);
          picc.school.selection.toggleCard(selectedCard, true);

          if (selectedSchools.length > 9) {
            picc.school.selection.showMaxSelected();
          }

          // save the new collection
          window.localStorage.setItem(collection, JSON.stringify(selectedSchools));

        } else {
          // only compare up to 10 schools
          picc.school.selection.showMaxSelected();
        }
      }
      picc.school.selection.setCount();
    },

    toggleBtn: function (el,state) {
      if (el && el.hasAttribute('aria-pressed')) {
        el.setAttribute('aria-pressed', state);
      }
    },

    toggleCard: function(el, state) {
      if (el && el.hasAttribute('data-compare')) {
        el.setAttribute('data-compare', state)
      }
    },

    setCount: function() {
      var counter = document.querySelector('.selection-count');
      if (counter) {
       counter.textContent = picc.school.selection.all(picc.school.selection.LSKey).length;
      }
    },

    // remove any highlight from a deselecte school
    highlightRemove: function(schoolId) {

        var btn = document.querySelector('button[data-highlight-btn][data-school-id="'+schoolId+'"]');
        btn.setAttribute('aria-pressed', false);

        var sections = [].slice.call(document.querySelectorAll('[data-bind="school_section"][data-school-id="'+schoolId+'"]'));
        for(var i=0; i<sections.length;i++) {
          sections[i].removeAttribute('data-highlight')
        }
    },

    highlightToggle: function(e, el) {
      if (!el) {
        el = (e.target);
      }
      var schoolID = el.getAttribute('data-school-id');
      var highlightTarget = (el.getAttribute('aria-pressed') !== "true");

      if (el.nextElementSibling && !el.nextElementSibling.querySelector('input').checked) {
        // let the highlight button reselect a deselected (hidden) school
        var checkbox = el.nextElementSibling.querySelector('input');
        checkbox.checked = true;
        checkbox.dispatchEvent(new CustomEvent('change'));
      }

      // reset all other highlight buttons and toggle target
      var btns = [].slice.call(document.querySelectorAll('button[data-highlight-btn]'));
      for(var i=0; i < btns.length; i++) {
        var btnID = btns[i].getAttribute('data-school-id');

        if (btnID === schoolID) {
          // toggle
          el.setAttribute('aria-pressed', highlightTarget);
        } else {
          btns[i].setAttribute('aria-pressed', false);

        }
      }
      // reset all highlightable sections and toggle target sections
      var highlightable = [].slice.call(document.querySelectorAll('[data-bind="school_section"]'));
      for(var i=0;i<highlightable.length; i++) {
        var sectionID =  highlightable[i].getAttribute('data-school-id');
        if (sectionID === schoolID) {
          highlightable[i].setAttribute('data-highlight', highlightTarget);
        } else {
          highlightable[i].removeAttribute('data-highlight');
        }
      }

    },

    highlightBarToggle: function(e) {
      var  el = e.target.closest('[data-bind="school_section"]');
      var schoolId = el.getAttribute('data-school-id');
      var schoolHighlightBtn = document.querySelector('button[data-highlight-btn][data-school-id="'+schoolId+'"]');
      picc.school.selection.highlightToggle(e, schoolHighlightBtn)
    },

    renderCompareToggles: function() {
        var collection = picc.school.selection.LSKey;
        tagalong(
          '#edit-compare-list',
          picc.school.selection.all(collection),
          {
            name: function(d) {
              return picc.access('schoolName')(d)
            },
            checkbox_label: {
              '@for': function(d) {
                return 'edit-compare-' + picc.access('schoolId')(d);
              },
              '@data-school': function(d) {
                return collection;
              },
              '@data-school-id': function (d) {
                return picc.access('schoolId')(d);
              },
              '@data-school-name': function(d) {
                return picc.access('schoolName')(d);
              }
            },
            compare_checkbox: {
              '@id': function (d) {
                return 'edit-compare-' + picc.access('schoolId')(d);
              },
              '@checked': function(d) {
                return (picc.school.selection.isSelected(picc.access('schoolId')(d), collection) >= 0) ? 'checked': null;
              }
            },
            highlight_button: {
              '@aria-pressed': function (d) {
                return this.getAttribute('aria-pressed');

              },
              '@data-school-id': function (d) {
                return picc.access('schoolId')(d);
              }
            }
          }
        );

      // Fix for tagalong binding only to the first instance of a directive
      var checkboxes = document.querySelectorAll('input[name="_compare"]');


      for (var i = 0; i < checkboxes.length; i++) {
          checkboxes[i].checked = true;
      }

      // update compare schools link
      picc.school.selection.renderCompareLink();

    },

    renderCompareLink: function() {
      var compareLink = d3.select('#compare-link');
      if (!compareLink.empty()) {
        var linkContainer = d3.select(compareLink.node().parentNode);
        if (picc.school.selection.all(picc.school.selection.LSKey).length) {
          compareLink
            .attr('href', picc.BASE_URL + '/compare/')
            .attr('aria-disabled', null);
          linkContainer.classed('disabled',false);
        } else {
          compareLink
            .attr('href', null)
            .attr('aria-disabled', true);
          linkContainer.classed('disabled', true);
        }
      }
    }

};

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
    small:  '1..2000',
    medium: '2000..15000',
    large:  '15001..'
  },

  degree: {
    a: '2',
    b: '3',
    c: '1'
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
    //close typeahead.js so it is hidden on back
    var ac = jQuery('#'+form.element.id).find('#name-school');
    ac.typeahead('close').typeahead('val', '');

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
      // field to match schools in that zip:
      // ?zip=XXXXXX&distance=0 will always return zero results because it
      // does a distance calculation; whereas
      // ?school.zip=XXXXXX will return all schools with that zip code value
      // instead of doing a distance calculation
      if (! +query.distance) {
        query[fields.ZIP_CODE] = value; // query['school.zip'] = ...
        delete query[key]; // delete query.zip
        delete query.distance;
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
        case 'c':
        case '1':
          subfield = 'certificate'

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
      } else if (value === 'c') {
        query[picc.fields.DEGREE_OFFERED + '.certificate'] = true;
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

  // map a degree string ('', 'a' or 'b' or 'c') or array of strings to an
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
      query[fields.DEGREE_OFFERED + '.assoc_or_bachelors_or_certificate'] = true;
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

    for (var key in query) {
      if (query[key] === null || query[key] === undefined) {
        delete query[key];
      }
    }

    // set the predominant degree to range '1..3' because ED expert guidance
    query[picc.fields.PREDOMINANT_DEGREE + '__range'] = '1..3';

    // exclude perfect-only children per ED
    query[picc.fields.ID + '__range'] = '..999999';

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

// are we in IE? hopefully not.
picc.ui.ie = typeof document !== 'undefined' && typeof document.documentMode === 'number';

// flag used mainly by IE/tagalong issue
picc.ui.alreadyLoaded = false;

// another IE/tagalong util
picc.ui.removeAllChildren = function(node) {
  while (node.lastChild) {
    node.removeChild(node.lastChild);
  }
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
picc.API.debounced_search = picc.debounce(picc.API.search, 250);

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
  return _listener;
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
    var definition = this.definition;
    if (!tooltip) {
      tooltip = document.getElementById(this.getAttribute('aria-describedby'));
      if (!tooltip) {
        return console.warn('no tooltip found for:', this);
      }
      this.tooltip = tooltip;
    }

    if (!definition) {
     var definitionTarget = ( this.hasAttribute('data-definition') ) ? this.getAttribute('data-definition') : 'default';
     this.definition = definition = tooltip.querySelector('[data-definition="'+definitionTarget+'"]');
    }

    var parent = this;
    var ref = this.querySelector('.tooltip-target') || this;
    var show = function() {
      // console.log('show tooltip:', this, tooltip);
      tooltip.setAttribute('aria-hidden', false);
      definition.setAttribute('aria-hidden', false);
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
    this.definition.setAttribute('aria-hidden', true);
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

    var content = tooltip.querySelector('.tooltip-content[aria-hidden="false"]') || tooltip;
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
  index:      require('./index'),
  search:     require('./search'),
  school:     require('./school'),
  compare:    require('./compare'),
  data:       require('./data')
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

  /**
   * add event listeners for school selection click events
   */
  picc.ready(function() {
      var ariaPressed = 'aria-pressed';
      var compareSchool = 'data-school';
      picc.delegate(
          document.body,
          // if the element matches '[aria-pressed] && [data-school]'
          function() {
              return (this.parentElement.hasAttribute(ariaPressed) || this.hasAttribute(ariaPressed))
                && (this.parentElement.hasAttribute(compareSchool) || this.hasAttribute(compareSchool));
          },
          {
            click: picc.school.selection.toggle
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
      limit: 20, //limit higher than displayed to counteract typeahead.js bug
      display: picc.fields.NAME,
      source: function(q, syncResults, asyncResults) {
        //fashion basic query object to pass to API.search
        //return more results to ensure enough left-first matches are captured
        var query = { fields: picc.fields.NAME, per_page: 20 };
        query[picc.fields.NAME] = q;
        query = picc.form.prepareParams(query);

        //uses debounced search call to avoid API spam
        picc.API.debounced_search(query, function(error, data) {
          if (error || !data.results.length) { return {}; }

          //sort results to perform left-first matching
          data.results.sort(function(a,b) {
            var qU = q.toUpperCase(), //uppercase original query
                s1 = a['school.name'].toUpperCase(),
                s2 = b['school.name'].toUpperCase();

            var s1match = (qU == s1.substr(0,qU.length)),
                s2match = (qU == s2.substr(0,qU.length));

            if (s1match) {
              return (s2match) ? 0 : -1;
            } else {
              return (s2match) ? 1 : 0;
            }
          });

          //reduce results to 5 for display
          data.results.length = (data.results.length > 10) ? 10 : data.results.length;
          asyncResults(data.results);
        });
      }
    });
  };

  picc.socialTabListener = {};

  var socialTabNavToggle = function socialTabNavToggle(evt) {
    setTimeout(function() {
      evt.target.classList.add('social-tab');
    },300);
    document.body.removeEventListener('focus', picc.socialTabListener['focus'], true);
  };

  var socialDidClickShare = function socialDidClickShare(evt) {
    var type = evt.target.closest('[data-social]').getAttribute('data-social');
    var shareTypes = ['Facebook', 'Twitter', 'Email', 'LinkedIn'];
    var shareType = (shareTypes.indexOf(type) >= 0) ? type : 'unknown';
    if (window.ga) {
      try {
        ga('send', 'event', 'Social Share', shareType, window.location.pathname)
      } catch (e) {
        console.error('[ga] social event error');
      }
    }
  };

  var accordionDidExpand = function accordionToggle(evt) {
    var controlType = evt.target.getAttribute('aria-controls');
    var accordionTypes = {
      'Data': {
        'cost'        : 'Costs',
        'finaid'      : 'Financial Aid & Debt',
        'graduation'  : 'Graduation & Retention',
        'earnings'    : 'Earnings After School',
        'student'     : 'Student Body',
        'school'      : 'College Information',
        'selectivity' : 'SAT/ACT Scores',
        'academics'   : 'Academic Programs',
      },
      'Search': {
        'major-content'     : 'Programs/Degrees',
        'location-content'  : 'Location',
        'size-content'      : 'Size',
        'name-content'      : 'Name',
        'type-content'      : 'Advanced Search',
      }
    };

    function matchAccordionType(typeArr, group) {
      var accordion = [];
      Object.keys(typeArr[group]).forEach(function(k) {
        if (!accordion.length && controlType.indexOf(k) === 0) {
          accordion.push({
            'group': group,
            'name': typeArr[group][k]
          });
        }
      });
      return accordion;
    }

    var accordionType = matchAccordionType(accordionTypes, 'Data');

    if(!accordionType.length) {
      // also check the search accordions
      accordionType = matchAccordionType(accordionTypes, 'Search');
    }

    if (window.ga && accordionType.length) {
      try {
        var category = '[' + accordionType[0]['group'] + '] Expand Accordion';
        ga('send', 'event', category, accordionType[0]['name'], window.location.pathname);
      } catch (e) {
        console.error('[ga] accordion event error');
      }
    }
  };

  var outboundLinks = function outboundLinks(evt) {
    var target = evt.target.href.replace(/^https:\/\//, '');
    if (window.ga && target) {
      try {
        ga('send', 'event', 'Outbound Links', target, window.location.pathname);
      } catch (e) {
        console.error('[ga] outbound link event error');
      }
    }
  };

  /**
   * * add focus and click listeners for social links and tab navigation
   */
  picc.ready(function() {
    var shareBtn = 'data-share-button';
    picc.socialTabListener = picc.delegate(
      document.body,
      function() {
        return this.hasAttribute(shareBtn);
      },
      {
        focus: socialTabNavToggle,
      }
    );

    var socialType = 'data-social';
    picc.delegate(
      document.body,
      function() {
        return this.parentElement.hasAttribute(socialType) || this.hasAttribute(socialType);
      },
      {
        click: socialDidClickShare,
      }
    );
  });

  /**
   * * add click listeners for accordion expanded events
   */
  picc.ready(function() {
    var ariaControls = 'aria-controls';
    var ariaExpanded = 'aria-expanded';
    picc.delegate(
      document.body,
      function() {
        return this.hasAttribute(ariaControls) && this.getAttribute(ariaExpanded) === 'false';
      },
      {
        click: accordionDidExpand,
      }
    );

  });

  /**
   * * add event listeners for outbound links
   */
  picc.ready(function() {
    var anchorHref = 'href';
    picc.delegate(
      document.body,
      function() {
        return this.hasAttribute(anchorHref)
          && this.href.indexOf(location.host) === -1
          && (
            this.href.match(/^https:\/\/fafsa\.ed\.gov\//)
            || this.href.match(/^https:\/\/studentaid\.ed\.gov\//)
            || this.href.match(/^https:\/\/www\.vets\.gov\//)
          );
      },
      {
        click: outboundLinks,
      }
    );

  });

  // namespace sankey
  picc.sankey = {};

  picc.sankey.init  = function(){
    google.charts.load('current', {'packages':['sankey']});

    jQuery('.outcome_toggle').click(function(e){
      e.preventDefault();
      var $ref = jQuery(this);
      $ref.closest('.toggle_group').find('.active').removeClass('active');
      $ref.addClass('active');
      jQuery('.om_visualization').each(function(idx, el){
        picc.sankey.drawSankeyChart(jQuery(el));
      })
      if (window.ga) {
          var ga_enroll = jQuery('#enroll_toggle').find('.active').attr('href').substring(8).replace(/_/g,' ');
          var ga_study = jQuery('#study_toggle').find('.active').attr('href').substring(7).replace(/_/g,' ');
          try {
              ga('send', 'event', 'Outcome', 'Toggle', ga_enroll+" "+ga_study);
          } catch (e) {
              console.error('[ga] outcome measure toggle event error');
          }
      }
    });
    jQuery('#graduation').click(function(){
      jQuery('.om_visualization').each(function(idx, el){
        picc.sankey.drawSankeyChart(jQuery(el));
      })
    });
    jQuery(window).resize(function(){
      jQuery('.om_visualization').each(function(idx, el){
        picc.sankey.drawSankeyChart(jQuery(el));
      })
    });    
  }


  picc.sankey.outcomeVisualization = function(school, $element) {

    var outcomes = picc.access('latest.completion.outcome_percentage_suppressed')(school);
    var outcome_cohort_data = picc.access('latest.completion.outcome_cohort')(school);
    var outcome_cohorts = {
        study_full_time:{
            enroll_first_time: outcome_cohort_data.full_time.first_time['8yr_pooled'],
            enroll_not_first_time: outcome_cohort_data.full_time.not_first_time['8yr_pooled'],
            enroll_both: outcome_cohort_data.full_time.first_time['8yr_pooled']+outcome_cohort_data.full_time.not_first_time['8yr_pooled']
        },
        study_part_time:{
           enroll_first_time: outcome_cohort_data.part_time.first_time['8yr_pooled'],
            enroll_not_first_time: outcome_cohort_data.part_time.not_first_time['8yr_pooled'],
            enroll_both: outcome_cohort_data.part_time.first_time['8yr_pooled']+outcome_cohort_data.part_time.not_first_time['8yr_pooled']
        },
        study_both:{
            enroll_first_time: outcome_cohort_data.full_time.first_time['8yr_pooled']+outcome_cohort_data.part_time.first_time['8yr_pooled'],
            enroll_not_first_time: outcome_cohort_data.full_time.not_first_time['8yr_pooled']+outcome_cohort_data.part_time.not_first_time['8yr_pooled'],
            enroll_both: outcome_cohort_data.full_time.first_time['8yr_pooled']+outcome_cohort_data.full_time.not_first_time['8yr_pooled']+outcome_cohort_data.part_time.first_time['8yr_pooled']+outcome_cohort_data.part_time.not_first_time['8yr_pooled']
        },
    }
    $element.data('outcomes', outcomes);
    $element.data('outcome_cohorts', outcome_cohorts);

    google.charts.setOnLoadCallback(function(){ picc.sankey.drawSankeyChart($element)});   
  };

  picc.sankey.drawSankeyChart = function($element) {

    var enroll = jQuery('#enroll_toggle').find('.active').attr('href').substring(1);
    var study = jQuery('#study_toggle').find('.active').attr('href').substring(1);

    var outcomes = $element.data('outcomes');
    var outcome_cohorts = $element.data('outcome_cohorts');

    var links = {
        study_full_time: {
            enroll_first_time: {
                variable: 'full_time.first_time.8yr',
                text: "Out of students who started college here and started their studies full-time..."
            },
            enroll_not_first_time: {
                variable: 'full_time.not_first_time.8yr',
                text: "Out of students who transferred in and started their studies full-time..."
            },
            enroll_both: {
                variable: 'full_time.8yr',
                text: "Out of students who started their studies full-time..."
            }
        },
        study_part_time: {
            enroll_first_time: {
                variable: 'part_time.first_time.8yr',
                text: 'Out of students who started college here and started their studies part-time...'
            },
            enroll_not_first_time: {
                variable: 'part_time.not_first_time.8yr',
                text: 'Out of students who transferred in and started their studies part-time...'
            },
            enroll_both: {
                variable: 'part_time.8yr',
                text: 'Out of students who started their studies part-time...'
            },
        },
        study_both: {
            enroll_first_time: {
                variable: 'first_time.8yr',
                text: 'Out of students who started college here...'
            },
            enroll_not_first_time: {
                variable: 'not_first_time.8yr',
                text: 'Out of students who transferred in...'
            },
            enroll_both: {
                variable: 'all_students.8yr',
                text: 'Out of all students...'
            }
        }
    }

    var friendlyMetrics = {
        'award_pooled': 'graduated',
        'still_enrolled_pooled': 'still enrolled',
        'transfer_pooled': 'transferred',
        'unknown_pooled': 'withdrew'
    }

    var currentData = jQuery.extend(true, {}, picc.access(links[study][enroll].variable)(outcomes));
    var rows = [];
    var percent;

    for(var q in currentData){ 
        percent = Math.round(currentData[q] * 100);
        if(percent > 0) {
            rows.push([ percent+"% " + friendlyMetrics[q], 'Group', percent]);
        }
    }

    if(rows.length>0)
    {
        $element.find('.om_sankey').removeClass('na');
        $element.find('.om_group').show();

        var data = new google.visualization.DataTable();
        var colors = [];
        data.addColumn('string', 'From');
        data.addColumn('string', 'To');
        data.addColumn('number', 'Percent');
        data.addRows(rows);
        if($element.data('colors')=='solid')
        {
          colors = ['#8360ED','#FFFFFF','#8360ED','#8360ED','#8360ED','#8360ED']
        }
        else
        {
          colors = ['#d37c39', '#FFFFFF', '#86B33B', '#8360ED', '#49ACEC', '#37608D']
        }

        // Sets chart options.
        var options = {
        width: '100%',
        tooltip: {
            trigger: 'selection',
            isHtml: true
        },
        sankey:{
            node: {
            colors: colors,
            width: 80, 
            //nodePadding: 0,
            label: { 
                fontName: 'Montserrat,"Helvetica Neue",Helvetica,arial,sans-serif',
                fontSize: 14,
                color: '#040404'
            },
            interactivity: false,
            colorMode: 'unique'
            },
            link: {
            color: '#FFFFFF'
            },
            tooltip: false
        }
        };
        var chart = new google.visualization.Sankey($element.find('.om_sankey')[0]);
        $element.find('.om_group').text("Out of "+picc.format.number(study+'.'+enroll)(outcome_cohorts)+" students...")
        chart.draw(data, options);
    }
    else
    {
        $element.find('.om_sankey').empty().text('Data not available').addClass('na');
        $element.find('.om_group').hide();
    }
  }
}

module.exports = picc;
