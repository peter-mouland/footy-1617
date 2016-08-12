import debug from 'debug';

const log = debug('footy:fetch-stats-snapshots');

export default (spreadsheet) => {
  const sheets = spreadsheet.getWorksheets();
  return sheets
    .then((worksheets) => {
      return worksheets.filter(sheet => sheet.title !== 'player list');
    })
    .catch(e => log(e));
};

