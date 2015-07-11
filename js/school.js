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

  var directives = {
    size_number: format.number('size'),
    control: format.control('ownership'),
    locale_name: format.locale('locale'),
    years: format.preddeg('common_degree'),
    size_category: format.sizeCategory('size'),

    // this is a direct accessor because some designations
    // (e.g. `women_only`) are at the object root, rather than
    // nested in `minority_serving`.
    special_designation: format.specialDesignation,

    average_cost: format.dollars('avg_net_price'),
    average_cost_meter: {
      '@max':     d3.functor(100000),
      '@average': d3.functor(20000),
      '@value':   function(d) {
        return Math.floor(Math.random() * 100000);
      }
    },

    // for debugging
    map: {
      '@data-latitude': function(d) {
        return d.location.lat;
      },
      '@data-longitude': function(d) {
        return d.location.lon;
      }
    }
  };

  API.getSchool(id, function(error, school) {
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

})(this);
