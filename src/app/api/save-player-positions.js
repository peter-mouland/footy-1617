import fetch from 'isomorphic-fetch';
import debug from 'debug';

import { checkStatus } from './utils';
import { localUrl } from '../utils';

const log = debug('footy:save-player-positions');

export default (data) => {
  return fetch(`${localUrl}/api/save-player-positions`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(checkStatus)
    .then(() => data)
    .catch((error) => {
      log('request failed', error);
    });
};

