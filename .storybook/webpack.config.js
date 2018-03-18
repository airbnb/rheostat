const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        loaders: ["style-loader", "css-loader"],
        include: path.resolve(__dirname, '../')
      }
    ]
  },
  externals: {
    'jsdom': 'window',
    'cheerio': 'window',
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': 'window',
    'react/addons': true
  }
}
