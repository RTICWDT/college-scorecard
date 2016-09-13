var picc = require('../../js/src/picc');
var assert = require('assert');

describe('picc.access', function() {

  describe('picc.access.retentionRate()', function() {

    it('uses the four_year.full_time retention rate if it exists', function() {
      var value = picc.access.retentionRate({
        2014: {
          student: {
            retention_rate: {
              four_year: {
                full_time: 1.0
              }
            }
          }
        }
      });
      assert.equal(value, 1.0);
    });

    it('uses the lt_four_year.full_time retention rate if 4-year doesn\'t exist', function() {
      var value = picc.access.retentionRate({
        2014: {
          student: {
            retention_rate: {
              four_year: {
                full_time: null
              },
              lt_four_year: {
                full_time: 0.5
              }
            }
          }
        }
      });
      assert.equal(value, 0.5);
    });
  });

});
