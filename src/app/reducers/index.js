import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { FETCH_PLAYERS, SAVE_PLAYER_STATS, UPDATE_PLAYER_POSITIONS } from '../actions';

import StatsToPoints from './statsToPoints';

const defaultStatsState = { data: { unknown: [], players: [] }, status: {} };

function stats(state = defaultStatsState, action) {
  switch (action.type) {
    case FETCH_PLAYERS:
      return {
        ...state,
        data: new StatsToPoints(action.data, action.timeFrame),
        status: action.status
      };
    case SAVE_PLAYER_STATS:
      return {
        ...state,
        status: action.status
      };
    default:
      return state;
  }
}

function positions(state = {}, action) {
  switch (action.type) {
    case UPDATE_PLAYER_POSITIONS:
      return {
        ...state,
        status: action.status
      };
    default:
      return state;
  }
}

export default combineReducers({
  positions,
  stats,
  routing
});
