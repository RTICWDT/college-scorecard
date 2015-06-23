(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
window.tagalong = require('./');

},{"./":2}],2:[function(require,module,exports){
const ARRAY_TEMPLATE = '__array_template__';

var tagalong = function(node, data, directives) {
  if (typeof node === 'string') {
    var selector = node;
    node = document.querySelector(node);
    if (!node) throw new Error('no such element: ' + selector);
  }

  if (typeof directives === 'object') {
    directives = expandKeys(directives);
    applyDirectives(node, data, directives);
  } else if (typeof directives === 'function') {
    directives = directives.call(node, data) || {};
  } else {
    directives = {};
  }

  if (Array.isArray(data)) {
    return bindArray(node, data, directives);
  } else if (typeof data === 'object') {
    return bindObject(node, data, directives);
  }

  return bindScalar(node, data, directives);
};

tagalong.object = bindObject;
tagalong.array = bindArray;
tagalong.scalar = bindScalar;

module.exports = tagalong;

function bindObject(node, data, directives) {
  for (var key in data) {
    if (!data.hasOwnProperty(key)) continue;
    bindKey(node, key, data[key], directives[key]);
  }
  return node;
}

function bindArray(node, data, directives) {
  var nodes = getChildren(node);
  var template = node[ARRAY_TEMPLATE] || (node[ARRAY_TEMPLATE] = nodes[0]);
  var nodeCount = nodes.length;
  var dataCount = data.length;
  if (nodeCount < dataCount) {
    var last = nodes[nodeCount - 1] || template;
    while (nodeCount < dataCount) {
      var clone = template.cloneNode(true);
      nodeCount = nodes.push(node.insertBefore(clone, last.nextSibling));
      last = clone;
    }
  } else if (nodeCount > dataCount) {
    while (nodeCount > dataCount) {
      var child = nodes.shift();
      node.removeChild(child);
      nodeCount--;
    }
  }
  for (var i = 0; i < dataCount; i++) {
    tagalong(nodes[i], data[i], directives);
  }
  return node;
}

function bindKey(node, key, value, directives) {
  var target = findKeyNode(node, key);
  if (!target) {
    return false;
  }
  return tagalong(target, value, directives);
}

function bindScalar(node, data, directives) {
  var stringify = directives.stringify || String;
  node.textContent = stringify.call(node, data);
  return node;
}

function findKeyNode(node, key) {
  var classed = node.getElementsByClassName(key)[0];
  if (classed) return classed;

  // Doing it this way, rather than:
  //
  // `querySelector('[data-bind="' + key + '"]')`,
  //
  // ...ensures that we won't get an exception for keys that would produce
  // invalid selectors.
  var children = node.querySelectorAll('[data-bind]');
  for (var i = 0, len = children.length; i < len; i++) {
    if (children[i].getAttribute('data-bind') == key) {
      return children[i];
    }
  }
  return null;
}

function getChildren(node) {
  var children = [];
  for (var child = node.firstChild; child; child = child.nextSibling) {
    if (child.nodeType === 1) {
      children.push(child);
    }
  }
  return children;
}

function access(getter, data, thisArg) {
  if (typeof getter === 'function') {
    return getter.call(thisArg, data);
  }
  return data[getter];
}

function applyDirectives(node, data, directives) {
  var interpolated;
  for (var key in directives) {
    if (key.charAt(0) === '@') {
      var attr = key.substr(1);
      var value = directives[key] === true
        ? data[attr]
        : access(directives[key], data, node);
      node.setAttribute(attr, value);
    } else {
      // only interpolate scalars and functions;
      // nested directives apply to children
      if (typeof directives[key] !== 'object') {
        if (!interpolated) interpolated = {};
        interpolated[key] = access(directives[key], data, node);
      }
    }
  }
  if (interpolated) {
    tagalong(node, interpolated);
  }
}

function expandKeys(obj) {
  var expanded = {};
  for (var key in obj) {
    if (key.indexOf('.') > 0) {
      var bits = key.split('.');
      var value = obj[key];
      var d = expanded;
      while (bits.length) {
        d = d[bits.shift()] = bits.length ? {} : value;
      }
    } else {
      expanded[key] = obj[key];
    }
  }
  return expanded;
}

},{}]},{},[1]);
