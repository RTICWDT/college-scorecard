/* jshint esnext: true, -W097 */
'use strict';

var requoteRe = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;

function requote(string) {
  return string.replace(requoteRe, "\\$&");
};

var filterEvents = new Map;

var event = null;

if (typeof document !== "undefined") {
  var element = document.documentElement;
  if (!("onmouseenter" in element)) {
    filterEvents.set("mouseenter", "mouseover").set("mouseleave", "mouseout");
  }
}

function selection_event(type, listener, capture) {
  var n = arguments.length,
      key = "__on" + type,
      filter,
      root = this._root;

  if (n < 2) return (n = this.node()[key]) && n._listener;

  if (n < 3) capture = false;
  if ((n = type.indexOf(".")) > 0) type = type.slice(0, n);
  if (filter = filterEvents.has(type)) type = filterEvents.get(type);

  function add() {
    var ancestor = root, i = arguments.length >> 1, ancestors = new Array(i);
    while (--i >= 0) ancestor = ancestor[arguments[(i << 1) + 1]], ancestors[i] = i ? ancestor._parent : ancestor;
    var l = listenerOf(listener, ancestors, arguments);
    if (filter) l = filterListenerOf(l);
    remove.call(this);
    this.addEventListener(type, this[key] = l, l._capture = capture);
    l._listener = listener;
  }

  function remove() {
    var l = this[key];
    if (l) {
      this.removeEventListener(type, l, l._capture);
      delete this[key];
    }
  }

  function removeAll() {
    var re = new RegExp("^__on([^.]+)" + requote(type) + "$"), match;
    for (var name in this) {
      if (match = name.match(re)) {
        var l = this[name];
        this.removeEventListener(match[1], l, l._capture);
        delete this[name];
      }
    }
  }

  return this.each(listener
      ? (n ? add : noop) // Attempt to add untyped listener is ignored.
      : (n ? remove : removeAll));
};

function listenerOf(listener, ancestors, args) {
  return function(event1) {
    var i = ancestors.length, event0 = event; // Events can be reentrant (e.g., focus).
    while (--i >= 0) args[i << 1] = ancestors[i].__data__;
    event = event1;
    try {
      listener.apply(ancestors[0], args);
    } finally {
      event = event0;
    }
  };
}

function filterListenerOf(listener) {
  return function(event) {
    var related = event.relatedTarget;
    if (!related || (related !== this && !(related.compareDocumentPosition(this) & 8))) {
      listener(event);
    }
  };
}

function noop() {}

function selectorOf(selector) {
  return function() {
    return this.querySelector(selector);
  };
};

// The selector may either be a selector string (e.g., ".foo")
// or a function that optionally returns the node to select.
function selection_select(selector) {
  var depth = this._depth,
      stack = new Array(depth * 2);

  if (typeof selector !== "function") selector = selectorOf(selector);

  function visit(nodes, update, depth) {
    var i = -1,
        n = nodes.length,
        node,
        subnode,
        subnodes = new Array(n);

    if (--depth) {
      var stack0 = depth * 2,
          stack1 = stack0 + 1;
      while (++i < n) {
        if (node = nodes[i]) {
          stack[stack0] = node._parent.__data__, stack[stack1] = i;
          subnodes[i] = visit(node, update && update[i], depth);
        }
      }
    }

    // The leaf group may be sparse if the selector returns a falsey value;
    // this preserves the index of nodes (unlike selection.filter).
    // Propagate data to the new node only if it is defined on the old.
    // If this is an enter selection, materialized nodes are moved to update.
    else {
      while (++i < n) {
        if (node = nodes[i]) {
          stack[0] = node.__data__, stack[1] = i;
          if (subnode = selector.apply(node, stack)) {
            if ("__data__" in node) subnode.__data__ = node.__data__;
            if (update) update[i] = subnode, delete nodes[i];
            subnodes[i] = subnode;
          }
        }
      }
    }

    subnodes._parent = nodes._parent;
    return subnodes;
  }

  return new Selection(visit(this._root, this._update && this._update._root, depth), depth);
};

// The selector may either be a selector string (e.g., ".foo")
// or a function that optionally returns an array of nodes to select.
// This is the only operation that increases the depth of a selection.
function selection_selectAll(selector) {
  var depth = this._depth,
      stack = new Array(depth * 2);

  if (typeof selector !== "function") selector = selectorAllOf(selector);

  function visit(nodes, depth) {
    var i = -1,
        n = nodes.length,
        node,
        subnode,
        subnodes = new Array(n);

    if (--depth) {
      var stack0 = depth * 2,
          stack1 = stack0 + 1;
      while (++i < n) {
        if (node = nodes[i]) {
          stack[stack0] = node._parent.__data__, stack[stack1] = i;
          subnodes[i] = visit(node, depth);
        }
      }
    }

    // Data is not propagated since there is a one-to-many mapping.
    // The parent of the new leaf group is the old node.
    else {
      while (++i < n) {
        if (node = nodes[i]) {
          stack[0] = node.__data__, stack[1] = i;
          subnodes[i] = subnode = selector.apply(node, stack);
          subnode._parent = node;
        }
      }
    }

    subnodes._parent = nodes._parent;
    return subnodes;
  }

  return new Selection(visit(this._root, depth), depth + 1);
};

function selectorAllOf(selector) {
  return function() {
    return this.querySelectorAll(selector);
  };
}

// The filter may either be a selector string (e.g., ".foo")
// or a function that returns a boolean.
function selection_filter(filter) {
  var depth = this._depth,
      stack = new Array(depth * 2);

  if (typeof filter !== "function") filter = filterOf(filter);

  function visit(nodes, depth) {
    var i = -1,
        n = nodes.length,
        node,
        subnodes;

    if (--depth) {
      var stack0 = depth * 2,
          stack1 = stack0 + 1;
      subnodes = new Array(n);
      while (++i < n) {
        if (node = nodes[i]) {
          stack[stack0] = node._parent.__data__, stack[stack1] = i;
          subnodes[i] = visit(node, depth);
        }
      }
    }

    // The filter operation does not preserve the original index,
    // so the resulting leaf groups are dense (not sparse).
    else {
      subnodes = [];
      while (++i < n) {
        if (node = nodes[i]) {
          stack[0] = node.__data__, stack[1] = i;
          if (filter.apply(node, stack)) {
            subnodes.push(node);
          }
        }
      }
    }

    subnodes._parent = nodes._parent;
    return subnodes;
  }

  return new Selection(visit(this._root, depth), depth);
};

var filterOf = function(selector) {
  return function() {
    return this.matches(selector);
  };
};

if (typeof document !== "undefined") {
  var element$1 = document.documentElement;
  if (!element$1.matches) {
    var vendorMatches = element$1.webkitMatchesSelector || element$1.msMatchesSelector || element$1.mozMatchesSelector || element$1.oMatchesSelector;
    filterOf = function(selector) { return function() { return vendorMatches.call(this, selector); }; };
  }
}

// The value may either be an array or a function that returns an array.
// An optional key function may be specified to control how data is bound;
// if no key function is specified, data is bound to nodes by index.
// Or, if no arguments are specified, this method returns all bound data.
function selection_data(value, key) {
  if (!value) {
    var data = new Array(this.size()), i = -1;
    this.each(function(d) { data[++i] = d; });
    return data;
  }

  var depth = this._depth - 1,
      stack = new Array(depth * 2),
      bind = key ? bindKey : bindIndex;

  if (typeof value !== "function") value = valueOf_(value);
  visit(this._root, this.enter()._root, this.exit()._root, depth);

  function visit(update, enter, exit, depth) {
    var i = -1,
        n,
        node;

    if (depth--) {
      var stack0 = depth * 2,
          stack1 = stack0 + 1;

      n = update.length;

      while (++i < n) {
        if (node = update[i]) {
          stack[stack0] = node._parent.__data__, stack[stack1] = i;
          visit(node, enter[i], exit[i], depth);
        }
      }
    }

    else {
      var j = 0,
          before;

      bind(update, enter, exit, value.apply(update._parent, stack));
      n = update.length;

      // Now connect the enter nodes to their following update node, such that
      // appendChild can insert the materialized enter node before this node,
      // rather than at the end of the parent node.
      while (++i < n) {
        if (before = enter[i]) {
          if (i >= j) j = i + 1;
          while (!(node = update[j]) && ++j < n);
          before._next = node || null;
        }
      }
    }
  }

  function bindIndex(update, enter, exit, data) {
    var i = 0,
        node,
        nodeLength = update.length,
        dataLength = data.length,
        minLength = Math.min(nodeLength, dataLength);

    // Clear the enter and exit arrays, and then initialize to the new length.
    enter.length = 0, enter.length = dataLength;
    exit.length = 0, exit.length = nodeLength;

    for (; i < minLength; ++i) {
      if (node = update[i]) {
        node.__data__ = data[i];
      } else {
        enter[i] = new EnterNode(update._parent, data[i]);
      }
    }

    // Note: we don’t need to delete update[i] here because this loop only
    // runs when the data length is greater than the node length.
    for (; i < dataLength; ++i) {
      enter[i] = new EnterNode(update._parent, data[i]);
    }

    // Note: and, we don’t need to delete update[i] here because immediately
    // following this loop we set the update length to data length.
    for (; i < nodeLength; ++i) {
      if (node = update[i]) {
        exit[i] = update[i];
      }
    }

    update.length = dataLength;
  }

  function bindKey(update, enter, exit, data) {
    var i,
        node,
        dataLength = data.length,
        nodeLength = update.length,
        nodeByKeyValue = new Map,
        keyStack = new Array(2).concat(stack),
        keyValues = new Array(nodeLength),
        keyValue;

    // Clear the enter and exit arrays, and then initialize to the new length.
    enter.length = 0, enter.length = dataLength;
    exit.length = 0, exit.length = nodeLength;

    // Compute the keys for each node.
    for (i = 0; i < nodeLength; ++i) {
      if (node = update[i]) {
        keyStack[0] = node.__data__, keyStack[1] = i;
        keyValues[i] = keyValue = key.apply(node, keyStack);

        // Is this a duplicate of a key we’ve previously seen?
        // If so, this node is moved to the exit selection.
        if (nodeByKeyValue.has(keyValue)) {
          exit[i] = node;
        }

        // Otherwise, record the mapping from key to node.
        else {
          nodeByKeyValue.set(keyValue, node);
        }
      }
    }

    // Now clear the update array and initialize to the new length.
    update.length = 0, update.length = dataLength;

    // Compute the keys for each datum.
    for (i = 0; i < dataLength; ++i) {
      keyStack[0] = data[i], keyStack[1] = i;
      keyValue = key.apply(update._parent, keyStack);

      // Is there a node associated with this key?
      // If not, this datum is added to the enter selection.
      if (!(node = nodeByKeyValue.get(keyValue))) {
        enter[i] = new EnterNode(update._parent, data[i]);
      }

      // Did we already bind a node using this key? (Or is a duplicate?)
      // If unique, the node and datum are joined in the update selection.
      // Otherwise, the datum is ignored, neither entering nor exiting.
      else if (node !== true) {
        update[i] = node;
        node.__data__ = data[i];
      }

      // Record that we consumed this key, either to enter or update.
      nodeByKeyValue.set(keyValue, true);
    }

    // Take any remaining nodes that were not bound to data,
    // and place them in the exit selection.
    for (i = 0; i < nodeLength; ++i) {
      if ((node = nodeByKeyValue.get(keyValues[i])) !== true) {
        exit[i] = node;
      }
    }
  }

  return this;
};

function EnterNode(parent, datum) {
  this.ownerDocument = parent.ownerDocument;
  this.namespaceURI = parent.namespaceURI;
  this._next = null;
  this._parent = parent;
  this.__data__ = datum;
}

EnterNode.prototype = {
  appendChild: function(child) { return this._parent.insertBefore(child, this._next); },
  insertBefore: function(child, next) { return this._parent.insertBefore(child, next || this._next); }
};

function valueOf_(value) { // XXX https://github.com/rollup/rollup/issues/12
  return function() {
    return value;
  };
}

// The leaf groups of the selection hierarchy are initially NodeList,
// and then lazily converted to arrays when mutation is required.
function arrayify(selection) {
  return selection._root = arrayifyNode(selection._root, selection._depth);
};

function arrayifyNode(nodes, depth) {
  var i = -1,
      n = nodes.length,
      node;

  if (--depth) {
    while (++i < n) {
      if (node = nodes[i]) {
        nodes[i] = arrayifyNode(node, depth);
      }
    }
  }

  else if (!Array.isArray(nodes)) {
    var array = new Array(n);
    while (++i < n) array[i] = nodes[i];
    array._parent = nodes._parent;
    nodes = array;
  }

  return nodes;
}

function emptyOf(selection) {
  return new Selection(emptyNode(arrayify(selection), selection._depth), selection._depth);
};

