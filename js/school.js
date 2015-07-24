(function(exports) {

  var id = getSchoolId();

  if (!id) {
    return showError('No school ID provided');
  }

  var root = document.querySelector('#school');

  picc.API.getAll({
    metadata: 'data.json',
    school: [picc.API.getSchool, id]
  }, function(error, data) {
    // console.log('data:', data);
    if (error) {
      return showError(error);
    }

    var school = data.school;
    school.metadata = data.metadata;
    console.log('got school:', school);
    root.classList.remove('hidden');

    // update the above/below average icons whenever the
    // corresponding meters update
    d3.selectAll('i.average-arrow[data-meter]')
      .each(function() {
        var icon = d3.select(this);
        var meter = d3.select('#' + this.getAttribute('data-meter'))
          .on('update', function() {
            var above = this.classList.contains('above-average');
            icon
              .classed('above-average fa-arrow-up', above)
              .classed('below-average fa-arrow-down', !above)
              .attr('title', above
                ? 'above average'
                : 'below average');
            // console.log('update:', this.className, above, icon.attr('class'));
          });
      });

    // this is necessary because tagalong only binds to
    // the first instance for each data or directive key
    var sections = root.querySelectorAll('.section-card_container-school');

    // common school template directives
    var directives = picc.school.directives;

    [root]
      .concat([].slice.call(sections))
      .forEach(function(node) {
        // console.log('binding to:', node);
        tagalong(node, school, directives);
      });

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

  // TODO: this should be much easier with aria-accordion
  window.addEventListener('load', function() {
    var sectionId = location.hash.substr(1);
    if (!sectionId) return;
    var found;
    d3.selectAll('.picc-accordion')
      .each(function() {
        if (this.id === sectionId) {
          var button = this.querySelector('[aria-controls]');
          button.setAttribute('aria-expanded', 'true');
          var content = document.getElementById(button.getAttribute('aria-controls'));
          content.setAttribute('aria-hidden', 'false');
          content.classList.remove('hidden');
          found = this;
        }
      });

      if (found) {
        location.hash = '';
        location.hash = '#' + found.id;
      }
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
