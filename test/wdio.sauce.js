var config = require('./wdio.conf').config;

config.user = process.env.SAUCE_USERNAME;
config.key = process.env.SAUCE_ACCESS_KEY;

exports.config = config;
