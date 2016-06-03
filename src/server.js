/* eslint no-console: 0 */
import http from 'http';
import express from 'express';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Router, RouterContext, match } from 'react-router';
import routes from './routes';

const release = (process.env.NODE_ENV === 'production');
const port = (parseInt(process.env.PORT, 10) || 3000) - !release;
const app = express();

// Set view engine
app.set('views', './src/server/views');
app.set('view engine', 'ejs');
app.use(express.static('./public'));
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
    } else if (!props) {
      return res.status(404).send('not found');
    }

    // Render template
    res.render('index', {
      includeStyles: release,
      includeClient: true,
      renderedRoot: ReactDOMServer.renderToString(
        <RouterContext {...props} />
      ),
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
