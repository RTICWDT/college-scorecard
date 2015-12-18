var config = require('./wdio.conf').config;

config.exclude = [
  './test/spec/searchData.js'
];

exports.config = config;
