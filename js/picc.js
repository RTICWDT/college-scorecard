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
        return function(d) {
          var value = d[key];
          return (!value && empty)
            ? empty.call(d)
            : fmt.call(d, +value, key);
        };
      };
    };

    return {
      dollars: formatter('$,d', '$0'),
      percent: formatter('%.0f', '--'),
      number: formatter(',d', '0'),
      plural: function(key, singular, plural) {
        if (!plural) plural = singular + 's';
        return function(d) {
          return d[key] == 1 ? singular : plural;
        };
      }
    };
  })();

})(this);
