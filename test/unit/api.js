/* jshint esnext: true */
/* globals require, process, global */
var picc = require('../../js/src/picc');
var assert = require('assert');
var sinon = require('sinon');
var d3 = require('d3');

describe('picc.API', function() {
  picc.API.url = '';
  picc.API.key = '';

  describe('get()', function() {

    it('knows how to add the API key to requests', function() {
      var spy = sinon.stub(d3, 'json');
      picc.API.key = 'bar';
      var cb = function() { };
      picc.API.get('foo', cb);
      assert.ok(spy.calledWith('foo?api_key=bar'));
      d3.json.restore();
      picc.API.key = '';
    });

  });

  describe('getAll()', function() {

    it('knows how to request multiple schools by id', function() {
      var spy = sinon.stub(d3, 'json');
      var cb = function () {};
      var urls = {
        'foo': [picc.API.getSchool, 'foo'],
        'bar': [picc.API.getSchool, 'bar'],
        'bazz': [picc.API.getSchool, 'bazz'],
      };
      picc.API.getAll(urls, cb);
      assert.ok(spy.calledThrice);
      assert.ok(spy.firstCall.calledWith('schools/?id=foo'));
      assert.ok(spy.secondCall.calledWith('schools/?id=bar'));
      assert.ok(spy.thirdCall.calledWith('schools/?id=bazz'));
      d3.json.restore();
    });

    it('knows how to request multiple schools by id with optional parameters', function() {
      var spy = sinon.stub(d3, 'json');
      var cb = function () {};

      var params = {
        fields: [
          'something',
          'another',
          'thistoo'
        ],
        '_per_page':'1million'
      };

      var urls = {
        'foo': [picc.API.getSchool, 'foo', params],
        'bar': [picc.API.getSchool, 'bar', params],
        'bazz': [picc.API.getSchool, 'bazz', params],
      };

      picc.API.getAll(urls, cb);
      assert.ok(spy.calledThrice);
      assert.ok(spy.firstCall.calledWith('schools/?fields=something%2Canother%2Cthistoo&_per_page=1million&id=foo'));
      assert.ok(spy.secondCall.calledWith('schools/?fields=something%2Canother%2Cthistoo&_per_page=1million&id=bar'));
      assert.ok(spy.thirdCall.calledWith('schools/?fields=something%2Canother%2Cthistoo&_per_page=1million&id=bazz'));
      d3.json.restore();
    });
  });

});
