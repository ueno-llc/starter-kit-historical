/* eslint-disable */
import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from 'containers/App';
import Home from 'routes/Home';
import Elements from 'routes/Elements';
import About from 'routes/About.lazy';

const loadRoute = pkg => (location, cb) => {
  if (__CLIENT__) {
    return pkg(module => cb(null, module.default));
  }
  return cb(null, pkg);
};

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Home} />
    <Route path="elements" component={Elements} />
    <Route path="about" getComponent={loadRoute(About)} />
  </Route>
);
