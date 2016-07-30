import React, { Component, PropTypes } from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router'
import { makeRoutes } from './routes'
import debug from 'debug';

const log = debug('lego:App')

export default class Root extends Component {

  static propTypes = {
    store: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  render() {
    log('render')
    const { store, history } = this.props;
    return (
      <Provider store={store}>
        <Router history={history} routes={makeRoutes()} />
      </Provider>
    )
  }
}

