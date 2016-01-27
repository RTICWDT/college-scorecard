/* jshint esnext: true */

import {
  event,
  select,
  selectAll
} from 'd3-selection';

import {
  xhr,
  json
} from 'd3-xhr';

import {
  range,
  sum,
  ascending,
  descending
} from 'd3-arrays';

import * as scale from 'd3-scale';

import { format } from 'd3-format';

const functor = function(x) {
  return (typeof x === 'function') ?
    x :
    function() { return x; };
};

export default {
  get event() { return event; },
  select: select,
  selectAll: selectAll,
  functor: functor,
  scale: scale,
  format: format,
  range: range,
  ascending: ascending,
  descending: descending,
  sum: sum,
  json: json,
  xhr: xhr
};
