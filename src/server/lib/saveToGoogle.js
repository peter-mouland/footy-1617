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
      console.log('Loaded doc: '+info.title+' by '+info.author.email);
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

const buildRow = (player) => {
  return {
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
  };
}

const addrowsSync = (sheet, rows, cb) => {
  if (!rows.length) return cb();
  const player = buildRow(rows[0]);
  sheet.addRow(player, (err) => {
    if (err) {
      console.log(`err`, err)
      throw new Error(err);
    } else {
      console.log(`${rows.length}`, player.player);
      rows.shift();
      addrowsSync(sheet, rows)
    }
  });
};

const addrowsASync = (sheet, rows) => {
  let completed = 0;
  const promises = rows.map((row) => {
    new Promise((resolve, reject) => {
      const player = buildRow(row);
      sheet.addRow(player, (err) => {
        if (err) reject(err);
        console.log(`${completed}`, player.player);
        resolve(player)
      });
    });
  });
  return Promise.all(promises);
};

function addStats(sheet, players) {
  return new Promise((resolve, reject)=> {
    addrowsSync(sheet, players, resolve);
  })
}

export default (data) => {
  return setAuth()
    .then(getInfoAndWorksheets)
    .then(addNewStatsSheets)
    .then((sheet) => addStats(sheet, data))
    .then(() => console.log('done.'))
    .catch(e => console.log(e))
};

