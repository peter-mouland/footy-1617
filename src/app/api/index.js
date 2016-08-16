import fetch from 'isomorphic-fetch';
import debug from 'debug';

import { checkStatus } from './utils';
import { localUrl } from '../utils';
import mergePlayerInfo from './merge-player-info';

const log = debug('footy:api/index');

const jsonOpts = (method, data) => ({
  method,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
});

const fetchUrl = (url, opts) => {
  return fetch(`${localUrl}/${url}`, opts)
    .then(checkStatus)
    .then((res) => res.json())
    .then((json) => json)
    .catch((error) => {
      log('request failed', error);
    });
};
const getJSON = (url) => fetchUrl(url, jsonOpts('GET'));
const postJSON = (url, data) => fetchUrl(url, jsonOpts('POST', data));

function ffPlayers() {
  return require('./ff.json'); // eslint-disable-line
}

export default {
  fetchPlayers() {
    return Promise.all([getJSON('api/sky-players'), ffPlayers()])
      .then(([skyResults, ffResults]) => ({ skyResults, ffResults }))
      .then(mergePlayerInfo);
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
    return postJSON('api/save-week-end-tag', [{ sheet: data.title }])
      .then(() => ({
        ...data,
        weekEndTag: true
      }));
  },
  savePlayerPositions(data) {
    return postJSON('api/save-player-positions', data);
  }
};
