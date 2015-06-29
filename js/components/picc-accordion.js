(function(exports) {

  var picc = exports.picc || (exports.picc = {});

  picc.accordion = function() {
    var selectors = {
      button: '.accordion-toggle, button[aria-controls], a[aria-controls]',
      content: null
    };

    var accordion = function() {
      var root = d3.select(this);

      var button = root.select(selectors.button);
      if (button.empty()) {
        console.warn('no <button aria-controls="..."> found in:', this);
        return;
      }

      var content = root.select(contentSelector(button));
      if (!content) {
        console.error('no element with id: "%s" found in:', button.attr('aria-controls'), this);
        return;
      }

      button.on('click', function() {
        root.call(accordion.toggle);
        d3.event.preventDefault();
      });

      root.each(update);
    };

    accordion.expanded = function(el) {
      return d3.select(el)
        .select(selectors.button)
          .attr('aria-expanded') === 'true';
    };

    accordion.toggle = function(selection) {
      selection.each(function() {
        var root = d3.select(this);
        root.attr('data-expanded', root.attr('data-expanded') !== 'true');
        update.call(this);
      });
    };

    accordion.button = function(selector) {
      if (!arguments.length) return selectors.button;
      selectors.button = selector;
      return accordion;
    };

    accordion.content = function(selector) {
      if (!arguments.length) return selectors.content;
      selectors.content = selector;
      return accordion;
    };

    function update() {
      var root = d3.select(this);
      var expanded = root.attr('data-expanded') === 'true';
      var button = root.select(selectors.button);
      var content = root.select(contentSelector(button));

      root
        .attr('open', expanded || null);

      button
        .attr('aria-expanded', expanded)
        .attr('title', buttonTitle(expanded));

      content
        .attr('aria-hidden', !expanded)
        .classed('hidden', !expanded);
    }

    function contentSelector(button) {
      return selectors.content || ('#' + button.attr('aria-controls'));
    }

    function buttonTitle(expanded) {
      return function() {
        if (expanded && this.hasAttribute('data-expanded-title')) {
          return this.getAttribute('data-expanded-title');
        } else if (!expanded && this.hasAttribute('data-collapsed-title')) {
          return this.getAttribute('data-collapsed-title');
        }
        return [
          expanded ? 'Collapse' : 'Expand',
          this.textContent.trim()
        ].join(' ')
      };
    }

    return accordion;
  };


  window.addEventListener('load', function() {
    d3.selectAll('.picc-accordion')
      .each(picc.accordion());
  });

})(this);
