import fetch from 'isomorphic-fetch';
import debug from 'debug';

import { checkStatus } from './utils';
import { localUrl } from '../utils';

const log = debug('footy:fetch-stats-snaphsots');

export default () => {
  return fetch(`${localUrl}/api/stats-snapshots`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
    .then(checkStatus)
    .then((res) => res.json())
    .catch((error) => {
      log('request failed', error);
    });
};

