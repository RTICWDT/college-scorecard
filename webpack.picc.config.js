const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
  mode: "development",
  entry: './js/src/picc.js',
  output: {
    filename: 'picc.js',
    path: __dirname + '/js',
    library: "picc",
    libraryTarget: "umd"
  }
};