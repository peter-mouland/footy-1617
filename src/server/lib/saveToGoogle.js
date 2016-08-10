import GoogleSpreadsheet from './google-sheets';
import debug from 'debug';

const log = debug('footy:saveToGoogle');

const spreadsheet = new GoogleSpreadsheet('167qhKgUtQAUto19Jniveo0pzrz59l2A9uDZcV50noTY');
const headers = [
  'code', 'position', 'player', 'club', 'starts', 'subs', 'goals', 'asts', 'cs',
  'con', 'penSvd', 'yells', 'reds', 'total'
];
const createWorksheetOptions = (data) => ({
  title: new Date(),
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

export default (data) => {
  return spreadsheet
    .addWorksheet(createWorksheetOptions(data))
    .addRowsBulk(createRows(data), createRowOptions(data))
    .whenComplete
    .then(() => log('done.'))
    .catch(e => log(e));
};

