/* eslint-disable */
import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from 'containers/app';
import Home from 'routes/Home';
import Planets from 'routes/Planets';
import Planet from 'routes/Planet';
import About from 'routes/About';
import NotFound from 'routes/NotFound';

export {
  NotFound,
};

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Home} />
    <Route path="planets" component={Planets} />
    <Route path="planet/:id" component={Planet} />
    <Route path="about" component={About} />
    <Route path="*" component={NotFound} />,
  </Route>
);
