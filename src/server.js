/* eslint no-console: 0 */
import 'source-map-support/register';
import http from 'http';
import express from 'express';
import compression from 'compression';
import React from 'react';
import helmet from 'helmet';
import ReactHelmet from 'react-helmet';
import { Router, RouterContext, match } from 'react-router';
import { serverWaitRender } from 'mobx-server-wait';
import debug from 'utils/debug';
import { Provider } from 'mobx-react';
import _omit from 'lodash/omit';
import color from 'cli-color';
import hpp from 'hpp';

// Local imports
import routes, { NotFound } from './routes';
import Store from './store';

const {
  NODE_ENV = 'development',
} = process.env;

// Ground work
const release = (NODE_ENV === 'production');
const port = (parseInt(process.env.PORT, 10) || 3000) - !release;
const app = express();
const debugsw = (...args) => debug(color.yellow('server-wait'), ...args);

// Hide all software information
app.disable('x-powered-by');

// Prevent HTTP Parameter pollution.
// @note: Make sure body parser goes above the hpp middleware
app.use(hpp());

// Content Security Policy
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self' 'unsafe-inline' 'unsafe-eval'", 'cdn.polyfill.io'],
    styleSrc: ["'self' 'unsafe-inline'", 'fonts.googleapis.com', 'blob:;'],
    imgSrc: ["'self' 'unsafe-inline'", 'data:;'],
    connectSrc: ["'self'", 'ws:', 'swapi.co'],
    fontSrc: ["'self'", 'fonts.gstatic.com'],
    objectSrc: ["'none'"],
    mediaSrc: ["'none'"],
    frameSrc: ["'none'"],
  },
}));
app.use(helmet.xssFilter());
app.use(helmet.frameguard('deny'));
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());

// Set view engine
app.use(compression());
app.use(express.static('./src/assets/favicon'));
app.use(express.static('./build'));

// Route handler that rules them all!
app.get('*', (req, res, next) => {

  res.set('content-type', 'text/html');

  // Start writing output
  res.write('<!doctype html>');
  res.write(`<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    ${release ? '<link rel="stylesheet" type="text/css" href="/styles.css">' : ''}
    <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=es6"></script>
    <script src="/vendor.js" defer></script>
    <script src="/client.js" defer></script>
    <!-- CHUNK -->`);
  res.flush();

  // Some debugging info
  debug(color.cyan('http'), '%s - %s %s', req.ip, req.method, req.url);

  // Do a router match
  match({
    routes: (<Router>{routes}</Router>),
    location: req.url,
  },
  (err, redirect, props) => {

    // Sanity checks
    if (err) {
      return res.status(500).send(err.message);
    } else if (redirect) {
      return res.redirect(302, redirect.pathname + redirect.search);
    } else if (props.components.some(component => component === NotFound)) {
      res.status(404);
    }

    // Setup store and context for provider
    const store = new Store();

    // Add env variables
    store.env = {
      NODE_ENV,
    };

    // Setup the root but don't add $mobx as property to provider.
    const root = (
      <Provider {..._omit(store, k => (k !== '$mobx'))}>
        <RouterContext {...props} />
      </Provider>
    );

    // Main render function
    const render = (html, state) => {
      const encodedState = new Buffer(state).toString('base64');
      const { meta, title, link } = ReactHelmet.rewind();
      res.write(`${meta} ${title} ${link}
  </head>
  <body>
    <div id="root">${html}</div>
    <script type="text/json" id="__INITIAL_STATE__">${encodedState}</script>
  </body>
</html>`);
      res.end();
    };

    // Render when all actions have completed their promises
    const cancel = serverWaitRender({
      store,
      root,
      debug: debugsw,
      onError: next,
      render,
    });

    // Cancel server rendering
    req.on('close', cancel);
  });
});

app.use((err, req, res, next) => {
  res.end(`</head><body><h1>500 Server Error</h1><p>${err}</p></body></html>`);
  next(err);
});

// Create HTTP Server
const server = http.createServer(app);

// Start
const listener = server.listen(port, err => {
  if (err) throw err;
  debug(color.cyan('http'), `🚀  started on port ${port}`);
});

export default listener;
