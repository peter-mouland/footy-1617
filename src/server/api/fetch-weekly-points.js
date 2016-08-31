import debug from 'debug';

const log = debug('footy:fetch-weekly-points');

const isSnapshot = (sheet) => sheet.title.indexOf('snapshot') > -1;
const isWeekEndTags = (sheet) => sheet.title.indexOf('week end tags') > -1;
const statsSnapshots = (spreadsheet) => {
  const snapshotSheets = [];
  const weekEndTags = [];
  return spreadsheet
    .getWorksheets()
    .then((worksheets) => worksheets.forEach(sheet => {
      isSnapshot(sheet) && snapshotSheets.push(sheet); // eslint-disable-line
      isWeekEndTags(sheet) && weekEndTags.push(sheet); // eslint-disable-line
    }))
    .then(() => {
      return spreadsheet.getCells(weekEndTags[0]).then(cells => cells.map(cell => cell.value));
    })
    .then((tags) => {
      return Promise.all(
        snapshotSheets
          .filter(snapshot => (tags.indexOf(snapshot.title) > -1))
          .sort((a, b) => a.title > b.title) // eslint-disable-line
          .map(sheet => spreadsheet.getRows(sheet).then(rows => rows))
      );
    });
};

export default (spreadsheet) => {
  return statsSnapshots(spreadsheet)
    .then(sheets => {
      if (!sheets.length) return [];
      const latest = {};
      const previousTotal = {};
      sheets[sheets.length - 1].forEach(row => { latest[row.code] = row; });
      sheets.forEach((sheet, sIterator) => {
        return sheet.forEach(row => {
          delete latest[row.code].id;
          delete latest[row.code]._xml; // eslint-disable-line
          delete latest[row.code]._links; // eslint-disable-line
          delete latest[row.code]['app:edited'];
          latest[row.code][`week${sIterator + 1}`] = row.total - (previousTotal[row.code] || 0);
          previousTotal[row.code] = row.total;
        });
      });
      return latest;
    })
    .then(latest => Object.keys(latest).map(key => latest[key]))
    .catch(e => log(e));
};

