/* eslint no-console: 0 */
import http from 'http';
import express from 'express';
import compression from 'compression';
import React from 'react';
import Helmet from 'react-helmet';
import { Router, RouterContext, match } from 'react-router';
import { serverWaitRender } from 'utils/server-wait';
import Provider from 'containers/provider';
import routes, { NotFound } from './routes';
import Store from './store';

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
    const context = { store };
    const head = Helmet.rewind();
    const root = (
      <Provider context={context}>
        <RouterContext {...props} />
      </Provider>
    );

    serverWaitRender({
      store,
      root,
      maxWait: 2000,
      render: (renderedRoot, initialState) => res.render('index', {
        includeStyles: release,
        includeClient: true,
        renderedRoot,
        initialState,
        title: head.title.toString(),
        meta: head.meta.toString(),
        link: head.link.toString(),
      }),
    });
  });
});

// Create HTTP Server
const server = http.createServer(app);

// Start
server.listen(port, err => {
  if (err) throw err;
  console.info(`[🚀 ] Server started on port ${port}`);
});
