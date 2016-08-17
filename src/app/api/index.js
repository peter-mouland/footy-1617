import { getJSON, postJSON } from './utils';

export default {
  fetchPlayers() {
    return getJSON('api/player-stats');
  },
  fetchStatsSnapshots() {
    return getJSON('api/stats-snapshots');
  },
  fetchWeeklyPoints() {
    return getJSON('api/weekly-points');
  },
  saveWeeklyPoints(data) {
    return postJSON('api/save-player-positions', data);
  },
  saveStatsSnapshot(data) {
    return postJSON('api/save-stats-snapshot', data);
  },
  saveWeekEndTag(data) {
    return postJSON('api/save-week-end-tag', data);
  },
  savePlayerPositions(data) {
    return postJSON('api/save-player-positions', data);
  }
};
