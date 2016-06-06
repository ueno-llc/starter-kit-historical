const make = require('./make');

module.exports = make({
  entry: {
    server: './src/server.js',
  },
  target: 'node',
});
