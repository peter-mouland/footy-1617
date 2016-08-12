import debug from 'debug';

const log = debug('footy:save-week-end-tag');

export default (spreadsheet, worksheetTitle) => {
  // console.log('worksheetTitle', worksheetTitle);
  spreadsheet.getWorksheet('week end tags')
    .addRows([worksheetTitle])
    .then(() => log('done.'))
    .catch(e => log(e));
};