function emptyNode(nodes, depth) {
  var i = -1,
      n = nodes.length,
      node,
      empty = new Array(n);

  if (--depth) {
    while (++i < n) {
      if (node = nodes[i]) {
        empty[i] = emptyNode(node, depth);
      }
    }
  }

  empty._parent = nodes._parent;
  return empty;
}

// Lazily constructs the enter selection for this (update) selection.
// Until this selection is joined to data, the enter selection will be empty.
function selection_enter() {
  if (!this._enter) {
    this._enter = emptyOf(this);
    this._enter._update = this;
  }
  return this._enter;
};

// Lazily constructs the exit selection for this (update) selection.
// Until this selection is joined to data, the exit selection will be empty.
function selection_exit() {
  return this._exit || (this._exit = emptyOf(this));
};

function selection_order() {
  orderNode(this._root, this._depth);
  return this;
};

function orderNode(nodes, depth) {
  var i = nodes.length,
      node,
      next;

  if (--depth) {
    while (--i >= 0) {
      if (node = nodes[i]) {
        orderNode(node, depth);
      }
    }
  }

  else {
    next = nodes[--i];
    while (--i >= 0) {
      if (node = nodes[i]) {
        if (next && next !== node.nextSibling) next.parentNode.insertBefore(node, next);
        next = node;
      }
    }
  }
}

function selection_sort(comparator) {
  if (!comparator) comparator = ascending$1;

  function compare(a, b) {
    return a && b ? comparator(a.__data__, b.__data__) : !a - !b;
  }

  function visit(nodes, depth) {
    if (--depth) {
      var i = -1,
          n = nodes.length,
          node;
      while (++i < n) {
        if (node = nodes[i]) {
          visit(node, depth);
        }
      }
    }

    else {
      nodes.sort(compare);
    }
  }

  visit(arrayify(this), this._depth);
  return this.order();
};

function ascending$1(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}

function selection_call() {
  var callback = arguments[0];
  callback.apply(arguments[0] = this, arguments);
  return this;
};

function selection_nodes() {
  var nodes = new Array(this.size()), i = -1;
  this.each(function() { nodes[++i] = this; });
  return nodes;
};

function selection_node() {
  return firstNode(this._root, this._depth);
};

function firstNode(nodes, depth) {
  var i = -1,
      n = nodes.length,
      node;

  if (--depth) {
    while (++i < n) {
      if (node = nodes[i]) {
        if (node = firstNode(node, depth)) {
          return node;
        }
      }
    }
  }

  else {
    while (++i < n) {
      if (node = nodes[i]) {
        return node;
      }
    }
  }
}

function selection_size() {
  var size = 0;
  this.each(function() { ++size; });
  return size;
};

function selection_empty() {
  return !this.node();
};

function selection_each(callback) {
  var depth = this._depth,
      stack = new Array(depth);

  function visit(nodes, depth) {
    var i = -1,
        n = nodes.length,
        node;

    if (--depth) {
      var stack0 = depth * 2,
          stack1 = stack0 + 1;
      while (++i < n) {
        if (node = nodes[i]) {
          stack[stack0] = node._parent.__data__, stack[stack1] = i;
          visit(node, depth);
        }
      }
    }

    else {
      while (++i < n) {
        if (node = nodes[i]) {
          stack[0] = node.__data__, stack[1] = i;
          callback.apply(node, stack);
        }
      }
    }
  }

  visit(this._root, depth);
  return this;
};

var namespaces = (new Map)
    .set("svg", "http://www.w3.org/2000/svg")
    .set("xhtml", "http://www.w3.org/1999/xhtml")
    .set("xlink", "http://www.w3.org/1999/xlink")
    .set("xml", "http://www.w3.org/XML/1998/namespace")
    .set("xmlns", "http://www.w3.org/2000/xmlns/");

function namespace(name) {
  var i = name.indexOf(":"), prefix = name;
  if (i >= 0) prefix = name.slice(0, i), name = name.slice(i + 1);
  return namespaces.has(prefix) ? {space: namespaces.get(prefix), local: name} : name;
};

function selection_attr(name, value) {
  name = namespace(name);

  if (arguments.length < 2) {
    var node = this.node();
    return name.local
        ? node.getAttributeNS(name.space, name.local)
        : node.getAttribute(name);
  }

  function remove() {
    this.removeAttribute(name);
  }

  function removeNS() {
    this.removeAttributeNS(name.space, name.local);
  }

  function setConstant() {
    this.setAttribute(name, value);
  }

  function setConstantNS() {
    this.setAttributeNS(name.space, name.local, value);
  }

  function setFunction() {
    var x = value.apply(this, arguments);
    if (x == null) this.removeAttribute(name);
    else this.setAttribute(name, x);
  }

  function setFunctionNS() {
    var x = value.apply(this, arguments);
    if (x == null) this.removeAttributeNS(name.space, name.local);
    else this.setAttributeNS(name.space, name.local, x);
  }

  return this.each(value == null
      ? (name.local ? removeNS : remove)
      : (typeof value === "function"
          ? (name.local ? setFunctionNS : setFunction)
          : (name.local ? setConstantNS : setConstant)));
};

function defaultView$1(node) {
  return node
      && ((node.ownerDocument && node.ownerDocument.defaultView) // node is a Node
          || (node.document && node) // node is a Window
          || node.defaultView); // node is a Document
};

function selection_style(name, value, priority) {
  var n = arguments.length;

  if (n < 2) return defaultView$1(n = this.node()).getComputedStyle(n, null).getPropertyValue(name);

  if (n < 3) priority = "";

  function remove() {
    this.style.removeProperty(name);
  }

  function setConstant() {
    this.style.setProperty(name, value, priority);
  }

  function setFunction() {
    var x = value.apply(this, arguments);
    if (x == null) this.style.removeProperty(name);
    else this.style.setProperty(name, x, priority);
  }

  return this.each(value == null ? remove : typeof value === "function" ? setFunction : setConstant);
};

function selection_property(name, value) {
  if (arguments.length < 2) return this.node()[name];

  function remove() {
    delete this[name];
  }

  function setConstant() {
    this[name] = value;
  }

  function setFunction() {
    var x = value.apply(this, arguments);
    if (x == null) delete this[name];
    else this[name] = x;
  }

  return this.each(value == null ? remove : typeof value === "function" ? setFunction : setConstant);
};

function selection_class(name, value) {
  name = (name + "").trim().split(/^|\s+/);
  var n = name.length;

  if (arguments.length < 2) {
    var node = this.node(), i = -1;
    if (value = node.classList) { // SVG elements may not support DOMTokenList!
      while (++i < n) if (!value.contains(name[i])) return false;
    } else {
      value = node.getAttribute("class");
      while (++i < n) if (!classedRe(name[i]).test(value)) return false;
    }
    return true;
  }

  name = name.map(classerOf);

  function setConstant() {
    var i = -1;
    while (++i < n) name[i](this, value);
  }

  function setFunction() {
    var i = -1, x = value.apply(this, arguments);
    while (++i < n) name[i](this, x);
  }

  return this.each(typeof value === "function" ? setFunction : setConstant);
};

function classerOf(name) {
  var re;
  return function(node, value) {
    if (c = node.classList) return value ? c.add(name) : c.remove(name);
    if (!re) re = classedRe(name);
    var c = node.getAttribute("class") || "";
    if (value) {
      re.lastIndex = 0;
      if (!re.test(c)) node.setAttribute("class", collapse(c + " " + name));
    } else {
      node.setAttribute("class", collapse(c.replace(re, " ")));
    }
  };
}

function collapse(string) {
  return string.trim().replace(/\s+/g, " ");
}

function classedRe(name) {
  return new RegExp("(?:^|\\s+)" + requote(name) + "(?:\\s+|$)", "g");
}

function selection_text(value) {
  if (!arguments.length) return this.node().textContent;

  function setConstant() {
    this.textContent = value;
  }

  function setFunction() {
    var v = value.apply(this, arguments);
    this.textContent = v == null ? "" : v;
  }

  if (value == null) value = "";

  return this.each(typeof value === "function" ? setFunction : setConstant);
};

function selection_html(value) {
  if (!arguments.length) return this.node().innerHTML;

  function setConstant() {
    this.innerHTML = value;
  }

  function setFunction() {
    var v = value.apply(this, arguments);
    this.innerHTML = v == null ? "" : v;
  }

  if (value == null) value = "";

  return this.each(typeof value === "function" ? setFunction : setConstant);
};

function selection_append(creator, selector) {
  if (typeof creator !== "function") creator = creatorOf(creator);

  function append() {
    return this.appendChild(creator.apply(this, arguments));
  }

  function insert() {
    return this.insertBefore(creator.apply(this, arguments), selector.apply(this, arguments) || null);
  }

  return this.select(arguments.length < 2
      ? append
      : (typeof selector !== "function" && (selector = selectorOf(selector)), insert));
};

function creatorOf(name) {
  name = namespace(name);

  function creator() {
    var document = this.ownerDocument,
        uri = this.namespaceURI;
    return uri
        ? document.createElementNS(uri, name)
        : document.createElement(name);
  }

  function creatorNS() {
    return this.ownerDocument.createElementNS(name.space, name.local);
  }

  return name.local ? creatorNS : creator;
}

function selection_remove() {
  return this.each(function() {
    var parent = this.parentNode;
    if (parent) parent.removeChild(this);
  });
};

function selection_datum(value) {
  return arguments.length ? this.property("__data__", value) : this.node().__data__;
};

function selection_dispatch(type, params) {

  function dispatchConstant() {
    return dispatchEvent(this, type, params);
  }

  function dispatchFunction() {
    return dispatchEvent(this, type, params.apply(this, arguments));
  }

  return this.each(typeof params === "function" ? dispatchFunction : dispatchConstant);
};

function dispatchEvent(node, type, params) {
  var window = defaultView$1(node),
      event = window.CustomEvent;

  if (event) {
    event = new event(type, params);
  } else {
    event = window.document.createEvent("Event");
    if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
    else event.initEvent(type, false, false);
  }

  node.dispatchEvent(event);
}

// When depth = 1, root = [Node, …].
// When depth = 2, root = [[Node, …], …].
// When depth = 3, root = [[[Node, …], …], …]. etc.
// Note that [Node, …] and NodeList are used interchangeably; see arrayify.
function Selection(root, depth) {
  this._root = root;
  this._depth = depth;
  this._enter = this._update = this._exit = null;
};

function selection() {
  return new Selection([document.documentElement], 1);
}

Selection.prototype = selection.prototype = {
  select: selection_select,
  selectAll: selection_selectAll,
  filter: selection_filter,
  data: selection_data,
  enter: selection_enter,
  exit: selection_exit,
  order: selection_order,
  sort: selection_sort,
  call: selection_call,
  nodes: selection_nodes,
  node: selection_node,
  size: selection_size,
  empty: selection_empty,
  each: selection_each,
  attr: selection_attr,
  style: selection_style,
  property: selection_property,
  class: selection_class,
  classed: selection_class, // deprecated alias
  text: selection_text,
  html: selection_html,
  append: selection_append,
  insert: selection_append, // deprecated alias
  remove: selection_remove,
  datum: selection_datum,
  event: selection_event,
  on: selection_event, // deprecated alias
  dispatch: selection_dispatch
};

function select(selector) {
  return new Selection([typeof selector === "string" ? document.querySelector(selector) : selector], 1);
};

var bug44083 = typeof navigator !== "undefined" && /WebKit/.test(navigator.userAgent) ? -1 : 0;

function selectAll(selector) {
  return new Selection(typeof selector === "string" ? document.querySelectorAll(selector) : selector, 1);
};

function dispatch() {
  return new Dispatch(arguments);
}

function Dispatch(types) {
  var i = -1,
      n = types.length,
      callbacksByType = {},
      callbackByName = {},
      type,
      that = this;

  that.on = function(type, callback) {
    type = parseType(type);

    // Return the current callback, if any.
    if (arguments.length < 2) {
      return (callback = callbackByName[type.name]) && callback.value;
    }

    // If a type was specified…
    if (type.type) {
      var callbacks = callbacksByType[type.type],
          callback0 = callbackByName[type.name],
          i;

      // Remove the current callback, if any, using copy-on-remove.
      if (callback0) {
        callback0.value = null;
        i = callbacks.indexOf(callback0);
        callbacksByType[type.type] = callbacks = callbacks.slice(0, i).concat(callbacks.slice(i + 1));
        delete callbackByName[type.name];
      }

      // Add the new callback, if any.
      if (callback) {
        callback = {value: callback};
        callbackByName[type.name] = callback;
        callbacks.push(callback);
      }
    }

    // Otherwise, if a null callback was specified, remove all callbacks with the given name.
    else if (callback == null) {
      for (var otherType in callbacksByType) {
        if (callback = callbackByName[otherType + type.name]) {
          callback.value = null;
          var callbacks = callbacksByType[otherType], i = callbacks.indexOf(callback);
          callbacksByType[otherType] = callbacks.slice(0, i).concat(callbacks.slice(i + 1));
          delete callbackByName[callback.name];
        }
      }
    }

    return that;
  };

  while (++i < n) {
    type = types[i] + "";
    if (!type || (type in that)) throw new Error("illegal or duplicate type: " + type);
    callbacksByType[type] = [];
    that[type] = applier(type);
  }

  function parseType(type) {
    var i = (type += "").indexOf("."), name = type;
    if (i >= 0) type = type.slice(0, i); else name += ".";
    if (type && !callbacksByType.hasOwnProperty(type)) throw new Error("unknown type: " + type);
    return {type: type, name: name};
  }

  function applier(type) {
    return function() {
      var callbacks = callbacksByType[type], // Defensive reference; copy-on-remove.
          callback,
          callbackValue,
          i = -1,
          n = callbacks.length;

      while (++i < n) {
        if (callbackValue = (callback = callbacks[i]).value) {
          callbackValue.apply(this, arguments);
        }
      }

      return that;
    };
  }
}

