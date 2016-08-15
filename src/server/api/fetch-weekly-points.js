import debug from 'debug';
import statsSnapshots from './fetch-stats-snapshots';

const log = debug('footy:fetch-weekly-points');

export default (spreadsheet) => {
  const weekEndTitles = statsSnapshots(spreadsheet)
    .then(snapshots => snapshots.filter(snapshot => !!snapshot.weekEndTag))
    .then(snapshots => snapshots.map(snapshot => snapshot.title))
    .catch(e => log(e));

  const allSheets = spreadsheet.getWorksheets().catch(e => log(e));

  const weeklyPoints = Promise.all([weekEndTitles, allSheets])
    .then(([weekEnds, worksheets]) => {
      return worksheets.filter(worksheet => weekEnds.indexOf(worksheet.title) > -1);
    })
    .then(sheets => {
      const ps = sheets.map(sheet => {
        const title = sheet.title;
        return spreadsheet
          .getRows(sheet)
          .then(rows => ({ title, rows }));
      });
      return Promise.all(ps);
    })
    .then(sheets => {
      if (!sheets.length) return [];
      const latest = sheets[sheets.length - 1];
      const newS = latest.rows;
      sheets.forEach((sheet, sIterator) => {
        return sheet.rows.forEach((row, rIterator) => {
          newS[rIterator][`week${sIterator + 1}`] = (sIterator === 0)
            ? row.total
            : row.total - sheets[sIterator - 1].rows[rIterator].total;
        });
      });
      return newS;
    })
    .catch(e => log(e));
  return weeklyPoints;
};

