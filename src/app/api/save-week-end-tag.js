import fetch from 'isomorphic-fetch';
import debug from 'debug';

import { checkStatus } from './utils';
import { localUrl } from '../utils';

const log = debug('footy:save-week-end-tags');

export default (data) => {
  return fetch(`${localUrl}/api/save-week-end-tag`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify([{ sheet: `'${data.title}` }])
  })
  .then(checkStatus)
  .then((res) => res.json())
  .then(() => {
    return {
      ...data,
      weekEndTag: true
    };
  })
  .catch((error) => {
    log('request failed', error);
  });
};

