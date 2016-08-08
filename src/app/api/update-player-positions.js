import fetch from 'isomorphic-fetch';
import debug from 'debug';

import { checkStatus } from './utils';

const log = debug('footy:update-player-positions');

export default () => {
  return fetch('/update-player-positions', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .then(checkStatus)
  .catch((error) => {
    log('request failed', error);
  });
};

