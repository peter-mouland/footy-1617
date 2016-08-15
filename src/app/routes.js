import React from 'react';
import { Route, IndexRoute } from 'react-router';
import debug from 'debug';
import objectAssign from 'object-assign';

import MainLayout from './Layouts/MainLayout';
import PlayersByPosition from './containers/PlayersByPosition/PlayersByPosition';
import PlayerStats from './containers/PlayerStats/PlayerStats';
import WeeklyPoints from './containers/WeeklyPoints/WeeklyPoints';
import StatsSnapshots from './containers/StatsSnapshots/StatsSnapshots';
import Homepage from './containers/Homepage/Homepage';
import NotFound from './containers/NotFound/NotFound';

const log = debug('footy:routes');

const siteTitle = 'FF Footy 16/17';

export const routes = {
  homepage: {
    label: 'Homepage',
    path: '/',
    title: siteTitle,
    component: Homepage
  },
  playersByPosition: {
    label: 'Player by Position',
    path: '/players-by-position',
    title: `${siteTitle} - Player Stats`,
    component: PlayersByPosition
  },
  playerStats: {
    label: 'Player Stats',
    path: '/player-stats',
    title: `${siteTitle} - Player Stats`,
    component: PlayerStats
  },
  weeklyPoints: {
    label: 'Weekly Points',
    path: '/weekly-points',
    title: `${siteTitle} - Weekly Points`,
    component: WeeklyPoints
  },
  statsSnapshots: {
    label: 'Stats-Snapshots',
    path: '/stats-snapshots',
    title: `${siteTitle} - Stats-Snapshots`,
    component: StatsSnapshots
  },
  notFound: {
    label: 'Not Found',
    path: '*', // path * will return a 404
    title: `${siteTitle} - page not found`,
    component: NotFound
  }
};

const indexRoute = (route) => objectAssign({}, route, { path: null });

export function makeRoutes() {
  log('makeRoutes');
  return (
    <Route path="/" component={ MainLayout }>
      <IndexRoute { ...indexRoute(routes.homepage) } />
      <Route { ...routes.playersByPosition } />
      <Route { ...routes.playerStats } />
      <Route { ...routes.weeklyPoints } />
      <Route { ...routes.statsSnapshots } />
      <Route { ...routes.notFound } />
    </Route>
  );
}
