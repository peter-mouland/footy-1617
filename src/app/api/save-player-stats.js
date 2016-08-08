import fetch from 'isomorphic-fetch';
import { checkStatus } from './utils'

export default (data) => {
  return fetch('/save-player-stats', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(checkStatus)
  .catch((error) => {
    console.log('request failed', error)
  });
}

