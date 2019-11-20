
// in this file you can append custom step methods to 'I' object

module.exports = function() {
  return actor({
    grabAndFilterConsole:  async function(filter = 'error') {
      let logs = await this.grabBrowserLogs();
      let errors = logs.filter((obj) => {
        return obj._type === filter;
      });
      return errors;
    }
  });
}
