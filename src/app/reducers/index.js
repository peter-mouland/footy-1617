import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { FETCH_PLAYERS, SAVE_PLAYER_STATS, SAVE_PLAYER_POSITIONS } from '../actions';

import calculatePoints from './calculatePoints';

const defaultStatsState = { data: { players: [] }, status: {} };

const newPlayers = (players, data) => {
  return players.map(player => ({
    ...player,
    pos: !!data[player.fullName] ? data[player.fullName].pos : player.pos
  }));
};

function stats(state = defaultStatsState, action) {
  switch (action.type) {
    case FETCH_PLAYERS:
      return {
        ...state,
        data: {
          ...action.data,
          players: calculatePoints(action.data.players, action.timeFrame),
        },
        status: action.status
      };
    case SAVE_PLAYER_STATS:
      return {
        ...state,
        status: action.status
      };
    case SAVE_PLAYER_POSITIONS:
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

export default combineReducers({
  stats,
  routing
});
