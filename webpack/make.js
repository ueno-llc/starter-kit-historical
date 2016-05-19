const path = require('path');
const webpack = require('webpack');

module.exports = function make(options) {

  const isClient = (options.target === 'web');
  const isHot = isClient && (options.hot === true);
  const entries = ['babel-polyfill'];
  const entry = {};

  // Init plugins with provide, define and no errors
  const plugins = [
    new webpack.ProvidePlugin({
      React: 'react',
    }),
    new webpack.NoErrorsPlugin(),
  ];

  // Styles loader
  const loader = {
    css: 'css-loader?modules&importLoaders=1&localIdentName=[name]_[local]_[hash:base64:5]',
    babel: 'babel-loader?presets[]=react&presets[]=es2015&presets[]=stage-0'
    + `${isHot ? '&presets[]=react-hmre' : ''}`,
  };

  // Hot Loading
  if (isHot) {

    // Add hot middleware
    entries.push('webpack-hot-middleware/client');

    // Add HMRE plugin
    plugins.push(new webpack.HotModuleReplacementPlugin());
  }

  // Set entry point
  if (options.entry) {
    Object.keys(options.entry).forEach(name => {
      entry[name] = entries.concat(options.entry[name]);
    });
  }

  const config = {
    context: path.join(__dirname, '../'),
    debug: options.debug || true,
    devtool: options.devtool || (isClient ? 'cheap-module-eval-source-map' : 'eval-source-map'),
    target: options.target || 'web',

    entry,

    plugins,

    output: {
      path: path.join(__dirname, '..', 'build'),
      filename: '[name].js',
      publicPath: '/',
      libraryTarget: (isClient ? 'var' : 'commonjs2'),
    },

    resolve: {
      modulesDirectories: ['./node_modules', './src/components', './src'],
      extensions: ['', '.js', '.json', '.css', '.scss'],
    },

    module: {
      preLoaders: [],
      loaders: [{
        test: /\.js/,
        loader: loader.babel,
      }, {
        test: /\.css$/,
        loader: (isClient ? `style-loader!${loader.css}` : ExtractTextPlugin.extract('style-loader', loader.css)), // eslint-disable-line
      }, {
        test: /\.scss$/,
        loader: (isClient ? `style-loader!${loader.css}!sass-loader` : ExtractTextPlugin.extract('style-loader', `${loader.css}!sass-loader`)), // eslint-disable-line
      }, {
        test: /\.(woff2?|svg|jpe?g|png|gif|ico)$/,
        loader: 'url?limit=10000',
      }, {
        test: /\.json$/,
        loader: 'json-loader',
      }],
    },
  };

  // Skip node_modules
  config.module.loaders.forEach(l => {
    l.exclude = /node_modules/; // eslint-disable-line
  });

  if (options.eslint !== false) {
    config.module.preLoaders.push({
      test: /\.js$/,
      loader: 'eslint-loader',
      exclude: /node_modules/,
    });
  }

  return config;
};
