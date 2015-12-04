const path = require('path');
const webpack = require('webpack');

module.exports = {
  devtool: 'eval',
  resolve: {
    alias: {
      COSMOS_COMPONENTS: path.join(__dirname, 'examples'),
      COSMOS_FIXTURES: path.join(__dirname, 'fixtures'),
    },
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/static/',
  },
  entry: [
    'webpack-hot-middleware/client?reload=true',
    'cosmos-js',
  ],
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ],
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loader: 'babel',
      exclude: /(node_modules|bower_components)/,
    }],
  },
};
