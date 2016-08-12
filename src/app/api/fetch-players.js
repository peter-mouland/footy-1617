import fetch from 'isomorphic-fetch';
import debug from 'debug';

import { checkStatus } from './utils';

const log = debug('footy:fetch-players');

function skyPlayers() {
  return fetch('https://fantasyfootball.skysports.com/cache/json_players.json')
    .then((response) => {
      if (response.status >= 400) {
        throw new Error('Bad response from server');
      }
      return response.json();
    });
}

function ffPlayers() {
  return require('./ff.json'); // eslint-disable-line
}

export default function fetchPlayers() {
  return Promise.all([ffPlayers(), skyPlayers()])
    .then((results) => {
      const [ffResults, skyResults] = results;
      const mergedPlayers = skyResults.players.map((player) => {
        const key = player.fName
          ? `${player.sName}, ${player.fName}`
          : `${player.sName}`;

        const ffPlayerDetails = {
          ...player,
          fullName: key,
          code: player.id,
          club: player.tName,
        };
        return {
          ...ffPlayerDetails,
          pos: ffResults[key] ? ffResults[key].pos : 'unknown'
        };
      });
      return {
        updatedOn: ffResults.updatedOn,
        players: mergedPlayers
      };
    });
}
