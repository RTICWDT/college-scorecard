var tito = require('tito');
var ss = require('simple-statistics');
var yaml = require('js-yaml');

var read = tito.createReadStream('csv');
var write = tito.createWriteStream('csv');

var valuesByColumn = {};

var columns = {
  'SAT_avg': 'SAT_avg',

  'net_price_public': 'NPT4_PUB',
  /*
  'net_price_public_income1': 'NPT41_PUB',
  'net_price_public_income2': 'NPT42_PUB',
  'net_price_public_income3': 'NPT43_PUB',
  'net_price_public_income4': 'NPT44_PUB',
  'net_price_public_income5': 'NPT45_PUB',
  */

  'net_price_private': 'NPT4_PRIV',
  /*
  'net_price_private_income1': 'NPT41_PRIV',
  'net_price_private_income2': 'NPT42_PRIV',
  'net_price_private_income3': 'NPT43_PRIV',
  'net_price_private_income4': 'NPT44_PRIV',
  'net_price_private_income5': 'NPT45_PRIV',
  */

  'four_years': 'C150_4',
  'lt_four_years': 'C150_L4',
  'median_earnings': '2011.earnings.10_yrs_after_entry.median',

  'retention_rate': function(d) {
    with (d) {
      return ((UGDS * (PPTUG_EF || PPTUG_EF2) * (RET_PT4 || RET_PTL4)) + ((UGDS-(UGDS * (PPTUG_EF || PPTUG_EF2))) * (RET_FT4 || RET_FTL4))) / UGDS;
    }
  },

  'repayment_rate': 'RPY_3YR_RT_SUPP',

  'median_completer_debt': 'GRAD_DEBT_MDN_SUPP',
  'median_monthly_loan': 'GRAD_DEBT_MDN10YR_SUPP',

  'earnings_gt_25k': '2011.earnings.6_yrs_after_entry.percent_greater_than_25000',
};

for (var dest in columns) {
  valuesByColumn[dest] = [];
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
    for (var dest in columns) {
      var src = columns[dest];
      var value = number(typeof src === 'function'
        ? src.call(this, d, dest)
        : d[src]);
      valuesByColumn[dest].push(value);
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
