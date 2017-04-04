#!/usr/bin/env node
/* jshint node: true, esnext: true */

var async = require('async');
var pa11y = require('pa11y');
var reporter = require('pa11y/reporter/cli');
var config = require('./pa11y.conf');
var test = pa11y(config);

var baseUrl = require('./url');

var URLS = [
  baseUrl + '/',
  baseUrl + '/search/?state=CA',
  baseUrl + '/school/?226152-Texas-A-M-International-University',
  baseUrl + '/data/',
  baseUrl + '/data/documentation/',
  baseUrl + '/data/changelog/',
  baseUrl + '/compare/?schools[]=226152&schools[]=117803'

  // BASEURL + '/data/',
];

var IGNORE_RESULTS = [
  function leafletImage(result) {
    return result.context.match(/leaflet-tile/);
  }
];

var failed = false;

async.mapSeries(URLS, function(url, done) {
  // reporter.begin(url);

  test.run(url, function(error, results) {

    if (error) {
      reporter.error(error.stack);
      return done(error.stack);
    }

    // filter out "invalid" (ignoreable) results
    results = results ? results.filter(isValidResult) : [];

    reporter.results(results, url);

    if (results.some(isFailingResult)) {
      failed = true;
    }

    // never report failure here so the tests can all run
    done(null, results);
  });
}, function(error, runs) {
  if (error || failed) {
    if (failed) {
      var count = 0;
      var failing = runs.map(function(results) {
        var failing = results.filter(isFailingResult);
        count += failing.length;
        return failing;
      })
      .filter(function(failing) {
        return failing.length;
      });

      reporter.error([
        pluralize(count, 'failure'),
        'on', pluralize(failing.length, 'page')
      ].join(' '));
    }
    process.exit(2);
  }
});

function pluralize(num, singular, plural) {
  if (!plural) {
    plural = singular + 's';
  }
  return [num, num === 1 ? singular : plural].join(' ');
}

function isValidResult(result) {
  return IGNORE_RESULTS.every(function(ignore) {
    return !ignore(result);
  });
}

function isFailingResult(result) {
  return result.type === config.level;
}
