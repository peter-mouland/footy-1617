import React from 'react';
import { match, RouterContext } from 'react-router';
import * as routes from '../../app/routes';

// some components define a `requestData` static method that returns promise; skip the rest
function mapComponentsToPromises(components, params) {
  const filteredComponents = components.filter((Component) => {
    return (typeof Component.requestData === 'function');
  });
  const promises = filteredComponents.map(function(Component) {
    return Component.requestData(params /*, nconf.get('domain') */);
  });

  return {promises, components: filteredComponents};
}

// create component name -> component data map
function prepareData(values, components) {
  const map = {};

  values.forEach((value, index) => {
    map[components[0].NAME] = value.data;
  });

  return map;
}

const setRouterContext = (req, res, next) => {
  match({
    routes: routes.makeRoutes(),
    location: req.url
  }, (error, redirect, renderProps) => {
    if (error) {
      throw error;
    } else if (redirect) {
      res.redirect(302, redirect.pathname + redirect.search);
    } else {

    // / each component carries a promise that retrieves its data
      const {promises, components} = mapComponentsToPromises(renderProps.components, renderProps.params);
      // when all promises are resolved, process data
      Promise.all(promises).then((values) => {
        console.log('values', values);
        // create map of [component name -> component data]
        res.initialData = prepareData(values, components);

        // path * will return a 404
        const isNotFound = renderProps.routes.find((route) => route.path === '*');
        res.status(isNotFound ? 404 : 200); // eslint-disable-line
        res.routerContext = <RouterContext {...renderProps} />; // eslint-disable-line
        next();
      }).catch((err) => {
        console.log('err', err);
        res.status(500).send(err);
      });
    }
  });
};

export default setRouterContext;
