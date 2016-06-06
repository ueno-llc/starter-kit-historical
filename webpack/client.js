const make = require('./make');

module.exports = make({
  entry: './src/client.js',
  hot: true,
  target: 'web',
  offline: (process.env.NODE_ENV === 'production'),
  offlineCache: [
    '/about',
  ],
});
