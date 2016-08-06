import stats from '../api/stats';

export const FETCH_PLAYERS = 'FETCH_PLAYERS';

export function fetchPlayers() {
  return {
    type: FETCH_PLAYERS,
    timeFrame: 'season', // week / month / season
    promise: stats.fetchPlayers()
  };
}
