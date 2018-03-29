/* jshint node: true */
var config = require('./wdio.sauce').config;

/*
var job = process.env.CIRCLE_BUILD_NUM;
if (job) {
  var jobID = '18f-cs-' + job;
  console.log('Looking for tunnel ID:', jobID);
  config.capabilities.forEach(function(caps) {
    caps['tunnel-identifier'] = jobID;
  });
  config.build = jobID;
}
*/

if (process.env.TEST_REPORTER) {
  config.reporter = process.env.TEST_REPORTER;
} else {
  config.reporter = 'xunit';
  config.reporterOptions = {
    outputDir: process.env.TEST_REPORTS_CI + '/browser'
  };
}

exports.config = config;
