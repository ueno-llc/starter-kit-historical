const path = require('path');
const make = require('./make');
const isTravis = process.env.TRAVIS;

const webpackConfig = make({
  target: 'web',
  devtool: 'inline-source-map',
  eslint: false,
});

// Don't need externals or plugins
delete webpackConfig.externals;
delete webpackConfig.plugins;

module.exports = config => {
  config.set({
    frameworks: ['mocha'],
    reporters: ['mocha'],
    browsers: isTravis ? ['Chrome_travis_ci'] : ['Chrome'],
    autoWatch: true,
    singleRun: true,
    files: [
      path.join(__dirname, '../node_modules/babel-polyfill/browser.js'),
      {
        pattern: '../src/**/*.spec.js',
        watched: true,
        served: true,
        included: true,
      },
    ],
    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox'],
      },
    },
    preprocessors: {
      '../src/**/*.spec.js': ['webpack', 'sourcemap'],
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      quiet: true,
    },
  });
};
