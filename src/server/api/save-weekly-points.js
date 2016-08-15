import debug from 'debug';

const log = debug('footy:save-weekly-points');
const headers = [
  'code', 'position', 'player', 'club', 'total'
];

const getTitle = () => {
  const date = new Date();
  const opts = { weekday: 'short', hour: '2-digit', minute: '2-digit' };
  const day = date.toLocaleDateString('en-GB', opts);
  return `points: ${date.getFullYear()}/${date.getMonth()}/${date.getDate()} ${day}`;
};

const createWorksheetOptions = (data, weeks) => ({
  title: getTitle(),
  headers: headers.concat(weeks),
  rowCount: data.length + 1,
  colCount: headers.length + weeks.length
});

const createRowOptions = (data) => ({
  'return-empty': true,
  'min-row': 1 + 1,
  'max-row': data.length + 1
});

const createRows = (data, weeks) => data.map((player) => {
  const cols = [
    null,
    player.code,
    player.position,
    player.player,
    player.club,
    player.total
  ];
  weeks.forEach(week => cols.push(player[week]));
  return cols;
});

export default (spreadsheet, data) => {
  const weeks = Object.keys(data[0]).filter(key => key.indexOf('week') > -1);
  return spreadsheet
    .addWorksheet(createWorksheetOptions(data, weeks))
    .addRowsBulk(createRows(data, weeks), createRowOptions(data))
    .then(() => log('done.'))
    .catch(e => log(e));
};

