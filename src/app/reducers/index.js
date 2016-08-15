import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import * as actions from '../actions';

import calculatePoints from './calculatePoints';

const defaultStatsState = { };

const newPlayers = (players, data) => {
  return players.map(player => ({
    ...player,
    pos: !!data[player.fullName] ? data[player.fullName].pos : player.pos
  }));
};

const newTag = (rows, data) => {
  return rows.map(row => {
    return (row.id === data.id) ? data : row;
  });
};

function stats(state = defaultStatsState, action) {
  switch (action.type) {
    case actions.FETCH_PLAYERS:
      return {
        ...state,
        players: calculatePoints(action.data, action.timeFrame),
        status: action.status
      };
    case actions.FETCH_WEEKLY_POINTS:
      return {
        ...state,
        weekly: action.data,
        status: action.status
      };
    case actions.SAVE_WEEKLY_POINTS:
      return {
        ...state,
        weekly: action.data,
        status: action.status
      };
    case actions.SAVE_STATS_SNAPSHOT:
      return {
        ...state,
        status: action.status
      };
    case actions.SAVE_PLAYER_POSITIONS:
      return {
        ...state,
        players: newPlayers(state.players, action.data),
        status: action.status
      };
    default:
      return state;
  }
}

function statsSnapshots(state = defaultStatsState, action) {
  switch (action.type) {
    case actions.SAVE_WEEK_END_TAG:
      return {
        ...state,
        data: newTag(state.data, action.data),
        status: action.status
      };
    case actions.FETCH_STATS_SNAPSHOTS:
      return {
        ...state,
        data: action.data,
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
