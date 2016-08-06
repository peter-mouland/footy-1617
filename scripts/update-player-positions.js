#!/usr/bin/env node
var gsjson = require('google-spreadsheet-to-json');

var fs = require('fs');
var mkdirp = require("mkdirp");
var getDirName = require("path").dirname;

const secretSquirellStuff = {"web":{"client_id":"1031181206488-99j3vqarkq2987qu6qivlcrc2ql12l37.apps.googleusercontent.com","project_id":"footy-1617","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://accounts.google.com/o/oauth2/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"lQY7ncIdwYErIWA0MF-9mM0w"}}

gsjson({
    spreadsheetId: '17Wl0UlbBfbd5xgrqC2kJcuSq0M76-yDiqb4xU5C9l-0',
    token: 'ya29.Ci83A3H7Ie-F5wMKX0dGT1N8iSteGrPIiROhsLq0y_EOqWOQXkop9J8DpqM4OIB5uQ',
    hash: 'player',
  })
  .then(function(result) {
    return writeJson('src/app/api/ff.json', result)
  })
  .catch(function(err) {
    console.log(err.message);
    console.log(err.stack);
  });

const writeJson = (url, json) => {
  return mkdirp(getDirName(url), function (err) {
    if (err) return console.log(err);
    fs.writeFile(url, JSON.stringify(json, null, 2), function(err){
      if (err) console.log(err);
      console.log(url + ' saved');
    });
  });
};
