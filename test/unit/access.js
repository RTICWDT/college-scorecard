var picc = require('../../js/src/picc');
var assert = require('assert');

describe('picc.access', function() {

  describe('picc.access.retentionRate()', function() {

    it('uses the four_year.full_time_pooled retention rate if it exists', function() {
      var value = picc.access.retentionRate({
        latest: {
          student: {
            retention_rate_suppressed: {
              four_year: {
                full_time_pooled: 1.0
              }
            }
          }
        }
      });
      assert.equal(value, 1.0);
    });

    it('uses the lt_four_year.full_time_pooled retention rate if 4-year doesn\'t exist', function() {
      var value = picc.access.retentionRate({
        latest: {
          student: {
            retention_rate_suppressed: {
              four_year: {
                full_time_pooled: null
              },
              lt_four_year: {
                full_time_pooled: 0.5
              }
            }
          }
        }
      });
      assert.equal(value, 0.5);
    });
  });

  // fake data for largestPrograms
  let reporterPrograms = {
    latest: {
      cost: {
        program_reporter: {
          program_1: {
            cip_6_digit: {
              full_program: 10000,
              annualized: 5000
            }
          },
          program_2: {
            cip_6_digit: {
              full_program: 20000,
              annualized: 1000
            }
          }
        },
        avg_net_price: {
          overall: 15000
        }
      },
      academics: {
        program_reporter: {
          programs_offered: 2,
          program_1: {
            cip_6_digit: {
              title: 'Registered Nursing/Registered Nurse',
              avg_month_completion: 18
            }
          },
          program_2: {
            cip_6_digit: {
              title: 'Medical/Clinical Assistant',
              avg_month_completion: 30
            }
          }
        }
      }
    }
  };

  describe('picc.access.largestProgramsReported()', function() {

    it('returns largest programs with full_program cost by default', function() {
      var programs = picc.access.largestProgramsReported(reporterPrograms);
      assert.equal(programs[0].program, 'Registered Nursing / Registered Nurse'); // slashes have spaces added, ' / '
      assert.equal(programs[0].cost, '$10,000');
      assert.equal(programs[0].duration, 18);
    })

    it('returns largest programs with annualized costs if specified', function() {
      var programs = picc.access.largestProgramsReported(reporterPrograms, 'annualized');
      assert.equal(programs[0].cost, '$5,000');
    })

    it('returns the largest programs costs for both `full_program` and `annualized` in nested costs key', function() {
      var programs = picc.access.largestProgramsReported(reporterPrograms, 'annualized');
      assert.equal(programs[0].costs['full_program'], '$10,000');
      assert.equal(programs[0].costs['annualized'], '$5,000');
    })

    it('returns multiple largest programs', function() {
      var programs = picc.access.largestProgramsReported(reporterPrograms);
      assert.equal(programs.length, 2);
    })
  })

  describe('picc.access.largestProgramReported() or cost after aid for largest program', function() {

    it('returns the largest program with average annual cost as cost key', function() {
      var program = picc.access.largestProgramReported(reporterPrograms);
      assert.equal(program.cost, '$15,000');
    })

    it('returns the whether the program isYearLong', function() {
      // multi-year program
      var program = picc.access.largestProgramReported(reporterPrograms);
      assert.deepStrictEqual(program.isYearLong, false);
      assert(program.costDescription.match(/per year on average/), 'a multi-year program should return the respective description' );

      // make largest program year long
      var yearLongProgramData = {...reporterPrograms};
      yearLongProgramData.latest.cost.program_reporter.program_1.cip_6_digit.full_program = 12000;
      yearLongProgramData.latest.cost.program_reporter.program_1.cip_6_digit.annualized   = 12000;

      var yearLongProgram = picc.access.largestProgramReported(yearLongProgramData);
      assert.deepStrictEqual(yearLongProgram.isYearLong, true);
      assert(yearLongProgram.costDescription.match(/month program/), 'a single year program should return the respective description' );
    })
  })

});