dispatch.prototype = Dispatch.prototype;

function xhr(url, callback) {
  var xhr,
      event = dispatch("beforesend", "progress", "load", "error"),
      mimeType,
      headers = new Map,
      request = new XMLHttpRequest,
      response,
      responseType;

  // If IE does not support CORS, use XDomainRequest.
  if (typeof XDomainRequest !== "undefined"
      && !("withCredentials" in request)
      && /^(http(s)?:)?\/\//.test(url)) request = new XDomainRequest;

  "onload" in request
      ? request.onload = request.onerror = respond
      : request.onreadystatechange = function() { request.readyState > 3 && respond(); };

  function respond() {
    var status = request.status, result;
    if (!status && hasResponse(request)
        || status >= 200 && status < 300
        || status === 304) {
      if (response) {
        try {
          result = response.call(xhr, request);
        } catch (e) {
          event.error.call(xhr, e);
          return;
        }
      } else {
        result = request;
      }
      event.load.call(xhr, result);
    } else {
      event.error.call(xhr, request);
    }
  }

  request.onprogress = function(e) {
    event.progress.call(xhr, e);
  };

  xhr = {
    header: function(name, value) {
      name = (name + "").toLowerCase();
      if (arguments.length < 2) return headers.get(name);
      if (value == null) headers.delete(name);
      else headers.set(name, value + "");
      return xhr;
    },

    // If mimeType is non-null and no Accept header is set, a default is used.
    mimeType: function(value) {
      if (!arguments.length) return mimeType;
      mimeType = value == null ? null : value + "";
      return xhr;
    },

    // Specifies what type the response value should take;
    // for instance, arraybuffer, blob, document, or text.
    responseType: function(value) {
      if (!arguments.length) return responseType;
      responseType = value;
      return xhr;
    },

    // Specify how to convert the response content to a specific type;
    // changes the callback value on "load" events.
    response: function(value) {
      response = value;
      return xhr;
    },

    // Alias for send("GET", …).
    get: function(data, callback) {
      return xhr.send("GET", data, callback);
    },

    // Alias for send("POST", …).
    post: function(data, callback) {
      return xhr.send("POST", data, callback);
    },

    // If callback is non-null, it will be used for error and load events.
    send: function(method, data, callback) {
      if (!callback && typeof data === "function") callback = data, data = null;
      if (callback && callback.length === 1) callback = fixCallback(callback);
      request.open(method, url, true);
      if (mimeType != null && !headers.has("accept")) headers.set("accept", mimeType + ",*/*");
      if (request.setRequestHeader) headers.forEach(function(value, name) { request.setRequestHeader(name, value); });
      if (mimeType != null && request.overrideMimeType) request.overrideMimeType(mimeType);
      if (responseType != null) request.responseType = responseType;
      if (callback) xhr.on("error", callback).on("load", function(request) { callback(null, request); });
      event.beforesend.call(xhr, request);
      request.send(data == null ? null : data);
      return xhr;
    },

    abort: function() {
      request.abort();
      return xhr;
    },

    on: function() {
      var value = event.on.apply(event, arguments);
      return value === event ? xhr : value;
    }
  };

  return callback
      ? xhr.get(callback)
      : xhr;
};

function fixCallback(callback) {
  return function(error, request) {
    callback(error == null ? request : null);
  };
}

function hasResponse(request) {
  var type = request.responseType;
  return type && type !== "text"
      ? request.response // null on error
      : request.responseText; // "" on error
}

function xhrType(defaultMimeType, response) {
  return function(url, callback) {
    var r = xhr(url).mimeType(defaultMimeType).response(response);
    return callback ? r.get(callback) : r;
  };
};

var json = xhrType("application/json", function(request) {
  return JSON.parse(request.responseText);
});

function dsv(delimiter) {
  var reFormat = new RegExp("[\"" + delimiter + "\n]"),
      delimiterCode = delimiter.charCodeAt(0);

  function parse(text, f) {
    var o;
    return parseRows(text, function(row, i) {
      if (o) return o(row, i - 1);
      var a = new Function("d", "return {" + row.map(function(name, i) {
        return JSON.stringify(name) + ": d[" + i + "]";
      }).join(",") + "}");
      o = f ? function(row, i) { return f(a(row), i); } : a;
    });
  }

  function parseRows(text, f) {
    var EOL = {}, // sentinel value for end-of-line
        EOF = {}, // sentinel value for end-of-file
        rows = [], // output rows
        N = text.length,
        I = 0, // current character index
        n = 0, // the current line number
        t, // the current token
        eol; // is the current token followed by EOL?

    function token() {
      if (I >= N) return EOF; // special case: end of file
      if (eol) return eol = false, EOL; // special case: end of line

      // special case: quotes
      var j = I;
      if (text.charCodeAt(j) === 34) {
        var i = j;
        while (i++ < N) {
          if (text.charCodeAt(i) === 34) {
            if (text.charCodeAt(i + 1) !== 34) break;
            ++i;
          }
        }
        I = i + 2;
        var c = text.charCodeAt(i + 1);
        if (c === 13) {
          eol = true;
          if (text.charCodeAt(i + 2) === 10) ++I;
        } else if (c === 10) {
          eol = true;
        }
        return text.slice(j + 1, i).replace(/""/g, "\"");
      }

      // common case: find next delimiter or newline
      while (I < N) {
        var c = text.charCodeAt(I++), k = 1;
        if (c === 10) eol = true; // \n
        else if (c === 13) { eol = true; if (text.charCodeAt(I) === 10) ++I, ++k; } // \r|\r\n
        else if (c !== delimiterCode) continue;
        return text.slice(j, I - k);
      }

      // special case: last token before EOF
      return text.slice(j);
    }

    while ((t = token()) !== EOF) {
      var a = [];
      while (t !== EOL && t !== EOF) {
        a.push(t);
        t = token();
      }
      if (f && (a = f(a, n++)) == null) continue;
      rows.push(a);
    }

    return rows;
  }

  function format(rows) {
    if (Array.isArray(rows[0])) return formatRows(rows); // deprecated; use formatRows
    var fieldSet = Object.create(null), fields = [];

    // Compute unique fields in order of discovery.
    rows.forEach(function(row) {
      for (var field in row) {
        if (!((field += "") in fieldSet)) {
          fields.push(fieldSet[field] = field);
        }
      }
    });

    return [fields.map(formatValue).join(delimiter)].concat(rows.map(function(row) {
      return fields.map(function(field) {
        return formatValue(row[field]);
      }).join(delimiter);
    })).join("\n");
  }

  function formatRows(rows) {
    return rows.map(formatRow).join("\n");
  }

  function formatRow(row) {
    return row.map(formatValue).join(delimiter);
  }

  function formatValue(text) {
    return reFormat.test(text) ? "\"" + text.replace(/\"/g, "\"\"") + "\"" : text;
  }

  return {
    parse: parse,
    parseRows: parseRows,
    format: format,
    formatRows: formatRows
  };
};

var csv$1 = dsv(",");
var tsv$1 = dsv("\t");

function ascending(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
};

function bisector(compare) {
  if (compare.length === 1) compare = ascendingComparator(compare);
  return {
    left: function(a, x, lo, hi) {
      if (arguments.length < 3) lo = 0;
      if (arguments.length < 4) hi = a.length;
      while (lo < hi) {
        var mid = lo + hi >>> 1;
        if (compare(a[mid], x) < 0) lo = mid + 1;
        else hi = mid;
      }
      return lo;
    },
    right: function(a, x, lo, hi) {
      if (arguments.length < 3) lo = 0;
      if (arguments.length < 4) hi = a.length;
      while (lo < hi) {
        var mid = lo + hi >>> 1;
        if (compare(a[mid], x) > 0) hi = mid;
        else lo = mid + 1;
      }
      return lo;
    }
  };
};

function ascendingComparator(f) {
  return function(d, x) {
    return ascending(f(d), x);
  };
}

var ascendingBisect = bisector(ascending);

function descending(a, b) {
  return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
};

function range(start, stop, step) {
  if ((n = arguments.length) < 3) {
    step = 1;
    if (n < 2) {
      stop = start;
      start = 0;
    }
  }

  var i = -1,
      n = Math.max(0, Math.ceil((stop - start) / step)) | 0,
      range = new Array(n);

  while (++i < n) {
    range[i] = start + i * step;
  }

  return range;
};

function sum(array, f) {
  var s = 0,
      n = array.length,
      a,
      i = -1;

  if (arguments.length === 1) {
    while (++i < n) if (a = +array[i]) s += a; // Note: zero and null are equivalent.
  }

  else {
    while (++i < n) if (a = +f(array[i], i, array)) s += a;
  }

  return s;
};

function formatDefault(x, p) {
  x = x.toPrecision(p);

  out: for (var n = x.length, i = 1, i0 = -1, i1; i < n; ++i) {
    switch (x[i]) {
      case ".": i0 = i1 = i; break;
      case "0": if (i0 === 0) i0 = i; i1 = i; break;
      case "e": break out;
      default: if (i0 > 0) i0 = 0; break;
    }
  }

  return i0 > 0 ? x.slice(0, i0) + x.slice(i1 + 1) : x;
};

// Computes the decimal coefficient and exponent of the specified number x with
// significant digits p, where x is positive and p is in [1, 21] or undefined.
// For example, formatDecimal(1.23) returns ["123", 0].
function formatDecimal(x, p) {
  if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0) return null; // NaN, ±Infinity
  var i, coefficient = x.slice(0, i);

  // The string returned by toExponential either has the form \d\.\d+e[-+]\d+
  // (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).
  return [
    coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
    +x.slice(i + 1)
  ];
};

var prefixExponent;

function formatPrefixAuto(x, p) {
  var d = formatDecimal(x, p);
  if (!d) return x + "";
  var coefficient = d[0],
      exponent = d[1],
      i = exponent - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1,
      n = coefficient.length;
  return i === n ? coefficient
      : i > n ? coefficient + new Array(i - n + 1).join("0")
      : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i)
      : "0." + new Array(1 - i).join("0") + formatDecimal(x, p + i - 1)[0]; // less than 1y!
};

function formatRounded(x, p) {
  var d = formatDecimal(x, p);
  if (!d) return x + "";
  var coefficient = d[0],
      exponent = d[1];
  return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient
      : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1)
      : coefficient + new Array(exponent - coefficient.length + 2).join("0");
};

var formatTypes = {
  "": formatDefault,
  "%": function(x, p) { return (x * 100).toFixed(p); },
  "b": function(x) { return Math.round(x).toString(2); },
  "c": function(x) { return x + ""; },
  "d": function(x) { return Math.round(x).toString(10); },
  "e": function(x, p) { return x.toExponential(p); },
  "f": function(x, p) { return x.toFixed(p); },
  "g": function(x, p) { return x.toPrecision(p); },
  "o": function(x) { return Math.round(x).toString(8); },
  "p": function(x, p) { return formatRounded(x * 100, p); },
  "r": formatRounded,
  "s": formatPrefixAuto,
  "X": function(x) { return Math.round(x).toString(16).toUpperCase(); },
  "x": function(x) { return Math.round(x).toString(16); }
};

