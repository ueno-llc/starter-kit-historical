const make = require('./make');

module.exports = make({
  entry: './src/client.js',
  hot: true,
  target: 'web',
  routes: [
    '/about',
  ],
});
