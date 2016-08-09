import debug from 'debug';
import mkdirp from 'mkdirp';
import fs from 'fs';
import path from 'path';
import GoogleSpreadsheet from './google-sheets';

const getDirName = path.dirname;
const log = debug('footy:save-player-positions');
const buildRowObject = (player) => {
  return {
    code: player.code,
    pos: player.pos,
    player: player.fullName,
    club: player.club
  };
};

const createRows = (data) => Object.keys(data).map(row => buildRowObject(data[row]));
const spreadsheet = new GoogleSpreadsheet('167qhKgUtQAUto19Jniveo0pzrz59l2A9uDZcV50noTY');
const playerListSheet = spreadsheet.getWorksheet('player list');

const writeJson = (file, json, resolve) => {
  return mkdirp(getDirName(file), (err) => {
    if (err) return log(err);
    return fs.writeFile(file, JSON.stringify(json, null, 2), (stringyErr) => {
      if (stringyErr) log(stringyErr);
      log(`${file} saved`);
      resolve();
    });
  });
};

function saveJson(result) {
  return new Promise((resolve) => {
    writeJson('src/app/api/ff.json', result, resolve);
  });
}

function updateJsonPositions(data) {
  const ff = require('../../app/api/ff.json');// eslint-disable-line
  return Object.assign({}, ff, data, { updatedOn: new Date() });
}

function cleatFFJsonCache() {
  delete require.cache[require.resolve('../../app/api/ff.json')]; // eslint-disable-line
}

export default (data) => {
  const rows = createRows(data);
  const json = updateJsonPositions(data);
  const updateGoogle = playerListSheet.addRows(rows);
  const updateJson = saveJson(json).then(cleatFFJsonCache);
  return Promise
    .all([updateGoogle, updateJson])
    .then(() => log('done.'))
    .catch(e => log(e));
};

