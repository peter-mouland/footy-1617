import debug from 'debug';

const log = debug('footy:fetch-stats-snapshots');

export default (spreadsheet) => {
  const snapshotSheets = spreadsheet
    .getWorksheets()
    .then((worksheets) => {
      return worksheets
        .filter(sheet => (
          sheet.title !== 'player list' && sheet.title !== 'week end tags'
        ));
    })
    .catch(e => log(e));

  const weekEndTags = spreadsheet
    .getWorksheet('week end tags')
    .getCells()
    .then(cells => cells.map(cell => cell.value));

  return Promise.all([snapshotSheets, weekEndTags])
    .then(([snapshots, tags]) => {
      return snapshots.map(snapshot => {
        return {
          ...snapshot,
          weekEndTag: (tags.indexOf(snapshot.title) > -1)
        };
      });
    });
};

