/* jshint node: true */
var config = require('./wdio.quick').config;

config.user = process.env.SAUCE_USERNAME;
config.key = process.env.SAUCE_ACCESS_KEY;

exports.config = config;
