import fetch from 'isomorphic-fetch';
import debug from 'debug';

import { checkStatus } from './utils';

const log = debug('footy:save-player-positions');

export default () => {
  return fetch('http://localhost:3000/api/archives', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
    .then(checkStatus)
    .then((res) => {
      return res.json().then((json) => {
        return {
          archives: json
        };
      });
    })
    .catch((error) => {
      log('request failed', error);
    });
};

