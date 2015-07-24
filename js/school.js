(function(exports) {

  var id = getSchoolId();

  if (!id) {
    return showError('No school ID provided');
  }

  var root = document.querySelector('#school');

  var averageLabels = {
    'above': 'Above average',
    'below': 'Lower than average',
    'about': 'About average'
  };

  picc.API.getSchool(id, function(error, school) {
    if (error) {
      return showError(error);
    }

    console.log('got school:', school);
    root.classList.remove('hidden');

    // update the above/below average icons whenever the
    // corresponding meters update
    d3.selectAll('i.average-arrow[data-meter]')
      .each(function() {
        var icon = d3.select(this);
        var meter = d3.select('#' + this.getAttribute('data-meter'))
          .on('update', function() {
            var match = this.className.match(/\b(\w+)_average\b/);
            var state = match ? match[1] : 'na';
            icon
              .classed('above_average fa-arrow-up', state === 'above')
              .classed('below_average fa-arrow-down', state === 'below')
              .classed('about_average fa-check', state === 'about');

            var text = averageLabels[state];
            icon.attr('title', text);
            label
              .classed('above_average', state === 'above')
              .classed('below_average', state === 'below')
              .classed('about_average', state === 'about')
              .text(text);
          });
        var label = d3.select(this.parentNode)
          .select('.average-label');
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
