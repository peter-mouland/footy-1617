#!/usr/bin/env node
var gsjson = require('google-spreadsheet-to-json');

var fs = require('fs');
var mkdirp = require("mkdirp");
var getDirName = require("path").dirname;

gsjson({
    spreadsheetId: '17Wl0UlbBfbd5xgrqC2kJcuSq0M76-yDiqb4xU5C9l-0',
    token: 'ya29.Ci83A9Z7ALUBK7Qt6enXht0tiHApiW1A3MW91vok7Q8RdLXJPR-hJMsJ9-s9-gl6rw',
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
