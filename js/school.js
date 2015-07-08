---
# // hey there
---
(function(exports) {

  var id = getSchoolId();

  if (!id) {
    return showError('No school ID provided');
  }

  var root = document.querySelector('#school');

  var directives = {
    size_pretty: picc.format.number('size'),
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

    var map = L.map(
      root.querySelector('.school-map'),
      {
        center: L.latLng(
          +school.location.lat,
          +school.location.lon
        ),
        zoom: 13,
        zoomControl: false,
        panControl: false,
        attributionControl: false
      }
    );

    L.tileLayer('http://tile.stamen.com/terrain/{z}/{x}/{y}.png')
      .addTo(map);
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
