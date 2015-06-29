(function(exports) {

  var PICCAccordion = document.registerElement('picc-accordion', createPrototype({
    createdCallback: function() {
      var target = this.getElementsByClassName(PICCAccordion.TOGGLE_CLASS)[0];
      if (!target) {
        target = this.appendChild(document.createElement('button'));
        target.className = PICCAccordion.TOGGLE_CLASS;
      } else if (target.nodeName !== 'BUTTON') {
        target.classList.remove(PICCAccordion.TOGGLE_CLASS);
        target.classList.add(PICCAccordion.TOGGLE_CLASS + '-container');
        var button = target.appendChild(document.createElement('button'));
        button.className = PICCAccordion.TOGGLE_CLASS;
      }

      var self = this;
      var toggle = function(e) {
        self.toggle();
        e.preventDefault();
        return false;
      };

      target.addEventListener('click', toggle);
    },

    attachedCallback: function() {
      update.call(this);
    },

    attributeChangedCallback: function(attr, old, value) {
    },

    open: {
      get: function() {
        return this.hasAttribute('open') && this.getAttribute('open') !== 'false';
      },
      set: function(value) {
        var changed = false;
        if (this.open && !value) {
          this.removeAttribute('open');
          changed = true;
        } else if (!this.open && value) {
          this.setAttribute('open', true);
          changed = true;
        }

        if (changed) {
          update.call(this);
          this.dispatchEvent(new CustomEvent(this.open ? 'open' : 'close'));
        }
      }
    },

    toggle: function() {
      console.log('toggle:', this.open);
      return this.open = !this.open;
    }
  }));

  PICCAccordion.TOGGLE_CLASS = 'picc-accordion-toggle';
  PICCAccordion.CONTENT_CLASS = 'picc-accordion-content';

  exports.PICCAccordion = PICCAccordion;

  function update() {
    var toggle = this.getElementsByClassName(PICCAccordion.TOGGLE_CLASS)[0];
    if (toggle) {
      toggle.innerHTML = this.open
        ? '&minus;'
        : '&plus;';
    }

    var content = this.getElementsByClassName(PICCAccordion.CONTENT_CLASS)[0];
    if (content) {
      if (this.open) {
        content.classList.add('picc-accordion-content-open');
        content.classList.remove('picc-accordion-content-closed');
      } else {
        content.classList.remove('picc-accordion-content-open');
        content.classList.add('picc-accordion-content-closed');
      }
    }
  }

  function createPrototype(proto, parent) {
    if (!parent) parent = HTMLElement;
    for (var key in proto) {
      if (typeof proto[key] === 'function') {
        proto[key] = {value: proto[key]};
      }
    }
    return {
      prototype: Object.create(parent.prototype, proto)
    };
  }

})(this);
