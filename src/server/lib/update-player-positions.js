#!/usr/bin/env node
import fs from 'fs';
import mkdirp from 'mkdirp';
import path from 'path';
import debug from 'debug';
import GoogleSpreadsheet from 'google-spreadsheet';

import creds from './google-generated-creds.json';

const log = debug('footy:update-player-positions');
const getDirName = path.dirname;
const doc = new GoogleSpreadsheet('167qhKgUtQAUto19Jniveo0pzrz59l2A9uDZcV50noTY');

const setAuth = () => new Promise((resolve) => doc.useServiceAccountAuth(creds, resolve));

function getPlayerList() {
  return new Promise((resolve, reject) => {
    doc.getInfo((err, info) => {
      if (err) reject(err);
      log(`Loaded doc: ${info.title} by ${info.author.email}`);
      const playerListSheet = info.worksheets
        .find(sheet => sheet.title.toLowerCase() === 'player list');
      resolve(playerListSheet);
    });
  });
}

function sheetToJson(sheet) {
  return new Promise((resolve, reject) => {
    sheet.getRows((err, info) => {
      if (err) reject(err);
      const players = info.reduce((prev, item) => {
        const player = {
          [item.player]: {
            code: item.code,
            pos: item.pos,
            player: item.player,
            club: item.club,
          }
        };
        return Object.assign(prev, player);
      }, {});
      players.updatedOn = new Date();
      resolve(players);
    });
  });
}

const writeJson = (url, json) => {
  return mkdirp(getDirName(url), (err) => {
    if (err) return log(err);
    return fs.writeFile(url, JSON.stringify(json, null, 2), (stringyErr) => {
      if (stringyErr) log(stringyErr);
      log(`${url} saved`);
    });
  });
};

function save(result) {
  return writeJson('src/app/api/ff.json', result);
}

export default () => {
  return setAuth()
    .then(getPlayerList)
    .then(sheetToJson)
    .then(save)
    .then(() => log('done.'))
    .catch(e => log(e));
};
