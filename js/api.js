---
# // with frontmatter, we can use {{ variable }} template tags
---
(function(exports) {
  
  var API = {
    url: '{{ site.api.baseurl }}',
    key: '{{ site.api.key }}'
  };

  API.get = function(uri, params, done) {
    console.debug('[API] get("%s", %s)', uri, JSON.stringify(params));
    if (arguments.length === 2) {
      done = params;
    } else if (params) {
      if (typeof params === 'object') {
        if (API.key) params.api_key = API.key;
        params = querystring.stringify(params);
      } else if (API.key) {
        params += '&api_key=' + API.key;
      }
      uri = join([uri, params], '?');
    }
    var url = join([API.url, uri], '/');
    console.debug('[API] get: "%s"', url);
    return d3.json(url, done);
  };

  API.load = function(uri, done) {
    var ext = uri.split('.').pop();
    var load = d3[ext || 'json'];
    return load(uri, done);
  };

  API.endpoint = function(uri) {
    return function endpoint(params, done) {
      return API.get(uri, params, done);
    };
  };

  var schoolEndpoint = 'school/';
  var idField = 'id';

  API.search = API.endpoint(schoolEndpoint);

  API.getSchool = function(id, done) {
    var data = {};
    data[idField] = id;
    return API.get(schoolEndpoint, data, function(error, res) {
      return error || !res.total
        ? done(error ? error.responseText : 'No such school found.')
        : done(null, res.results[0]);
    });
  };

  exports.API = API;

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

})(this);
