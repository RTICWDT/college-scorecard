(function(exports) {
  var ELEMENT_NAME = 'picc-slider';
  var CLASS_PREFIX = ELEMENT_NAME + '-';

  var HTMLParsedElement = require('./html-parsed-element');

  exports.customElements.define(
    ELEMENT_NAME,
    class extends HTMLParsedElement {

      static get observedAttributes() {
        return ['format', 'min', 'max', 'lower', 'middle', 'upper', 'median', 'step', 'role', '__range', '__left', '__right'];
      }

      parsedCallback() {
        this.__range = createRange.call(this);
        /** this.__mark = createMark.call(this, 'median'); */
        this.__left = createHandle.call(this, 'min');
        this.__right = createHandle.call(this, 'max');

        this.setAttribute('role', 'slider');
        this.min = getAttr.call(this, 'min', 0);
        this.max = getAttr.call(this, 'max', 100);
        this.lower = getAttr.call(this, 'lower', this.min);
        this.upper = getAttr.call(this, 'upper', this.max);
        this.step = getAttr.call(this, 'step', 1);
        /** this.median = getAttr.call(this, 'median'); */
        this.format = getAttr.call(this, 'format');
        this.addEventListener('click', click);
        this.addEventListener('mousedown', engage);
        this.addEventListener('touchstart', engage);
        this.addEventListener('focus', engage, true);
        this.update();
      }

      disconnectedCallback() {
        this.removeEventListener('click', click);
        this.removeEventListener('mousedown', engage);
        this.removeEventListener('touchstart', engage);
        this.removeEventListener('focus', engage, true);
      }

      attributeChangedCallback(attr, prev, value) {
        if (this.parsed) {
          switch (attr) {
            case 'min':
            case 'max':
            case 'value':
            case 'step':
            /** case 'median': */
            case 'format':
              // console.log('picc-slider attr: ', attr, ' = ', value);
              this[attr] = value;
              this.update();
              break;
          }
        }
      }

      update() {
        var min = this.min;
        var max = this.max;

        // enforce lower/upper crossing
        if (this.__dragging === this.__left && this.__lower >= this.__upper) {
          this.__lower = this.__upper - this.step;
        } else if (this.__dragging === this.__right && this.__upper <= this.__lower) {
          this.__upper = this.__lower + this.step;
        }

        // enforce min/max bounds
        this.__lower = Math.min(Math.max(this.__lower, min), max);
        this.__upper = Math.max(Math.min(this.__upper, max), min);

        var lower = this.lower;
        var upper = this.upper;
       /** var median = this.median; */

        var x = function(value) {
          return 100 * (value - min) / (max - min);
        };

        var left = percent(x(lower));
        var right = percent(x(upper));

        this.__left.style.setProperty('left', left);
        this.__right.style.setProperty('left', right);

        this.__range.style.setProperty('left', left);
        this.__range.style.setProperty('right', percent(x(max - upper)));

        var mark = this.__mark;

        var labels = [
          {el: getLabel(this.__left), value: lower},
          {el: getLabel(this.__right), value: upper},
          /** {el: getLabel(mark), value: median}, */
        ];

        var format = function() { return ''; };
        switch (this.format) {
          case '%':
            format = formatPercent;
            break;
          case '$':
            format = formatDollars;
            break;
        }

        var nudgeThreshold = 12;
        var outerRect = this.getBoundingClientRect();
        var leftEdge = outerRect.left + nudgeThreshold;
        var rightEdge = outerRect.right;
        labels.forEach(function(d, i) {
          var label = d.el;
          if (!label) return console.warn('no label:', i);
          label.textContent = format(d.value);

          /*
          var offset = 0;
          var bump = false;
          label.style.removeProperty('left');
          label.style.removeProperty('right');

          var rect = label.getBoundingClientRect();
          if (rect.left < leftEdge) {
            bump = 'left';
            offset = leftEdge - rect.left - rect.width / 2;
            // console.log('bump left:', rect.left, leftEdge);
            label.style.setProperty('left', offset + 'px');
            label.style.removeProperty('right');
          } else if (rect.right > rightEdge) {
            bump = 'right';
            offset = rect.right - rightEdge - label.parentNode.getBoundingClientRect().width;
            // console.log('bump right:', rect.right, rightEdge);
            label.style.setProperty('left', 'auto');
            label.style.setProperty('right', offset + 'px');
          }

          label.classList.toggle('bump-left', bump === 'left');
          label.classList.toggle('bump-right', bump === 'right');
          */
        });

        /** if (isNaN(median)) {
          mark.style.setProperty('display', 'none');
        } else {
          var p = percent(x(median));
          // console.log('mark:', median, p);
          mark.style.setProperty('left', p);
          mark.style.removeProperty('display');
        } */

        this.setAttribute('aria-valuemin', lower);
        this.setAttribute('aria-valuemax', upper);

      }

      // clamp to min and max, round if snap === true
      value() {
        return property('value', function(v) {
          v = clamp(+v, this.min, this.max);
          if (this.step) v = roundTo(v, this.step);
          return v;
        }
      )}

      // parse all of these as numbers
      min()   { return property('min', Number) }
      max()   { return property('max', Number) }
      lower() { return property('lower', Number) }
      upper() { return property('upper', Number) }
      step()  { return property('step', Number) }
      /** median: property('median', Number), */
      format() { return property('format', String) }
    }
  );

  function click(e) {
    // ignore right-clicks
    if (e.button === 2) return;
    // console.info('* click');
    this.__dragging = getClosestHandle.call(this, e);
    move.call(this, e);
    this.__dragging = null;
    this.dispatchEvent(new CustomEvent('change'));
  }

  function engage(e) {
    // ignore right-clicks
    if (e.button === 2 || this.__mousedrag) {
      e.preventDefault();
      return;
    }
    // console.info('+ engage', e.type);

    this.__dragging = getClosestHandle.call(this, e);
    this.__dragging.setAttribute('aria-grabbed', true);

    if (e.type === 'focus') {
      window.addEventListener('keyup', getListener(keypress, this));
      e.target.addEventListener('blur', getListener(releaseFocus, this));
    } else {
      this.__mousedrag = true;
      window.addEventListener('mousemove', getListener(move, this));
      window.addEventListener('mouseup', getListener(release, this));
      window.addEventListener('touchmove', getListener(move, this));
      window.addEventListener('touchend', getListener(release, this));
    }
  }

  function move(e) {
    if (!this.__dragging) {
      console.warn('move() while not dragging');
      return;
    }

    // console.info('* move', e.type);

    var handle = this.__dragging;
    var x = getMouseX.call(this, e);

    var property = handle === this.__left ? 'lower' : 'upper';

    var width = this.getBoundingClientRect().width;
    x = Math.max(0, Math.min(x, width));

    var value = this.min + (x / width) * (this.max - this.min);

    if (this.step && value !== this.max) value = roundTo(value, this.step);
    this[property] = value;
    this.update();

    this.setAttribute('aria-valuenow', value);

    var event = new CustomEvent('drag');
    event.property = property;
    event.value = value;
    this.dispatchEvent(event);

    e.preventDefault();

    try {
      window.getSelection().removeAllRanges();
    } catch (err) {
      console.warn('unable to clear ranges:', err);
    }
    return;
  }

  function release(e) {
    // console.info('- release', e.type);

    if (this.__dragging) {
      this.__dragging.removeAttribute('aria-grabbed');
    } else {
      console.warn('release() while not dragging');
    }

    this.__dragging = false;
    this.removeAttribute('aria-valuenow');

    if (e.type === 'blur') {
      //window.removeEventListener('keyup', getListener(keypress, this));
      //this.removeEventListener('blur', release, true);
    } else {
      this.__mousedrag = false;
      window.removeEventListener('mousemove', getListener(move, this));
      window.removeEventListener('mouseup', getListener(release, this));
      window.removeEventListener('touchmove', getListener(move, this));
      window.removeEventListener('touchend', getListener(release, this));
    }

    this.dispatchEvent(new CustomEvent('change'));

    e.preventDefault();
    return;
  }

  function releaseFocus(e) {
     //console.info('- release focus', e.type);
     window.removeEventListener('keyup', getListener(keypress, this));
     e.target.removeEventListener('blur', getListener(releaseFocus, this));
    this.__dragging = false;
    return false;
  }

  function keypress(e) {
    // console.info('* keypress:', e.keyCode);
    switch (e.keyCode) {
      case 37: // left
        nudge.call(this, -1);
        this.dispatchEvent(new CustomEvent('change'));
      break;
      case 39: // right
        nudge.call(this, +1);
        this.dispatchEvent(new CustomEvent('change'));
      break;

      case 36: // end
      case 35: // home
        switch (this.__dragging) {
          case this.__left:
            this.lower = this.min;
            break;
          case this.__right:
            this.upper = this.max;
            break;
        }
        this.dispatchEvent(new CustomEvent('change'));
        break;
    }
  }

  function getListener(fn, obj) {
    var name = fn.name || fn.toString().match(/function (\w+)/)[1];
    var key = '__listener_' + name;
    // console.log('listener:', name);
    return obj[key] || (obj[key] = fn.bind(obj));
  }

  function registerElement(name, proto, parent) {
    if (!parent) parent = HTMLElement;
    for (var key in proto) {
      if (typeof proto[key] === 'function') {
        proto[key] = {value: proto[key]};
        if (key.indexOf('__') === 0) {
          proto[key].enumerable = false;
        }
      }
    }
    return document.registerElement(name, {
      prototype: Object.create(
        parent.prototype,
        proto
      )
    });
  }

  function getAttr(name, fallback) {
    return this.hasAttribute(name)
      ? this.getAttribute(name)
      : fallback;
  }

  function property(name, parse) {
    var key = '__' + name;
    return {
      get: function propGetter() {
        return this[key];
      },
      set: function propSetter(value) {
        if (parse) value = parse.call(this, value, name);
        if (value !== this[key]) {
          this[key] = value;
          this.update();
        }
      }
    };
  }

  function createHandle(which) {
    var div = document.createElement('div');
    div.classList.add(CLASS_PREFIX + 'handle');
    div.classList.add(CLASS_PREFIX + 'handle_' + which);
    div.setAttribute('tabindex', 0);
    div.appendChild(createLabel());
    return this.appendChild(div);
  }

  function createRange() {
    var div = document.createElement('div');
    div.className = CLASS_PREFIX + 'range';
    return this.appendChild(div);
  }

  function createMark(klass) {
    var div = document.createElement('div');
    div.className = CLASS_PREFIX + klass;
    div.appendChild(createLabel());
    return this.appendChild(div);
  }

  function createLabel() {
    var label = document.createElement('span');
    label.className = CLASS_PREFIX + 'label';
    return label;
  }

  function getLabel(parent) {
    return parent.querySelector('.' + CLASS_PREFIX + 'label');
  }

  function getClosestHandle(e) {
    switch (e.target) {
      case this.__left: return this.__left;
      case this.__right: return this.__right;
    }

    var x = getMouseX.call(this, e);
    var left = this.__left.getBoundingClientRect().left;
    var right = this.__right.getBoundingClientRect().left;
    // console.info('x: %d, left: %d, right: %d', x, left, right);
    var dl = Math.abs(x - left);
    var dr = Math.abs(x - right);
    return dl < dr ? this.__left : this.__right;
  }

  function getMouseX(e) {
    var rect = this.getBoundingClientRect();
    var width = rect.width;
    var x = (e.touches && e.touches.length)
      ? e.touches[0].clientX
      : e.clientX;
    return x - rect.left;
  }

  function nudge(multiplier) {
    var handle = this.__dragging;
    if (!handle) return;

    var property = handle === this.__left ? 'lower' : 'upper';
    var step = this.step || .1;
    this[property] += step * multiplier;
  }

  function clamp(x, min, max) {
    if (x < min) return min;
    else if (x > max) return max;
    return x;
  }

  function roundTo(value, step) {
    return Math.round(value / step) * step;
  }

  function percent(value) {
    return value.toFixed(2) + '%';
  }

  function formatDollars(n) {
    if (n >= 1000) {
      return '$' + roundFloat(n / 1000) + 'K';
    }
    return '$' + Math.round(n);
  }

  function formatPercent(n) {
    return Math.round(n * 100) + '%';
  }

  function roundFloat(n) {
    return n.toFixed(1).replace(/\.0$/, '');
  }

})(window);
