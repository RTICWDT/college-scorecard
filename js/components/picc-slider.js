(function(exports) {

  exports.PICCSlider = registerElement('picc-slider', {
    createdCallback: function() {
      this.__range = createRange.call(this);
      this.__mark = createMark.call(this, 'average');
      this.__left = createHandle.call(this, 'min');
      this.__right = createHandle.call(this, 'max');

      this.setAttribute('role', 'slider');
      this.min = getAttr.call(this, 'min', 0);
      this.max = getAttr.call(this, 'max', 100);
      this.lower = getAttr.call(this, 'lower', this.min);
      this.upper = getAttr.call(this, 'upper', this.max);
      this.step = getAttr.call(this, 'step', 1);
      this.average = getAttr.call(this, 'average');
      this.format = getAttr.call(this, 'format');
    },

    attachedCallback: function() {
      this.addEventListener('click', click);
      this.addEventListener('mousedown', engage);
      this.addEventListener('touchstart', engage);
      this.addEventListener('focus', focus, true);
      this.update();
    },

    detachedCallback: function() {
      // console.log('picc-slider detached');
      this.removeEventListener('click', click);
      this.removeEventListener('mousedown', enagage);
      this.removeEventListener('touchstart', enagage);
      this.removeEventListener('focus', focus, true);
    },

    attributeChangedCallback: function(attr, prev, value) {
      switch (attr) {
        case 'min':
        case 'max':
        case 'value':
        case 'step':
        case 'average':
        case 'format':
          // console.log('picc-slider attr: ', attr, ' = ', value);
          this[attr] = value;
          this.update();
          break;
      }
    },

    update: function() {
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
      var average = this.average;

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
        {el: getLabel(mark), value: average},
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

      if (isNaN(average)) {
        mark.style.setProperty('display', 'none');
      } else {
        var p = percent(x(average));
        // console.log('mark:', average, p);
        mark.style.setProperty('left', p);
        mark.style.removeProperty('display');
      }

      this.setAttribute('aria-valuemin', lower);
      this.setAttribute('aria-valuemax', upper);

      this.dispatchEvent(new CustomEvent('change', {
        min: lower,
        max: upper
      }));
    },

    // clamp to min and max, round if snap === true
    value: property('value', function(v) {
      v = clamp(+v, this.min, this.max);
      if (this.step) v = roundTo(v, this.step);
      return v;
    }),

    // parse all of these as numbers
    min:    property('min', Number),
    max:    property('max', Number),
    lower:  property('lower', Number),
    upper:  property('upper', Number),
    step:   property('step', Number),
    average: property('average', Number),

    format: property('format', String)
  });

  function click(e) {
    // ignore right-clicks
    if (e.button === 2) return false;
    // console.log('click');
    this.__dragging = getClosestHandle.call(this, e);
    this.__dragging.setAttribute('aria-grabbed', true);
    move.call(this, e);
  }

  function engage(e) {
    // ignore right-clicks
    if (e.button === 2) {
      e.preventDefault();
      return false;
    }
    // console.log('+ engage');

    this.__dragging = getClosestHandle.call(this, e);
    this.__dragging.setAttribute('aria-grabbed', true);

    window.addEventListener('mousemove', getListener(move, this));
    window.addEventListener('touchmove', getListener(move, this));
    window.addEventListener('mouseup', getListener(release, this));
    window.addEventListener('touchend', getListener(release, this));
  }

  function move(e) {
    if (!this.__dragging) return;

    // console.log('* move');

    var handle = this.__dragging;
    var x = getMouseX.call(this, e);

    var property = handle === this.__left ? 'lower' : 'upper';

    var width = this.getBoundingClientRect().width;
    x = Math.max(0, Math.min(x, width));

    var value = this.min + (x / width) * (this.max - this.min);
    if (this.step) value = roundTo(value, this.step);
    this[property] = value;
    this.update();

    this.setAttribute('aria-valuenow', value);

    e.preventDefault();
    return false;
  }

  function release(e) {
    // console.log('- release');
    if (this.__dragging) {
      this.__dragging.removeAttribute('aria-grabbed');
    }
    this.__dragging = false;
    this.removeAttribute('aria-valuenow');
    window.removeEventListener('mousemove', getListener(move, this));
    window.removeEventListener('touchmove', getListener(move, this));
    window.removeEventListener('mouseup', getListener(release, this));
    window.removeEventListener('touchend', getListener(release, this));
    e.preventDefault();
    return false;
  }

  function keypress(e) {
    // console.log('* keypress:', e.keyCode);
    switch (e.keyCode) {
      case 37: // left
        nudge.call(this, -1);
        break;
      case 39: // right
        nudge.call(this, +1);
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
        break;
    }
  }

  function focus(e) {
    // console.log('+ focus');
    this.__dragging = e.target;
    this.__dragging.setAttribute('aria-grabbed', true);

    window.addEventListener('keyup', getListener(keypress, this));
    this.addEventListener('blur', blur, true);
  }

  function blur(e) {
    if (this.__dragging === e.target) {
      // console.log('- blur');
      release.call(this, e);
      window.removeEventListener('keyup', getListener(keypress, this));
      this.removeEventListener('blur', blur, true);
    } else {
      // console.log('# invalid blur');
    }
  }

  function getListener(fn, obj) {
    var key = '__' + fn.name;
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
    div.className = 'handle handle_' + which;
    div.setAttribute('tabindex', 0);
    div.appendChild(createLabel());
    return this.appendChild(div);
  }

  function createRange() {
    var div = document.createElement('div');
    div.className = 'range';
    return this.appendChild(div);
  }

  function createMark(klass) {
    var div = document.createElement('div');
    div.className = klass;
    div.appendChild(createLabel());
    return this.appendChild(div);
  }

  function createLabel() {
    var label = document.createElement('span');
    label.className = 'label';
    return label;
  }

  function getLabel(parent) {
    return parent.querySelector('.label');
  }

  function getClosestHandle(e) {
    switch (e.target) {
      case this.__left: return this.__left;
      case this.__right: return this.__right;
    }

    var x = getMouseX.call(this, e);
    var left = this.__left.getBoundingClientRect().right;
    var right = this.__right.getBoundingClientRect().left;
    var dl = Math.abs(x - left);
    var dr = Math.abs(x - right);
    return dl < dr ? this.__left : this.__right;
  }

  function getMouseX(e) {
    var rect = this.getBoundingClientRect();
    var width = rect.width;
    return e.clientX - rect.left;
  }

  function nudge(multiplier) {
    var handle = this.__dragging;
    if (!handle) return;

    var property = handle === this.__left ? 'lower' : 'upper';
    var step = this.step || .1;
    this[property] += step * multiplier;
  }

  function getCenter(el) {
    var rect = el.getBoundingClientRect();
    return rect.left; // + rect.width / 2;
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

})(this);
