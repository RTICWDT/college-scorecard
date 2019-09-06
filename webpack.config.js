const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
  mode: "development",
  entry: './js/src/picc.js',
  output: {
    path: path.join(__dirname, "js"),
    filename: 'picc.js',
    library: "picc",
    libraryTarget: "umd"
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ]
};