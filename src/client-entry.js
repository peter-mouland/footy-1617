import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory, createMemoryHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import configureStore from './app/store/configureStore'
import { isBrowser } from './app/utils';
import App from './app/App';
import debug from 'debug';

import './styles/app.scss';

debug.enable(process.env.DEBUG);
const log = debug('lego:client-entry');
log('Client environment', process.env);

// exported to be used in tests
export const history = isBrowser ? browserHistory : createMemoryHistory();

const store = configureStore(window.__INITIAL_STATE__);
const reduxHistory = syncHistoryWithStore(history, store);

try {
  ReactDOM.render(<App store={store} history={reduxHistory} />, document.getElementById('html'));
} catch (err) {
  log('Render error', err);
}
