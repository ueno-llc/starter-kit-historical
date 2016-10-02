/* eslint-disable no-console */
/* eslint-disable global-require */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-dynamic-require */

const path = require('path');
const ListenerManager = require('./listener-manager');

class HotServer {
  constructor(compiler) {
    this.listenerManager = null;

    const runCompiler = () => {
      console.log('Building new server bundle...');

      compiler.run(() => undefined);
    };

    const compiledOutputPath = path.resolve(
      compiler.options.output.path, `${Object.keys(compiler.options.entry)[0]}.js`
    );

    compiler.plugin('done', (stats) => {
      if (stats.hasErrors()) {
        console.log('Build failed, check the console for more information.');
        console.log(stats.toString());
        return;
      }

      // Make sure our newly built server bundles aren't in the module cache.
      Object.keys(require.cache).forEach((modulePath) => {
        if (modulePath.indexOf(compiler.options.output.path) !== -1) {
          delete require.cache[modulePath];
        }
      });

      try {
        // The server bundle  will automatically start the web server just by
        // requiring it. It returns the http listener too.
        const listener = require(compiledOutputPath).default;
        this.listenerManager = new ListenerManager(listener, 'server');

        const url = 'http://localhost:3000';

        console.log(`Running on ${url} with latest changes.`);
      } catch (err) {
        console.log('Failed to start, please check the console for more information.');
        console.log(err);
      }
    });

    // Now we will configure `chokidar` to watch our server specific source folder.
    // Any changes will cause a rebuild of the server bundle.

    const compileHotServer = () => {
      // Shut down any existing running listener if necessary before starting the
      // compile, else just compile.
      if (this.listenerManager) {
        this.listenerManager.dispose(true).then(runCompiler);
      } else {
        runCompiler();
      }
    };

    compileHotServer();

    // Lets start the compile.
    runCompiler();
  }

  dispose() {
    return this.listenerManager
      ? this.listenerManager.dispose()
      : Promise.resolve();
  }
}

module.exports = HotServer;
