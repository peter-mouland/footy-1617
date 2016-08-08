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
          player.fullName = key;
          player.code = player.id;
          player.club = player.tName;
          if (!ffResults[key]) {
            unknownPlayers.push(player);
          }
          return {
            ...player,
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
