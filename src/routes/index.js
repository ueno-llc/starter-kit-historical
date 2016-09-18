/* eslint-disable */
import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from 'containers/App';
import Home from 'routes/Home';
import Planet from 'routes/Planet';
import About from 'routes/lazy/About';
import NotFound from 'routes/NotFound';
import loadRoute from 'utils/load-route';

export {
  NotFound,
};

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Home} />
    <Route path="planet/:id" component={Planet} />
    <Route path="about" getComponent={loadRoute(About)} />
    <Route path="*" component={NotFound} />,
  </Route>
);
