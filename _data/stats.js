var tito = require('tito');
var ss = require('simple-statistics');
var yaml = require('js-yaml');

var read = tito.createReadStream('csv');
var write = tito.createWriteStream('csv');

var valuesByColumn = {};

var columns = {
  'SAT_avg':        'SAT_avg',

  'NPT4_PUB':       'net_price_public',
  'NPT41_PUB':      'net_price_public_income1',
  'NPT42_PUB':      'net_price_public_income2',
  'NPT43_PUB':      'net_price_public_income3',
  'NPT44_PUB':      'net_price_public_income4',
  'NPT45_PUB':      'net_price_public_income5',

  'NPT4_PRIV':      'net_price_private',
  'NPT41_PRIV':     'net_price_private_income1',
  'NPT42_PRIV':     'net_price_private_income2',
  'NPT43_PRIV':     'net_price_private_income3',
  'NPT44_PRIV':     'net_price_private_income4',
  'NPT45_PRIV':     'net_price_private_income5',

  'C150_4':         'completion_rate_4',
  'C150_L4':        'completion_rate_l4',
  'earn_2002_p10':  'median_earnings'
};

for (var src in columns) {
  valuesByColumn[columns[src]] = [];
}

var stats = {
  min: ss.min,
  max: ss.max,
  median: ss.median
};

process.stdin
  .pipe(read)
  .on('data', function(d) {
    // console.log('read row:', JSON.stringify(d).substr(0, 100), '...');
    for (var src in columns) {
      var value = number(d[src]);
      valuesByColumn[columns[src]].push(value);
    }
  })
  .on('end', output);

function output() {
  var result = {};
  for (var column in valuesByColumn) {
    var values = valuesByColumn[column]
      .filter(function(n) { return n !== null; })
      .sort(ascending);
    if (values[0] === values[values.length - 1]) {
      console.warn('value for "%s":', column, values[0]);
    } else {
      console.warn('values for "%s":', column,
                   values.slice(0, 3), '...',
                   values.slice(-3));
    }
    result[column] = getStats(values);
  }

  var out = process.stdout;
  out.write(yaml.dump(result));
}

function getStats(values) {
  // values = values.filter(function(d) { return !isNaN(d); });
  var result = {};
  for (var stat in stats) {
    var value = stats[stat](values);
    result[stat] = isNaN(value) ? null : round(value);
  }
  return result;
}

function number(value) {
  return value === 'NULL' || isNaN(value)
    ? null
    : +value;
}

function round(n) {
  return n % 1 ? +n.toFixed(2) : n;
}

function ascending(a, b) {
  return a > b ? 1 : a < b ? -1 : 0;
}
