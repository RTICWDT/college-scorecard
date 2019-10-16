// Migrate required PICC functionality here.
'use strict';

// var d3 = require('d3');
// var async = require('async');

import d3 from 'd3';
import async from 'async';
import querystring from 'querystring';

// Common API Errors
const apiErrors = {
  NO_SCHOOL_ID: 'No school ID was provided.',
  NO_SUCH_SCHOOL: 'No school found.',
  NO_SCHOOLS_TO_COMPARE: 'No schools selected to compare.'
};

let picc = {};

/**
 * picc.API is a singleton object with methods to query the open-data-maker
 * JSON API. Its base URL (`picc.API.url`) and API key (`picc.API.key`) are
 * filled in by Jekyll.
 *
 * All of the API's methods are asynchronous, and use "error-first"
 * (Node.js-style) callbacks:
 *
 * @example
 * picc.API.get('school', {id: 100}, function(error, res) {
  *   // error is an XMLHttpRequest object
  *   if (error) return alert("Error: " + error.responseText);
  *   console.log('got data:', res);
  * });
  *
  */
const API = (function() { 
  
  // var API = {
  //    url: '/api/v1/',
  //    key: ''
  // };
 
   // local alias for errors
   var errors = apiErrors;
 
   // the API endpoint (URI) at which to find school data
   var schoolEndpoint = 'schools/';
 
   // the school's primary key field
   var idField = 'id';
 
   /**
    * get an endpoint with optional query string parameters, and call the
    * `callback` function when the response is completed.
    *
    * @param {String}          uri       the URI to request, relative to
    *                                    `picc.API.url`
    * @param {String|Object?}  params    query string
    * @param {Function}        callback  the error-first callback:
    *                                    `callback(error, response)`
    * @return {Object} the d3.xhr() wrapper object
    */
   API.get = function(uri, params, done, url, apiKey) {
     // console.info('[API] get("%s", %s)', uri, JSON.stringify(params));
     if (arguments.length === 2) {
       done = params;
       params = addAPIKey({});
     } else if (params) {
       params = addAPIKey(params);
     }
     if (params) uri = join([uri, params], '?');

     var url = url ? join([url, uri], '/') : uri;
     console.info('[API] get: "%s"', url);

     return d3.json(url, function(error, data) {
       if (data && data.errors && data.errors.length) {
         error = data.errors[0];
       }
       return done(error, data);
     });
   };
 
   /**
    * Generate an endpoint function that hits a fixed URI.
    *
    * @example
    * API.search = API.endpoint('search/');
    *
    * @param {String}    uri
    * @return {Function} a function that calls `picc.API.get(uri)` with the
    *                    provided parameters and callback.
    */
   API.endpoint = function(uri) {
     return function endpoint(params, done) {
       return API.get(uri, params, done);
     };
   };
 
   // the search endpoint
   API.search = API.endpoint(schoolEndpoint);
 
   /**
    * A helper function to get data for a single school.
    *
    * @param {String|Number} id - The school primary key identifier
    * @param {object}  params - Optional query params to append to the school's query;
    *                            most useful for a `fields` query
    * @param {Function} done - The callback function, as in
    *                            `picc.API.get()`, that receives a single
    *                            school's data as its second parameter on
    *                            success.
    */
   API.getSchool = function(id, params, done) {
     var queryParams = {};
     if (arguments.length === 2) {
       done = params;
     } else if (arguments.length === 3) {
       queryParams = picc.data.extend(queryParams, params);
     }
     queryParams[idField] = id;
     return API.get(schoolEndpoint, queryParams, function(error, res) {
       if (error || !res.metadata.total) {
         return done(error
           ? error.responseText || error || errors.NO_SUCH_SCHOOL
           : errors.NO_SUCH_SCHOOL);
       } else if (res.total > 1) {
         console.warn('More than one school found for ID: "' + id + '"');
       }
       return done(null, res.results[0]);
     });
   };
 
   /**
    * Get multiple URIs specified as an object, and call the `callback`
    * function with a similarly structured object containing data for each
    * URI.
    *
    * @example
    * picc.API.getAll({
    *   metadata: 'data.json',
    *   school: [picc.API.getSchool, 100]
    * }, function(error, data) {
    *   console.log('got metadata:', data.metadata);
    *   console.log('got school:', data.school);
    * });
    *
    * @param {Object}    urls      a map of properties to either URIs or
    *                              Arrays, in which the first element is the
    *                              function to call and the rest are arguments.
    * @param {Function}  callback  the callback function:
    *                              `callback(error, data)`
    */
   API.getAll = function(urls, done) {
     Object.keys(urls).forEach(function(key) {
       var url = urls[key];
       urls[key] = Array.isArray(url)
         ? function(done) {
           var method = url.shift();
           if (typeof method === 'string') {
             method = API[method];
           }
           url.push(done);
           return method.apply(API, url);
         }
         : function(done) {
           return API.get(url, done);
         };
     });
     // console.log('getAll:', urls);
     return async.parallel(urls, done);
   };
 
   /**
    * add the API key (if set) to either an object or string of query
    * parameters, and return the parameters as a query string.
    *
    * @param {String|Object} params
    * @return {String}
    */
   function addAPIKey(params) {
     var param = 'api_key';
     if (typeof params === 'object') {
       if (API.key) params[param] = API.key;
       // collapse arrays into comma-separated strings
       // per the API
       collapseArrays(params);
       params = querystring.stringify(params);
     } else if (API.key) {
       params += ['&', param, '=', API.key].join('');
     }
     return params;
   }
 
   /**
    * Join an array of strings with a `glue` string and de-dupe repeated glue
    * strings.
    *
    * @param {Array} list
    * @param {String} glue
    * @return {String}
    */
   function join(list, glue) {
     for (var i = 0; i < list.length; i++) {
       var str = String(list[i]);
       if (str.charAt(0) === glue) {
         list[i] = str.substr(1);
       } else if (str.charAt(str.length - 1) === glue) {
         list[i] = str.substr(0, str.length - 1);
       }
     }
     return list.join(glue);
   }
 
   /**
    * Iterate over the keys of an `object` and replace any that have Array
    * values with strings joined with `glue`.
    *
    * @param {Object} obj
    * @param {String?} glue
    * @return {Object} the original object
    */
   function collapseArrays(obj, glue) {
     if (!glue) glue = ',';
     for (var key in obj) {
       if (Array.isArray(obj[key])) {
         obj[key] = obj[key].join(glue);
       }
     }
     return obj;
   }
 
   return API;
 })();


