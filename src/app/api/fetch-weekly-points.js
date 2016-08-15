import fetch from 'isomorphic-fetch';
import debug from 'debug';

import { checkStatus } from './utils';
import { localUrl } from '../utils';

const log = debug('footy:fetch-weekly-points'); // eslint-disable-line

export default function fetchWeeklyPoints() {
  return fetch(`${localUrl}/api/weekly-points`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
    .then(checkStatus)
    .then((res) => res.json())
    .then((json) => json)
    .then((results) => results);
}
