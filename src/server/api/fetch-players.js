import fetch from 'isomorphic-fetch';
import debug from 'debug';

const log = debug('footy:fetch-players');

const skyPlayers = () => {
  return fetch('https://fantasyfootball.skysports.com/cache/json_players.json')
    .then((response) => {
      if (response.status >= 400) {
        log('error');
        throw new Error('Bad response from server');
      }
      return response.json();
    });
};

const ffPlayers = () => require('./ff.json'); // eslint-disable-line

function mergePlayers({ ffResults, skyResults }) {
  return skyResults.players.map((player) => {
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
}

export default () => Promise.all([skyPlayers(), ffPlayers()])
  .then(([skyResults, ffResults]) => ({ skyResults, ffResults }))
  .then(mergePlayers);
