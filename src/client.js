import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory, Router } from 'react-router';
import routes from './routes';

// Install service worker
require('offline-plugin/runtime').install();

// Render the application
ReactDOM.render(
  <Router history={browserHistory}>
    {routes}
  </Router>,
  document.getElementById('root')
);
