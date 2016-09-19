const webpack = require('webpack');
const client = require('./client');
const server = require('./server');

// Add uglify and dedupe
client.plugins.push(new webpack.optimize.UglifyJsPlugin({
  compress: {
    warnings: false,
  },
  mangle: {
    except: ['r'],
    keep_fnames: true,
  },
}));
client.plugins.push(new webpack.optimize.DedupePlugin());

// Remove source maps
server.plugins = server.plugins.filter(p => !(p instanceof webpack.BannerPlugin));

module.exports = [server, client];
