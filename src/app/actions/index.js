import api from '../api';

export const FETCH_STATS_SNAPSHOTS = 'FETCH_STATS_SNAPSHOTS';
export const FETCH_PLAYERS = 'FETCH_PLAYERS';
export const FETCH_WEEKLY_POINTS = 'FETCH_WEEKLY_POINTS';
export const SAVE_WEEKLY_POINTS = 'SAVE_WEEKLY_POINTS';
export const SAVE_STATS_SNAPSHOT = 'SAVE_STATS_SNAPSHOT';
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

export function saveWeeklyPoints(points) {
  return {
    type: SAVE_WEEKLY_POINTS,
    timeoutMs: 90000,
    promise: api.saveWeeklyPoints(points)
  };
}

export function saveStatsSnapshot(players) {
  return {
    type: SAVE_STATS_SNAPSHOT,
    timeoutMs: 90000,
    promise: api.saveStatsSnapshot(players)
  };
}

export function saveWeekEndTag(worksheet) {
  return {
    type: SAVE_WEEK_END_TAG,
    promise: api.saveWeekEndTag(worksheet)
  };
}

export function savePlayerPositions(playersToUpdate) {
  return {
    type: SAVE_PLAYER_POSITIONS,
    timeoutMs: 90000,
    promise: api.savePlayerPositions(playersToUpdate)
  };
}
