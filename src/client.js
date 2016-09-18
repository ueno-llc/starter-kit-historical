/* eslint no-underscore-dangle: 0 */
import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory, Router } from 'react-router';
import Provider from 'containers/provider';
import routes from './routes';
import Store from './store';

const state = JSON.parse(window.__INITIAL_STATE__ || '{}');
const store = window.store = new Store(state);

// Render the application
ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      {routes}
    </Router>
  </Provider>,
  document.getElementById('root')
);
