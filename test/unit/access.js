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

  describe('picc.access.largestProgramsReported()', function() {

    it('returns largest programs with full_program cost by default', function() {
      var programs = picc.access.largestProgramsReported({
        latest: {
          cost: {
            program_reporter: {
              cip_1: {
                full_program: 10000,
                annualized_by_academic_yr: 5000
              }
            }
          },
          academics: {
            program_reporter: {
              cip_1: {
                cip_description: 'Registered Nursing/Registered Nurse',
                avg_duration_by_month: 18
              }
            }
          }
        }
      });
      assert.equal(programs[0].program, 'Registered Nursing / Registered Nurse'); // slashes have spaces added, ' / '
      assert.equal(programs[0].cost, '$10,000');
      assert.equal(programs[0].duration, 18);
    })

    it('returns largest programs with annualized costs if specified', function() {
      var programs = picc.access.largestProgramsReported({
        latest: {
          cost: {
            program_reporter: {
              cip_1: {
                full_program: 10000,
                annualized_by_academic_yr: 5000
              }
            }
          },
          academics: {
            program_reporter: {
              cip_1: {
                cip_description: 'Registered Nursing/Registered Nurse',
                avg_duration_by_month: 18
              }
            }
          }
        }
      }, 'annualized_by_academic_yr');
      assert.equal(programs[0].cost, '$5,000');
    })

    it('returns multiple largest programs', function() {
      var programs = picc.access.largestProgramsReported({
        latest: {
          cost: {
            program_reporter: {
              cip_1: {
                full_program: 10000,
                annualized_by_academic_yr: 5000
              },
              cip_2: {
                full_program: 20000,
                annualized_by_academic_yr: 1000
              }
            }
          },
          academics: {
            program_reporter: {
              cip_1: {
                cip_description: 'Registered Nursing/Registered Nurse',
                avg_duration_by_month: 18
              },
              cip_2: {
                cip_description: 'Medical/Clinical Assistant',
                avg_duration_by_month: 30
              }
            }
          }
        }
      }, 'annualized_by_academic_yr');
      assert.equal(programs.length, 2);
    })
  })

});
