const webpack = require('webpack');
const client = require('./client');

function replaceLoaders(item) {
  if (typeof item.loader === 'string') {
    item.loader = item.loader.replace(/&presets\[\]=react-hmre/, ''); // eslint-disable-line
  }
}

client.debug = false;
client.devtool = null;

// Remove hot module loader
client.plugins = client.plugins.filter(p => !(p instanceof webpack.HotModuleReplacementPlugin));

// Remove React HMRE preset
client.module.loaders.forEach(replaceLoaders);

Object.keys(client.entry).forEach(name => {
  client.entry[name].filter(p => !p.match(/webpack-hot-middleware/));
});

// Add uglify and dedupe
client.plugins.push(new webpack.optimize.UglifyJsPlugin({
  compress: {
    warnings: false,
  },
}));
client.plugins.push(new webpack.optimize.DedupePlugin());

client.module.preLoaders = [];

module.exports = [client];
