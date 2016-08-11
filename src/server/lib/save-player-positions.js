import debug from 'debug';
import GoogleSpreadsheet from './google-sheets';
import json from './json';
import creds from './google-sheets/google-generated-creds.json';

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
const spreadsheet = new GoogleSpreadsheet('167qhKgUtQAUto19Jniveo0pzrz59l2A9uDZcV50noTY', creds);
const playerListSheet = spreadsheet.getWorksheet('player list');

function updateJsonPositions(data) {
  const ff = require('../../app/api/ff.json');// eslint-disable-line
  const jsonData = Object.assign({}, ff, data);
  return json.save(jsonData, 'src/app/api/ff.json')
    .then(() => {
      delete require.cache[require.resolve('../../app/api/ff.json')]; // eslint-disable-line
    });
}

export default (data) => {
  const updateGoogle = playerListSheet.addRows(createRows(data));
  const updateJson = updateJsonPositions(data);
  return Promise
    .all([updateGoogle, updateJson])
    .then(() => log('done.'))
    .catch(e => log(e));
};

