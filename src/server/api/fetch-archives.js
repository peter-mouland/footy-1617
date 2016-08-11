import debug from 'debug';

const log = debug('footy:fetch-player-archives');

export default (spreadsheet) => {
  const sheets = spreadsheet.getWorksheets();
  return sheets
    .whenComplete
    .then((worksheets) => {
      return worksheets.filter(sheet => sheet.title !== 'player list');
    })
    .catch(e => log(e));
};