// [[fill]align][sign][symbol][0][width][,][.precision][type]
var re = /^(?:(.)?([<>=^]))?([+\-\( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?([a-z%])?$/i;

function formatSpecifier(specifier) {
  return new FormatSpecifier(specifier);
};

function FormatSpecifier(specifier) {
  if (!(match = re.exec(specifier))) throw new Error("invalid format: " + specifier);

  var match,
      fill = match[1] || " ",
      align = match[2] || ">",
      sign = match[3] || "-",
      symbol = match[4] || "",
      zero = !!match[5],
      width = match[6] && +match[6],
      comma = !!match[7],
      precision = match[8] && +match[8].slice(1),
      type = match[9] || "";

  // The "n" type is an alias for ",g".
  if (type === "n") comma = true, type = "g";

  // Map invalid types to the default format.
  else if (!formatTypes[type]) type = "";

  // If zero fill is specified, padding goes after sign and before digits.
  if (zero || (fill === "0" && align === "=")) zero = true, fill = "0", align = "=";

  this.fill = fill;
  this.align = align;
  this.sign = sign;
  this.symbol = symbol;
  this.zero = zero;
  this.width = width;
  this.comma = comma;
  this.precision = precision;
  this.type = type;
}

FormatSpecifier.prototype.toString = function() {
  return this.fill
      + this.align
      + this.sign
      + this.symbol
      + (this.zero ? "0" : "")
      + (this.width == null ? "" : Math.max(1, this.width | 0))
      + (this.comma ? "," : "")
      + (this.precision == null ? "" : "." + Math.max(0, this.precision | 0))
      + this.type;
};

function exponent(x) {
  return x = formatDecimal(Math.abs(x)), x ? x[1] : NaN;
};

function formatGroup(grouping, thousands) {
  return function(value, width) {
    var i = value.length,
        t = [],
        j = 0,
        g = grouping[0],
        length = 0;

    while (i > 0 && g > 0) {
      if (length + g + 1 > width) g = Math.max(1, width - length);
      t.push(value.substring(i -= g, i + g));
      if ((length += g + 1) > width) break;
      g = grouping[j = (j + 1) % grouping.length];
    }

    return t.reverse().join(thousands);
  };
};

var prefixes = ["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"];

function identity$1(x) {
  return x;
}

function locale(locale) {
  var group = locale.grouping && locale.thousands ? formatGroup(locale.grouping, locale.thousands) : identity$1,
      currency = locale.currency,
      decimal = locale.decimal;

  function format(specifier) {
    specifier = formatSpecifier(specifier);

    var fill = specifier.fill,
        align = specifier.align,
        sign = specifier.sign,
        symbol = specifier.symbol,
        zero = specifier.zero,
        width = specifier.width,
        comma = specifier.comma,
        precision = specifier.precision,
        type = specifier.type;

    // Compute the prefix and suffix.
    // For SI-prefix, the suffix is lazily computed.
    var prefix = symbol === "$" ? currency[0] : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "",
        suffix = symbol === "$" ? currency[1] : /[%p]/.test(type) ? "%" : "";

    // What format function should we use?
    // Is this an integer type?
    // Can this type generate exponential notation?
    var formatType = formatTypes[type],
        maybeSuffix = !type || /[defgprs%]/.test(type);

    // Set the default precision if not specified,
    // or clamp the specified precision to the supported range.
    // For significant precision, it must be in [1, 21].
    // For fixed precision, it must be in [0, 20].
    precision = precision == null ? (type ? 6 : 12)
        : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision))
        : Math.max(0, Math.min(20, precision));

    return function(value) {
      var valuePrefix = prefix,
          valueSuffix = suffix;

      if (type === "c") {
        valueSuffix = formatType(value) + valueSuffix;
        value = "";
      } else {
        value = +value;

        // Convert negative to positive, and compute the prefix.
        // Note that -0 is not less than 0, but 1 / -0 is!
        var valueNegative = (value < 0 || 1 / value < 0) && (value *= -1, true);

        // Perform the initial formatting.
        value = formatType(value, precision);

        // Compute the prefix and suffix.
        valuePrefix = (valueNegative ? (sign === "(" ? sign : "-") : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
        valueSuffix = valueSuffix + (type === "s" ? prefixes[8 + prefixExponent / 3] : "") + (valueNegative && sign === "(" ? ")" : "");

        // Break the formatted value into the integer “value” part that can be
        // grouped, and fractional or exponential “suffix” part that is not.
        if (maybeSuffix) {
          var i = -1, n = value.length, c;
          while (++i < n) {
            if (c = value.charCodeAt(i), 48 > c || c > 57) {
              valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
              value = value.slice(0, i);
              break;
            }
          }
        }
      }

      // If the fill character is not "0", grouping is applied before padding.
      if (comma && !zero) value = group(value, Infinity);

      // Compute the padding.
      var length = valuePrefix.length + value.length + valueSuffix.length,
          padding = length < width ? new Array(width - length + 1).join(fill) : "";

      // If the fill character is "0", grouping is applied after padding.
      if (comma && zero) value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";

      // Reconstruct the final output based on the desired alignment.
      switch (align) {
        case "<": return valuePrefix + value + valueSuffix + padding;
        case "=": return valuePrefix + padding + value + valueSuffix;
        case "^": return padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length);
      }
      return padding + valuePrefix + value + valueSuffix;
    };
  }

  function formatPrefix(specifier, value) {
    var f = format((specifier = formatSpecifier(specifier), specifier.type = "f", specifier)),
        e = Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3,
        k = Math.pow(10, -e),
        prefix = prefixes[8 + e / 3];
    return function(value) {
      return f(k * value) + prefix;
    };
  }

  return {
    format: format,
    formatPrefix: formatPrefix
  };
};

function precisionFixed(step) {
  return Math.max(0, -exponent(Math.abs(step)));
};

function precisionPrefix(step, value) {
  return Math.max(0, Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3 - exponent(Math.abs(step)));
};

function precisionRound(step, max) {
  return Math.max(0, exponent(Math.abs(max)) - exponent(Math.abs(step))) + 1;
};

var caEs = {
  decimal: ",",
  thousands: ".",
  grouping: [3],
  currency: ["", "\xa0€"]
};

var deDe = {
  decimal: ",",
  thousands: ".",
  grouping: [3],
  currency: ["", "\xa0€"]
};

var enCa = {
  decimal: ".",
  thousands: ",",
  grouping: [3],
  currency: ["$", ""]
};

var enGb = {
  decimal: ".",
  thousands: ",",
  grouping: [3],
  currency: ["£", ""]
};

var enUs = {
  decimal: ".",
  thousands: ",",
  grouping: [3],
  currency: ["$", ""]
};

var esEs = {
  decimal: ",",
  thousands: ".",
  grouping: [3],
  currency: ["", "\xa0€"]
};

var fiFi = {
  decimal: ",",
  thousands: "\xa0",
  grouping: [3],
  currency: ["", "\xa0€"]
};

var frCa = {
  decimal: ",",
  thousands: "\xa0",
  grouping: [3],
  currency: ["", "$"]
};

var frFr = {
  decimal: ",",
  thousands: ".",
  grouping: [3],
  currency: ["", "\xa0€"]
};

var heIl = {
  decimal: ".",
  thousands: ",",
  grouping: [3],
  currency: ["₪", ""]
};

var itIt = {
  decimal: ",",
  thousands: ".",
  grouping: [3],
  currency: ["€", ""]
};

var jaJp = {
  decimal: ".",
  thousands: ",",
  grouping: [3],
  currency: ["", "円"]
};

var mkMk = {
  decimal: ",",
  thousands: ".",
  grouping: [3],
  currency: ["", "\xa0ден."]
};

var nlNl = {
  decimal: ",",
  thousands: ".",
  grouping: [3],
  currency: ["€\xa0", ""]
};

var plPl = {
  decimal: ",",
  thousands: ".",
  grouping: [3],
  currency: ["", "zł"]
};

var ptBr = {
  decimal: ",",
  thousands: ".",
  grouping: [3],
  currency: ["R$", ""]
};

var ruRu = {
  decimal: ",",
  thousands: "\xa0",
  grouping: [3],
  currency: ["", "\xa0руб."]
};

var zhCn = {
  decimal: ".",
  thousands: ",",
  grouping: [3],
  currency: ["¥", ""]
};

var localeDefinitions = (new Map)
    .set("ca-ES", caEs)
    .set("de-DE", deDe)
    .set("en-CA", enCa)
    .set("en-GB", enGb)
    .set("en-US", enUs)
    .set("es-ES", esEs)
    .set("fi-FI", fiFi)
    .set("fr-CA", frCa)
    .set("fr-FR", frFr)
    .set("he-IL", heIl)
    .set("it-IT", itIt)
    .set("ja-JP", jaJp)
    .set("mk-MK", mkMk)
    .set("nl-NL", nlNl)
    .set("pl-PL", plPl)
    .set("pt-BR", ptBr)
    .set("ru-RU", ruRu)
    .set("zh-CN", zhCn);

var defaultLocale = locale(enUs);
var format = defaultLocale.format;
var formatPrefix = defaultLocale.formatPrefix;

function ascending$2(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
};

function bisector$1(compare) {
  if (compare.length === 1) compare = ascendingComparator$1(compare);
  return {
    left: function(a, x, lo, hi) {
      if (arguments.length < 3) lo = 0;
      if (arguments.length < 4) hi = a.length;
      while (lo < hi) {
        var mid = lo + hi >>> 1;
        if (compare(a[mid], x) < 0) lo = mid + 1;
        else hi = mid;
      }
      return lo;
    },
    right: function(a, x, lo, hi) {
      if (arguments.length < 3) lo = 0;
      if (arguments.length < 4) hi = a.length;
      while (lo < hi) {
        var mid = lo + hi >>> 1;
        if (compare(a[mid], x) > 0) hi = mid;
        else lo = mid + 1;
      }
      return lo;
    }
  };
};

function ascendingComparator$1(f) {
  return function(d, x) {
    return ascending$2(f(d), x);
  };
}

var ascendingBisect$1 = bisector$1(ascending$2);
var bisectRight$1 = ascendingBisect$1.right;

function range$1(start, stop, step) {
  if ((n = arguments.length) < 3) {
    step = 1;
    if (n < 2) {
      stop = start;
      start = 0;
    }
  }

  var i = -1,
      n = Math.max(0, Math.ceil((stop - start) / step)) | 0,
      k = scale(Math.abs(step)),
      range = new Array(n);

  start *= k;
  step *= k;
  while (++i < n) {
    range[i] = (start + i * step) / k;
  }

  return range;
};

function scale(x) {
  var k = 1;
  while (x * k % 1) k *= 10;
  return k;
}

var e10$1 = Math.sqrt(50);
var e5$1 = Math.sqrt(10);
var e2$1 = Math.sqrt(2);
function tickRange(domain, count) {
  if (count == null) count = 10;

  var start = domain[0],
      stop = domain[domain.length - 1];

  if (stop < start) error = stop, stop = start, start = error;

  var span = stop - start,
      step = Math.pow(10, Math.floor(Math.log(span / count) / Math.LN10)),
      error = span / count / step;

  // Filter ticks to get closer to the desired count.
  if (error >= e10$1) step *= 10;
  else if (error >= e5$1) step *= 5;
  else if (error >= e2$1) step *= 2;

  // Round start and stop values to step interval.
  return [
    Math.ceil(start / step) * step,
    Math.floor(stop / step) * step + step / 2, // inclusive
    step
  ];
};

function ticks$1(domain, count) {
  return range$1.apply(null, tickRange(domain, count));
};

function tickFormat$2(domain, count, specifier) {
  var range = tickRange(domain, count);
  if (specifier == null) {
    specifier = ",." + precisionFixed(range[2]) + "f";
  } else {
    switch (specifier = formatSpecifier(specifier), specifier.type) {
      case "s": {
        var value = Math.max(Math.abs(range[0]), Math.abs(range[1]));
        if (specifier.precision == null) specifier.precision = precisionPrefix(range[2], value);
        return formatPrefix(specifier, value);
      }
      case "":
      case "e":
      case "g":
      case "p":
      case "r": {
        if (specifier.precision == null) specifier.precision = precisionRound(range[2], Math.max(Math.abs(range[0]), Math.abs(range[1]))) - (specifier.type === "e");
        break;
      }
      case "f":
      case "%": {
        if (specifier.precision == null) specifier.precision = precisionFixed(range[2]) - (specifier.type === "%") * 2;
        break;
      }
    }
  }
  return format(specifier);
};

var darker = .7;
var brighter = 1 / darker;

function rgb(r, g, b) {
  if (arguments.length === 1) {
    if (!(r instanceof Color)) r = color(r);
    if (r) {
      r = r.rgb();
      b = r.b;
      g = r.g;
      r = r.r;
    } else {
      r = g = b = NaN;
    }
  }
  return new Rgb(r, g, b);
};

function Rgb(r, g, b) {
  this.r = +r;
  this.g = +g;
  this.b = +b;
};

var prototype = rgb.prototype = Rgb.prototype = new Color;

prototype.brighter = function(k) {
  k = k == null ? brighter : Math.pow(brighter, k);
  return new Rgb(this.r * k, this.g * k, this.b * k);
};

prototype.darker = function(k) {
  k = k == null ? darker : Math.pow(darker, k);
  return new Rgb(this.r * k, this.g * k, this.b * k);
};

prototype.rgb = function() {
  return this;
};

prototype.displayable = function() {
  return (0 <= this.r && this.r <= 255)
      && (0 <= this.g && this.g <= 255)
      && (0 <= this.b && this.b <= 255);
};

prototype.toString = function() {
  return format$2(this.r, this.g, this.b);
};

function format$2(r, g, b) {
  return "#"
      + (isNaN(r) ? "00" : (r = Math.round(r)) < 16 ? "0" + Math.max(0, r).toString(16) : Math.min(255, r).toString(16))
      + (isNaN(g) ? "00" : (g = Math.round(g)) < 16 ? "0" + Math.max(0, g).toString(16) : Math.min(255, g).toString(16))
      + (isNaN(b) ? "00" : (b = Math.round(b)) < 16 ? "0" + Math.max(0, b).toString(16) : Math.min(255, b).toString(16));
};

function hsl(h, s, l) {
  if (arguments.length === 1) {
    if (h instanceof Hsl) {
      l = h.l;
      s = h.s;
      h = h.h;
    } else {
      if (!(h instanceof Color)) h = color(h);
      if (h) {
        if (h instanceof Hsl) return h;
        h = h.rgb();
        var r = h.r / 255,
            g = h.g / 255,
            b = h.b / 255,
            min = Math.min(r, g, b),
            max = Math.max(r, g, b),
            range = max - min;
        l = (max + min) / 2;
        if (range) {
          s = l < .5 ? range / (max + min) : range / (2 - max - min);
          if (r === max) h = (g - b) / range + (g < b) * 6;
          else if (g === max) h = (b - r) / range + 2;
          else h = (r - g) / range + 4;
          h *= 60;
        } else {
          h = NaN;
          s = l > 0 && l < 1 ? 0 : h;
        }
      } else {
        h = s = l = NaN;
      }
    }
  }
  return new Hsl(h, s, l);
};

function Hsl(h, s, l) {
  this.h = +h;
  this.s = +s;
  this.l = +l;
};

var prototype$1 = hsl.prototype = Hsl.prototype = new Color;

prototype$1.brighter = function(k) {
  k = k == null ? brighter : Math.pow(brighter, k);
  return new Hsl(this.h, this.s, this.l * k);
};

prototype$1.darker = function(k) {
  k = k == null ? darker : Math.pow(darker, k);
  return new Hsl(this.h, this.s, this.l * k);
};

prototype$1.rgb = function() {
  var h = this.h % 360 + (this.h < 0) * 360,
      s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
      l = this.l,
      m2 = l + (l < .5 ? l : 1 - l) * s,
      m1 = 2 * l - m2;
  return new Rgb(
    hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
    hsl2rgb(h, m1, m2),
    hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2)
  );
};

