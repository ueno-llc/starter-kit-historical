const make = require('./make');

module.exports = make({
  entry: {
    client: './src/client.js',
  },
  hot: true,
  target: 'web',
});
