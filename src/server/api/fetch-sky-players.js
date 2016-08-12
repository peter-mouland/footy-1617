import fetch from 'isomorphic-fetch';
import debug from 'debug';

const log = debug('footy:fetch-sky-players');

export default () => {
  return fetch('https://fantasyfootball.skysports.com/cache/json_players.json')
    .then((response) => {
      if (response.status >= 400) {
        log('error');
        throw new Error('Bad response from server');
      }
      return response.json();
    });
};