prototype$1.displayable = function() {
  return (0 <= this.s && this.s <= 1 || isNaN(this.s))
      && (0 <= this.l && this.l <= 1);
};

/* From FvD 13.37, CSS Color Module Level 3 */
function hsl2rgb(h, m1, m2) {
  return (h < 60 ? m1 + (m2 - m1) * h / 60
      : h < 180 ? m2
      : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
      : m1) * 255;
}

function Color() {};

var reHex3 = /^#([0-9a-f]{3})$/;
var reHex6 = /^#([0-9a-f]{6})$/;
var reRgbInteger = /^rgb\(\s*([-+]?\d+)\s*,\s*([-+]?\d+)\s*,\s*([-+]?\d+)\s*\)$/;
var reRgbPercent = /^rgb\(\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*\)$/;
var reHslPercent = /^hsl\(\s*([-+]?\d+(?:\.\d+)?)\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*\)$/;
color.prototype = Color.prototype = {
  displayable: function() {
    return this.rgb().displayable();
  },
  toString: function() {
    return this.rgb() + "";
  }
};

function color(format) {
  var m;
  format = (format + "").trim().toLowerCase();
  return (m = reHex3.exec(format)) ? (m = parseInt(m[1], 16), rgb((m >> 8 & 0xf) | (m >> 4 & 0x0f0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf))) // #f00
      : (m = reHex6.exec(format)) ? rgbn(parseInt(m[1], 16)) // #ff0000
      : (m = reRgbInteger.exec(format)) ? rgb(m[1], m[2], m[3]) // rgb(255,0,0)
      : (m = reRgbPercent.exec(format)) ? rgb(m[1] * 2.55, m[2] * 2.55, m[3] * 2.55) // rgb(100%,0%,0%)
      : (m = reHslPercent.exec(format)) ? hsl(m[1], m[2] * .01, m[3] * .01) // hsl(120,50%,50%)
      : named.has(format) ? rgbn(named.get(format))
      : null;
};

function rgbn(n) {
  return rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff);
}

var named = (new Map)
    .set("aliceblue", 0xf0f8ff)
    .set("antiquewhite", 0xfaebd7)
    .set("aqua", 0x00ffff)
    .set("aquamarine", 0x7fffd4)
    .set("azure", 0xf0ffff)
    .set("beige", 0xf5f5dc)
    .set("bisque", 0xffe4c4)
    .set("black", 0x000000)
    .set("blanchedalmond", 0xffebcd)
    .set("blue", 0x0000ff)
    .set("blueviolet", 0x8a2be2)
    .set("brown", 0xa52a2a)
    .set("burlywood", 0xdeb887)
    .set("cadetblue", 0x5f9ea0)
    .set("chartreuse", 0x7fff00)
    .set("chocolate", 0xd2691e)
    .set("coral", 0xff7f50)
    .set("cornflowerblue", 0x6495ed)
    .set("cornsilk", 0xfff8dc)
    .set("crimson", 0xdc143c)
    .set("cyan", 0x00ffff)
    .set("darkblue", 0x00008b)
    .set("darkcyan", 0x008b8b)
    .set("darkgoldenrod", 0xb8860b)
    .set("darkgray", 0xa9a9a9)
    .set("darkgreen", 0x006400)
    .set("darkgrey", 0xa9a9a9)
    .set("darkkhaki", 0xbdb76b)
    .set("darkmagenta", 0x8b008b)
    .set("darkolivegreen", 0x556b2f)
    .set("darkorange", 0xff8c00)
    .set("darkorchid", 0x9932cc)
    .set("darkred", 0x8b0000)
    .set("darksalmon", 0xe9967a)
    .set("darkseagreen", 0x8fbc8f)
    .set("darkslateblue", 0x483d8b)
    .set("darkslategray", 0x2f4f4f)
    .set("darkslategrey", 0x2f4f4f)
    .set("darkturquoise", 0x00ced1)
    .set("darkviolet", 0x9400d3)
    .set("deeppink", 0xff1493)
    .set("deepskyblue", 0x00bfff)
    .set("dimgray", 0x696969)
    .set("dimgrey", 0x696969)
    .set("dodgerblue", 0x1e90ff)
    .set("firebrick", 0xb22222)
    .set("floralwhite", 0xfffaf0)
    .set("forestgreen", 0x228b22)
    .set("fuchsia", 0xff00ff)
    .set("gainsboro", 0xdcdcdc)
    .set("ghostwhite", 0xf8f8ff)
    .set("gold", 0xffd700)
    .set("goldenrod", 0xdaa520)
    .set("gray", 0x808080)
    .set("green", 0x008000)
    .set("greenyellow", 0xadff2f)
    .set("grey", 0x808080)
    .set("honeydew", 0xf0fff0)
    .set("hotpink", 0xff69b4)
    .set("indianred", 0xcd5c5c)
    .set("indigo", 0x4b0082)
    .set("ivory", 0xfffff0)
    .set("khaki", 0xf0e68c)
    .set("lavender", 0xe6e6fa)
    .set("lavenderblush", 0xfff0f5)
    .set("lawngreen", 0x7cfc00)
    .set("lemonchiffon", 0xfffacd)
    .set("lightblue", 0xadd8e6)
    .set("lightcoral", 0xf08080)
    .set("lightcyan", 0xe0ffff)
    .set("lightgoldenrodyellow", 0xfafad2)
    .set("lightgray", 0xd3d3d3)
    .set("lightgreen", 0x90ee90)
    .set("lightgrey", 0xd3d3d3)
    .set("lightpink", 0xffb6c1)
    .set("lightsalmon", 0xffa07a)
    .set("lightseagreen", 0x20b2aa)
    .set("lightskyblue", 0x87cefa)
    .set("lightslategray", 0x778899)
    .set("lightslategrey", 0x778899)
    .set("lightsteelblue", 0xb0c4de)
    .set("lightyellow", 0xffffe0)
    .set("lime", 0x00ff00)
    .set("limegreen", 0x32cd32)
    .set("linen", 0xfaf0e6)
    .set("magenta", 0xff00ff)
    .set("maroon", 0x800000)
    .set("mediumaquamarine", 0x66cdaa)
    .set("mediumblue", 0x0000cd)
    .set("mediumorchid", 0xba55d3)
    .set("mediumpurple", 0x9370db)
    .set("mediumseagreen", 0x3cb371)
    .set("mediumslateblue", 0x7b68ee)
    .set("mediumspringgreen", 0x00fa9a)
    .set("mediumturquoise", 0x48d1cc)
    .set("mediumvioletred", 0xc71585)
    .set("midnightblue", 0x191970)
    .set("mintcream", 0xf5fffa)
    .set("mistyrose", 0xffe4e1)
    .set("moccasin", 0xffe4b5)
    .set("navajowhite", 0xffdead)
    .set("navy", 0x000080)
    .set("oldlace", 0xfdf5e6)
    .set("olive", 0x808000)
    .set("olivedrab", 0x6b8e23)
    .set("orange", 0xffa500)
    .set("orangered", 0xff4500)
    .set("orchid", 0xda70d6)
    .set("palegoldenrod", 0xeee8aa)
    .set("palegreen", 0x98fb98)
    .set("paleturquoise", 0xafeeee)
    .set("palevioletred", 0xdb7093)
    .set("papayawhip", 0xffefd5)
    .set("peachpuff", 0xffdab9)
    .set("peru", 0xcd853f)
    .set("pink", 0xffc0cb)
    .set("plum", 0xdda0dd)
    .set("powderblue", 0xb0e0e6)
    .set("purple", 0x800080)
    .set("rebeccapurple", 0x663399)
    .set("red", 0xff0000)
    .set("rosybrown", 0xbc8f8f)
    .set("royalblue", 0x4169e1)
    .set("saddlebrown", 0x8b4513)
    .set("salmon", 0xfa8072)
    .set("sandybrown", 0xf4a460)
    .set("seagreen", 0x2e8b57)
    .set("seashell", 0xfff5ee)
    .set("sienna", 0xa0522d)
    .set("silver", 0xc0c0c0)
    .set("skyblue", 0x87ceeb)
    .set("slateblue", 0x6a5acd)
    .set("slategray", 0x708090)
    .set("slategrey", 0x708090)
    .set("snow", 0xfffafa)
    .set("springgreen", 0x00ff7f)
    .set("steelblue", 0x4682b4)
    .set("tan", 0xd2b48c)
    .set("teal", 0x008080)
    .set("thistle", 0xd8bfd8)
    .set("tomato", 0xff6347)
    .set("turquoise", 0x40e0d0)
    .set("violet", 0xee82ee)
    .set("wheat", 0xf5deb3)
    .set("white", 0xffffff)
    .set("whitesmoke", 0xf5f5f5)
    .set("yellow", 0xffff00)
    .set("yellowgreen", 0x9acd32);

var deg2rad = Math.PI / 180;
var rad2deg$1 = 180 / Math.PI;

function hcl(h, c, l) {
  if (arguments.length === 1) {
    if (h instanceof Hcl) {
      l = h.l;
      c = h.c;
      h = h.h;
    } else {
      if (!(h instanceof Lab)) h = lab(h);
      l = h.l;
      c = Math.sqrt(h.a * h.a + h.b * h.b);
      h = Math.atan2(h.b, h.a) * rad2deg$1;
      if (h < 0) h += 360;
    }
  }
  return new Hcl(h, c, l);
};

function Hcl(h, c, l) {
  this.h = +h;
  this.c = +c;
  this.l = +l;
};

var prototype$3 = hcl.prototype = Hcl.prototype = new Color;

prototype$3.brighter = function(k) {
  return new Hcl(this.h, this.c, this.l + Kn * (k == null ? 1 : k));
};

prototype$3.darker = function(k) {
  return new Hcl(this.h, this.c, this.l - Kn * (k == null ? 1 : k));
};

prototype$3.rgb = function() {
  return lab(this).rgb();
};

var Kn = 18;

var Xn = 0.950470;
var Yn = 1;
var Zn = 1.088830;
var t0$1 = 4 / 29;
var t1$1 = 6 / 29;
var t2 = 3 * t1$1 * t1$1;
var t3 = t1$1 * t1$1 * t1$1;
function lab(l, a, b) {
  if (arguments.length === 1) {
    if (l instanceof Lab) {
      b = l.b;
      a = l.a;
      l = l.l;
    } else if (l instanceof Hcl) {
      var h = l.h * deg2rad;
      b = Math.sin(h) * l.c;
      a = Math.cos(h) * l.c;
      l = l.l;
    } else {
      if (!(l instanceof Rgb)) l = rgb(l);
      var r = rgb2xyz(l.r),
          g = rgb2xyz(l.g),
          b = rgb2xyz(l.b),
          x = xyz2lab((0.4124564 * r + 0.3575761 * g + 0.1804375 * b) / Xn),
          y = xyz2lab((0.2126729 * r + 0.7151522 * g + 0.0721750 * b) / Yn),
          z = xyz2lab((0.0193339 * r + 0.1191920 * g + 0.9503041 * b) / Zn);
      b = 200 * (y - z);
      a = 500 * (x - y);
      l = 116 * y - 16;
    }
  }
  return new Lab(l, a, b);
};

