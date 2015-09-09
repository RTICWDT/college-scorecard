var d3 = require('d3');

module.exports = function wh() {

  function resizeFrame() {
    window.parent.postMessage( document.documentElement.scrollHeight, '*' );
  }

  picc.ready(function() {
    d3.selectAll('aria-accordion')
      .on('open.iframe', resizeFrame)
      .on('close.iframe', resizeFrame);

    d3.selectAll('multi-select')
      .on('click.iframe', resizeFrame, '.button-add, .button-remove');
  });

};
