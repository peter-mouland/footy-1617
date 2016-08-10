import api from '../api';

export const FETCH_PLAYERS = 'FETCH_PLAYERS';
export const SAVE_PLAYER_STATS = 'SAVE_PLAYER_STATS';
export const SAVE_PLAYER_POSITIONS = 'SAVE_PLAYER_POSITIONS';

export function fetchPlayers() {
  return {
    type: FETCH_PLAYERS,
    timeFrame: 'season', // week / month / season
    promise: api.fetchPlayers()
  };
}

// post stats to google
export function savePlayerStats(players) {
  return {
    type: SAVE_PLAYER_STATS,
    timeoutMs: 90000,
    promise: api.savePlayerStats(players)
  };
}

export function savePlayerPositions(playersToUpdate) {
  return {
    type: SAVE_PLAYER_POSITIONS,
    timeoutMs: 90000,
    promise: api.savePlayerPositions(playersToUpdate)
  };
}
