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

const getCells = (doc, opts) => new Promise((resolve, reject) => {
  doc.getCells(opts, (err, cells) => {
    if (err) reject(err);
    resolve(cells);
  });
});

const addRow = (doc, row) => new Promise((resolve, reject) => {
  doc.addRow(row, (err, upd) => {
    if (err) reject(err);
    resolve(upd);
  });
});

const addWorksheet = (doc, opts) => new Promise((resolve, reject) => {
  doc.addWorksheet(opts, (err, upd) => {
    if (err) reject(err);
    resolve(upd);
  });
});

const bulkUpdateCells = (doc, cells) => new Promise((resolve, reject) => {
  doc.bulkUpdateCells(cells, (err, upd) => {
    if (err) reject(err);
    resolve(upd);
  });
});

const onceResolved = (obj) => Promise.all(Object.keys(obj).map(key => obj[key]));

export default function Connect(id) {
  this.doc = new GoogleSpreadsheet(id);
  const promise = setAuth(this.doc)
    .then(getInfo)
    .then(workbook => {
      this.workbook = workbook;
      return workbook;
    })
    .catch(e => {
      log(e);
    });
  if (!this.connections) this.connections = {};
  this.connectionsId = id;
  this.connections[id] = promise;
  this.whenComplete = promise;
  return this;
}

Connect.prototype.getWorksheet = function getWorksheet(id) {
  const promise = onceResolved(this.connections)
    .then(() => {
      this.worksheet = this.workbook.worksheets.find(sheet => sheet.title.toLowerCase() === id);
      return this.worksheet;
    });
  if (!this.worksheets) this.worksheets = {};
  this.worksheetId = id;
  this.worksheets[id] = promise;
  this.whenComplete = promise;
  return this;
};

Connect.prototype.addWorksheet = function ConnectAddWorksheet(opts) {
  const promise = onceResolved(this.connections)
    .then(() => {
      return addWorksheet(this.doc, opts)
        .then(sheet => {
          this.worksheet = sheet;
        });
    });
  if (!this.worksheets) this.worksheets = {};
  this.worksheetId = String(new Date());
  this.worksheets[this.worksheetId] = promise;
  this.whenComplete = promise;
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
  const promise = onceResolved(this.worksheets)
    .then(() => {
      return new Promise((resolve) => addRows(this.worksheet, rows, resolve));
    });
  if (!this.addRowsQueue) this.addRowsQueue = {};
  this.addRowsQueueId = String(new Date());
  this.addRowsQueue[this.addRowsQueueId] = promise;
  this.whenComplete = promise;
  return this;
};

Connect.prototype.addRowsBulk = function ConnectAddRowsBulk(rows, opts) {
  const promise = onceResolved(this.worksheets)
    .then(() => {
      return getCells(this.worksheet, opts)
        .then((cells) => {
          cells.forEach((cell, i) => {
            try {
              cell.value = String(rows[cell.row - 2][cell.col]); // eslint-disable-line
            } catch (e) {
              log(`NOT FOUND ${i} : R${cell.row} C${cell.col} rows:${rows.length}`);
            }
          });
          log('Updating Cells...');
          return bulkUpdateCells(this.worksheet, cells);
        });
    });
  if (!this.addRowsQueue) this.addRowsQueue = {};
  this.addRowsQueueId = String(new Date());
  this.addRowsQueue[this.addRowsQueueId] = promise;
  this.whenComplete = promise;
  return this;
};

Connect.prototype.toJson = function toJson(creator) {
  const promise = onceResolved(this.worksheets).then(() => {
    return getRows(this.worksheet).then((rows) => {
      return rows.reduce((prev, item) => {
        const row = creator(item);
        return Object.assign(prev, row);
      }, {});
    });
  });
  if (!this.toJsonQueue) this.toJsonQueue = {};
  this.toJsonQueueId = String(new Date());
  this.toJsonQueue[this.toJsonQueueId] = promise;
  this.whenComplete = promise;
  return this;
};
