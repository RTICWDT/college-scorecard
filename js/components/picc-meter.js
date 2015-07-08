(function(exports) {

  var CLASS_PREFIX = 'picc-meter-';

  exports.PICCMeter = document.registerElement('picc-meter', {
    prototype: Object.create(
      HTMLElement.prototype,
      {

        attachedCallback: {value: function() {
          var bar = this.appendChild(document.createElement('div'));
          bar.className = CLASS_PREFIX + 'bar';

          var line = this.appendChild(document.createElement('div'));
          line.className = CLASS_PREFIX + 'line';

          this.min = getAttr(this, 'min', 0);
          this.max = getAttr(this, 'max', 1);
          this.value = getAttr(this, 'value', 0);
          this.average = getAttr(this, 'average', 0);

          this.update();
        }},

        attributeChangedCallback: {value: function(attr, prev, value) {
          switch (attr) {
            case 'min':
              this.min = value;
              break;
            case 'max':
              this.max = value;
              break;
          }
        }},

        update: {value: function() {
          var min = this.min;
          var max = this.max;

          var scale = function(v) {
            return (v - min) / (max - min);
          };

          var percent = function(v) {
            return (scale(v) * 100).toFixed(1) + '%';
          };

          var bar = this.querySelector('.' + CLASS_PREFIX + 'bar');
          var line = this.querySelector('.' + CLASS_PREFIX + 'line');

          bar.style.setProperty('height', percent(this.value));
          line.style.setProperty('bottom', percent(this.average));

          delete this.__timeout;
        }},

        min: {
          get: function() {
            return this.__min;
          },
          set: function(value) {
            this.__min = number(value, 0);
            deferUpdate(this);
          }
        },

        max: {
          get: function() {
            return this.__max;
          },
          set: function(value) {
            this.__max = number(value, 0);
            deferUpdate(this);
          }
        },

        value: {
          get: function() {
            return this.__value;
          },
          set: function(value) {
            this.__value = number(value, 0);
            deferUpdate(this);
          }
        },

        average: {
          get: function() {
            return this.__average;
          },
          set: function(value) {
            this.__average = number(value, 0);
            deferUpdate(this);
          }
        }
      }
    )
  });

  function deferUpdate(meter, delay) {
    if (!delay) delay = 50;
    if (!meter.__timeout) {
      meter.__timeout = setTimeout(function() {
        delete meter.__timeout;
        meter.update();
      }, delay);
    }
  }

  function getAttr(node, attr, fallback) {
    return node.hasAttribute(attr)
      ? node.getAttribute(attr) || fallback
      : fallback;
  }

  function number(value, fallback) {
    var num = +value;
    return isNaN(value) ? (fallback || 0) : num;
  }

})(this);
