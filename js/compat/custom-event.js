(function() {

  try {
    new CustomEvent('foo');
  } catch (err) {

    var createEvent = document.createCustomEvent || document.createEvent;

    window.CustomEvent = function(event, params) {
      var evt;
      params = params || {
        bubbles: false,
        cancelable: false,
        detail: undefined
      };
      evt = createEvent.call(document, 'CustomEvent');
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return evt;
    };

    window.CustomEvent.prototype = window.Event.prototype;
  }

})(this);
