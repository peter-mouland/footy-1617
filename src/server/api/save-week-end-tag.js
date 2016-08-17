import debug from 'debug';

const log = debug('footy:save-week-end-tag');

export default (spreadsheet, worksheetToTag) => {
  return spreadsheet.getWorksheet('week end tags')
    .addRows([{ sheet: worksheetToTag.title }])
    .then(() => worksheetToTag)
    .catch(e => log(e));
};