picc.data = {};

picc.data.extend = function(obj, a, b) {
  for (var i = 1, len = arguments.length; i < len; i++) {
    var arg = arguments[i];
    if (typeof arg === 'object') {
      for (var key in arg) obj[key] = arg[key];
    }
  }
  return obj;
};

picc.data.rangify = function(obj, key, values) {
  if (Array.isArray(values)) {
    switch (values.length) {
      case 0:
        values = '';
        break;
      case 1:
        values = values[0];
        break;
    }
  }

  if (!Array.isArray(values)) {
    values = String(values);
    if (values.indexOf('..') > -1) {
      obj[key + '__range'] = values;
    } else if (values) {
      obj[key] = values;
    }
    return obj;
  }

  values = values.map(Number)
    .sort(d3.ascending);

  var range = [values.shift()];
  var ranges = [range];
  while (values.length) {
    var value = values.shift();
    var previous = range[range.length - 1];
    if (value === previous + 1) {
      range.push(value);
    } else {
      ranges.push(range = [value]);
    }
  }

  obj[key + '__range'] = ranges.map(function(range, i) {
    var min = range.shift();
    var max = range.length ? range.pop() : min;
    if (min === max) {
      switch (i) {
        case 0:
          return '..' + min;
        case ranges.length - 1:
          return max + '..';
      }
    }
    return [min, max].join('..');
  }).join(',');

  return obj;
};

picc.data.selectKeys = function(obj, keys) {
  var copy = {};
  keys.forEach(function(key) {
    if (key in obj) {
      copy[key] = obj[key];
    } else {
      console.warn('no such key in source object:', key, obj);
    }
  });
  return copy;
};

const apiGet = API.get;
const apiSearch = API.search;
const apiGetSchool = API.getSchool;
const apiGetAll = API.getAll;

export {apiSearch,apiGetSchool};