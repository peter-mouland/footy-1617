import debug from 'debug';

const log = debug('footy:save-week-end-tag');

export default (spreadsheet, tags) => {
  return spreadsheet.getWorksheet('week end tags')
    .addRows(tags)
    .catch(e => log(e));
};

