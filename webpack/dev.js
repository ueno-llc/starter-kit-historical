const path = require('path');
const webpack = require('webpack');
const bs = require('browser-sync').create();
const proxyMiddleware = require('http-proxy-middleware');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const HappyPack = require('happypack');
const color = require('cli-color');
const debug = require('../src/utils/debug');
const clientConfig = require('./client');
const serverConfig = require('./server');

const domain = [color.magentaBright('webpack'), '::', color.redBright('server')].join('');
const domainClient = [color.magentaBright('webpack'), '::', color.yellow('client')].join('');
const threadPool = HappyPack.ThreadPool({ size: 8 }); // eslint-disable-line

// Get ports
const port = (parseInt(process.env.PORT, 10) || 3000) - 1;
const proxyPort = port + 1;
const useHappyPack = process.env.HAPPY !== '0';

// Logging
const log = (...args) => debug(domain, ...args);
const logClient = (...args) => debug(domainClient, ...args);

// Use happy or not
if (useHappyPack) {

  // Loaders that we should happypackivide
  const samples = ['.js', '.css', '.scss', '.json'];

  // Log that stuff
  logClient(`using happypack for [${samples.join(', ')}]`);

  const rules = clientConfig.module.loaders
  .map((item, i) => {
    const res = item;
    const sample = samples.find(file => item.test.test(file));
    if (sample) {
      const loaders = item.loader ? [{ loader: item.loader }] : item.loaders;
      const id = `${i}${sample}`;
      if (sample === '.js') {
        loaders[0].query.plugins.splice(0, 0, 'react-hot-loader/babel');
      }
      clientConfig.plugins.push(new HappyPack({
        id,
        loaders,
        threadPool,
        verbose: false,
      }));
      delete res.loader;
      res.loaders = [`happypack/loader?id=${id}`];
    }
    return res;
  });

  clientConfig.module = { rules };
}

// Add HMR entry points
clientConfig.entry.client.splice(0, 0,
  'react-hot-loader/patch',
  `webpack-hot-middleware/client?reload=true&path=http://localhost:${proxyPort}/__webpack_hmr`
);

// Add ProgressBar, HMR and NoErrors plugin
clientConfig.plugins.push(
  new ProgressBarPlugin({
    width: 12,
    format: `[:bar] ${domainClient} ${color.green.bold(':percent')} :msg (:elapsed seconds)`,
    clear: true,
    summary: false,
  }),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin()
);

// Add progress bar to server build
serverConfig.plugins.push(
  new webpack.NoErrorsPlugin()
);

// Performance hints
clientConfig.performance = { hints: false };
serverConfig.performance = { hints: false };

// Create compilers
const clientCompiler = webpack(clientConfig);
const serverCompiler = webpack(serverConfig);

// Build container
const build = {
  failed: false,
  first: true,
  started: false,
  connections: [],
};

const devMiddleware = webpackDevMiddleware(clientCompiler, {
  publicPath: '/',
  noInfo: true,
  stats: {
    timings: false,
    version: false,
    hash: false,
    assets: false,
    chunks: false,
    colors: true,
  },
});

clientCompiler.plugin('done', stats => {
  if (!stats.hasErrors()) {
    logClient('built %s in %sms', stats.hash, stats.endTime - stats.startTime);
  }
});

serverCompiler.plugin('done', stats => {

  if (stats.hasErrors()) {
    log(color.red.bold('build failed'));

    stats.compilation.errors.forEach(error => {
      log(color.yellow.bold(error.message));
    });

    build.failed = true;
    return;
  }

  if (build.failed) {
    build.failed = false;
    log(color.green('build fixed'));
  }

  if (useHappyPack && !build.started) console.log('\n');
  log('built %s in %sms', stats.hash, stats.endTime - stats.startTime);

  const opts = serverCompiler.options;
  const outputPath = path.resolve(opts.output.path, `${Object.keys(opts.entry)[0]}.js`);

  // Make sure our newly built server bundles aren't in the module cache.
  Object.keys(require.cache).forEach((modulePath) => {
    if (modulePath.indexOf(opts.output.path || outputPath) !== -1) {
      delete require.cache[modulePath];
    }
  });

  if (build.listener) {
    // Close the last server listener
    build.listener.close();
  }

  if (!build.started) {
    build.started = false;
    log(`started on ${color.blue.underline(`http://localhost:${proxyPort}`)}`);
  }

  // Start the server
  build.listener = require(outputPath).default; // eslint-disable-line

  // Track all connections to our server so that we can close them when needed.
  build.listener.on('connection', (connection) => {
    // Fixes first request to the server when nothing has been hot reloaded
    if (build.first) {
      devMiddleware.invalidate();
      build.first = false;
    }

    build.connections.push(connection);
    connection.on('close', () => {
      build.connections.splice(build.connections.indexOf(connection));
    });
  });
});

serverCompiler.watch({
  aggregateTimeout: 300,
  poll: true,
  ignored: /\.happypack/,
}, () => undefined);

// Initialize BrowserSync
bs.init({
  port: proxyPort,
  open: false,
  notify: false,
  logLevel: 'silent',
  server: {
    baseDir: './',
    middleware: [
      devMiddleware,
      webpackHotMiddleware(clientCompiler, {
        log: false,
        watchOptions: {
          aggregateTimeout: 300,
          poll: true,
          ignored: /\.happypack/,
        },
      }),
      proxyMiddleware(p => !p.match('^/browser-sync'), {
        target: `http://localhost:${port}`,
        changeOrigin: true,
        ws: true,
        logLevel: 'warn',
      }),
    ],
  },
});

process.on('SIGTERM', () => {
  if (build.listener) {
    build.listener.close(() => {
      log('closing %s connections', build.connections.length);
      log('shutting down');
      build.connections.forEach(conn => {
        conn.destroy();
      });
      process.exit(0);
    });
  }
});
