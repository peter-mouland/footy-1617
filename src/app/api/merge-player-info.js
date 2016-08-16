export default function fetchPlayers({ ffResults, skyResults }) {
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
