'use strict';

var d3Selection = require('d3-selection');
var d3Xhr = require('d3-xhr');
var d3Array = require('d3-array');
var scale = require('d3-scale');
var d3Format = require('d3-format');

const functor = function(x) {
  return (typeof x === 'function') ?
    x :
    function() { return x; };
};

var d3Bundle = {
  get event() { return d3Selection.event; },
  select: d3Selection.select,
  selectAll: d3Selection.selectAll,
  functor: functor,
  scale: scale,
  format: d3Format.format,
  range: d3Array.range,
  ascending: d3Array.ascending,
  descending: d3Array.descending,
  sum: d3Array.sum,
  json: d3Xhr.json,
  xhr: d3Xhr.xhr
};

module.exports = d3Bundle;