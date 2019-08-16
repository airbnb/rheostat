const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.css?$/,
        use: ['style-loader', 'raw-loader'],
        include: [
          path.resolve(__dirname, '../'),
        ],
      },
    ],
  },
};
