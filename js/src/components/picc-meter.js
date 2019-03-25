(function(exports) {

  var CLASS_PREFIX = 'picc-meter-';
  var HTMLParsedElement = require('./html-parsed-element');

  exports.customElements.define(
    'picc-meter',
    class extends HTMLParsedElement {

        static get observedAttributes() {
          return ['min', 'max', 'value', 'degree'];
        }

        parsedCallback() {

          this.min = getAttr(this, 'min', 0);
          this.max = getAttr(this, 'max', 1);
          this.value = getAttr(this, 'value');
          /** this.median = getAttr(this, 'median'); */
          this.degree = getAttr(this,'degree');

          this.update();
        }

        attributeChangedCallback(attr, prev, value) {
          // pass through attribute settings to
          // properties for min, max, value an
          // median
          switch (attr) {
            case 'min':
            case 'max':
            case 'value':
            /** case 'median': */
            case 'degree':
              this[attr] = value;
              return;
          }
        }

        update() {
          // var min = getMin(this);
          // var max = getMax(this);
          // var median = getMedian(this);
          var min = this.min;
          var max = this.max;
          /** var median = this.median; */
          var value = this.value;

          var bar = getBar(this);
          /** var line = getLine(this); */

          if (typeof value !== 'number' || isNaN(value)) {
            // console.log('bad value:', value);

            // reset the bar
            bar.style.setProperty('display', 'none');
            bar.style.removeProperty('height');

            // reset the line
            /** line.style.setProperty('display', 'none');
            line.style.removeProperty('bottom'); */

            // classify and bail
            classify(this, {
              'no_data': true,
              'above_average': false,
              'below_average': false,
              'about_average': false
            });

          } else {

            classify(this, {no_data: false});

            var scale = function(v) {
              return (v - min) / (max - min);
            };

            var percent = function(v) {
              return (scale(v) * 100).toFixed(1) + '%';
            };

            bar.style.removeProperty('display');
            // prevent the bar from exceeding the height
            bar.style.setProperty('height', percent(Math.min(value, max)));

            /** if (this.hasAttribute('percentile-range')) {
              // var range = getRange(this);
              var range = this.getAttribute('percentile-range');
              var numbers = range.split('..').map(Number);
              if (numbers.some(isNaN)) {
                console.warn('invalid median-range:', range, numbers);
                classify(this, {
                  'above_average': false,
                  'below_average': false,
                  'about_average': false
                });
              } else {
                var lo = numbers[0];
                var hi = numbers[1];
                classify(this, {
                  'above_average': value > hi,
                  'below_average': value < lo,
                  'about_average': value >= lo && value <= hi
                });
              }
            } else {
              classify(this, {
                'above_average': false,
                'below_average': false,
                'about_average': false
              });
            }

            if (isNaN(median)) {
              line.style.setProperty('display', 'none');
            } else {
              // line.style.removeProperty('display');
              // line.style.setProperty('bottom', percent(median));
            } */

          }

          delete this.__timeout;

          this.dispatchEvent(new CustomEvent('update'));
        }

        get min() {
          return this.__min;
        }
        set min(value) {
          this.__min = number(value, 0);
          deferUpdate(this);
        }

        get max() {
          return this.__max;
        }
        set max(value) {
          this.__max = number(value, 1);
          deferUpdate(this);
        }

        get value() {
          return this.__value;
        }
        set value(value) {
          this.__value = number(value);
          deferUpdate(this);
        }

        /**get median() {
          return this.__median;
        }
        set median(value) {
          this.__median = number(value);
          deferUpdate(this);
        }*/

        get degree() {
          return this.__degree;
        }
        set degree(value) {
          this.__degree = number(value);
          deferUpdate(this);
        }
      }
  );

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

  function getBar(meter) {
    var bar = meter.querySelector('.' + CLASS_PREFIX + 'bar');
    if (!bar) {
      bar = meter.appendChild(document.createElement('div'));
      bar.className = CLASS_PREFIX + 'bar';
    }
    return bar;
  }

  /** function getLine(meter) {
    var line = meter.querySelector('.' + CLASS_PREFIX + 'line');
    if (!line) {
      line = meter.appendChild(document.createElement('div'));
      line.className = CLASS_PREFIX + 'line';
      line.appendChild(document.createElement('span'))
        .setAttribute('class', 'label');
    }
    return line;
  } */

  function getMin(meter) {
    return meter.getAttribute('data-min-' + getSuffixForDegree(meter.degree));
  }

  function getMax(meter) {
    return meter.getAttribute('data-max-' + getSuffixForDegree(meter.degree));
  }

  function getMedian(meter) {
   return meter.getAttribute('data-median-' + getSuffixForDegree(meter.degree));
  }

  function getRange(meter) {
    return meter.getAttribute('data-range-' + getSuffixForDegree(meter.degree));
  }

  function getSuffixForDegree(degree){
    switch(degree) {
      case 3:
        return 'four_year';
      case 2:
        return 'two_year';
      case 1:
        return 'cert';
    }
  }

  function number(value, fallback) {
    var num = String(value).length ? +value : NaN;
    // console.log('number(', value, ') ->', num);
    if (arguments.length < 2) fallback = NaN;
    return isNaN(num) ? fallback : num;
  }

  function classify(el, classes) {
    for (var klass in classes) {
      el.classList[classes[klass] ? 'add' : 'remove'](klass);
    }
  }

})(window);
