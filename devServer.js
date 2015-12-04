const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.playground');

const PORT = 8989;

const compiler = webpack(webpackConfig);
const app = express();

app.use('/css', express.static('css'));

app.use(require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  noInfo: true,
}));

app.use(require('webpack-hot-middleware')(compiler));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, 'localhost', function (err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Listening at localhost:' + PORT);
});