function Lab(l, a, b) {
  this.l = +l;
  this.a = +a;
  this.b = +b;
};

var prototype$2 = lab.prototype = Lab.prototype = new Color;

prototype$2.brighter = function(k) {
  return new Lab(this.l + Kn * (k == null ? 1 : k), this.a, this.b);
};

prototype$2.darker = function(k) {
  return new Lab(this.l - Kn * (k == null ? 1 : k), this.a, this.b);
};

prototype$2.rgb = function() {
  var y = (this.l + 16) / 116,
      x = isNaN(this.a) ? y : y + this.a / 500,
      z = isNaN(this.b) ? y : y - this.b / 200;
  y = Yn * lab2xyz(y);
  x = Xn * lab2xyz(x);
  z = Zn * lab2xyz(z);
  return new Rgb(
    xyz2rgb( 3.2404542 * x - 1.5371385 * y - 0.4985314 * z), // D65 -> sRGB
    xyz2rgb(-0.9692660 * x + 1.8760108 * y + 0.0415560 * z),
    xyz2rgb( 0.0556434 * x - 0.2040259 * y + 1.0572252 * z)
  );
};

function xyz2lab(t) {
  return t > t3 ? Math.pow(t, 1 / 3) : t / t2 + t0$1;
}

function lab2xyz(t) {
  return t > t1$1 ? t * t * t : t2 * (t - t0$1);
}

function xyz2rgb(x) {
  return 255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
}

function rgb2xyz(x) {
  return (x /= 255) <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
}

var A = -0.14861;
var B = +1.78277;
var C = -0.29227;
var D = -0.90649;
var E = +1.97294;
var ED = E * D;
var EB = E * B;
var BC_DA = B * C - D * A;
function cubehelix(h, s, l) {
  if (arguments.length === 1) {
    if (h instanceof Cubehelix) {
      l = h.l;
      s = h.s;
      h = h.h;
    } else {
      if (!(h instanceof Rgb)) h = rgb(h);
      var r = h.r / 255, g = h.g / 255, b = h.b / 255;
      l = (BC_DA * b + ED * r - EB * g) / (BC_DA + ED - EB);
      var bl = b - l, k = (E * (g - l) - C * bl) / D;
      s = Math.sqrt(k * k + bl * bl) / (E * l * (1 - l)); // NaN if l=0 or l=1
      h = s ? Math.atan2(k, bl) * rad2deg$1 - 120 : NaN;
      if (h < 0) h += 360;
    }
  }
  return new Cubehelix(h, s, l);
};

function Cubehelix(h, s, l) {
  this.h = +h;
  this.s = +s;
  this.l = +l;
};

var prototype$4 = cubehelix.prototype = Cubehelix.prototype = new Color;

prototype$4.brighter = function(k) {
  k = k == null ? brighter : Math.pow(brighter, k);
  return new Cubehelix(this.h, this.s, this.l * k);
};

prototype$4.darker = function(k) {
  k = k == null ? darker : Math.pow(darker, k);
  return new Cubehelix(this.h, this.s, this.l * k);
};

prototype$4.rgb = function() {
  var h = isNaN(this.h) ? 0 : (this.h + 120) * deg2rad,
      l = +this.l,
      a = isNaN(this.s) ? 0 : this.s * l * (1 - l),
      cosh = Math.cos(h),
      sinh = Math.sin(h);
  return new Rgb(
    255 * (l + a * (A * cosh + B * sinh)),
    255 * (l + a * (C * cosh + D * sinh)),
    255 * (l + a * (E * cosh))
  );
};

function interpolateRgb(a, b) {
  a = rgb(a);
  b = rgb(b);
  var ar = a.r,
      ag = a.g,
      ab = a.b,
      br = b.r - ar,
      bg = b.g - ag,
      bb = b.b - ab;
  return function(t) {
    return format$2(Math.round(ar + br * t), Math.round(ag + bg * t), Math.round(ab + bb * t));
  };
};

// TODO sparse arrays?
function interpolateArray(a, b) {
  var x = [],
      c = [],
      na = a.length,
      nb = b.length,
      n0 = Math.min(a.length, b.length),
      i;

  for (i = 0; i < n0; ++i) x.push(interpolate(a[i], b[i]));
  for (; i < na; ++i) c[i] = a[i];
  for (; i < nb; ++i) c[i] = b[i];

  return function(t) {
    for (i = 0; i < n0; ++i) c[i] = x[i](t);
    return c;
  };
};

function interpolateNumber(a, b) {
  return a = +a, b -= a, function(t) {
    return a + b * t;
  };
};

function interpolateObject(a, b) {
  var i = {},
      c = {},
      k;

  for (k in a) {
    if (k in b) {
      i[k] = interpolate(a[k], b[k]);
    } else {
      c[k] = a[k];
    }
  }

  for (k in b) {
    if (!(k in a)) {
      c[k] = b[k];
    }
  }

  return function(t) {
    for (k in i) c[k] = i[k](t);
    return c;
  };
};

var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g;
var reB = new RegExp(reA.source, "g");
function interpolate0(b) {
  return function() {
    return b;
  };
}

function interpolate1(b) {
  return function(t) {
    return b(t) + "";
  };
}

function interpolateString(a, b) {
  var bi = reA.lastIndex = reB.lastIndex = 0, // scan index for next number in b
      am, // current match in a
      bm, // current match in b
      bs, // string preceding current number in b, if any
      i = -1, // index in s
      s = [], // string constants and placeholders
      q = []; // number interpolators

  // Coerce inputs to strings.
  a = a + "", b = b + "";

  // Interpolate pairs of numbers in a & b.
  while ((am = reA.exec(a))
      && (bm = reB.exec(b))) {
    if ((bs = bm.index) > bi) { // a string precedes the next number in b
      bs = b.slice(bi, bs);
      if (s[i]) s[i] += bs; // coalesce with previous string
      else s[++i] = bs;
    }
    if ((am = am[0]) === (bm = bm[0])) { // numbers in a & b match
      if (s[i]) s[i] += bm; // coalesce with previous string
      else s[++i] = bm;
    } else { // interpolate non-matching numbers
      s[++i] = null;
      q.push({i: i, x: interpolateNumber(am, bm)});
    }
    bi = reB.lastIndex;
  }

  // Add remains of b.
  if (bi < b.length) {
    bs = b.slice(bi);
    if (s[i]) s[i] += bs; // coalesce with previous string
    else s[++i] = bs;
  }

  // Special optimization for only a single match.
  // Otherwise, interpolate each of the numbers and rejoin the string.
  return s.length < 2 ? (q[0]
      ? interpolate1(q[0].x)
      : interpolate0(b))
      : (b = q.length, function(t) {
          for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
          return s.join("");
        });
};

var interpolators = [
  function(a, b) {
    var t = typeof b, c;
    return (t === "string" ? ((c = color(b)) ? (b = c, interpolateRgb) : interpolateString)
        : b instanceof color ? interpolateRgb
        : Array.isArray(b) ? interpolateArray
        : t === "object" && isNaN(b) ? interpolateObject
        : interpolateNumber)(a, b);
  }
];

function interpolate(a, b) {
  var i = interpolators.length, f;
  while (--i >= 0 && !(f = interpolators[i](a, b)));
  return f;
};

function interpolateRound(a, b) {
  return a = +a, b -= a, function(t) {
    return Math.round(a + b * t);
  };
};

function nice(domain, step) {
  domain = domain.slice();
  if (!step) return domain;

  var i0 = 0,
      i1 = domain.length - 1,
      x0 = domain[i0],
      x1 = domain[i1],
      t;

  if (x1 < x0) {
    t = i0, i0 = i1, i1 = t;
    t = x0, x0 = x1, x1 = t;
  }

  domain[i0] = Math.floor(x0 / step) * step;
  domain[i1] = Math.ceil(x1 / step) * step;
  return domain;
};

function uninterpolateClamp(a, b) {
  b = (b -= a = +a) || 1 / b;
  return function(x) {
    return Math.max(0, Math.min(1, (x - a) / b));
  };
}

function uninterpolateNumber(a, b) {
  b = (b -= a = +a) || 1 / b;
  return function(x) {
    return (x - a) / b;
  };
}

function bilinear(domain, range, uninterpolate, interpolate) {
  var u = uninterpolate(domain[0], domain[1]),
      i = interpolate(range[0], range[1]);
  return function(x) {
    return i(u(x));
  };
}

function polylinear(domain, range, uninterpolate, interpolate) {
  var k = Math.min(domain.length, range.length) - 1,
      u = new Array(k),
      i = new Array(k),
      j = -1;

  // Handle descending domains.
  if (domain[k] < domain[0]) {
    domain = domain.slice().reverse();
    range = range.slice().reverse();
  }

  while (++j < k) {
    u[j] = uninterpolate(domain[j], domain[j + 1]);
    i[j] = interpolate(range[j], range[j + 1]);
  }

  return function(x) {
    var j = bisectRight$1(domain, x, 1, k) - 1;
    return i[j](u[j](x));
  };
}

function newLinear(domain, range, interpolate, clamp) {
  var output,
      input;

  function rescale() {
    var linear = Math.min(domain.length, range.length) > 2 ? polylinear : bilinear,
        uninterpolate = clamp ? uninterpolateClamp : uninterpolateNumber;
    output = linear(domain, range, uninterpolate, interpolate);
    input = linear(range, domain, uninterpolate, interpolateNumber);
    return scale;
  }

  function scale(x) {
    return output(x);
  }

  scale.invert = function(y) {
    return input(y);
  };

  scale.domain = function(x) {
    if (!arguments.length) return domain.slice();
    domain = x.map(Number);
    return rescale();
  };

  scale.range = function(x) {
    if (!arguments.length) return range.slice();
    range = x.slice();
    return rescale();
  };

  scale.rangeRound = function(x) {
    return scale.range(x).interpolate(interpolateRound);
  };

  scale.clamp = function(x) {
    if (!arguments.length) return clamp;
    clamp = !!x;
    return rescale();
  };

  scale.interpolate = function(x) {
    if (!arguments.length) return interpolate;
    interpolate = x;
    return rescale();
  };

  scale.ticks = function(count) {
    return ticks$1(domain, count);
  };

  scale.tickFormat = function(count, specifier) {
    return tickFormat$2(domain, count, specifier);
  };

  scale.nice = function(count) {
    domain = nice(domain, tickRange(domain, count)[2]);
    return rescale();
  };

  scale.copy = function() {
    return newLinear(domain, range, interpolate, clamp);
  };

  return rescale();
}

function linear() {
  return newLinear([0, 1], [0, 1], interpolate, false);
};

var tickFormat10 = format(".0e");
var tickFormatOther = format(",");

var locale$2 = {
  dateTime: "%a %b %e %X %Y",
  date: "%m/%d/%Y",
  time: "%H:%M:%S",
  periods: ["AM", "PM"],
  days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
};

var isoSpecifier = "%Y-%m-%dT%H:%M:%S.%LZ";

function formatIsoNative(date) {
  return date.toISOString();
}

formatIsoNative.parse = function(string) {
  var date = new Date(string);
  return isNaN(date) ? null : date;
};

formatIsoNative.toString = function() {
  return isoSpecifier;
};

var formatIso = Date.prototype.toISOString && +new Date("2000-01-01T00:00:00.000Z")
    ? formatIsoNative
    : locale$2.utcFormat(isoSpecifier);

var t0 = new Date;
var t1 = new Date;
function newInterval(floori, offseti, count) {

  function interval(date) {
    return floori(date = new Date(+date)), date;
  }

  interval.floor = interval;

  interval.round = function(date) {
    var d0 = new Date(+date),
        d1 = new Date(date - 1);
    floori(d0), floori(d1), offseti(d1, 1);
    return date - d0 < d1 - date ? d0 : d1;
  };

  interval.ceil = function(date) {
    return floori(date = new Date(date - 1)), offseti(date, 1), date;
  };

  interval.offset = function(date, step) {
    return offseti(date = new Date(+date), step == null ? 1 : Math.floor(step)), date;
  };

  interval.range = function(start, stop, step) {
    var range = [];
    start = new Date(start - 1);
    stop = new Date(+stop);
    step = step == null ? 1 : Math.floor(step);
    if (!(start < stop) || !(step > 0)) return range; // also handles Invalid Date
    offseti(start, 1), floori(start);
    if (start < stop) range.push(new Date(+start));
    while (offseti(start, step), floori(start), start < stop) range.push(new Date(+start));
    return range;
  };

  interval.filter = function(test) {
    return newInterval(function(date) {
      while (floori(date), !test(date)) date.setTime(date - 1);
    }, function(date, step) {
      while (--step >= 0) while (offseti(date, 1), !test(date));
    });
  };

  if (count) interval.count = function(start, end) {
    t0.setTime(+start), t1.setTime(+end);
    floori(t0), floori(t1);
    return Math.floor(count(t0, t1));
  };

  return interval;
};

