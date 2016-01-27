/* jshint esnext: true */
/* globals require, process, global */
var picc = require('../../js/src/picc');
var d3 = require('../../js/src/d3');
var assert = require('assert');
var sinon = require('sinon');

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
    });

  });

});
