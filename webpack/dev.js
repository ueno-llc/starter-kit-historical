/* eslint no-console: 0 */
const webpack = require('webpack');
const spawn = require('child_process').spawn;
const bs = require('browser-sync').create();
const color = require('cli-color');
const fs = require('fs');
const log = require('../src/utils/debug');

const proxyMiddleware = require('http-proxy-middleware');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');


log('starting dev server');

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
    log(`📦  ${color.green.bold('build fixed')}`);
  }
  didNotCompile = false;
}

fs.readFile('./build/PID.dev', 'utf8', (err, data) => {
  if (err) return;
  try {
    process.kill(parseInt(data, 10), 'SIGHUP');
  } catch (e) {
    return;
  }
});

// Spawn server
function start() {
  return new Promise(resolve => {
    running = spawn('node', ['build/server.js'], {});
    running.stdout.on('data', data => {
      const msg = data.toString().replace(/\n$/, '');
      if (msg.match(/http.*started/)) {
        resolve();
        if (!initial) {
          console.log(msg);
          log(`available at ${color.underline.blue(`http://localhost:${proxyPort}`)}`);
          initial = true;
        } else {
          log('👍  reloaded server');
        }
      } else {
        console.log(msg);
      }
    });

    running.stderr.on('data', data => {
      console.error(data.toString().replace(/\n$/, ''));
    });

    // Write to file new PID
    fs.writeFile('./build/PID.dev', running.pid, (err) => {
      if (err) {
        log('Could not store PID for child process:', err);
      }
    });
  });
}

// Initialize
bs.init({
  port: proxyPort,
  open: false,
  notify: false,
  logLevel: 'silent',
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
      log(`📦  ${color.red.bold('build failed')}`);
      log('⏳  waiting for changes...');
    }

    if (!stats.hasErrors()) {
      compileBuilt();
    }
  }, 180);

  const s = stats.toJson();

  (s.children && s.children.length ? s.children : [s])
  .forEach(childStats => {
    log(`📦  built ${childStats.name ? childStats.name : ''}`
      + `${childStats.hash} in ${childStats.time}ms`);
  });
});

// Fired when webpack is building
bundler.plugin('compile', () => {
  log('🚧  building...');
});

// Server watch
compiler.watch({
  aggregateTimeout: 300,
  poll: true,
}, (err, stats) => {

  if (stats.hasErrors() || stats.hasWarnings()) {

    // Output webpack stats
    log(stats.toString({ colors: true }));

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
