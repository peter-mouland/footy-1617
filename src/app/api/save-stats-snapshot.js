import fetch from 'isomorphic-fetch';
import debug from 'debug';

import { checkStatus } from './utils';
import { localUrl } from '../utils';

const log = debug('footy:save-stats-snapshot');

export default (data) => {
  return fetch(`${localUrl}/api/save-stats-snapshot`, {
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

