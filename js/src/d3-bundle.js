import {
  event,
  select,
  selectAll
} from "d3-selection";

import {
  xhr,
  json
} from 'd3-xhr';

import { format } from 'd3-format';

export default {
  get event() { return event; },
  format: format,
  xhr: xhr,
  json: json,
  select: select,
  selectAll: selectAll
};
