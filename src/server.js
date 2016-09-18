/* eslint no-console: 0 */
import http from 'http';
import express from 'express';
import compression from 'compression';
import React from 'react';
import Helmet from 'react-helmet';
import { Router, RouterContext, match } from 'react-router';
import { serverWaitRender } from 'utils/server-wait';
import debug from 'utils/debug';
import Provider from 'containers/provider';
import routes, { NotFound } from './routes';
import Store from './store';
import color from 'cli-color'; // eslint-disable-line

const release = (process.env.NODE_ENV === 'production');
const port = (parseInt(process.env.PORT, 10) || 3000) - !release;
const app = express();

// Set view engine
app.set('views', './src/server/views');
app.set('view engine', 'ejs');
app.use(compression());
app.use(express.static('./src/assets/favicon'));
app.use(express.static('./build'));

// Route handler that rules them all!
app.get('*', (req, res) => {

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
    const root = (
      <Provider store={store}>
        <RouterContext {...props} />
      </Provider>
    );

    const cancel = serverWaitRender({
      store,
      root,
      debug: (...args) => debug(color.yellow('server-wait'), ...args),
      maxWait: 2000,
      render: (renderedRoot, initialState) => {
        const head = Helmet.rewind();
        res.render('index', {
          includeStyles: release,
          includeClient: true,
          renderedRoot,
          initialState,
          title: head.title.toString(),
          meta: head.meta.toString(),
          link: head.link.toString(),
        });
      },
    });

    // Cancel server rendering
    req.on('close', cancel);
  });
});

// Create HTTP Server
const server = http.createServer(app);

// Start
server.listen(port, err => {
  if (err) throw err;
  debug(color.cyan('http'), `🚀  started on port ${port}`);
});
