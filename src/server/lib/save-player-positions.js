import debug from 'debug';
import GoogleSpreadsheet from './google-sheets';
import json from './json';

const log = debug('footy:save-player-positions');

const buildRowObject = (item) => {
  return {
    code: item.code,
    pos: item.pos,
    player: item.fullName,
    club: item.club
  };
};

const createRows = (data) => Object.keys(data).map(row => buildRowObject(data[row]));
const spreadsheet = new GoogleSpreadsheet('167qhKgUtQAUto19Jniveo0pzrz59l2A9uDZcV50noTY');
const playerListSheet = spreadsheet.getWorksheet('player list');

function updateJsonPositions(data) {
  const ff = require('../../app/api/ff.json');// eslint-disable-line
  return Object.assign({}, ff, data, { updatedOn: new Date() });
}

function cleatFFJsonCache() {
  delete require.cache[require.resolve('../../app/api/ff.json')]; // eslint-disable-line
}

export default (data) => {
  const rows = createRows(data);
  const jsonData = updateJsonPositions(data);
  const updateGoogle = playerListSheet.addRows(rows);
  const updateJson = json.save(jsonData, 'src/app/api/ff.json').then(cleatFFJsonCache);
  return Promise
    .all([updateGoogle, updateJson])
    .then(() => log('done.'))
    .catch(e => log(e));
};

