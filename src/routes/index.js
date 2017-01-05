import React from 'react';
import Route from 'react-router/lib/Route';
import IndexRoute from 'react-router/lib/IndexRoute';
import App from 'containers/app';
import NotFound from 'routes/NotFound';
import getRoute from 'utils/get-route';

export {
  NotFound,
};

export default (
  <Route path="/" component={App}>
    <IndexRoute getComponent={getRoute('Home')} />
    <Route path="planets" getComponent={getRoute('Planets')} />
    <Route path="planet/:id" getComponent={getRoute('Planet')} />
    <Route path="about" getComponent={getRoute('About')} />
    <Route path="*" getComponent={getRoute('NotFound', 'routes/NotFound')} />,
  </Route>
);
