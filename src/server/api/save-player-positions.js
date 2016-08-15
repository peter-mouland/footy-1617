import debug from 'debug';
import json from '../lib/json';

const log = debug('footy:save-player-positions');

const buildRowObject = (item) => {
  return {
    code: item.code,
    pos: item.pos,
    player: item.fullName,
    club: item.club,
    new: item.pos !== 'park'
  };
};

const createRows = (data) => Object.keys(data).map(row => buildRowObject(data[row]));

function updateJsonPositions(data) {
  const ff = require('../../app/api/ff.json');// eslint-disable-line
  const jsonData = Object.assign({}, ff, data);
  return json.save(jsonData, 'src/app/api/ff.json')
    .then(() => {
      delete require.cache[require.resolve('../../app/api/ff.json')]; // eslint-disable-line
    });
}

export default (spreadsheet, data) => {
  const playerListSheet = spreadsheet.getWorksheet('player list');
  const updateGoogle = playerListSheet.addRows(createRows(data));
  const updateJson = updateJsonPositions(data);
  return Promise
    .all([updateGoogle, updateJson])
    .then(() => log('done.'))
    .then(() => data)
    .catch(e => log(e));
};

