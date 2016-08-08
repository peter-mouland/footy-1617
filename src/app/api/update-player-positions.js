import fetch from 'isomorphic-fetch';
import { checkStatus } from './utils'

export default () => {
  return fetch('/update-player-positions', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .then(checkStatus)
  .catch((error) => {
    console.log('request failed', error)
  });
}

