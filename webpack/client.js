const make = require('./make');

module.exports = make({
  entry: {
    client: './src/client.js',
  },
  lazy: true,
  hot: true,
  target: 'web',
  offline: (process.env.NODE_ENV === 'production'),
  offlineCache: [
    '/about',
  ],
});
