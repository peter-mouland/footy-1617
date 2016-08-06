import ffPlayers from './ff-players'
import skyPlayers from './sky-players'

export default {
  fetchPlayers() {
    const unknownPlayers = [];

    return Promise.all([ffPlayers(), skyPlayers()])
      .then((results) => {
        const [ ffResults, skyResults ] = results;
        const mergedPlayers = skyResults.players.map((player) => {
          const key =  player.fName
            ? `${player.sName}, ${player.fName}`
            : `${player.sName}`;
          if (!ffResults[key]){
            unknownPlayers.push(key)
          }
          return {
            ...player,
            fullName: key,
            code: ffResults[key] ? ffResults[key].code : null,
            pos: ffResults[key] ? ffResults[key].pos : null
          }
        });
        return {
          unknown: unknownPlayers,
          players: mergedPlayers
        };
      });
  }
}
