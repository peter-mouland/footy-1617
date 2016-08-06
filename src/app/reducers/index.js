import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { FETCH_PLAYERS } from '../actions';

import statsToPoints from './statsToPoints';

function stats(state = {}, action) {
  switch (action.type) {
    case FETCH_PLAYERS:
      return {
        ...state,
        data: new statsToPoints(action.data),
        status: action.status
      };
    default:
      return {
        ...state,
        ...action
      };
  }
}

export default combineReducers({
  stats,
  routing
});
