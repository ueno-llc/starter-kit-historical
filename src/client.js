/* eslint no-underscore-dangle: 0 */
import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory, Router } from 'react-router';
import stringify from 'json-stringify-safe';
import { toJS } from 'mobx';
import { Provider } from 'mobx-react';
import _omit from 'lodash/omit';
import routes from './routes';
import Store from './store';

const state = JSON.parse(window.__INITIAL_STATE__ || '{}');
let store = window.store = new Store(state);

// Render the application
const render = (Root) => {
  ReactDOM.render(
    <Root {..._omit(store, k => (k !== '$mobx'))}>
      <Router history={browserHistory}>
        {routes}
      </Router>
    </Root>,
    document.getElementById('root')
  );
};

render(Provider);

if (module.hot) {
  if (module.hot.data && module.hot.data.store) {
    store = new Store(JSON.parse(module.hot.data.store));
  }

  module.hot.dispose((data) => {
    data.store = stringify(toJS(store)); // eslint-disable-line
  });

  module.hot.accept(() => render(
    require('mobx-react').Provider // eslint-disable-line
  ));
}
