#!/usr/bin/env node
var express = require('express');
var child = require('child_process');
require('colors');

var app = express();

app.use(function(req, res, next) {
  console.log('GET %s'.gray, req.url);
  next();
});

app.use('/college-choice', express.static('./_site'));

console.log('building the site...'.yellow);

child.spawn('jekyll', ['build'], {
  stdio: 'inherit'
})
.on('close', function(code) {
  startServer();
});

function startServer() {
  console.log('starting the server...'.yellow);
  return app.listen(4001, '0.0.0.0', function(error) {
    if (error) return console.error('error:', error);
    console.log('listening on %s', ('http://localhost:' + this.address().port).green);
  });
}
