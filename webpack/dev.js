/* eslint no-console: 0 */
const webpack = require('webpack');
const spawn = require('child_process').spawn;
const bs = require('browser-sync').create();
const color = require('cli-color');

const proxyMiddleware = require('http-proxy-middleware');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

// Get server config
const config = require('./server');
const client = require('./client');
client.context = undefined;
// Configs eslint to not prevent successful build on errors
client.eslint = config.eslint = { emitWarning: true };

// Setup webpack compiler
const compiler = webpack(config);
const bundler = webpack(client);

// Other stuff
let running = null;
const port = (parseInt(process.env.PORT, 10) || 3000) - 1;
const proxyPort = port + 1;
let initial = false;
let didNotCompile = false;

function compileBuilt() {
  if (didNotCompile) {
    console.log(`[📦 ] ${color.green.bold('Webpack build fixed.')}`);
  }
  didNotCompile = false;
}

// Spawn server
function start() {
  return new Promise(resolve => {
    running = spawn('node', ['build/server.js']);
    running.stdout.on('data', data => {
      const msg = data.toString().replace(/\n$/, '');
      if (msg.match(/Server started/)) {
        resolve();
        if (!initial) {
          console.log(msg);
          initial = true;
        } else {
          console.log('[👍 ] Reloaded server');
        }
      } else {
        console.log(msg);
      }
    });

    running.stderr.on('data', data => console.error(data.toString().replace(/\n$/, '')));
  });
}

// Initialize
bs.init({
  port: proxyPort,
  open: false,
  notify: false,
  server: {
    baseDir: './',
    middleware: [
      webpackDevMiddleware(bundler, {
        publicPath: '/',
        noInfo: true,
        stats: {
          colors: true,
        },
      }),
      webpackHotMiddleware(bundler, {
        log: false,
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

// Fired when client webpack is done packing
bundler.plugin('done', stats => {

  // Also output
  setTimeout(() => {
    if (didNotCompile) {
      console.log(`\n[📦 ] ${color.red.bold('Webpack build failed.')}`);
      console.log('[⏳ ] Waiting for changes to restart...');
    }

    if (!stats.hasErrors()) {
      compileBuilt();
    }
  }, 180);

  const s = stats.toJson();

  (s.children && s.children.length ? s.children : [s])
  .forEach(childStats => {
    console.log(`[📦 ] Webpack built ${childStats.name ? childStats.name : ''}`
      + ` ${childStats.hash} in ${childStats.time}ms`);
  });
});

// Fired when webpack is building
bundler.plugin('compile', () => {
  console.log('[🚧 ] Webpack building...');
});

// Server watch
compiler.watch({
  aggregateTimeout: 300,
  poll: true,
}, (err, stats) => {

  if (stats.hasErrors() || stats.hasWarnings()) {

    // Output webpack stats
    console.log(stats.toString({ colors: true }));

    // Disable reloading if webpack has errors
    if (stats.hasErrors()) {
      didNotCompile = true;
      return;
    }

    compileBuilt();
  }

  if (running) {
    setTimeout(() => running.kill(), 100);
  }

  setTimeout(() => start(), 110);
});
