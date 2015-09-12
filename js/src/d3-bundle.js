import {
  event,
  select,
  selectAll
} from "d3-selection";

import {
  xhr,
  json
} from 'd3-xhr';

export default {
  get event() { return event; },
  xhr: xhr,
  json: json,
  select: select,
  selectAll: selectAll
};
