---
# // hey there
---
(function(exports) {

  var id = getSchoolId();

  if (!id) {
    return showError('No school ID provided');
  }

  var root = document.querySelector('#school');

  var format = picc.format;
  var access = picc.accessor;

  var directives = {
    size_number:    format.number('size'),
    control:        format.control('ownership'),
    locale_name:    format.locale('locale'),
    years:          format.preddeg('common_degree'),
    size_category:  format.sizeCategory('size'),

    // this is a direct accessor because some designations
    // (e.g. `women_only`) are at the object root, rather than
    // nested in `minority_serving`.
    special_designation: access.specialDesignation,

    SAT_avg: function(d) {
      return picc.nullify(d.SAT_avg) || '?';
    },
    SAT_meter: {
      // TODO
    },

    average_cost: format.dollars(access.averageCost),
    average_cost_meter: {
      '@max':     access.nationalStat('max', access.publicPrivate),
      '@average': access.nationalStat('median', access.publicPrivate),
      '@value':   access.averageCost,
      '@title':   debugMeterTitle
    },
    average_cost_arrow: {
      '@class': access.meterArrowClass()
    },

    grad_rate: format.percent(access.completionRate),
    grad_rate_meter: {
      '@max':     access.nationalStat('max', access.yearDesignation),
      '@average': access.nationalStat('median', access.yearDesignation),
      '@value':   access.completionRate,
      '@title':   debugMeterTitle
    },
    grad_rate_arrow: {
      '@class': access.meterArrowClass()
    },

    average_salary: format.dollars(access.medianEarnings),
    average_salary_meter: {
      '@value': access.medianEarnings,
      '@title': debugMeterTitle
    },
    average_salary_arrow: {
      '@class': access.meterArrowClass()
    }

  };

  picc.API.getSchool(id, function(error, school) {
    if (error) {
      return showError(error);
    }

    console.log('got school:', school);
    root.classList.remove('hidden');
    tagalong(root, school, directives);

    var center = L.latLng(
      +school.location.lat,
      +school.location.lon
    );

    var map = L.map(root.querySelector('.school-map'), {
        zoomControl:        false,
        panControl:         false,
        attributionControl: false,
        dragging:           false,
        scrollWheelZoom:    false,
        touchZoom:          false,
        doubleClickZoom:    false,
        boxZoom:            false
      })
      .setView(center, 13);

    L.tileLayer('http://tile.stamen.com/terrain/{z}/{x}/{y}.png')
      .addTo(map);

    var marker = L.circle(center, 200, {
        color: 'black',
        opacity: 1,
        strokeWidth: 1,
        fillColor: 'white',
        fillOpacity: 1
      })
      .addTo(map);

    marker.bindPopup(school.name);
  });

  function getSchoolId() {
    if (!location.search) return null;
    var match = location.search.match(/^\?(\d+)(\b|-)/);
    return match ? match[1] : null;
  }

  function redirect(uri) {
    window.location = uri || '../search/';
  }

  function showError(message) {
    var container = document.querySelector('#error');
    container.classList.remove('hidden');
    var target = container.querySelector('.error-message') || container;
    target.textContent = message;
    return target;
  }

  function debugMeterTitle(d) {
    return [
      'value: ', this.getAttribute('value'), '\n',
      'median: ', this.getAttribute('average')
    ].join('');
  }

})(this);