var day = newInterval(function(date) {
  date.setHours(0, 0, 0, 0);
}, function(date, step) {
  date.setDate(date.getDate() + step);
}, function(start, end) {
  return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * 6e4) / 864e5;
});

function weekday(i) {
  return newInterval(function(date) {
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (date.getDay() + 7 - i) % 7);
  }, function(date, step) {
    date.setDate(date.getDate() + step * 7);
  }, function(start, end) {
    return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * 6e4) / 6048e5;
  });
}

var sunday = weekday(0);
var monday = weekday(1);

var year = newInterval(function(date) {
  date.setHours(0, 0, 0, 0);
  date.setMonth(0, 1);
}, function(date, step) {
  date.setFullYear(date.getFullYear() + step);
}, function(start, end) {
  return end.getFullYear() - start.getFullYear();
});

var utcDay = newInterval(function(date) {
  date.setUTCHours(0, 0, 0, 0);
}, function(date, step) {
  date.setUTCDate(date.getUTCDate() + step);
}, function(start, end) {
  return (end - start) / 864e5;
});

function utcWeekday(i) {
  return newInterval(function(date) {
    date.setUTCHours(0, 0, 0, 0);
    date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 7 - i) % 7);
  }, function(date, step) {
    date.setUTCDate(date.getUTCDate() + step * 7);
  }, function(start, end) {
    return (end - start) / 6048e5;
  });
}

var utcSunday = utcWeekday(0);
var utcMonday = utcWeekday(1);

var utcYear = newInterval(function(date) {
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCMonth(0, 1);
}, function(date, step) {
  date.setUTCFullYear(date.getUTCFullYear() + step);
}, function(start, end) {
  return end.getUTCFullYear() - start.getUTCFullYear();
});

function localDate(d) {
  if (0 <= d.y && d.y < 100) {
    var date = new Date(-1, d.m, d.d, d.H, d.M, d.S, d.L);
    date.setFullYear(d.y);
    return date;
  }
  return new Date(d.y, d.m, d.d, d.H, d.M, d.S, d.L);
}

function utcDate(d) {
  if (0 <= d.y && d.y < 100) {
    var date = new Date(Date.UTC(-1, d.m, d.d, d.H, d.M, d.S, d.L));
    date.setUTCFullYear(d.y);
    return date;
  }
  return new Date(Date.UTC(d.y, d.m, d.d, d.H, d.M, d.S, d.L));
}

function newYear(y) {
  return {y: y, m: 0, d: 1, H: 0, M: 0, S: 0, L: 0};
}

function locale$1(locale) {
  var locale_dateTime = locale.dateTime,
      locale_date = locale.date,
      locale_time = locale.time,
      locale_periods = locale.periods,
      locale_weekdays = locale.days,
      locale_shortWeekdays = locale.shortDays,
      locale_months = locale.months,
      locale_shortMonths = locale.shortMonths;

  var periodLookup = formatLookup(locale_periods),
      weekdayRe = formatRe(locale_weekdays),
      weekdayLookup = formatLookup(locale_weekdays),
      shortWeekdayRe = formatRe(locale_shortWeekdays),
      shortWeekdayLookup = formatLookup(locale_shortWeekdays),
      monthRe = formatRe(locale_months),
      monthLookup = formatLookup(locale_months),
      shortMonthRe = formatRe(locale_shortMonths),
      shortMonthLookup = formatLookup(locale_shortMonths);

  var formats = {
    "a": formatShortWeekday,
    "A": formatWeekday,
    "b": formatShortMonth,
    "B": formatMonth,
    "c": null,
    "d": formatDayOfMonth,
    "e": formatDayOfMonth,
    "H": formatHour24,
    "I": formatHour12,
    "j": formatDayOfYear,
    "L": formatMilliseconds,
    "m": formatMonthNumber,
    "M": formatMinutes,
    "p": formatPeriod,
    "S": formatSeconds,
    "U": formatWeekNumberSunday,
    "w": formatWeekdayNumber,
    "W": formatWeekNumberMonday,
    "x": null,
    "X": null,
    "y": formatYear$1,
    "Y": formatFullYear,
    "Z": formatZone,
    "%": formatLiteralPercent
  };

  var utcFormats = {
    "a": formatUTCShortWeekday,
    "A": formatUTCWeekday,
    "b": formatUTCShortMonth,
    "B": formatUTCMonth,
    "c": null,
    "d": formatUTCDayOfMonth,
    "e": formatUTCDayOfMonth,
    "H": formatUTCHour24,
    "I": formatUTCHour12,
    "j": formatUTCDayOfYear,
    "L": formatUTCMilliseconds,
    "m": formatUTCMonthNumber,
    "M": formatUTCMinutes,
    "p": formatUTCPeriod,
    "S": formatUTCSeconds,
    "U": formatUTCWeekNumberSunday,
    "w": formatUTCWeekdayNumber,
    "W": formatUTCWeekNumberMonday,
    "x": null,
    "X": null,
    "y": formatUTCYear$1,
    "Y": formatUTCFullYear,
    "Z": formatUTCZone,
    "%": formatLiteralPercent
  };

  var parses = {
    "a": parseShortWeekday,
    "A": parseWeekday,
    "b": parseShortMonth,
    "B": parseMonth,
    "c": parseLocaleDateTime,
    "d": parseDayOfMonth,
    "e": parseDayOfMonth,
    "H": parseHour24,
    "I": parseHour24,
    "j": parseDayOfYear,
    "L": parseMilliseconds,
    "m": parseMonthNumber,
    "M": parseMinutes,
    "p": parsePeriod,
    "S": parseSeconds,
    "U": parseWeekNumberSunday,
    "w": parseWeekdayNumber,
    "W": parseWeekNumberMonday,
    "x": parseLocaleDate,
    "X": parseLocaleTime,
    "y": parseYear,
    "Y": parseFullYear,
    "Z": parseZone,
    "%": parseLiteralPercent
  };

  // These recursive directive definitions must be deferred.
  formats.x = newFormat(locale_date, formats);
  formats.X = newFormat(locale_time, formats);
  formats.c = newFormat(locale_dateTime, formats);
  utcFormats.x = newFormat(locale_date, utcFormats);
  utcFormats.X = newFormat(locale_time, utcFormats);
  utcFormats.c = newFormat(locale_dateTime, utcFormats);

  function newFormat(specifier, formats) {
    return function(date) {
      var string = [],
          i = -1,
          j = 0,
          n = specifier.length,
          c,
          pad,
          format;

      while (++i < n) {
        if (specifier.charCodeAt(i) === 37) {
          string.push(specifier.slice(j, i));
          if ((pad = pads[c = specifier.charAt(++i)]) != null) c = specifier.charAt(++i);
          if (format = formats[c]) c = format(date, pad == null ? (c === "e" ? " " : "0") : pad);
          string.push(c);
          j = i + 1;
        }
      }

      string.push(specifier.slice(j, i));
      return string.join("");
    };
  }

  function newParse(specifier, newDate) {
    return function(string) {
      var d = newYear(1900),
          i = parseSpecifier(d, specifier, string, 0);
      if (i != string.length) return null;

      // The am-pm flag is 0 for AM, and 1 for PM.
      if ("p" in d) d.H = d.H % 12 + d.p * 12;

      // If a time zone is specified, all fields are interpreted as UTC and then
      // offset according to the specified time zone.
      if ("Z" in d) {
        if ("w" in d && ("W" in d || "U" in d)) {
          var day = utcDate(newYear(d.y)).getUTCDay();
          if ("W" in d) d.U = d.W, d.w = (d.w + 6) % 7, --day;
          d.m = 0;
          d.d = d.w + d.U * 7 - (day + 6) % 7;
        }
        d.H += d.Z / 100 | 0;
        d.M += d.Z % 100;
        return utcDate(d);
      }

      // Otherwise, all fields are in local time.
      if ("w" in d && ("W" in d || "U" in d)) {
        var day = newDate(newYear(d.y)).getDay();
        if ("W" in d) d.U = d.W, d.w = (d.w + 6) % 7, --day;
        d.m = 0;
        d.d = d.w + d.U * 7 - (day + 6) % 7;
      }
      return newDate(d);
    };
  }

  function parseSpecifier(d, specifier, string, j) {
    var i = 0,
        n = specifier.length,
        m = string.length,
        c,
        parse;

    while (i < n) {
      if (j >= m) return -1;
      c = specifier.charCodeAt(i++);
      if (c === 37) {
        c = specifier.charAt(i++);
        parse = parses[c in pads ? specifier.charAt(i++) : c];
        if (!parse || ((j = parse(d, string, j)) < 0)) return -1;
      } else if (c != string.charCodeAt(j++)) {
        return -1;
      }
    }

    return j;
  }

  function parseShortWeekday(d, string, i) {
    var n = shortWeekdayRe.exec(string.slice(i));
    return n ? (d.w = shortWeekdayLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
  }

  function parseWeekday(d, string, i) {
    var n = weekdayRe.exec(string.slice(i));
    return n ? (d.w = weekdayLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
  }

  function parseShortMonth(d, string, i) {
    var n = shortMonthRe.exec(string.slice(i));
    return n ? (d.m = shortMonthLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
  }

  function parseMonth(d, string, i) {
    var n = monthRe.exec(string.slice(i));
    return n ? (d.m = monthLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
  }

  function parseLocaleDateTime(d, string, i) {
    return parseSpecifier(d, locale_dateTime, string, i);
  }

  function parseLocaleDate(d, string, i) {
    return parseSpecifier(d, locale_date, string, i);
  }

  function parseLocaleTime(d, string, i) {
    return parseSpecifier(d, locale_time, string, i);
  }

  function parsePeriod(d, string, i) {
    var n = periodLookup.get(string.slice(i, i += 2).toLowerCase());
    return n == null ? -1 : (d.p = n, i);
  }

  function formatShortWeekday(d) {
    return locale_shortWeekdays[d.getDay()];
  }

  function formatWeekday(d) {
    return locale_weekdays[d.getDay()];
  }

  function formatShortMonth(d) {
    return locale_shortMonths[d.getMonth()];
  }

  function formatMonth(d) {
    return locale_months[d.getMonth()];
  }

  function formatPeriod(d) {
    return locale_periods[+(d.getHours() >= 12)];
  }

  function formatUTCShortWeekday(d) {
    return locale_shortWeekdays[d.getUTCDay()];
  }

  function formatUTCWeekday(d) {
    return locale_weekdays[d.getUTCDay()];
  }

  function formatUTCShortMonth(d) {
    return locale_shortMonths[d.getUTCMonth()];
  }

  function formatUTCMonth(d) {
    return locale_months[d.getUTCMonth()];
  }

  function formatUTCPeriod(d) {
    return locale_periods[+(d.getUTCHours() >= 12)];
  }

  return {
    format: function(specifier) {
      var f = newFormat(specifier += "", formats);
      f.parse = newParse(specifier, localDate);
      f.toString = function() { return specifier; };
      return f;
    },
    utcFormat: function(specifier) {
      var f = newFormat(specifier += "", utcFormats);
      f.parse = newParse(specifier, utcDate);
      f.toString = function() { return specifier; };
      return f;
    }
  };
};

var pads = {"-": "", "_": " ", "0": "0"};
var numberRe = /^\s*\d+/;
var percentRe = /^%/;
var requoteRe$1 = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;
function pad(value, fill, width) {
  var sign = value < 0 ? "-" : "",
      string = (sign ? -value : value) + "",
      length = string.length;
  return sign + (length < width ? new Array(width - length + 1).join(fill) + string : string);
}

function requote$1(s) {
  return s.replace(requoteRe$1, "\\$&");
}

function formatRe(names) {
  return new RegExp("^(?:" + names.map(requote$1).join("|") + ")", "i");
}

function formatLookup(names) {
  var map = new Map, i = -1, n = names.length;
  while (++i < n) map.set(names[i].toLowerCase(), i);
  return map;
}

function parseWeekdayNumber(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 1));
  return n ? (d.w = +n[0], i + n[0].length) : -1;
}

function parseWeekNumberSunday(d, string, i) {
  var n = numberRe.exec(string.slice(i));
  return n ? (d.U = +n[0], i + n[0].length) : -1;
}

function parseWeekNumberMonday(d, string, i) {
  var n = numberRe.exec(string.slice(i));
  return n ? (d.W = +n[0], i + n[0].length) : -1;
}

function parseFullYear(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 4));
  return n ? (d.y = +n[0], i + n[0].length) : -1;
}

function parseYear(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.y = +n[0] + (+n[0] > 68 ? 1900 : 2000), i + n[0].length) : -1;
}

function parseZone(d, string, i) {
  return /^[+-]\d{4}$/.test(string = string.slice(i, i + 5))
      ? (d.Z = -string, i + 5) // sign differs from getTimezoneOffset!
      : -1;
}

function parseMonthNumber(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.m = n[0] - 1, i + n[0].length) : -1;
}

