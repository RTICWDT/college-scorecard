var tito = require('tito');
var ss = require('simple-statistics');
var yaml = require('js-yaml');

var read = tito.createReadStream('csv');
var write = tito.createWriteStream('csv');

var valuesByColumn = {};

var columns = {
  'NPT4_PUB':   'average_price_public',
  'NPT4_PRIV':  'average_price_private',
  'SAT_avg':    'SAT_avg'
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
      var value = nullify(d[src]);
      valuesByColumn[columns[src]].push(value);
    }
  })
  .on('end', output);

function output() {
  var result = {};
  for (var column in valuesByColumn) {
    result[column] = getStats(valuesByColumn[column]);
  }

  var out = process.stdout;
  out.write(yaml.dump(result));
}

function getStats(values) {
  values = values.filter(function(d) { return !isNaN(d); });
  var result = {};
  for (var stat in stats) {
    result[stat] = values.length ? stats[stat](values) : null;
  }
  return result;
}

function nullify(value) {
  return value === 'NULL' ? null : +value;
}
