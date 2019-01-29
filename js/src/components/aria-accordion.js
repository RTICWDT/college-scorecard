(function(exports) {

  var EXPANDED = 'aria-expanded';
  var HIDDEN = 'aria-hidden';
  var TOGGLE_EVENTS = ['click'];

  function ARIAAccordion() {
    var self = Reflect.construct(HTMLBaseCustomElement, [], this.constructor);
    return self;
  }

  ARIAAccordion.prototype = Object.create(HTMLBaseCustomElement.prototype);
  ARIAAccordion.prototype.constructor = ARIAAccordion;
  Object.setPrototypeOf(ARIAAccordion, HTMLBaseCustomElement);

  ARIAAccordion.observedAttributes = ['trigger', 'aria-controls', 'aria-expanded', 'aria-hidden'];

  ARIAAccordion.prototype.connectedCallback = function() {
    this.setup();
  };

  ARIAAccordion.prototype.childrenAvailableCallback = function() {

    this.parsed = true;
    var trigger = this.__trigger = getTrigger(this);
    if (!trigger) {
      return;
    };

    var content = this.__content = getContent(this, trigger);
    if (!content) {
      return;
    };

    trigger.setAttribute('tabindex', 0);

    // set role="button" on the trigger element if it's not a <button>
    if (trigger.nodeName !== 'BUTTON' && !trigger.hasAttribute('role')) {
      trigger.setAttribute('role', 'button');
    }

    // reflect the aria-expanded attribute of the accordion to the
    // trigger (button) if the attribute is unset
    if (!trigger.hasAttribute(EXPANDED)) {
      trigger.setAttribute(EXPANDED, getAriaBoolean(this, EXPANDED));
    }

    var toggle = this.toggle.bind(this);
    var toggleAndCancel = this.__toggleAndCancel = function(e) {
      toggle();
      e.preventDefault();
      return false;
    };

    TOGGLE_EVENTS.forEach(function(event) {
      trigger.addEventListener(event, toggleAndCancel);
    });

    this.update();

  };

  ARIAAccordion.prototype.attributeChangedCallback = function (attr, old, value) {

  };

  ARIAAccordion.prototype.disconnectedCallback = function() {
    var trigger = this.__trigger;
    if (!trigger) return;
    var toggleAndCancel = this.__toggleAndCancel;
    TOGGLE_EVENTS.forEach(function(event) {
      trigger.removeEventListener(event, toggleAndCancel);
    });
  };

  Object.defineProperties(ARIAAccordion.prototype, {
    "expanded": {
      get: function () {
        return getAriaBoolean(this.__trigger, EXPANDED);
      },
      set: function (value) {
        value = !!value;
        if (value !== this.expanded && this.__trigger) {
          this.__trigger.setAttribute(EXPANDED, value);
          this.update();
          this.dispatchEvent(new CustomEvent(value ? 'open' : 'close'));
        }
      }
    }
  });

  ARIAAccordion.prototype.update = function() {
    var expanded = this.expanded;
    this.setAttribute(EXPANDED, expanded);
    this.__trigger.setAttribute(EXPANDED, expanded);
    this.__content.setAttribute(HIDDEN, !expanded);
  };

  ARIAAccordion.prototype.open = function() {
    this.expanded = true;
  };

  ARIAAccordion.prototype.close = function() {
    this.expanded = false;
  };

  ARIAAccordion.prototype.toggle = function() {
    this.expanded = !this.expanded;
  };

  ARIAAccordion.prototype.trigger = {
    get: function() {
      return this.__trigger;
    }
  };

  ARIAAccordion.prototype.content = {
    get: function() {
      return this.__content;
    }
  };


  function getTrigger(root) {
    var selector = root.getAttribute('trigger') || '[aria-controls]';
    var trigger = root.querySelector(selector);
    if (!trigger || !trigger.hasAttribute('aria-controls')) {
      console.warn('no trigger found for selector: "' + selector + '"');
      return;
    }
    return trigger;
  }

  function getContent(root, trigger) {
    var contentId = trigger.getAttribute('aria-controls');
    var content = document.getElementById(contentId);
    if (!content) {
      console.warn('no content element found with id: "' + contentId + '"');
      return;
    }
    return content;
  }

  function getAriaBoolean(el, attr) {
    return el && el.hasAttribute(attr) && el.getAttribute(attr) !== 'false';
  }

  exports.customElements.define('aria-accordion', ARIAAccordion);

})(window);
