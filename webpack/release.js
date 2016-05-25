const webpack = require('webpack');
const client = require('./client');
const server = require('./server');

function replaceLoaders(item) {
  if (typeof item.loader === 'string') {
    item.loader = item.loader.replace(/&presets\[\]=react-hmre/, ''); // eslint-disable-line
  }
}

client.debug = server.debug = false;
client.devtool = server.devtool = null;

// Remove hot module loader
client.plugins = client.plugins.filter(p => !(p instanceof webpack.HotModuleReplacementPlugin));

// Remove React HMRE preset
client.module.loaders.forEach(replaceLoaders);
server.module.loaders.forEach(replaceLoaders);

client.entry = client.entry.filter(p => !p.match(/webpack-hot-middleware/));

// Add uglify and dedupe
client.plugins.push(new webpack.optimize.UglifyJsPlugin({
  compress: {
    warnings: false,
  },
}));
client.plugins.push(new webpack.optimize.DedupePlugin());

client.module.preLoaders = [];
server.module.preLoaders = [];

// Remove source maps
server.plugins = server.plugins.filter(p => !(p instanceof webpack.BannerPlugin));

module.exports = [server, client];
