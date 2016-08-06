import { PLAYER_STATS } from '../../config/paths'
import fetch from 'isomorphic-fetch';

export default () => {
  return fetch(PLAYER_STATS).then(function(response) {
    if (response.status >= 400) {
      throw new Error("Bad response from server");
    }
    return response.json();
  });
}

