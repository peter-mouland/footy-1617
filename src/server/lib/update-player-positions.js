#!/usr/bin/env node
var fs = require('fs');
var mkdirp = require("mkdirp");
var getDirName = require("path").dirname;


var GoogleSpreadsheet = require('google-spreadsheet');
var doc = new GoogleSpreadsheet('167qhKgUtQAUto19Jniveo0pzrz59l2A9uDZcV50noTY');

const setAuth = () => {
  const creds = require('./google-generated-creds.json');
  return new Promise((resolve, reject) => {
    doc.useServiceAccountAuth(creds, resolve);
  });
};

function getPlayerList() {
  return new Promise((resolve, reject)=>{
    doc.getInfo(function(err, info) {
      if (err) reject(err);
      console.log('Loaded doc: '+info.title+' by '+info.author.email);
      const playerListSheet = info.worksheets
        .find(sheet => sheet.title.toLowerCase() === 'player list');
      resolve(playerListSheet)
    });
  })
}

function sheetToJson(sheet){
  return new Promise((resolve, reject)=>{
    sheet.getRows(function(err, info) {
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
      resolve(players)
    });
  })
}

export default () => {
   return setAuth()
    .then(getPlayerList)
    .then(sheetToJson)
    .then(save)
    .then(() => console.log('done.'))
    .catch(e => console.log(e));
};




function save(result) {
  return writeJson('src/app/api/ff.json', result)
}
const writeJson = (url, json) => {
  return mkdirp(getDirName(url), function (err) {
    if (err) return console.log(err);
    fs.writeFile(url, JSON.stringify(json, null, 2), function(err){
      if (err) console.log(err);
      console.log(url + ' saved');
    });
  });
};
