import React from 'react';
import { Provider } from 'react-redux';
import Html from '../templates/Html';
import configureStore from '../../app/store/configureStore';
// import { getAllProducts } from '../../app/actions'

export default function renderAppWrapper(assets) {
  const store = configureStore({});
  // store.dispatch(getAllProducts());
  
  return function renderApp(req, res) {
    try {
      res.send(res.renderPageToString(
        <Html
          initialState={store.getState()}
          scripts={assets.javascript}
          stylesheets={assets.styles}
          content={<Provider store={store}>{res.routerContext}</Provider>}
        />
      ));
    } catch (error) {
      res.render500(error);
    }
  };
}
