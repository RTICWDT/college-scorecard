/* jshint node: true */
var config = require('./wdio.conf').config;

config.exclude = [
  './test/spec/searchData.js'
];

config.mochaOpts.grep = process.env.MOCHA_GREP;

if (process.env.MOCHA_BAIL) {
  config.mochaOpts.bail = true;
}

exports.config = config;
