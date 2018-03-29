module.exports = function data() {

  /**
   * * add click listeners for download links
   */
  picc.ready(function() {
    var downloadType = 'data-download';
    picc.delegate(
      document.body,
      function() {
        return this.hasAttribute(downloadType);
      },
      {
        click: dataDidClickDownload,
      }
    );
  });

  function dataDidClickDownload(evt) {
    var type = evt.target.getAttribute('href').split('/').pop();
    if (window.ga) {
      try {
        ga('send', 'event', 'Downloads', type, window.location.pathname)
      } catch (e) {
        console.error('[ga] downloads event error');
      }
    }
  }

};