function parseDayOfMonth(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.d = +n[0], i + n[0].length) : -1;
}

function parseDayOfYear(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 3));
  return n ? (d.m = 0, d.d = +n[0], i + n[0].length) : -1;
}

function parseHour24(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.H = +n[0], i + n[0].length) : -1;
}

function parseMinutes(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.M = +n[0], i + n[0].length) : -1;
}

function parseSeconds(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.S = +n[0], i + n[0].length) : -1;
}

function parseMilliseconds(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 3));
  return n ? (d.L = +n[0], i + n[0].length) : -1;
}

function parseLiteralPercent(d, string, i) {
  var n = percentRe.exec(string.slice(i, i + 1));
  return n ? i + n[0].length : -1;
}

function formatDayOfMonth(d, p) {
  return pad(d.getDate(), p, 2);
}

function formatHour24(d, p) {
  return pad(d.getHours(), p, 2);
}

function formatHour12(d, p) {
  return pad(d.getHours() % 12 || 12, p, 2);
}

function formatDayOfYear(d, p) {
  return pad(1 + day.count(year(d), d), p, 3);
}

function formatMilliseconds(d, p) {
  return pad(d.getMilliseconds(), p, 3);
}

function formatMonthNumber(d, p) {
  return pad(d.getMonth() + 1, p, 2);
}

function formatMinutes(d, p) {
  return pad(d.getMinutes(), p, 2);
}

function formatSeconds(d, p) {
  return pad(d.getSeconds(), p, 2);
}

function formatWeekNumberSunday(d, p) {
  return pad(sunday.count(year(d), d), p, 2);
}

function formatWeekdayNumber(d) {
  return d.getDay();
}

function formatWeekNumberMonday(d, p) {
  return pad(monday.count(year(d), d), p, 2);
}

function formatYear$1(d, p) {
  return pad(d.getFullYear() % 100, p, 2);
}

function formatFullYear(d, p) {
  return pad(d.getFullYear() % 10000, p, 4);
}

function formatZone(d) {
  var z = d.getTimezoneOffset();
  return (z > 0 ? "-" : (z *= -1, "+"))
      + pad(z / 60 | 0, "0", 2)
      + pad(z % 60, "0", 2);
}

function formatUTCDayOfMonth(d, p) {
  return pad(d.getUTCDate(), p, 2);
}

function formatUTCHour24(d, p) {
  return pad(d.getUTCHours(), p, 2);
}

function formatUTCHour12(d, p) {
  return pad(d.getUTCHours() % 12 || 12, p, 2);
}

function formatUTCDayOfYear(d, p) {
  return pad(1 + utcDay.count(utcYear(d), d), p, 3);
}

function formatUTCMilliseconds(d, p) {
  return pad(d.getUTCMilliseconds(), p, 3);
}

function formatUTCMonthNumber(d, p) {
  return pad(d.getUTCMonth() + 1, p, 2);
}

function formatUTCMinutes(d, p) {
  return pad(d.getUTCMinutes(), p, 2);
}

function formatUTCSeconds(d, p) {
  return pad(d.getUTCSeconds(), p, 2);
}

function formatUTCWeekNumberSunday(d, p) {
  return pad(utcSunday.count(utcYear(d), d), p, 2);
}

function formatUTCWeekdayNumber(d) {
  return d.getUTCDay();
}

function formatUTCWeekNumberMonday(d, p) {
  return pad(utcMonday.count(utcYear(d), d), p, 2);
}

function formatUTCYear$1(d, p) {
  return pad(d.getUTCFullYear() % 100, p, 2);
}

function formatUTCFullYear(d, p) {
  return pad(d.getUTCFullYear() % 10000, p, 4);
}

function formatUTCZone() {
  return "+0000";
}

function formatLiteralPercent() {
  return "%";
}

var caEs$1 = {
  dateTime: "%A, %e de %B de %Y, %X",
  date: "%d/%m/%Y",
  time: "%H:%M:%S",
  periods: ["AM", "PM"],
  days: ["diumenge", "dilluns", "dimarts", "dimecres", "dijous", "divendres", "dissabte"],
  shortDays: ["dg.", "dl.", "dt.", "dc.", "dj.", "dv.", "ds."],
  months: ["gener", "febrer", "març", "abril", "maig", "juny", "juliol", "agost", "setembre", "octubre", "novembre", "desembre"],
  shortMonths: ["gen.", "febr.", "març", "abr.", "maig", "juny", "jul.", "ag.", "set.", "oct.", "nov.", "des."]
};

var deDe$1 = {
  dateTime: "%A, der %e. %B %Y, %X",
  date: "%d.%m.%Y",
  time: "%H:%M:%S",
  periods: ["AM", "PM"], // unused
  days: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
  shortDays: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
  months: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
  shortMonths: ["Jan", "Feb", "Mrz", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"]
};

var enCa$1 = {
  dateTime: "%a %b %e %X %Y",
  date: "%Y-%m-%d",
  time: "%H:%M:%S",
  periods: ["AM", "PM"],
  days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
};

var enGb$1 = {
  dateTime: "%a %e %b %X %Y",
  date: "%d/%m/%Y",
  time: "%H:%M:%S",
  periods: ["AM", "PM"],
  days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
};

var esEs$1 = {
  dateTime: "%A, %e de %B de %Y, %X",
  date: "%d/%m/%Y",
  time: "%H:%M:%S",
  periods: ["AM", "PM"],
  days: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
  shortDays: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
  months: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
  shortMonths: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"]
};

var fiFi$1 = {
  dateTime: "%A, %-d. %Bta %Y klo %X",
  date: "%-d.%-m.%Y",
  time: "%H:%M:%S",
  periods: ["a.m.", "p.m."],
  days: ["sunnuntai", "maanantai", "tiistai", "keskiviikko", "torstai", "perjantai", "lauantai"],
  shortDays: ["Su", "Ma", "Ti", "Ke", "To", "Pe", "La"],
  months: ["tammikuu", "helmikuu", "maaliskuu", "huhtikuu", "toukokuu", "kesäkuu", "heinäkuu", "elokuu", "syyskuu", "lokakuu", "marraskuu", "joulukuu"],
  shortMonths: ["Tammi", "Helmi", "Maalis", "Huhti", "Touko", "Kesä", "Heinä", "Elo", "Syys", "Loka", "Marras", "Joulu"]
};

var frCa$1 = {
  dateTime: "%a %e %b %Y %X",
  date: "%Y-%m-%d",
  time: "%H:%M:%S",
  periods: ["", ""],
  days: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"],
  shortDays: ["dim", "lun", "mar", "mer", "jeu", "ven", "sam"],
  months: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
  shortMonths: ["jan", "fév", "mar", "avr", "mai", "jui", "jul", "aoû", "sep", "oct", "nov", "déc"]
};

var frFr$1 = {
  dateTime: "%A, le %e %B %Y, %X",
  date: "%d/%m/%Y",
  time: "%H:%M:%S",
  periods: ["AM", "PM"], // unused
  days: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"],
  shortDays: ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."],
  months: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
  shortMonths: ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."]
};

var heIl$1 = {
  dateTime: "%A, %e ב%B %Y %X",
  date: "%d.%m.%Y",
  time: "%H:%M:%S",
  periods: ["AM", "PM"],
  days: ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"],
  shortDays: ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"],
  months: ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"],
  shortMonths: ["ינו׳", "פבר׳", "מרץ", "אפר׳", "מאי", "יוני", "יולי", "אוג׳", "ספט׳", "אוק׳", "נוב׳", "דצמ׳"]
};

var itIt$1 = {
  dateTime: "%A %e %B %Y, %X",
  date: "%d/%m/%Y",
  time: "%H:%M:%S",
  periods: ["AM", "PM"], // unused
  days: ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"],
  shortDays: ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"],
  months: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
  shortMonths: ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"]
};

var jaJp$1 = {
  dateTime: "%Y %b %e %a %X",
  date: "%Y/%m/%d",
  time: "%H:%M:%S",
  periods: ["AM", "PM"],
  days: ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"],
  shortDays: ["日", "月", "火", "水", "木", "金", "土"],
  months: ["睦月", "如月", "弥生", "卯月", "皐月", "水無月", "文月", "葉月", "長月", "神無月", "霜月", "師走"],
  shortMonths: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
};

var mkMk$1 = {
  dateTime: "%A, %e %B %Y г. %X",
  date: "%d.%m.%Y",
  time: "%H:%M:%S",
  periods: ["AM", "PM"],
  days: ["недела", "понеделник", "вторник", "среда", "четврток", "петок", "сабота"],
  shortDays: ["нед", "пон", "вто", "сре", "чет", "пет", "саб"],
  months: ["јануари", "февруари", "март", "април", "мај", "јуни", "јули", "август", "септември", "октомври", "ноември", "декември"],
  shortMonths: ["јан", "фев", "мар", "апр", "мај", "јун", "јул", "авг", "сеп", "окт", "ное", "дек"]
};

var nlNl$1 = {
  dateTime: "%a %e %B %Y %T",
  date: "%d-%m-%Y",
  time: "%H:%M:%S",
  periods: ["AM", "PM"], // unused
  days: ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"],
  shortDays: ["zo", "ma", "di", "wo", "do", "vr", "za"],
  months: ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"],
  shortMonths: ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"]
};

var plPl$1 = {
  dateTime: "%A, %e %B %Y, %X",
  date: "%d/%m/%Y",
  time: "%H:%M:%S",
  periods: ["AM", "PM"], // unused
  days: ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"],
  shortDays: ["Niedz.", "Pon.", "Wt.", "Śr.", "Czw.", "Pt.", "Sob."],
  months: ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"],
  shortMonths: ["Stycz.", "Luty", "Marz.", "Kwie.", "Maj", "Czerw.", "Lipc.", "Sierp.", "Wrz.", "Paźdz.", "Listop.", "Grudz."]/* In Polish language abbraviated months are not commonly used so there is a dispute about the proper abbraviations. */
};

var ptBr$1 = {
  dateTime: "%A, %e de %B de %Y. %X",
  date: "%d/%m/%Y",
  time: "%H:%M:%S",
  periods: ["AM", "PM"],
  days: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
  shortDays: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
  months: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
  shortMonths: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
};

var ruRu$1 = {
  dateTime: "%A, %e %B %Y г. %X",
  date: "%d.%m.%Y",
  time: "%H:%M:%S",
  periods: ["AM", "PM"],
  days: ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"],
  shortDays: ["вс", "пн", "вт", "ср", "чт", "пт", "сб"],
  months: ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"],
  shortMonths: ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"]
};

var zhCn$1 = {
  dateTime: "%a %b %e %X %Y",
  date: "%Y/%-m/%-d",
  time: "%H:%M:%S",
  periods: ["上午", "下午"],
  days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
  shortDays: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
  months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
  shortMonths: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
};

var localeDefinitions$1 = (new Map)
    .set("ca-ES", caEs$1)
    .set("de-DE", deDe$1)
    .set("en-CA", enCa$1)
    .set("en-GB", enGb$1)
    .set("en-US", locale$2)
    .set("es-ES", esEs$1)
    .set("fi-FI", fiFi$1)
    .set("fr-CA", frCa$1)
    .set("fr-FR", frFr$1)
    .set("he-IL", heIl$1)
    .set("it-IT", itIt$1)
    .set("ja-JP", jaJp$1)
    .set("mk-MK", mkMk$1)
    .set("nl-NL", nlNl$1)
    .set("pl-PL", plPl$1)
    .set("pt-BR", ptBr$1)
    .set("ru-RU", ruRu$1)
    .set("zh-CN", zhCn$1);

var defaultLocale$1 = locale$1(locale$2);
var format$1 = defaultLocale$1.format;
var utcFormat = defaultLocale$1.utcFormat;

var bisectTickIntervals = bisector$1(function(method) {
  return method[2];
}).right;

var formatMillisecond = format$1(".%L");
var formatSecond = format$1(":%S");
var formatMinute = format$1("%I:%M");
var formatHour = format$1("%I %p");
var formatDay = format$1("%a %d");
var formatWeek = format$1("%b %d");
var formatMonth = format$1("%B");
var formatYear = format$1("%Y");

var formatUTCMillisecond = utcFormat(".%L");
var formatUTCSecond = utcFormat(":%S");
var formatUTCMinute = utcFormat("%I:%M");
var formatUTCHour = utcFormat("%I %p");
var formatUTCDay = utcFormat("%a %d");
var formatUTCWeek = utcFormat("%b %d");
var formatUTCMonth = utcFormat("%B");
var formatUTCYear = utcFormat("%Y");

const functor = function(x) {
  return (typeof x === 'function') ?
    x :
    function() { return x; };
};

var d3Bundle = {
  get event() { return event; },
  select: select,
  selectAll: selectAll,
  functor: functor,
  scale: {
    linear: linear
  },
  format: format,
  range: range,
  ascending: ascending,
  descending: descending,
  sum: sum,
  json: json,
  xhr: xhr
};

module.exports = d3Bundle;