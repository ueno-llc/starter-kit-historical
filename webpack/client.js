const make = require('./make');

module.exports = make({
  entry: {
    client: './src/client.js',
  },
  lazy: true,
  hot: true,
  target: 'web',
});
