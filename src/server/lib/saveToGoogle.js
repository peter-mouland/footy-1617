var GoogleSpreadsheet = require('google-spreadsheet');
var doc = new GoogleSpreadsheet('167qhKgUtQAUto19Jniveo0pzrz59l2A9uDZcV50noTY');

const setAuth = () => {
  const creds = require('./google-generated-creds.json');
  return new Promise((resolve, reject) => {
    doc.useServiceAccountAuth(creds, resolve);
  });
};

function getInfoAndWorksheets() {
  return new Promise((resolve, reject)=>{
    doc.getInfo(function(err, info) {
      if (err) reject(err);
      // console.log('Loaded doc: '+info.title+' by '+info.author.email);
      // console.log(`info`, info)
      resolve(info)
    });
  })
}

function addNewStatsSheets() {
  return new Promise((resolve, reject)=> {
    doc.addWorksheet({
      title: new Date(),
      headers: [`code`,`position`,`player`,`club`,`starts`,`subs`,`goals`,`asts`,`cs`,`con`,`penSvd`,`yells`,`reds`,`total`],
      rowCount: 650,
      colCount: 20
    }, function (err, sheet) {
      if (err) reject(err);
      resolve(sheet);
    });
  });
}

function addStats(sheet, players) {
  console.log(`players to add: ${players.length}`);
  const promises = players.map((player, i)=> {
    return new Promise((resolve, reject)=> {
      sheet.addRow({
        code: player.id,
        position:  player.pos,
        player: player.fullName,
        club: player.tName,
        starts: player.ffPoints.starts,
        subs: player.ffPoints.subs,
        goals: player.ffPoints.goals,
        asts: player.ffPoints.asts,
        cs: player.ffPoints.cs,
        con: player.ffPoints.con,
        penSvd: player.ffPoints.penSvd,
        yells: player.ffPoints.yells,
        reds: player.ffPoints.reds,
        total: player.ffPoints.total
      }, () => {
        console.log(i, player.fullName);
        resolve()
      });
    });
  });
  return Promise.all(promises);
}

export default (data) => {
  return setAuth()
    .then(getInfoAndWorksheets)
    .then(addNewStatsSheets)
    .then((sheet) => addStats(sheet, data))
    .then(()=>console.log(`done.`))
    .catch(e => console.log(e))
};


function workingWithCells(step) {
    sheet.getCells({
      'min-row': 1,
      'max-row': 5,
      'return-empty': true
    }, function(err, cells) {
      var cell = cells[0];
      console.log('Cell R'+cell.row+'C'+cell.col+' = '+cells.value);

      // cells have a value, numericValue, and formula
      cell.value == '1'
      cell.numericValue == 1;
      cell.formula == '=ROW()';

      // updating `value` is "smart" and generally handles things for you
      cell.value = 123;
      cell.value = '=A1+B2'
      cell.save( cb); //async

      // bulk updates make it easy to update many cells at once
      cells[0].value = 1;
      cells[1].value = 2;
      cells[2].formula = '=A1+B1';
      sheet.bulkUpdateCells(cells, cb); //async

      step();
    });
  }

