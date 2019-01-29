
require('es6-shim');

// window.customElements() polyfills
require('document-register-element');
require('@webcomponents/custom-elements');
require('./html-base-custom-element');

// CustomEvent polyfill
require('./compat/custom-event');

require('./aria-accordion');
require('./picc-meter');
require('./picc-range');
require('./picc-side-meter');
require('./picc-slider');
require('./multi-select');
