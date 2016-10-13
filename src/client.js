/* eslint no-underscore-dangle: 0 */
import React from 'react';
import ReactDOM from 'react-dom';
import Router from 'react-router/lib/Router';
import browserHistory from 'react-router/lib/browserHistory';
import match from 'react-router/lib/match';
import stringify from 'json-stringify-safe';
import { toJS } from 'mobx';
import { Provider } from 'mobx-react';
import _omit from 'lodash/omit';
import routes from './routes';
import Store from './store';

const state = JSON.parse(window.__INITIAL_STATE__ || '{}');
let store = window.store = new Store(state);

// Render the application
const render = (Root, target = 'root') => {

  match({
    routes: (<Router>{routes}</Router>),
    location: window.location,
  }, (err, location, props) => {

    // Make sure that all System.imports are loaded before rendering
    const imports = props.routes
    .filter(route => route.getComponent)
    .map(route => new Promise(resolve => route.getComponent(location, resolve)));

    // Run the chain
    Promise.all(imports)
    .then(() => {
      ReactDOM.render(
        <Root {..._omit(store, k => (k !== '$mobx'))}>
          <Router history={browserHistory}>
            {props.routes}
          </Router>
        </Root>,
        document.getElementById(target)
      );
    });
  });
};

// Render for the first time
render(Provider);

if (module.hot) {

  // Remove some warnings and errors related to
  // hot reloading and System.import conflicts.
  require('utils/hmr'); // eslint-disable-line

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
