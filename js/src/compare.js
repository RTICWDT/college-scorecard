var tagalong = require('./tagalong');
var d3 = require('d3');
var querystring = require('querystring');
var jQuery = require('jquery');

if (typeof document !== 'undefined') {
  require('./components/compat/custom-event');
}

module.exports = function compare() {

  var loadable = d3.select('.loadable');
  var root = d3.select('.compare-bg');
  var compareRoot = document.querySelector('.compare-schools');
  var LSKey = picc.school.selection.LSKey;
  var compareSchools = picc.school.selection.all(LSKey);


  // if schools were shared by querystring,
  // compare those instead of any local school picks
  var qs = querystring.parse(decodeURIComponent(location.search.substr(1)));
  var shareComparison = false;
  var compareShareLink = document.querySelector('.school-share-wrapper');

  if (qs['s[]'] || qs['schools[]']) {
    // console.log('share', qs['schools[]']);
    compareSchools = (qs['s[]']) ? qs['s[]'] : qs['schools[]'];
    shareComparison = true;

  }

  var searchReferrer = (!shareComparison && document.referrer.match('/search')) ? document.referrer : '../search/';
  d3.select('#referrer-link')
    .attr('href', searchReferrer);

  var showError = function (error) {
    console.error('error:', error);
    var message = compareRoot.querySelector('.error-message');
    if (typeof error.responseText != 'undefined') {
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

  var params = {};

  params.fields = [
    // we need the id to link it
    picc.fields.ID,

    // basic display fields
    picc.fields.NAME,
    picc.fields.CITY,
    picc.fields.STATE,
    picc.fields.SIZE,
    picc.fields.LOCALE,
    // to get "public" or "private" control
    picc.fields.OWNERSHIP,
    picc.fields.HIGHEST_DEGREE,
    // to get the "four_year" or "lt_four_year" bit
    picc.fields.PREDOMINANT_DEGREE,
    // to get alternative predominant degree offered flag
    picc.fields.DEGREE_OFFERED + '.assoc_or_bachelors',
    picc.fields.DEGREE_OFFERED + '.bachelors',
    picc.fields.DEGREE_OFFERED + '.assoc',
    picc.fields.DEGREE_OFFERED + '.certificate',
    // program reporter number / flag
    picc.fields.PROGRAM_REPORTER_OFFERED,
    // get all of the net price values
    picc.fields.NET_PRICE,
    picc.fields.COMPLETION_RATE,
    picc.fields.REPAYMENT_RATE,
    // this has no sub-fields
    picc.fields.MEDIAN_EARNINGS,
    picc.fields.EARNINGS_GT_25K,
    picc.fields.RETENTION_RATE + '.four_year.full_time_pooled',
    picc.fields.RETENTION_RATE + '.lt_four_year.full_time_pooled',
    picc.fields.PELL_PERCENTAGE,
    picc.fields.AVERAGE_TOTAL_DEBT,
    picc.fields.AID_PERCENTAGE,
    picc.fields.MONTHLY_LOAN_PAYMENT,
    picc.fields.PART_TIME_SHARE,
    // under investigation flag
    picc.fields.UNDER_INVESTIGATION,
    //SAT/ACT
    picc.fields.ACT_MIDPOINT,
    picc.fields.ACT_25TH_PCTILE,
    picc.fields.ACT_75TH_PCTILE,
    picc.fields.SAT_MATH_MIDPOINT,
    picc.fields.SAT_MATH_25TH_PCTILE,
    picc.fields.SAT_MATH_75TH_PCTILE,
    picc.fields.SAT_READING_MIDPOINT,
    picc.fields.SAT_READING_25TH_PCTILE,
    picc.fields.SAT_READING_75TH_PCTILE,
    picc.fields.SAT_WRITING_MIDPOINT,
    picc.fields.SAT_WRITING_25TH_PCTILE,
    picc.fields.SAT_WRITING_75TH_PCTILE,

    'latest.completion.outcome_cohort.full_time.first_time.8yr_pooled',
    'latest.completion.outcome_cohort.full_time.not_first_time.8yr_pooled',
    'latest.completion.outcome_cohort.part_time.first_time.8yr_pooled',
    'latest.completion.outcome_cohort.part_time.not_first_time.8yr_pooled',

    'latest.completion.outcome_percentage_suppressed.full_time.first_time.8yr.award_pooled',
    'latest.completion.outcome_percentage_suppressed.full_time.first_time.8yr.still_enrolled_pooled',
    'latest.completion.outcome_percentage_suppressed.full_time.first_time.8yr.transfer_pooled',
    'latest.completion.outcome_percentage_suppressed.full_time.first_time.8yr.unknown_pooled',

    'latest.completion.outcome_percentage_suppressed.full_time.not_first_time.8yr.award_pooled',
    'latest.completion.outcome_percentage_suppressed.full_time.not_first_time.8yr.still_enrolled_pooled',
    'latest.completion.outcome_percentage_suppressed.full_time.not_first_time.8yr.transfer_pooled',
    'latest.completion.outcome_percentage_suppressed.full_time.not_first_time.8yr.unknown_pooled',

    'latest.completion.outcome_percentage_suppressed.full_time.8yr.award_pooled',
    'latest.completion.outcome_percentage_suppressed.full_time.8yr.still_enrolled_pooled',
    'latest.completion.outcome_percentage_suppressed.full_time.8yr.transfer_pooled',
    'latest.completion.outcome_percentage_suppressed.full_time.8yr.unknown_pooled',

    'latest.completion.outcome_percentage_suppressed.part_time.first_time.8yr.award_pooled',
    'latest.completion.outcome_percentage_suppressed.part_time.first_time.8yr.still_enrolled_pooled',
    'latest.completion.outcome_percentage_suppressed.part_time.first_time.8yr.transfer_pooled',
    'latest.completion.outcome_percentage_suppressed.part_time.first_time.8yr.unknown_pooled',

    'latest.completion.outcome_percentage_suppressed.part_time.not_first_time.8yr.award_pooled',
    'latest.completion.outcome_percentage_suppressed.part_time.not_first_time.8yr.still_enrolled_pooled',
    'latest.completion.outcome_percentage_suppressed.part_time.not_first_time.8yr.transfer_pooled',
    'latest.completion.outcome_percentage_suppressed.part_time.not_first_time.8yr.unknown_pooled',

    'latest.completion.outcome_percentage_suppressed.part_time.8yr.award_pooled',
    'latest.completion.outcome_percentage_suppressed.part_time.8yr.still_enrolled_pooled',
    'latest.completion.outcome_percentage_suppressed.part_time.8yr.transfer_pooled',
    'latest.completion.outcome_percentage_suppressed.part_time.8yr.unknown_pooled',

    'latest.completion.outcome_percentage_suppressed.first_time.8yr.award_pooled',
    'latest.completion.outcome_percentage_suppressed.first_time.8yr.still_enrolled_pooled',
    'latest.completion.outcome_percentage_suppressed.first_time.8yr.transfer_pooled',
    'latest.completion.outcome_percentage_suppressed.first_time.8yr.unknown_pooled',

    'latest.completion.outcome_percentage_suppressed.not_first_time.8yr.award_pooled',
    'latest.completion.outcome_percentage_suppressed.not_first_time.8yr.still_enrolled_pooled',
    'latest.completion.outcome_percentage_suppressed.not_first_time.8yr.transfer_pooled',
    'latest.completion.outcome_percentage_suppressed.not_first_time.8yr.unknown_pooled',

    'latest.completion.outcome_percentage_suppressed.all_students.8yr.award_pooled',
    'latest.completion.outcome_percentage_suppressed.all_students.8yr.still_enrolled_pooled',
    'latest.completion.outcome_percentage_suppressed.all_students.8yr.transfer_pooled',
    'latest.completion.outcome_percentage_suppressed.all_students.8yr.unknown_pooled',
  ];

  var INCOME_LEVELS = [
    '0-30000',
    '30001-48000',
    '48001-75000',
    '75001-110000',
    '110001-plus'
  ];

  // full paths until wildcard search is supported by API
  INCOME_LEVELS.forEach(function(level) {
    params.fields.push(picc.fields.NET_PRICE_BY_INCOME + '.public.by_income_level.' + level);
    params.fields.push(picc.fields.NET_PRICE_BY_INCOME + '.private.by_income_level.' + level);
  });

  Object.keys(picc.RACE_ETHNICITY_LABELS).forEach(function(key) {
    params.fields.push(picc.access.raceEthnicityValueByKey(key));
  });

  params.fields.join(',');

  // browser cache-busting for d3.json calls
  params._per_page = new Date().getTime();

  var directives = picc.data.selectKeys(picc.school.directives, [
    'name',
    'years',
    'control',
    'size_number',
    'award_level',
    'locale_name',
    'size_category',
    'average_cost',
    'average_cost_meter',
    'net_price_income1',
    'net_price_income2',
    'net_price_income3',
    'net_price_income4',
    'net_price_income5',
    'net_price_income_val',
    'net_price_income_meter',
    'grad_rate',
    'grad_rate_meter',
    'average_salary',
    'average_salary_meter',
    'advantage_rate',
    'advantage_rate_meter',
    'repayment_rate_meter',
    'repayment_rate_percent',
    'retention_rate_value',
    'retention_rate_meter',
    'full_time_percent',
    'full_time_value',
    'race_ethnicity_val',
    'race_ethnicity_meter',
    'pell_grant_percentage',
    'pell_grant_meter',
    'average_total_debt',
    'average_total_debt_meter',
    'federal_aid_percentage',
    'federal_aid_meter',
    'average_monthly_loan_payment',
    'average_monthly_loan_payment_meter',
    'act_scores_visible',
    'act_scores_invisible',
    'act_scores',
    'act_25',
    'act_75',
    'sat_reading_scores_visible',
    'sat_reading_scores_invisible',
    'sat_reading_scores',
    'sat_reading_25',
    'sat_reading_75',
    'sat_math_scores_visible',
    'sat_math_scores_invisible',
    'sat_math_scores',
    'sat_math_25',
    'sat_math_75',
    'sat_writing_scores_visible',
    'sat_writing_scores_invisible',
    'sat_writing_scores',
    'sat_writing_25',
    'sat_writing_75',
  ]);

  directives.school_section = {
      '@data-school-id': function(d) {
        return picc.access(picc.fields.ID)(d);
      }
  };

  var meterWrapper = picc.data.selectKeys(picc.school.directives, [
    'compare_group',
    /**'median_line' */
  ]);

  var shareLinks = picc.data.selectKeys(picc.school.directives, [
    'compare_share_link_fb',
    'compare_share_link_twt',
    'compare_share_link_li',
    'compare_share_link_mail',
  ]);

  // build query for API call
  function buildQuery (schools) {
    var query = {};
    schools.map(function (school) {
      var id = +school.schoolId || +school;
      query[id] = [picc.API.getSchool, id, params];
    });
    return query;
  }

  function onChange() {

    if(shareComparison) {
      compareSchools = (qs['s[]']) ? qs['s[]'] : qs['schools[]'];
    } else {
      compareSchools =  picc.school.selection.all(LSKey);
    }

    // build query for API call
    var query = buildQuery(compareSchools);

    // pass the list of chosen schools to analytics. 
    if (window.ga) {      
      try {
        ga('send', 'event', 'Comparison', 'School IDs', Object.keys(query).join(";"));
      } catch (e) {
        console.error('[ga] compare school event error');
      }
    }

    picc.API.getAll(query, function (error, data) {

      loadable.classed('js-loading', false);
      loadable.classed('highlight', !shareComparison);

      if (error) {
        console.error('getAll error:', error);
      }

      console.info('got schools:', data);

      var schools = {};
      schools.results = [];

      Object.keys(data).forEach(function (key) {
        if (data[key]) {
          schools.results.push(data[key]);
        }
      });

      if (!schools.results.length) {
        loadable.classed('js-error', true);
        loadable.classed('js-loaded', false);
        return showError(picc.errors.NO_SUCH_SCHOOL);
      }
      loadable.classed('js-error', false);
      loadable.classed('js-loaded', true);

        // sort schools a-z
      schools.results.sort(function (a, b) {
        return (a['school.name'].toLowerCase() < b['school.name'].toLowerCase()) ? -1
          : (a['school.name'].toLowerCase() > b['school.name'].toLowerCase()) ? 1
          : 0;
      });

      /*
       * XXX this avoids a nasty hard crash in IE11, which seems to have some
       * problems with tagalong's data joining algorithm (and/or, you know,
       * it's just broken).
       *
       * Removing the children of the results list after it's already been
       * rendered (iff `alreadyLoaded` is true) guarantees that tagalong has
       * stashed a reference to the template node. On the compare page, clone
       * template references are needed as we have nested templates.
       *
       * Note: we _don't_ do this in other browsers because it has performance
       * implications. Rendering will be much faster when the existing nodes
       * are reused and modified in place, rather than being cloned anew each
       * time.
       */

      var degreeSectionContainers;

      if (picc.ui.ie && picc.ui.alreadyLoaded) {

        degreeSectionContainers = document.querySelectorAll('.compare-container_group');

        [].slice.call(degreeSectionContainers).forEach(function(node) {
          var section = node.querySelector('.section-card_container-compare').cloneNode(true);
          /** var median = node.querySelector('.median_line').cloneNode(true); */
          picc.ui.removeAllChildren(node);
          /** node.appendChild(median);
          var addedMedian = node.querySelector('.median_line');
          // addedAvg.parentNode.insertBefore(section, addedAvg.nextSibling);
          insertAfter(section, addedMedian); */
        });

      }

      var sections = document.querySelectorAll('.section-card_container-compare');

      [].slice.call(sections).forEach(function(node){
          tagalong(node, schoolsByPredDegree(schools.results, node.getAttribute('data-pred-degree')), directives);
      });

      degreeSectionContainers = document.querySelectorAll('.compare-container_group');

      [].slice.call(degreeSectionContainers).forEach(function (node) {
        tagalong(node, {}, meterWrapper);
      });

      tagalong(compareShareLink, {}, shareLinks);

      picc.ui.alreadyLoaded = true;

      picc.sankey.init();

      jQuery('.selected-school_outcomes_group').each(function(idx, el){
        var $ref = jQuery(this);
        var schoolId = $ref.find('.selected-school_outcomes').attr('data-school-id');
        var el = $ref.find('.om_visualization');
        var newObj = {};
        for(var q in data[schoolId])
        { 
          parseDotNotation(q, data[schoolId][q], newObj);
        }
        picc.sankey.outcomeVisualization(newObj, el);
      })

    });

  }
  function parseDotNotation(str, val, obj) {
    var currentObj = obj,
        keys = str.split("."),
        i, l = Math.max(1, keys.length - 1),
        key;

    for (i = 0; i < l; ++i) {
        key = keys[i];
        currentObj[key] = currentObj[key] || {};
        currentObj = currentObj[key];
    }
    
    currentObj[keys[i]] = val;
    delete obj[str];
  }
  
  function schoolsByPredDegree(results, degreeType) {
    return results.filter(function(d) {
      // if degreeType is empty for a section, this returns all schools
      return picc.access(picc.fields.PREDOMINANT_DEGREE)(d) === +degreeType || !degreeType ;
    });
  }

  function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }

  function toggleGroupOnHiddenChildren() {
    var groupsToToggle = [].slice.call(document.querySelectorAll('.compare-container_group[data-pred-degree]'));
    groupsToToggle.forEach(function(grp) {
      var isHidden = [].slice.call(grp.querySelectorAll('[data-bind="school_section"]')).every(function(school){
        return window.getComputedStyle(school, null).display === 'none';
      });
      grp.firstElementChild.setAttribute('aria-hidden', isHidden);
    });
  }

  function toggleDisplay(e) {

    var el = (e.target.parentElement.hasAttribute('data-school-id')) ? e.target.parentElement : e.target;
    var toggleState = !(el.firstElementChild.checked);
    var schoolID = el.getAttribute('data-school-id');

    var sections = [].slice.call(document.querySelectorAll('[data-bind="school_section"][data-school-id="'+schoolID+'"]'));
    for(var i=0; i < sections.length; i++) {
      sections[i].setAttribute('aria-hidden', toggleState);
    }

    // show error if last checkbox was unchecked (nothing to compare)
    if (!picc.school.selection.all(LSKey).length) {
      root.classed('js-loaded', false);
      loadable.classed('js-error', true);
      return showError(picc.errors.NO_SCHOOLS_TO_COMPARE);
    } else {
      root.classed('js-loaded', true);
      loadable.classed('js-error', false);
    }

    // if all schools of a degree type are hidden
    // toggle the container for the degree type
    toggleGroupOnHiddenChildren();

  }

  /**
   * add event listeners for school selection change events and fetch new results
   */
  picc.ready(function() {

    if (!shareComparison) {
      // don't show edit toggle on shared comparison views
      var compareToggle = d3.select('#compare_schools-edit');
      compareToggle.attr('aria-hidden', false);
      picc.school.selection.renderCompareToggles();

    }

    // initial display
    onChange();

    var compareBox = 'data-school';
    picc.delegate(
      document.body,
      // if the element matches '[data-school]'
      function() {
        return this.parentElement.hasAttribute(compareBox) ||
          this.hasAttribute(compareBox);
      },
      {
        change: function(e) {
          picc.school.selection.toggle(e);
          toggleDisplay(e);
        }
      }
    );

  });

  /**
   * * add event listeners for school highlighter click events
   */
  picc.ready(function() {
    var ariaPressed = 'aria-pressed';
    var highlightSchool = 'data-highlight-btn';
    picc.delegate(
      document.body,
      // no events for shared pages
      // if the element matches '[aria-pressed] && [data-highlight]'
      function() {
        return !shareComparison
          && ( this.parentElement.hasAttribute(ariaPressed) || this.hasAttribute(ariaPressed) )
          && this.hasAttribute(highlightSchool);
      },
      {
        click: picc.school.selection.highlightToggle
      }
    );

  });

  /**
   * * add event listeners for school picc bar highlighter click events
   */
  picc.ready(function() {
    picc.delegate(
      document.body,
      // if the element matches '[data-bind="school_section"] && [data-school-id]'
      function() {
        return !shareComparison
          && this.closest('[data-bind="school_section"]')
          && this.closest('[data-bind="school_section"]').hasAttribute('data-school-id');
      },
      {
        click: picc.school.selection.highlightBarToggle
      }
    );

  });

  /**
   * * add event listeners for select-controlled sections
   */
  picc.ready(function() {
    var dataSelect = 'data-select';
    picc.delegate(
      document.body,
      // if the element matches '[data-select]'
      function() {
        return this.hasAttribute(dataSelect);
      },
      {
        change: picc.debounce(function(e) {
          e.preventDefault();
          var targetMeter = e.target.getAttribute(dataSelect);
          var meters = [].slice.call(document.querySelectorAll('picc-side-meter[data-bind="'+targetMeter+'"]'));
          var selectedOption = e.target.value;

          var formatter = (+meters[0].getAttribute('max') === 1) ? 'percent' : 'dollars';
          for (var i = 0; i < meters.length; i++) {
            var value = meters[i].getAttribute('data-'+selectedOption);
            var formattedValue = picc.format[formatter]('value')({'value': value});
            if (formatter === 'percent') {
              formattedValue = (+value >= 0.005 || +value === 0) ? formattedValue : (value) ? '<1%' : 'No Data Available';
            }
            // set bar
            meters[i].setAttribute('value', value);
            // set bar text value
            var barVal = meters[i].querySelector('.picc-side-meter-val');
            if (barVal) {
              barVal.textContent = formattedValue;
            }
            // set figure value for screen-reader
            var figVal = (meters[i].nextElementSibling) ? meters[i].nextElementSibling.querySelector('.fig-val') : null;
            if(figVal) {
              figVal.textContent = formattedValue;
            }
          }
        }, 250)
      }
    );

  });

  var win = d3.select(window);
  // close other toggles when one opens
  var toggles = d3.selectAll('.toggle-accordion')
    .on('open', function() {
      var opened = this;
      toggles.each(function() {
        if (this !== opened) { this.close(); }
      });

      var event = 'click.toggle';
      win.on(event, function() {
        if (!opened.contains(d3.event.target)) {
          win.on(event, null);
          opened.close();
        }
      });

    });

  // close all toggles on escape
  win.on('keyup.toggle', function() {
    if (d3.event.keyCode === 27) {
      toggles.property('expanded', false);
    }
  });
};