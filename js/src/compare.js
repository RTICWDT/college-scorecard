var tagalong = require('tagalong');
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
  var compareSchools = picc.school.selection.all('compare');


  // if schools were shared by querystring, compare those instead of any local school picks
  var qs = querystring.parse(location.search.substr(1));
  var shareComparison = false;
  var compareShareLink = document.querySelector('.school-share-wrapper');

  if (qs['schools[]'])
  {
    // console.log('share', qs['schools[]']);
    compareSchools = qs['schools[]'];
    shareComparison = true;

  }

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
    // to get the "four_year" or "lt_four_year" bit
    picc.fields.PREDOMINANT_DEGREE,
    // get all of the net price values
    picc.fields.NET_PRICE,
    picc.fields.COMPLETION_RATE,
    picc.fields.REPAYMENT_RATE,
    // this has no sub-fields
    picc.fields.MEDIAN_EARNINGS,
    picc.fields.EARNINGS_GT_25K,
    picc.fields.RETENTION_RATE + '.four_year.full_time',
    picc.fields.RETENTION_RATE + '.lt_four_year.full_time',
    picc.fields.PELL_PERCENTAGE,
    picc.fields.AVERAGE_TOTAL_DEBT,
    picc.fields.AID_PERCENTAGE,
    picc.fields.MONTHLY_LOAN_PAYMENT,
    picc.fields.PART_TIME_SHARE,
    // under investigation flag
    picc.fields.UNDER_INVESTIGATION
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

  var directives = picc.data.selectKeys(picc.school.directives, [
    'name',
    'years',
    'control',
    'size_number',
    'locale_name',
    'size_category',
    'average_cost',
    'average_cost_meter',
    'net_price_income1',
    'net_price_income2',
    'net_price_income3',
    'net_price_income4',
    'net_price_income5',
    'net_price_income_meter',
    'grad_rate',
    'grad_rate_meter',
    'average_salary',
    'average_salary_meter',
    'advantage_rate_meter',
    'repayment_rate_meter',
    'repayment_rate_percent',
    'retention_rate_value',
    'retention_rate_meter',
    'full_time_value',
    'race_ethnicity_meter',
    'pell_grant_meter',
    'average_total_debt_meter',
    'federal_aid_meter',
    'average_monthly_loan_payment_meter'
  ]);

  directives['school_section'] = {
      '@data-school-id': function(d) {
        return picc.access(picc.fields.ID)(d);
      }
  };

  var meterWrapper = picc.data.selectKeys(picc.school.directives, [
    'average_line'
  ]);

  var shareLink = picc.data.selectKeys(picc.school.directives, [
    'compare_link'
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

    compareSchools = (shareComparison) ? qs['schools[]'] : picc.school.selection.all('compare');

    // build query for API call
    query = buildQuery(compareSchools);

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
        loadable.classed('js-loaded', false);
        return showError(picc.errors.NO_SUCH_SCHOOL);
      }
      loadable.classed('js-error', false);
      loadable.classed('js-loaded', true);

      school.results.sort(function(a,b){
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

      var root = document.querySelectorAll('.compare-container_group');

      if (picc.ui.ie && picc.ui.alreadyLoaded) {

        [].slice.call(root).forEach(function(node) {
          var section = node.querySelector('.section-card_container-compare').cloneNode(true);
          var avg = node.querySelector('.average_line').cloneNode(true);
          picc.ui.removeAllChildren(node);
          node.appendChild(avg);
          var addedAvg = node.querySelector('.average_line');
          addedAvg.parentNode.insertBefore(section, addedAvg.nextSibling);
        });

      }

      var sections = document.querySelectorAll('.section-card_container-compare');

      [].slice.call(sections).forEach(function(node){
        tagalong(node, school.results, directives);
      });

      [].slice.call(root).forEach(function (node) {
        tagalong(node, {}, meterWrapper);
      });

      tagalong(compareShareLink, {}, shareLink);

      var thead = document.querySelector('.by-family-income-thead');
      var tbody = document.querySelector('.by-family-income-tbody');
      addOption2ByFamilyIncome(school.results, thead, tbody);

      picc.ui.alreadyLoaded = true;

    });

  }

  /** this will likely not test well on mobile, but is an option **/
  function addOption2ByFamilyIncome(schools, thead, tbody) {
    schools.forEach(function(school) {
      var last = thead.querySelector('.by-family-income-th:last-of-type');
      var th = last.cloneNode();
      th.textContent = picc.access(picc.fields.NAME)(school);
      th.setAttribute('data-school-id', picc.access(picc.fields.ID)(school));
      if (last.textContent === 'School Name') {
        insertAfter(th, last);
        last.parentNode.removeChild(last);
      } else {
        insertAfter(th, last);
      }

      var rows = [].slice.call(tbody.querySelectorAll('tr'));
      rows.forEach(function(row){
        var last = row.querySelector('.income-row:last-of-type');
        var td = last.cloneNode();
        var incomeLevel = last.getAttribute('data-row');
        td.textContent = picc.school.directives[incomeLevel](school);
        td.setAttribute('data-school-id', picc.access(picc.fields.ID)(school));
        if (last.textContent === '$XX,XXX'){
          insertAfter(td,last);
          last.parentNode.removeChild(last);
        } else {
          insertAfter(td, last);
        }
      });

    })
  }

  function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
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
    if (!picc.school.selection.all('compare').length) {
      root.classed('js-loaded', false);
      loadable.classed('js-error', true);
      return showError(picc.errors.NO_SCHOOLS_TO_COMPARE);
    } else {
      root.classed('js-loaded', true);
      loadable.classed('js-error', false);
    }

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
      // if the element matches '[aria-pressed] && [data-highlight]'
      function() {
        return (this.parentElement.hasAttribute(ariaPressed) || this.hasAttribute(ariaPressed))
          && this.hasAttribute(highlightSchool);
      },
      {
        click: picc.school.selection.highlightToggle
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
        return this.hasAttribute(dataSelect)
      },
      {
        change: function(e) {
          var targetMeter = e.target.getAttribute(dataSelect);
          var meters = [].slice.call(document.querySelectorAll('picc-side-meter[data-bind="'+targetMeter+'"]'));
          var selectedOption = e.target.value;

          var formatter = (+meters[0].getAttribute('max') === 1) ? 'percent' : 'dollars';
          for (var i = 0; i < meters.length; i++) {
            var value = meters[i].getAttribute('data-'+selectedOption);
            var formattedValue = picc.format[formatter]('value')({'value': value});
            if (formatter === 'percent') formattedValue = (value >= .005) ? formattedValue : '<1%';
            // set bar
            meters[i].setAttribute('value', value);
            // set bar text value
            var barVal = meters[i].querySelector('.picc-side-meter-val');
            if (barVal) {
              barVal.textContent = formattedValue;
            }
          }
        }
      }
    );

  });


  var win = d3.select(window);
  // close other toggles when one opens
  var toggles = d3.selectAll('.toggle-accordion')
    .on('open', function() {
      var opened = this;
      toggles.each(function() {
        if (this !== opened) this.close();
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