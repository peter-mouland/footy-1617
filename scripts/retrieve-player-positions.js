#!/usr/bin/env node
import debug from 'debug';

import GoogleSpreadsheet from '../src/server/lib/google-sheets';
import creds from '../src/server/lib/google-sheets/google-generated-creds.json';
import json from '../src/server/lib/json';

const log = debug('footy:retrieve-player-positions');

const createJsonObj = (item) => ({
  [item.player]: {
    code: item.code,
    pos: item.pos,
    player: item.player,
    club: item.club,
  }
});

const spreadsheet = new GoogleSpreadsheet('167qhKgUtQAUto19Jniveo0pzrz59l2A9uDZcV50noTY', creds);
const playerListSheet = spreadsheet.getWorksheet('player list');

playerListSheet
  .toJson(createJsonObj)
  .whenComplete
    .then((jsonData) => json.save(jsonData, 'src/app/api/ff.json'))
    .then(() => log('done.'))
    .catch(e => log(e));
