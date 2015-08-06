(function(exports) {

  var ITEM_CLASS = 'multi-select_item';

  exports.MultiSelect = document.registerElement('multi-select', {
    prototype: Object.create(
      HTMLElement.prototype,
      {
        createdCallback: {value: function() {
        }},

        attachedCallback: {value: function() {
          var select = this.querySelector('select');
          if (!select) return console.error('no <select> found in <multi-select>!');

          this.name = select.name;
          select.name = '';

          this.createTemplate();
          this.update();
        }},

        attributeChangedCallback: {value: function(attr, oldValue, newValue) {
        }},

        detachedCallback: {value: function() {
        }},

        update: {value: function() {
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

        }},

        createTemplate: {value: function() {
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
        }},

        type: {
          get: function() {
            return 'text';
          }
        },

        name: {
          get: function() {
            return this.getAttribute('name');
          },
          set: function(name) {
            this.setAttribute('name', name);
          }
        },

        value: {
          get: function() {
            return Array.isArray(this.__value)
              ? this.__value.slice()
              : this.__value || [null];
          },
          set: function(value) {
            // console.log('[set values]:', value);
            if (compare(this.__value, value)) {
              console.warn('no change');
              return;
            }

            this.__value = parseValues(value);
            this.update();

            this.dispatchEvent(new CustomEvent('change', {
              bubbles: true
            }));
          }
        }
      }
    )
  });

  function parseValues(d) {
    return Array.isArray(d)
      ? d
      : d ? String(d).split(/,/g) : [d];
  }

  function nullish(d) {
    return d === null || d === undefined;
  }

  // fast compare
  function compare(a, b) {
    return String(a) === String(b);
  }

})(this);
