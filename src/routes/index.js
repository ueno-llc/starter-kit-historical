import React from 'react';
import Route from 'react-router/lib/Route';
import IndexRoute from 'react-router/lib/IndexRoute';
import App from 'containers/app';
import NotFound from 'routes/NotFound';
import loadRoute from 'utils/load-route';

export {
  NotFound,
};

export default (
  <Route path="/" component={App}>
    <IndexRoute getComponent={loadRoute('Home')} />
    <Route path="planets" getComponent={loadRoute('Planets')} />
    <Route path="planet/:id" getComponent={loadRoute('Planet')} />
    <Route path="about" getComponent={loadRoute('About')} />
    <Route path="*" getComponent={loadRoute('NotFound')} />,
  </Route>
);
