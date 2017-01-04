const path = require('path');
const util = require('util');
const make = require('./make');
const HappyPack = require('happypack');
const ManifestPlugin = require('webpack-manifest-plugin');
const ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');

const happyThreadPool = HappyPack.ThreadPool({ size: 8 });

const include = path.resolve(__dirname, '..', 'src');

const HAPPY_CACHE = true;
const HAPPY_VERBOSE = true;

function createHappyPlugin(id, loaders) {
  return new HappyPack({
    id,
    loaders,
    threadPool: happyThreadPool,
    cache: HAPPY_CACHE,
    verbose: HAPPY_VERBOSE,
    verboseWhenProfiling: HAPPY_VERBOSE,
    debug: HAPPY_VERBOSE,
  });
}

const config = make({
  target: 'web',
});

config.plugins.push(
  new WebpackMd5Hash(),
  new ManifestPlugin()
  // new ChunkManifestPlugin({
  //   filename: 'chunk-manifest.json',
  //   manifestVariable: 'webpackManifest',
  // })
);

config.module = {
  rules: [
    {
      test: /\.js$/,
      include,
      loaders: ['happypack/loader?id=js'],
    },
    {
      test: /\.css$/,
      loaders: ['happypack/loader?id=css'],
    },
    {
      test: /\.scss$/,
      loaders: ['happypack/loader?id=scss'],
    },
    {
      test: /\.(woff2?|jpe?g|png|gif|ico)$/,
      loader: 'file-loader',
    },
    {
      test: /\.svg$/,
      loaders: ['react-svgdom-loader', 'svgo-loader'],
    },
    {
      test: /\.json$/,
      loader: 'json-loader',
    },
  ],
};

config.plugins.push(
  createHappyPlugin('css',
    [
      'style-loader',
      {
        path: 'css-loader',
        query: {
          sourceMap: true,
        },
      },
    ]
  ),
  createHappyPlugin('scss',
    [
      'classnames-loader',
      'style-loader',
      {
        loader: 'css-loader',
        query: {
          sourceMap: true,
          modules: true,
          importLoaders: 1,
          localIdentName: '[name]_[local]_[hash:base64:5]',
        },
      },
      'postcss-loader',
      'sass-loader',
    ]
  ),
  createHappyPlugin('js', [{
    loader: 'babel-loader',
    query: {
      presets: [['es2015', { modules: false }], 'react', 'stage-0'],
      plugins: ['react-hot-loader/babel', 'transform-decorators-legacy'],
    },
  }])
);

// console.log(util.inspect(config, false, null));

module.exports = config;
