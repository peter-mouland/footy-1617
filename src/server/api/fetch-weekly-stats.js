import debug from 'debug';

const log = debug('footy:fetch-weekly-stats');

export default (spreadsheet) => {
  const fetchWeeklyStats = spreadsheet
    .getWorksheets()
    .then((worksheets) => {
      return worksheets
        .filter(sheet => (
          sheet.title !== 'player list' && sheet.title !== 'week end tags'
        ));
    })
    .catch(e => log(e));

  return fetchWeeklyStats;
};

