import numeral from 'numeral'

export function useNumberFormatter() {
  return {
    toDollar: (value) => numeral(value).format('$0,0'),
    toK: (value) => numeral(value).format('$0a'),
    toPercent: (value) => numeral(value).format('0%'),
    toNumber: (value) => numeral(value).format('0,0'),
  }
}