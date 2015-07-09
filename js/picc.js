(function(exports) {

  var picc = exports.picc = {};

  /**
   * This is our format generator. Its methods are format generators for
   * specific types of values, and they take a key in the data object to
   * format. For instance:
   *
   * @example
   * var formatFoo = format.percent('foo');
   * formatFoo({foo: 0.5}) -> '50%'
   */
  picc.format = (function() {
    var formatter = function(fmt, _empty) {
      if (typeof fmt === 'string') {
        fmt = d3.format(fmt);
      }
      return function(key, empty) {
        empty = empty || _empty;
        if (typeof empty === 'string') {
          empty = d3.functor(empty);
        }
        key = picc.accessor(key);
        return function(d) {
          var value = key.call(this, d);
          return (!value && empty)
            ? empty.call(d)
            : fmt.call(d, +value, key);
        };
      };
    };

    var map = function(keys, fallback) {
      return function(key) {
        return keys[key] || fallback;
      };
    };

    var range = function(ranges) {
      var len = ranges.length;
      var i;
      return function(value) {
        value = +value;
        for (i = 0; i < len; i++) {
          var range = ranges[i];
          if (value >= range[0] && value < range[1]) {
            return range[2];
          }
        }
      };
    };

    return {
      // format.dollars('x')({x: 1000}) === '$1,000'
      dollars: formatter('$,d', '$0'),
      // format.percent('y')({x: 1000}) === '$1,000'
      percent: formatter('%.0f', '--'),
      number: formatter(',d', '0'),

      // format.plural('x', 'foo')({x: 1}) === 'foo'
      // format.plural('x', 'foo')({x: 2}) === 'foos'
      plural: function(key, singular, plural) {
        if (!plural) plural = singular + 's';
        return function(d) {
          return d[key] == 1 ? singular : plural;
        };
      },

      // format.map('x', {1: 'a'})({x: 1}) === 'a'
      map: function(key, values, empty) {
        return formatter(map(values))
          .call(this, key, empty);
      },

      // format.control('control')({control: 1}) === 'Public'
      // format.control('control')({control: 2}) === 'Private non-profit'
      control: formatter(map({
        '1': 'Public',
        '2': 'Private non-profit',
        '3': 'Private for-profit'
      }, 'unknown')),

      // format.preddeg('deg')({deg: 2}) === '2-year'
      // format.preddeg('deg')({deg: 3}) === '4-year'
      preddeg: formatter(map({
        '2': '2-year',
        '3': '4-year'
      }), ''),

      sizeCategory: formatter(range([
        [0, 2000, 'Small'],
        [2000, 15000, 'Medium'],
        [15000, Infinity, 'Large']
      ])),

      // format.locale('locale')({locale: 11}) === 'City: Large'
      locale: formatter(map({
        '11': 'City: Large',
        '12': 'City: Midsize',
        '13': 'City: Small',
        '21': 'Suburb: Large',
        '22': 'Suburb: Midsize',
        '23': 'Suburb: Small',
        '31': 'Town: Fringe',
        '32': 'Town: Distant',
        '33': 'Town: Remote',
        '41': 'Rural: Fringe',
        '42': 'Rural: Distant',
        '43': 'Rural: Remote'
      }, 'unknown'))
    };
  })();

  picc.accessor = function(key) {
    return (typeof key === 'function')
      ? key
      : function(d) { return d[key]; };
  };

})(this);
