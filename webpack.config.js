const webpack = require('webpack');
const path = require('path');

const root = (folder = '.') => path.join(__dirname, folder);
const { NODE_ENV } = process.env;

// Babel loader
const loaderBabel = {
  test: /\.js$/,
  exclude: /node_modules/,
  include: root('src'),
  loader: 'babel-loader',
  query: {
    presets: [
      ['es2015', { modules: false }],
      'react',
      'stage-0',
    ],
    plugins: [
      'react-hot-loader/babel',
      'transform-decorators-legacy',
      'transform-runtime',
    ],
  },
};

// Less loader
const loaderLess = {
  test: /\.less$/,
  include: root('src'),
  loaders: [
    'classnames-loader',
    'style-loader',
    {
      loader: 'css-loader',
      query: {
        modules: true,
        importLoaders: 1,
        localIdentName: '[name]_[local]_[hash:base64:5]',
      },
    },
    'postcss-loader',
    'less-loader',
  ],
};

const loaderFile = {
  test: /\.(woff2?|svg|jpe?g|png|gif|ico)$/,
  loader: 'file-loader',
};

const loaders = [
  loaderBabel,
  loaderLess,
  loaderFile,
  { test: /\.json$/, loader: 'json-loader' },
];

const plugins = [
  new webpack.DefinePlugin({
    WEBPACK_ENV: JSON.stringify(NODE_ENV),
    NODE_ENV: JSON.stringify(NODE_ENV),
    __CLIENT__: 'true',
  }),
];

const config = {

  cache: true,

  devtool: 'source-map',

  entry: {
    main: [
      'babel-polyfill',
      'react-hot-loader/patch',
      './src/client.js',
    ],
  },

  output: {
    path: root('build'),
    filename: '[name].bundle.js',
    sourceMapFilename: '[name].map',
    chunkFilename: '[id].chunk.js',
  },

  resolve: {
    extensions: ['.js', '.json', '.less'],
    modules: [
      path.resolve(root('src')),
      'node_modules',
    ],
  },

  module: {
    loaders,
  },

  plugins,
};

// production
if (NODE_ENV === 'production') {

  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true,
        warnings: false,
      },
      comments: false,
    })
  );

  config.plugins.push(
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    })
  );

  config.devtool = undefined;
}

module.exports = config;
