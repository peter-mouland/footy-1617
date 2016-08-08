import GoogleSpreadsheet from 'google-spreadsheet';
import debug from 'debug';

import creds from './google-generated-creds.json';

const log = debug('footy:saveToGoogle');
const doc = new GoogleSpreadsheet('167qhKgUtQAUto19Jniveo0pzrz59l2A9uDZcV50noTY');
const headers = [
  'code', 'position', 'player', 'club', 'starts', 'subs', 'goals', 'asts', 'cs',
  'con', 'penSvd', 'yells', 'reds', 'total'
];
const setAuth = () => new Promise((resolve) => doc.useServiceAccountAuth(creds, resolve));

function getInfoAndWorksheets() {
  return new Promise((resolve, reject) => {
    doc.getInfo((err, info) => {
      if (err) reject(err);
      log(`Loaded doc: ${info.title} by ${info.author.email}`);
      resolve(info);
    });
  });
}

function addNewStatsSheets(data) {
  log(`Add worksheet ${(data.length + 1)} * ${headers.length} Cells...`);
  return new Promise((resolve, reject) => {
    doc.addWorksheet({
      title: new Date(),
      headers: headers,
      rowCount: data.length + 1,
      colCount: headers.length
    }, (err, sheet) => {
      if (err) reject(err);
      resolve(sheet);
    });
  });
}

// const buildRowObject = (player) => {
//   return {
//     code: player.id,
//     position: player.pos,
//     player: player.fullName,
//     club: player.tName,
//     starts: player.ffPoints.starts,
//     subs: player.ffPoints.subs,
//     goals: player.ffPoints.goals,
//     asts: player.ffPoints.asts,
//     cs: player.ffPoints.cs,
//     con: player.ffPoints.con,
//     penSvd: player.ffPoints.penSvd,
//     yells: player.ffPoints.yells,
//     reds: player.ffPoints.reds,
//     total: player.ffPoints.total
//   };
// };


const buildRowArray = (player) => {
  return [
    null,
    player.id,
    player.pos,
    player.fullName,
    player.tName,
    player.ffPoints.starts,
    player.ffPoints.subs,
    player.ffPoints.goals,
    player.ffPoints.asts,
    player.ffPoints.cs,
    player.ffPoints.con,
    player.ffPoints.penSvd,
    player.ffPoints.yells,
    player.ffPoints.reds,
    player.ffPoints.total
  ]
};

const addrows = (sheet, players) => {
  const playerCount = players.length;
  log(`Retrieving ${(playerCount+1)} * ${headers.length} Cells...`);
  return new Promise((resolve, reject) => {
    sheet.getCells({
      'return-empty': true,
      'min-row': 1 + 1,
      'max-row': playerCount + 1
    }, function(err, cells) {
      if (err) reject(err);
      log(`Calculating new Cells...`);
      const playersArray = players.map(buildRowArray);
      cells.forEach((cell, i) => {
        try {
          cell.value = String(playersArray[cell.row - 2][cell.col]);
        } catch (e) {
          log(`NOT FOUND ${i} : R${cell.row} C${cell.col} playersArray:${playersArray.length}`)
        }
      });
      log(`Updating Cells...`);
      sheet.bulkUpdateCells(cells, () =>{
        log(`finished updating`);
        resolve();
      });
    });
  });
};

// const addrowsSync = (sheet, rows, cb) => {
//   if (!rows.length) {
//     cb();
//   } else {
//     const player = buildRow(rows[0]);
//     sheet.addRow(player, (err) => {
//       if (err) {
//         log('err', err);
//         throw new Error(err);
//       } else {
//         log(`${rows.length}`, player.player);
//         rows.shift();
//         addrowsSync(sheet, rows);
//       }
//     });
//   }
// };

// const addrowsASync = (sheet, rows) => {
//   let completed = 0;
//   const promises = rows.map((row) => {
//     new Promise((resolve, reject) => {
//       const player = buildRow(row);
//       sheet.addRow(player, (err) => {
//         if (err) reject(err);
//         log(`${completed}`, player.player);
//         resolve(player);
//       });
//     });
//   });
//   return Promise.all(promises);
// };

function addStats(sheet, players) {
  return new Promise((resolve) => {
    addrows(sheet, players, resolve);
  });
}

export default (data) => {
  return setAuth()
    .then(getInfoAndWorksheets)
    .then(() => addNewStatsSheets(data))
    .then((sheet) => addStats(sheet, data))
    .then(() => log('done.'))
    .catch(e => log(e));
};

