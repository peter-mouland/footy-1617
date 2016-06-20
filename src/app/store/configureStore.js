import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import reducers from '../reducers'

const inBrowser = typeof window === 'object';
const middleware = [
  thunk,
  createLogger({
    predicate: () => inBrowser && process.env.NODE_ENV !== 'production',
    collapsed: true
  })
];

export default function configureStore(preloadedState) {
  return createStore(
    reducers,
    preloadedState,
    applyMiddleware(...middleware)
  )
}
