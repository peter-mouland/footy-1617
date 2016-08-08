import { SKY_PLAYER_STATS } from '../../config/paths';
import fetch from 'isomorphic-fetch';

export default () => {
  return fetch(SKY_PLAYER_STATS).then((response) => {
    if (response.status >= 400) {
      throw new Error('Bad response from server');
    }
    return response.json();
  });
};

