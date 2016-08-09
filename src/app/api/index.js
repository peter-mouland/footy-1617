import ffPlayers from './fetch-ff-players';
import skyPlayers from './fetch-sky-players';
import savePlayerStats from './save-player-stats';
import updatePlayerPositions from './update-player-positions';

export default {
  fetchPlayers() {
    const unknownPlayers = [];

    return Promise.all([ffPlayers(), skyPlayers()])
      .then((results) => {
        const [ffResults, skyResults] = results;
        const mergedPlayers = skyResults.players.map((player) => {
          const key = player.fName
            ? `${player.sName}, ${player.fName}`
            : `${player.sName}`;
          if (!ffResults[key]) {
            unknownPlayers.push(player);
          }
          return {
            ...player,
            fullName: key,
            code: player.id,
            club: player.tName,
            pos: ffResults[key] ? ffResults[key].pos : null
          };
        });
        return {
          updatedOn: ffResults.updatedOn,
          unknown: unknownPlayers,
          players: mergedPlayers
        };
      });
  },

  savePlayerStats(data) {
    return savePlayerStats(data);
  },

  updatePlayerPositions() {
    return updatePlayerPositions();
  }
};
