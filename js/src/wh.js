var d3 = require('d3');

module.exports = function wh() {

  function resizeFrame() {
    var height = Math.min(
      // Handles a decrease in height in Firefox
      document.body.scrollHeight,
      // Handles a decrease in height in Chrome/Safari
      document.documentElement.scrollHeight
    );
    window.parent.postMessage( height, '*' );
  }

  picc.ready(function() {
    d3.selectAll('aria-accordion')
      .on('open.iframe', resizeFrame)
      .on('close.iframe', resizeFrame);

    d3.selectAll('multi-select')
      .on('click.iframe', resizeFrame, '.button-add, .button-remove');
  });

};
