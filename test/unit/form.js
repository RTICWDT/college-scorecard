/* jshint esnext: true */
/* globals require, process, global */
var picc = require('../../js/src/picc');
var assert = require('assert');
var extend = require('extend');

// expected default parameters
const EXPECTED_DEFAULTS = {
  'id__range': '..999999',
  'latest.academics.program_available.assoc_or_bachelors_or_certificate': true,
  'latest.student.size__range': '0..',
  'school.degrees_awarded.predominant__range': '1..3',
  'school.operating': 1
};

/**
 * Merge defaults into a set of parameters and optionally exclude one
 * or more named parameters from the result.
 *
 * @param Object  params    an object literal of API parameters
 * @param Array   [except]  an optional list of keys to exclude from
 *                          the resulting object
 * @return Object
 */
var fromDefaults = function(params, except) {
  params = extend({}, EXPECTED_DEFAULTS, params);
  if (except) {
    except.forEach(function(key) {
      delete params[key];
    });
  }
  return params;
};

describe('picc.form', function() {

  /**
   * picc.form.prepareParams() is the function that we pass the search
   * form input values to to generate the right API parameters.
   */
  describe('prepareParams()', function() {
    var prep = picc.form.prepareParams;

    it('defaults: `size >= 0`, `preddeg = 1..3`, id = ..999999 `curroper = 1`', function() {
      assert.deepEqual(prep({}), EXPECTED_DEFAULTS);
    });

    it('uses "school.name" instead of "name"', function() {
      assert.deepEqual(prep({name: 'foo'}), fromDefaults({
        'school.name': 'foo'
      }));
    });

    it('searches for associates degrees', function() {
      assert.deepEqual(prep({degree: 'a'}), fromDefaults({
        'latest.academics.program_available.assoc': true
      }, [ // omit
        'latest.academics.program_available.assoc_or_bachelors_or_certificate'
      ]));
    });

    it('searches for bachelors degrees', function() {
      assert.deepEqual(prep({degree: 'b'}), fromDefaults({
        'latest.academics.program_available.bachelors': true
      }, [ // omit
        'latest.academics.program_available.assoc_or_bachelors_or_certificate'
      ]));
    });

    it('searches for certificates awards', function() {
      assert.deepEqual(prep({degree: 'c'}), fromDefaults({
        'latest.academics.program_available.certificate': true
      }, [ // omit
        'latest.academics.program_available.assoc_or_bachelors_or_certificate'
      ]));
    });

    it('treats a distance of string "0" as empty', function() {
      assert.deepEqual(prep({zip: '12345', distance: '0'}), fromDefaults({
        'school.zip': '12345'
      }));
    });

    it('treats a non-zero distance as not empty', function() {
      assert.deepEqual(prep({zip: '12345', distance: '10'}), fromDefaults({
        'zip': '12345',
        'distance': '10'
      }));
    });

    xdescribe('majors', function() {

      it('can query associates degrees', function() {
        assert.deepEqual(prep({
          degree: 'a',
          major: 'science_technology'
        }), fromDefaults({
          'school.degrees_awarded.predominant': '2',
          'latest.academics.program.assoc.science_technology__range': '1..'
        }, [
          'school.degrees_awarded.predominant__range'
        ]));
      });

    });

  });

});
