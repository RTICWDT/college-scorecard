const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
  mode: "development",
  entry: {
    picc: './js/src/picc.js',
    app: './js/src/app.js'
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/js',
    library: "picc",
    libraryTarget: "umd"
  },
  // For template compiler.
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
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