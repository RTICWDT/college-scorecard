(function(exports) {


  exports.PICCSlider = registerElement('picc-slider', {
    createdCallback: function() {
      this.__range = createRange.call(this);
      this.__left = createHandle.call(this, 'min');
      this.__right = createHandle.call(this, 'max');

      this.setAttribute('aria-role', 'slider');
      this.min = getAttr.call(this, 'min', 0);
      this.max = getAttr.call(this, 'max', 100);
      this.lower = getAttr.call(this, 'lower', 0);
      this.upper = getAttr.call(this, 'upper', 100);
      this.step = getAttr.call(this, 'step', 1);
    },

    attachedCallback: function() {
      this.addEventListener('click', click);
      this.addEventListener('mousedown', engage);
      this.addEventListener('touchstart', engage);
      this.addEventListener('focus', focus, true);
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
          // console.log('picc-slider attr: ', attr, ' = ', value);
          this[attr] = value;
          this.update();
          break;
      }
    },

    update: function() {
      var min = this.min;
      var max = this.max;

      // enforce bounds
      this.__lower = Math.min(Math.max(this.__lower, min), max);
      this.__upper = Math.max(Math.min(this.__upper, max), min);

      // TODO: enforce upper/lower crossing

      var lower = this.lower;
      var upper = this.upper;

      var x = function(value) {
        return 100 * (value - min) / (max - min);
      };

      var left = percent(x(lower));
      var right = percent(x(upper));

      this.__left.style.setProperty('left', left);
      this.__right.style.setProperty('left', right);

      this.__range.style.setProperty('left', left);
      this.__range.style.setProperty('right', percent(x(max - upper)));

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
    step:   property('step', Number)
  });

  function click(e) {
    // ignore right-clicks
    if (e.button === 2) return false;
    console.log('click');
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
    console.log('+ engage');

    this.__dragging = getClosestHandle.call(this, e);
    this.__dragging.setAttribute('aria-grabbed', true);

    window.addEventListener('mousemove', getListener(move, this));
    window.addEventListener('touchmove', getListener(move, this));
    window.addEventListener('mouseup', getListener(release, this));
    window.addEventListener('touchend', getListener(release, this));
  }

  function move(e) {
    if (!this.__dragging) return;

    console.log('* move');

    var handle = this.__dragging;
    var x = getMouseX.call(this, e);

    var property;
    var fudge = 10;
    var valid = true;

    if (handle === this.__left) {
      property = 'lower';
      var limit = this.__right.getBoundingClientRect().left - fudge;
      if (x >= limit) valid = false;
    } else {
      property = 'upper';
      var limit = this.__left.getBoundingClientRect().right + fudge;
      if (x <= limit) valid = false;
    }

    if (valid) {
      var width = this.getBoundingClientRect().width;
      x = Math.max(0, Math.min(x, width));

      var value = this.min + (x / width) * (this.max - this.min);
      if (this.step) value = roundTo(value, this.step);
      this[property] = value;
      this.update();

      this.setAttribute('aria-valuenow', value);
    }

    e.preventDefault();
    return false;
  }

  function release(e) {
    console.log('- release');
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
    console.log('* keypress:', e.keyCode);
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
    console.log('+ focus');
    this.__dragging = e.target;
    this.__dragging.setAttribute('aria-grabbed', true);

    window.addEventListener('keyup', getListener(keypress, this));
    this.addEventListener('blur', blur, true);
  }

  function blur(e) {
    if (this.__dragging === e.target) {
      console.log('- blur');
      release.call(this, e);
      window.removeEventListener('keyup', getListener(keypress, this));
      this.removeEventListener('blur', blur, true);
    } else {
      console.log('# invalid blur');
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
    return this.appendChild(div);
  }

  function createRange() {
    var div = document.createElement('div');
    div.className = 'range';
    return this.appendChild(div);
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

})(this);
