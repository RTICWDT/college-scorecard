const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
  mode: "development",
  entry: './js/src/picc.js',
  output: {
    filename: 'picc.js',
    path: __dirname + '/js',
    library: "picc",
    libraryExport: "default",
    libraryTarget: "umd"
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          // options: {
          //   presets: ['@babel/preset-env']
          // }
        }
      }
    ]
  }
};