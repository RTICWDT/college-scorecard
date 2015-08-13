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

  picc.API.getAll({
    metadata: 'data.json',
    school: [picc.API.getSchool, id]
  }, function(error, data) {
    // console.log('data:', data);
    if (error) {
      return showError(error);
    }

    var school = data.school;

    var name = picc.access(picc.fields.NAME)(school);
    document.title += ' / ' + name;

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

    // render the bar charts
    // FIXME this should be possible in tagalong!
    var bars = d3.selectAll('ol.bars')
      .selectAll('li')
        .datum(function() {
          return +this.querySelector('.value').textContent;
        })
        .sort(d3.descending)
        .each(function() {
          var label = this.querySelector('.label');
          if (label) {
            var klass = label.textContent
              .toLowerCase()
              .replace(/\W+/g, '-');
            this.classList.add('bar-' + klass);
          }
        });

    bars.select('.value')
      .remove();

    bars.select('.bar')
      .style('width', d3.scale.linear()
        .domain([0, .01, 1])
        .range(['0%', '1%', '100%']));

    createMap(school);
  });

  function hashChange() {
    var id = location.hash.substr(1);
    var found = false;
    picc.ui.expandAccordions(function() {
      return this.id && this.id === id;
    })
    .each(function() {
      found = this;
    });
    return found;
  }

  window.addEventListener('hashchange', hashChange);

  var section = hashChange();
  if (section) {
    location.hash = '';
    location.hash = '#' + section.id;
  }

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
    var target = container.querySelector('.error-message') || container;
    target.textContent = message;
    return target;
  }

  function createMap(school) {
    var mapContainer = root.querySelector('.school-map');
    var location = picc.access.location(school);

    if (!location || !+location.lat || !+location.lon) {
      console.warn('missing or invalid location:', location, '; hiding the map');
      mapContainer.classList.add('hidden');
      return false;
    }

    var center = L.latLng(location.lat, location.lon);

    var map = L.map(mapContainer, {
        zoomControl:        false,
        panControl:         false,
        attributionControl: false,
        dragging:           false,
        scrollWheelZoom:    false,
        touchZoom:          false,
        doubleClickZoom:    false,
        boxZoom:            false
      })
      .setView(center, 10);

    L.tileLayer('http://tile.stamen.com/terrain/{z}/{x}/{y}.png')
      .addTo(map);

    var marker = L.circle(center, 1600, {
        color: 'black',
        opacity: 1,
        strokeWidth: 1,
        fillColor: 'white',
        fillOpacity: 1
      })
      .addTo(map);

    marker.bindPopup(school.name);
    return map;
  }

})(this);
