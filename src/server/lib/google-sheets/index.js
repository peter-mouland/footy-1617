import GoogleSpreadsheet from 'google-spreadsheet';
import debug from 'debug';

import creds from './google-generated-creds.json';

const log = debug('footy:google/connector');

const setAuth = (doc) => new Promise((resolve) => {
  doc.useServiceAccountAuth(creds, () => resolve(doc));
});
const getInfo = (doc) => new Promise((resolve, reject) => {
  doc.getInfo((err, sheet) => {
    if (err) reject(err);
    resolve(sheet);
  });
});

export default function Connect(id) {
  if (!this.connections) this.connections = {};
  if (!this.connections[id]) {
    const doc = new GoogleSpreadsheet(id);
    this.connections[id] = setAuth(doc)
      .then(getInfo)
      .then(workbook => {
        this.workbook = workbook;
        return workbook;
      })
      .catch(e => {
        log(e);
      });
  }
  return this;
}

Connect.prototype.getWorksheet = function getWorksheet(id) {
  if (!this.sheets) this.sheets = {};
  this.sheets[id] = Promise.all(Object.keys(this.connections).map(key => this.connections[key]))
    .then(() => {
      this.worksheet = this.workbook.worksheets.find(sheet => sheet.title.toLowerCase() === id);
      return this.worksheet;
    });
  return this;
};

function addRows(worksheet, rows, cb) {
  if (!rows.length) {
    cb(worksheet);
  } else {
    const row = rows[0];
    worksheet.addRow(row, (err) => {
      if (err) {
        log('err', err);
        throw new Error(err);
      } else {
        rows.shift();
        log(`${rows.length} remaining`);
        addRows(worksheet, rows, cb);
      }
    });
  }
}

Connect.prototype.addRows = function ConnectAddRows(rows) {
  this.rowsQueue = Promise.all(Object.keys(this.sheets).map(key => this.sheets[key]))
    .then(() => {
      return new Promise((resolve) => addRows(this.worksheet, rows, resolve));
    });
  return this;
};

