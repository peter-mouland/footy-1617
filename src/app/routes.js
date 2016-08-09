import React from 'react';
import { Route, IndexRoute } from 'react-router';
import debug from 'debug';
import objectAssign from 'object-assign';

import MainLayout from './Layouts/MainLayout';
import Homepage from './containers/Homepage/Homepage';
import NotFound from './containers/NotFound/NotFound';

const log = debug('footy:routes');

export const routes = {
  homepage: {
    path: '/',
    title: 'FF Footy 16/17',
    component: Homepage
  },
  notFound: {
    path: '*', // path * will return a 404
    title: 'Page Not Found',
    component: NotFound
  }
};

const indexRoute = (route) => objectAssign({}, route, { path: null });

export function makeRoutes() {
  log('makeRoutes');
  return (
    <Route path="/" component={ MainLayout }>
      <IndexRoute { ...indexRoute(routes.homepage) } />
      <Route { ...routes.notFound } />
    </Route>
  );
}
