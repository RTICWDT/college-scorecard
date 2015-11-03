var config = require('./wdio.sauce').config;

var job = process.env.TRAVIS_JOB_NUMBER;
if (job) {
  config['tunnel-identifier'] = job;
  config.build = job;
}

exports.config = config;
