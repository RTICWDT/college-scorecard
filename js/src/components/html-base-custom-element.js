(function(exports) {
// https://github.com/WebReflection/document-register-element#skipping-the-caveat-through-extends
// and https://stackoverflow.com/a/53135530/3380256

  function HTMLBaseCustomElement() {
    self = Reflect.construct(HTMLElement, [], this.constructor);
    self.parsed = false; // guard to make it easy to do certain stuff only once
    self.parentNodes = [];
    return self;
  }

  HTMLBaseCustomElement.prototype = Object.create(HTMLElement.prototype);
  HTMLBaseCustomElement.prototype.constructor = HTMLBaseCustomElement;
  HTMLBaseCustomElement.prototype.setup = function() {
    var el = this;
    while(el.parentNode) {
      el = el.parentNode;
      this.parentNodes.push(el);
    }

    var nodes = this.parentNodes.splice(0);
    nodes.unshift(this);

    // check if the parser has already passed the end tag of the component
    // in which case this element, or one of its parents, should have a nextSibling
    // if not (no whitespace at all between tags and no nextElementSiblings either)
    // resort to DOMContentLoaded or load having triggered
    if (nodes.some(function(el) { return el.nextSibling}) || document.readyState !== 'loading') {
      this.childrenAvailableCallback();
    } else {
      this.mutationObserver = new MutationObserver(function() {
        if (nodes.some(function(el) { return el.nextSibling}) || document.readyState !== 'loading') {
          this.childrenAvailableCallback();
          this.mutationObserver.disconnect();
        }
      }.bind(this));

      this.mutationObserver.observe(this, {childList: true});
    }

  };

  Object.setPrototypeOf(HTMLBaseCustomElement, HTMLElement);

  exports.HTMLBaseCustomElement = HTMLBaseCustomElement;

  // exports.customElements.define('html-base-custom-element', HTMLBaseCustomElement)

})(window);
