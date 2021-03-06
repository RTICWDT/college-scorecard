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
    },
    modules: [
      path.resolve('./js/src'),
      path.resolve('./node_modules')
    ]
},
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.m?js$/,
        include: [path.resolve('node_modules/vuetify'),path.resolve('js/src')],
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: '../css/fonts/',
              publicPath: process.env.BASEURL+'/css/fonts/'
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
          'vue-style-loader',
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            // // Requires sass-loader@^8.0.0
            options: {
              //prependData: './sass/_variables.scss',
              implementation: require('sass'),
              sassOptions: {
                fiber: require('fibers'),
              },
            },
          },
          
        ]
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