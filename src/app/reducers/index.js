import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import * as actions from '../actions';

import calculatePoints from './calculatePoints';

// const defaultStatsState = { data: { players: [] }, status: {} };
const defaultStatsState = { };

const newPlayers = (players, data) => {
  return players.map(player => ({
    ...player,
    pos: !!data[player.fullName] ? data[player.fullName].pos : player.pos
  }));
};

function stats(state = defaultStatsState, action) {
  switch (action.type) {
    case actions.FETCH_PLAYERS:
      return {
        ...state,
        data: {
          ...action.data,
          players: calculatePoints(action.data.players, action.timeFrame),
        },
        status: action.status
      };
    case actions.SAVE_PLAYER_STATS:
      return {
        ...state,
        status: action.status
      };
    case actions.SAVE_PLAYER_POSITIONS:
      return {
        ...state,
        data: {
          ...state.data,
          players: newPlayers(state.data.players, action.data)
        },
        status: action.status
      };
    default:
      return state;
  }
}

function statsSnapshots(state = defaultStatsState, action) {
  switch (action.type) {
    case actions.FETCH_STATS_SNAPSHOTS:
      return {
        ...state,
        data: {
          ...action.data
        },
        status: action.status
      };
    default:
      return state;
  }
}

export default combineReducers({
  statsSnapshots,
  stats,
  routing
});
