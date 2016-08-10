import ffPlayers from './fetch-ff-players';
import skyPlayers from './fetch-sky-players';
import savePlayerStats from './save-player-stats';
import savePlayerPositions from './save-player-positions';

export default {
  fetchPlayers() {
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
  },

  savePlayerStats,
  savePlayerPositions
};
