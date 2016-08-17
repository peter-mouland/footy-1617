import fetch from 'isomorphic-fetch';
import debug from 'debug';

import { localUrl } from '../utils';

const log = debug('footy:api/index');

export function checkStatus(response) {
  if (response.status < 200 || response.status >= 300) {
    const error = new Error(response.statustext);
    error.response = response;
    throw error;
  }
  return response;
}

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
export const getJSON = (url) => fetchUrl(url, jsonOpts('GET'));
export const postJSON = (url, data) => fetchUrl(url, jsonOpts('POST', data));
