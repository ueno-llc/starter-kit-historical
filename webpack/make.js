/* eslint no-param-reassign: 0 */
const webpack = require('webpack');
const path = require('path');
const externals = require('webpack-node-externals');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const cloneDeep = require('lodash/cloneDeep');
const autoprefixer = require('autoprefixer');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

const root = (folder = '.') => path.join(__dirname, '..', folder);
const {
  NODE_ENV = 'development',
} = process.env;

function extendLoader(loader, test, name) {
  const out = cloneDeep(loader);
  out.test = test;
  out.loaders.push(name);
  return out;
}

function make(conf) {

  // Defaults
  const target = conf.target || 'node';

  // Some useful constants
  const isServer = (target === 'node');
  const isClient = (target === 'web');
  const isDev = (NODE_ENV === 'development'); // eslint-disable-line
  const isProd = (NODE_ENV === 'production');

  // Extract text from css files
  const extract = new ExtractTextPlugin({
    filename: 'styles.css',
    allChunks: true,
  });

  // Webpack Loaders
  // ------------------------
  const loaders = {};

  // Babel loader
  loaders.babel = {
    test: /\.js$/,
    exclude: /node_modules/,
    include: root('src'),
    loaders: [{
      loader: 'babel-loader',
      query: {
        presets: [
          ['es2015', { modules: false }],
          'react',
          'stage-0',
        ],
        plugins: [
          'transform-decorators-legacy',
        ],
      },
    }],
  };

  loaders.css = {
    test: /\.css$/,
    include: root('src'),
    loaders: [
      'classnames-loader',
      'style-loader',
      {
        loader: 'css-loader',
        query: {
          sourceMap: isDev && isClient,
          modules: true,
          importLoaders: 1,
          localIdentName: (
            isDev
            ? '[name]_[local]_[hash:base64:5]'
            : '[hash:base64:10]'
          ),
        },
      },
      'postcss-loader',
    ],
  };

  loaders.less = extendLoader(loaders.css, /\.less$/, 'less-loader');

  loaders.sass = extendLoader(loaders.css, /\.(scss|sass)$/, 'sass-loader');

  loaders.file = {
    test: /\.(woff2?|jpe?g|png|gif|ico)$/,
    loader: 'file-loader',
  };

  loaders.svg = {
    test: /\.svg$/,
    loaders: ['react-svgdom-loader', 'svgo-loader'],
  };

  loaders.json = {
    test: /\.json$/,
    loader: 'json-loader',
  };

  // Alteration of loaders
  // Conditional for server/client or development/production
  // Modify with care.
  Object.keys(loaders)
  .map(key => loaders[key])
  .forEach(loader => {

    const items = loader.loaders || [loader.loader];
    const isStyleLoader = items.find(item => /style/.test(item));
    const isFileLoader = items.find(item => /file/.test(item));

    // Replace style loaders with extract plugin on client in production
    // Detach classnames and style loader outside extract.
    // But add style loader as fallback.
    if (isStyleLoader && isClient && isProd) {
      loader.loaders = [ // eslint-disable-line
        ...items.filter(item => /classnames/.test(item)),
        ...extract.extract({
          fallbackLoader: 'style-loader',
          loader: items.filter(item => !/classnames|style/.test(item)),
        }),
      ];
    }

    // Use locals for css modules loader on the server
    if (isStyleLoader && isServer) {
      loader.loaders = items.map(item => {
        if (item.loader && item.loader === 'css-loader') {
          item.loader = 'css-loader/locals';
        }
        return item;
      })
      .filter(item => !/style-loader/.test(item));
    }

    // Don't emit files from file-loader on the server.
    // This speeds things up.
    if (isFileLoader && isServer) {
      loader.loader += '?emitFile=false';
    }
  });

  // Webpack Plugins
  // ------------------------
  const plugins = [];

  // Define plugin
  plugins.push(
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
      __CLIENT__: JSON.stringify(isClient),
    }),
    new webpack.NamedModulesPlugin(),
    new CaseSensitivePathsPlugin()
  );

  const config = {

    target,

    entry: {},

    cache: true,

    devtool: isDev ? 'eval-cheap-module-source-map' : 'source-map', 

    output: {
      path: root('build'),
      filename: '[name].js',
      sourceMapFilename: '[name].map',
      chunkFilename: '[name].[chunkhash].js',
      publicPath: '/',
    },

    resolve: {
      extensions: ['.js', '.json', '.scss'],
      modules: [
        path.resolve(root('src')),
        'node_modules',
      ],
    },

    performance: {
      hints: false,
    },

    module: {
      loaders: [
        loaders.babel,
        loaders.css,
        loaders.sass,
        loaders.file,
        loaders.svg,
        loaders.json,
      ],
    },

    plugins,
  };

  // Final conditional alterations
  // -----------------------------

  if (isClient) {
    // Set entry point
    config.entry.client = [
      'regenerator-runtime/runtime',
      './src/client.js',
    ];

    // Set library target output
    config.output.libraryTarget = 'var';

    // Pack vendors
    config.entry.vendor = [
      'react',
      'react-dom',
      'react-helmet',
      'mobx',
      'mobx-react',
      'mobx-utils',
      'mobx-server-wait',
      'classnames',
      'lodash',
      'json-stringify-safe',
      'isomorphic-fetch',
      'core-decorators',
    ];

    config.plugins.push(
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: Infinity,
        filename: 'vendor.js',
      }),

      // Force System.import from routes directory non-recursive.
      new webpack.ContextReplacementPlugin(/src.routes.*/, './', false)
    );
  }

  if (isClient && isProd) {
    config.plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          screw_ie8: true,
          warnings: false,
        },
        mangle: {
          screw_ie8: true,
          keep_fnames: true,
        },
        output: {
          comments: false,
          screw_ie8: true,
        },
      }),
      extract
    );

    // Source map with no cost
    config.devtool = 'hidden-source-map';
  }

  if (isServer) {

    // Set entry point
    config.entry.server = [
      'babel-polyfill',
      './src/server.js',
    ];

    // Set library target output
    config.output.libraryTarget = 'commonjs2';

    // Allow dirname and filename
    config.node = {
      __dirname: true,
      __filename: true,
    };

    // Set externals but ignore assets
    config.externals = externals({
      whitelist: [
        /\.(eot|woff|woff2|ttf|otf)$/,
        /\.(svg|png|jpg|jpeg|gif|ico|webm)$/,
        /\.(mp4|mp3|ogg|swf|webp)$/,
        /\.(css|scss|sass|less|styl)$/,
      ],
    });
  }

  // Loader options plugin
  plugins.push(
    new webpack.LoaderOptionsPlugin({
      minimize: (isClient && isProd),
      debug: !isProd,
      options: {
        plugins() { return plugins; },
        postcss() { return [autoprefixer]; },
        context: root(),
      },
    })
  );

  return config;
}

module.exports = make;
