import fetch from 'isomorphic-fetch';
import debug from 'debug';

import { checkStatus } from './utils';

const log = debug('footy:save-player-stats');

export default (data) => {
  return fetch('/api/save-player-stats', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(checkStatus)
  .catch((error) => {
    log('request failed', error);
  });
};

