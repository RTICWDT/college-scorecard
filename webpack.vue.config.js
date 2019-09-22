const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

module.exports = {
  mode: "development",
  entry: './js/src/app.js',
  output: {
    filename: 'app.js',
    path: __dirname + '/js',
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
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: '../css/fonts/'
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
          // {
          //   loader: 'sass-loader',
          //   // Requires sass-loader@^8.0.0
          //   options: {
          //     implementation: require('sass'),
          //     sassOptions: {
          //       fiber: require('fibers'),
          //     },
          //   },
          // },
        ],
      },
    ]
  },
  watchOptions: {
    ignored: /node_modules/
  },
  plugins: [
    new VueLoaderPlugin(),
    new VuetifyLoaderPlugin()
  ]
};