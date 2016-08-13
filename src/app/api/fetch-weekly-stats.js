import fetch from 'isomorphic-fetch';
import debug from 'debug';

import { checkStatus } from './utils';
import { localUrl } from '../utils';

const log = debug('footy:fetch-weekly-stats');

export default function fetchWeeklyStats() {
  return fetch(`${localUrl}/api/fetch-weekly-stats`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
    .then(checkStatus)
    .then((res) => res.json())
    .then((results) => {
      log('results', results);
      // const [ffResults, skyResults] = results;
      // const mergedPlayers = skyResults.players.map((player) => {
      //   const key = player.fName
      //     ? `${player.sName}, ${player.fName}`
      //     : `${player.sName}`;
      //
      //   const ffPlayerDetails = {
      //     ...player,
      //     fullName: key,
      //     code: player.id,
      //     club: player.tName,
      //   };
      //   return {
      //     ...ffPlayerDetails,
      //     pos: ffResults[key] ? ffResults[key].pos : 'unknown'
      //   };
      // });
      // return {
      //   updatedOn: ffResults.updatedOn,
      //   players: mergedPlayers
      // };
    });
}
