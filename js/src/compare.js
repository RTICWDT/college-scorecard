var tagalong = require('tagalong');
var d3 = require('d3');
var querystring = require('querystring');

module.exports = function compare() {

  var loadable = d3.select('.loadable');
  var compareRoot = document.querySelector('.compare-schools');

  // if schools were shared by querystring, compare those instead of any local school picks
  var qs = querystring.parse(location.search.substr(1));
  var compareSchools = (qs['schools[]']) ? qs['schools[]'] : picc.school.selection.all('compare');

  var showError = function (error) {
    console.error('error:', error);
    var message = compareRoot.querySelector('.error-message');
    if (typeof error.responseText != "undefined") {
      var errorText = JSON.parse(error.responseText);
      error = errorText.errors[0].message;
    }

    message.textContent = String(error) || 'There was an unexpected API error.';
  };

  if (!compareSchools.length) {
    loadable.classed('js-error', true);
    return showError(picc.errors.NO_SCHOOLS_TO_COMPARE);
  }

  loadable.classed('js-loading', true);

  var params = {},
    query = {};

  params.fields = [
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
    picc.fields.NET_PRICE,
    // completion rate
    picc.fields.COMPLETION_RATE,
    // this has no sub-fields
    picc.fields.MEDIAN_EARNINGS,
    // not sure if we need this, but let's get it anyway
    picc.fields.EARNINGS_GT_25K,
    // under investigation flag
    picc.fields.UNDER_INVESTIGATION
  ].join(',');

  // var headingDirectives = picc.data.selectKeys(picc.school.directives, [
  //   'title',
  //   'school_link',
  //   'name',
  //   'city',
  //   'state',
  //   'selected_school',
  //   'under_investigation',
  //   'size_number',
  // ]);

  var directives = picc.data.selectKeys(picc.school.directives, [
    'name',
    'average_cost',
    'average_cost_meter',
    'grad_rate',
    'grad_rate_meter',
    'average_salary',
    'average_salary_meter'

  ]);

  var meterWrapper = picc.data.selectKeys(picc.school.directives, [
    'average_line'
  ]);


  // build query for API call
  compareSchools.map(function (school) {
    var id = +school.schoolId || +school;
    query['s'+id] = [picc.API.getSchool, id, params];
  });
console.log('query', query);
  picc.API.getAll(query, function (error, data) {

    loadable.classed('js-loading', false);

    if (error) {
      console.error('getAll error:', error);
    }

    console.info('got schools:', data);

    var school = {};
    school.results = [];

    Object.keys(data).forEach(function (key) {
      if (data[key]) {
        school.results.push(data[key]);
      }
    });

    if (!school.results.length) {
      loadable.classed('js-error', true);
      return showError(picc.errors.NO_SUCH_SCHOOL);
    }

    loadable.classed('js-loaded', true);



    // var headingList = document.querySelector('.selected-school_heading');
    var root = document.querySelectorAll('.compare-container_group');
    var compareGroups = document.querySelectorAll('.section-card_container-compare');



    [].slice.call(compareGroups)
      .forEach(function(node) {
        // console.log('binding to:', node);
        tagalong(node, school.results, directives);
      });


    [].slice.call(root)
      .forEach(function(node) {
        // using tagalong for directive bindings but not data
        tagalong(node, {}, meterWrapper);
      });


  });

};