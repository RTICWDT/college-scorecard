(function(exports) {

  var ITEM_CLASS = 'multi-select_item';
  var d3 = require('d3');
  var HTMLParsedElement = require('./html-parsed-element');

  exports.customElements.define(
    'multi-select',
    class extends HTMLParsedElement {

      parsedCallback() {
        var select = this.querySelector('select');
        if (!select) return console.error('no <select> found in <multi-select>!');

        // console.warn('<multi-select>');

        // remove the multiple attribute, the clone it
        select.removeAttribute('multiple');
        this.__select = select.cloneNode(true);
        removeEmptyOption(this.__select);

        // remove the name from the templated one
        select.name = '';

        // then set the multiple attribute
        this.__select.setAttribute('multiple', 'multiple');

        this.createTemplate();
        this.insertBefore(this.__select, this.firstChild);

        this.value = select.value;

        // listen for change events, and hide it
        this.__select.addEventListener('change', this.__onchange = onchange.bind(this));
        this.__select.style.display = 'none';
        this.__select.setAttribute('aria-hidden', 'true');

        this.__pollID = setInterval(pollSourceSelect.bind(this), 200);
      }

      attributeChangedCallback(attr, oldValue, newValue) { }

      disconnectedCallback() {
        this.__select.removeEventListener('change', this.__onchange);
        clearTimeout(this.__pollID);
      }

      update() {
        var root = d3.select(this);
        var values = this.value;
        // console.log('[update]');

        var set = (function(v, focus) {
          // console.log('[set] values:', v);
          this.value = v;
          if (focus) {
            this.querySelector('.' + ITEM_CLASS + ':last-child select').focus();
          }
        }).bind(this);

        var items = root
          .selectAll('.' + ITEM_CLASS)
          .data(values);

        var template = this.__template;
        items.exit().remove();
        items.enter()
          .append(function() {
            return template.cloneNode(true);
          })
          .classed(ITEM_CLASS, true);

        items.select('select')
          .property('value', function(d) {
            return nullish(d) ? '' : String(d);
          })
          .on('change', function(d, i) {
            // console.log('[change %d]', i, this.value);
            values[i] = this.value;
            set(values);
          });

        /*
        items.select('button')
          .attr('disabled', 'disabled');
        */

        items.selectAll('button')
          .on('click.cancel', function() {
            d3.event.preventDefault();
          });

        items.each(function(value, i) {
          var item = d3.select(this);
          item.select('.button-remove')
            .on('click', remove);
          item.select('.button-add')
            .on('click', add);
          function remove() {
            item.remove();
            values.splice(i, 1);
            // console.log('[remove %d]:', i, value);
            // console.log('values:', values);
            set(values);
          }
        })

        function add() {
          values.push(null);
          set(values, true);
        }
      }

      createTemplate() {
        if (!this.__template) {
          var html = this.innerHTML;
          var template = this.__template = document.createElement('div');
          template.className = ITEM_CLASS;
          template.innerHTML = html;
          while (this.firstChild) {
            this.removeChild(this.firstChild);
          }
          return template;
        }
        return this.__template;
      }

      get value() {
        return Array.isArray(this.__value)
          ? this.__value.slice()
          : this.__value || [null];
      }
      set value(value) {
        // console.log('[set values]:', value);
        if (compare(this.__value, value)) {
          // console.warn('no change');
          return;
        }

        this.__value = parseValues(value);

        this.__updating = true;
        this.update();
        setValue(this.__select, this.__value);
        this.__updating = false;
      }
    }
  );

  function onchange(e) {
    if (this.__updating) return;
    // console.log('source select change:', e.target);
    this.value = getValue(e.target);
  }

  function getValue(multiselect) {
    return [].filter.call(
      multiselect.options, function(option) {
        return option.selected;
      })
      .map(function(option) {
        return option.value;
      })
  }

  function setValue(multiselect, values) {
    var changed = false;
    var map = values.reduce(function(map, d) {
      return map[d] = true, map;
    }, {});

    [].forEach.call(multiselect.options, function(option) {
      var selected = !!map[option.value];
      if (option.selected !== selected) {
        option.selected = selected;
        changed = true;
      }
    });
    if (changed) {
      multiselect.dispatchEvent(new CustomEvent('change', {
        bubbles: true
      }));
    }
  }

  function pollSourceSelect() {
    var value = getValue(this.__select);
    if (this.__value.length > value.length) {
      value.push(null);
    }
    if (!compare(this.__value, value)) {
      this.value = value;
    }
  }

  function removeEmptyOption(select) {
    if (!select.options[0].value) {
      select.removeChild(select.options[0]);
    }
  }

  function parseValues(d) {
    return Array.isArray(d)
      ? d
      : d ? String(d).split(/,/g) : [d];
  }

  function nullish(d) {
    return d === null || d === undefined;
  }

  // Array comparison
  function compare(a, b) {
    if (Array.isArray(a) && Array.isArray(b)) {
      for (var i = 0, len = a.length; i < len; i++) {
        if (b.indexOf(a[i]) === -1) return false;
      }
    }
    return String(a) === String(b);
  }

})(window);
