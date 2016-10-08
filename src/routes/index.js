/* eslint-disable */
import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from 'containers/app';
import NotFound from 'routes/NotFound';

export {
  NotFound,
};

const cache = new Map();

const loadRoute = (name) => (location, cb) => {
  if (__CLIENT__) {
    if (cache.has(name)) {
      return cb(null, cache.get(name));
    }

    System.import('routes/' + name) // eslint-disable-line
    .then(module => {
      cache.set(name, module.default);
      cb(null, module.default);
    })
    .catch(err => {
      console.error('Could not load route: %o', err);
    });
  } else {
    cb(null, require('routes/' + name).default);
  }
}

export default (
  <Route path="/" component={App}>
    <IndexRoute getComponent={loadRoute('Home')} />
    <Route path="planets" getComponent={loadRoute('Planets')} />
    <Route path="planet/:id" getComponent={loadRoute('Planet')} />
    <Route path="about" getComponent={loadRoute('About')} />
    <Route path="*" getComponent={loadRoute('NotFound')} />,
  </Route>
);
