exports.command = function(callback) {
  console.time('document ready');
  return this.executeAsync(function(done) {
    if (document.readyState === 'complete') {
      done();
    } else {
      window.addEventListener('load', function(e) {
        done();
      });
    }
  }, [], function(result) {
    console.timeEnd('document ready');
    if (typeof callback === 'function') {
      callback(result);
    }
  });
};
