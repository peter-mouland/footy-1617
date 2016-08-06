import ffPlayers from './ff-players'
import skyPlayers from './sky-players'

export default {
  fetchPlayers() {
    return Promise.all([ffPlayers(), skyPlayers()])
      .then((results) => {
        const [ ffResults, skyResults ] = results;
        const merged = skyResults.players.map((player) => {
          const key =  player.fName
            ? `${player.sName}, ${player.fName}`
            : `${player.sName}`;
          return {
            ...player,
            pos: ffResults[key] ? ffResults[key].pos : key
          }
        });
        return merged;
      });
  }
}
