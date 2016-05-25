const make = require('./make');

module.exports = make({
  entry: './src/server.js',
  target: 'node',
});
