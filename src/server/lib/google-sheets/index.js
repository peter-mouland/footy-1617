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

const getRows = (doc) => new Promise((resolve, reject) => {
  doc.getRows((err, rows) => {
    if (err) reject(err);
    resolve(rows);
  });
});

const addRow = (doc, row) => new Promise((resolve, reject) => {
  doc.addRow(row, (err) => {
    if (err) reject(err);
    resolve();
  });
});

const onceResolved = (obj) => Promise.all(Object.keys(obj).map(key => obj[key]));

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
  if (!this.worksheets) this.worksheets = {};
  this.worksheets[id] = onceResolved(this.connections)
    .then(() => {
      this.worksheet = this.workbook.worksheets.find(sheet => sheet.title.toLowerCase() === id);
      return this.worksheet;
    });
  return this;
};

function addRows(worksheet, rows, cb) {
  if (!rows.length) return cb(worksheet);
  return addRow(worksheet, rows[0]).then(() => {
    rows.shift();
    log(`${rows.length} remaining`);
    return addRows(worksheet, rows, cb);
  });
}

Connect.prototype.addRows = function ConnectAddRows(rows) {
  this.rowsQueue = onceResolved(this.worksheets)
    .then(() => {
      return new Promise((resolve) => addRows(this.worksheet, rows, resolve));
    });
  return this;
};

Connect.prototype.toJson = function toJson(creator) {
  return onceResolved(this.worksheets).then(() => {
    return getRows(this.worksheet).then((rows) => {
      return rows.reduce((prev, item) => {
        const row = creator(item);
        return Object.assign(prev, row);
      }, {});
    });
  });
};
