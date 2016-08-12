import fetch from 'isomorphic-fetch';
import debug from 'debug';

import { checkStatus } from './utils';
import { localUrl } from '../utils';

const log = debug('footy:save-week-end-tags');

export default (data) => {
  return fetch(`${localUrl}/api/save-week-end-tags`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(checkStatus)
    .then((res) => {
      return res.json().then((json) => {
        log('json', json);
        return {
          tag: json
        };
      });
    })
  .catch((error) => {
    log('request failed', error);
  });
};

