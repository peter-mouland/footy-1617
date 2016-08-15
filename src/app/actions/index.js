import api from '../api';

export const FETCH_STATS_SNAPSHOTS = 'FETCH_STATS_SNAPSHOTS';
export const FETCH_PLAYERS = 'FETCH_PLAYERS';
export const FETCH_WEEKLY_POINTS = 'FETCH_WEEKLY_POINTS';
export const SAVE_PLAYER_STATS = 'SAVE_PLAYER_STATS';
export const SAVE_PLAYER_POSITIONS = 'SAVE_PLAYER_POSITIONS';
export const SAVE_WEEK_END_TAG = 'SAVE_WEEK_END_TAG';

export function fetchPlayers() {
  return {
    type: FETCH_PLAYERS,
    timeFrame: 'season', // week / month / season
    promise: api.fetchPlayers()
  };
}

export function fetchWeeklyPoints() {
  return {
    type: FETCH_WEEKLY_POINTS,
    timeFrame: 'season', // week / month / season
    promise: api.fetchWeeklyPoints()
  };
}

export function fetchStatsSnapshots() {
  return {
    type: FETCH_STATS_SNAPSHOTS,
    promise: api.fetchStatsSnapshots()
  };
}

export function savePlayerStats(players) {
  return {
    type: SAVE_PLAYER_STATS,
    timeoutMs: 90000,
    promise: api.savePlayerStats(players)
  };
}

export function saveWeekEndTag(worksheetTitle) {
  return {
    type: SAVE_WEEK_END_TAG,
    promise: api.saveWeekEndTag(worksheetTitle)
  };
}

export function savePlayerPositions(playersToUpdate) {
  return {
    type: SAVE_PLAYER_POSITIONS,
    timeoutMs: 90000,
    promise: api.savePlayerPositions(playersToUpdate)
  };
}
