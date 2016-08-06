var gsjson = require('google-spreadsheet-to-json');

export default function fetchPlayers() {
  return gsjson({
    spreadsheetId: '17Wl0UlbBfbd5xgrqC2kJcuSq0M76-yDiqb4xU5C9l-0',
    token: 'ya29.Ci83A3VfxJB2mDiYqOhmgnBKFR_JUoVFuVcXYig07ExlZ_JLtSk1th04Awhw5tqWZA',
    hash: 'player',
    // other options...
  })
    .then(function(result) {
      console.log(result.length);
      // console.log(result);
      return result;
    })
    .catch(function(err) {
      console.log(err.message);
      console.log(err.stack);
    });
};
