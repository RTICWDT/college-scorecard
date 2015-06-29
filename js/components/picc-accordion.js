(function(exports) {

  var PICCAccordion = document.registerElement('picc-accordion', createPrototype({
    createdCallback: function() {
      console.log('created:', this);
    },

    attachedCallback: function() {
      var toggle = this.querySelector(PICCAccordion.TOGGLE_SELECTOR);
      if (!toggle) {
        console.warn('no toggle found for "%s" in:', toggleSelector, this);
        return;
      }

      console.log('init:', this);
      toggle.addEventListener('click', this.toggle.bind(this));
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
          this.dispatchEvent(new CustomEvent(this.open ? 'open' : 'close'));
          var content = this.querySelector(PICCAccordion.CONTENT_SELECTOR);
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
      }
    },

    toggle: function() {
      console.log('toggle:', this.open);
      this.open = !this.open;
    }
  }));

  PICCAccordion.TOGGLE_SELECTOR = '.picc-accordion-title';
  PICCAccordion.CONTENT_SELECTOR = '.picc-accordion-content';

  exports.PICCAccordion = PICCAccordion;

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
