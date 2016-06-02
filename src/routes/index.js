/* eslint-disable */
import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from 'containers/App';

const loadRoute = pkg => (location, cb) => {
  if (__CLIENT__) {
    const lazyModule = require('bundle?lazy!./' + pkg);
    return lazyModule(module => cb(null, module.default));
  }
  return cb(null, require('./' + pkg).default);
};

export default (
  <Route path="/" component={App}>
    <IndexRoute getComponent={loadRoute('Home')} />
    <Route path="about" getComponent={loadRoute('About')} />
  </Route>
);
