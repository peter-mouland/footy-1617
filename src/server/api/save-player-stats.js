import debug from 'debug';

const log = debug('footy:save-player-stats');
const headers = [
  'code', 'position', 'player', 'club', 'starts', 'subs', 'goals', 'asts', 'cs',
  'con', 'penSvd', 'yells', 'reds', 'total'
];

const getTitle = () => {
  const date = new Date();
  const opts = { weekday: 'short', hour: '2-digit', minute: '2-digit' };
  const day = date.toLocaleDateString('en-GB', opts);
  return `${date.getFullYear()}/${date.getMonth()}/${date.getDate()} ${day}`;
};

const createWorksheetOptions = (data) => ({
  title: getTitle(),
  headers,
  rowCount: data.length + 1,
  colCount: headers.length
});

const createRowOptions = (data) => ({
  'return-empty': true,
  'min-row': 1 + 1,
  'max-row': data.length + 1
});

const createRows = (data) => data.map((player) => {
  return [
    null,
    player.id,
    player.pos,
    player.fullName,
    player.tName,
    player.ffPoints.starts,
    player.ffPoints.subs,
    player.ffPoints.goals,
    player.ffPoints.asts,
    player.ffPoints.cs,
    player.ffPoints.con,
    player.ffPoints.penSvd,
    player.ffPoints.yells,
    player.ffPoints.reds,
    player.ffPoints.total
  ];
});

export default (spreadsheet, data) => {
  return spreadsheet
    .addWorksheet(createWorksheetOptions(data))
    .addRowsBulk(createRows(data), createRowOptions(data))
    .then(() => log('done.'))
    .catch(e => log(e));
};

