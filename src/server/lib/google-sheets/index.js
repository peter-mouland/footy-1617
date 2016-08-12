import GoogleSpreadsheet from 'google-spreadsheet';
import debug from 'debug';

const log = debug('footy:google/connector');

const setAuth = (doc, creds) => new Promise((resolve) => {
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


// const mkPromise = (cb, arg1) => new Promise((resolve, reject) => {
//   const resolveOrReject = (err, res) => { if (err) { reject(err); } resolve(res); };
//   const args = arg1 ? [arg1, resolveOrReject] : [resolveOrReject];
//   cb(...args);
// });
//
// const getInfo = (doc) => mkPromise(doc.getInfo);
// const getRows = (doc) => mkPromise(doc.getRows);
// const getCells = (doc, opts) => mkPromise(doc.getCells, opts);
// const addRow = (doc, opts) => mkPromise(doc.addRow, opts);
// const addWorksheet = (doc, opts) => mkPromise(doc.addWorksheet, opts);
// const bulkUpdateCells = (doc, opts) => mkPromise(doc.bulkUpdateCells, opts);


const onceResolved = (obj) => Promise.all(Object.keys(obj).map(key => obj[key]));

export default function Connect(id, creds) {
  this.doc = new GoogleSpreadsheet(id);
  const promise = setAuth(this.doc, creds)
    .then(getInfo)
    .then(workbook => {
      this.workbook = workbook;
      return workbook;
    })
    .catch(e => {
      log(e);
    });
  this.updateQueues('connectionsQueue', promise, id);
  return this;
}

Connect.prototype.updateQueues = function updateQueues(queue, promise, id = String(new Date())) {
  if (!this[queue]) this[queue] = {};
  const queueId = `${queue}${id}`;
  this[queueId] = id;
  this[queue][this[queueId]] = promise;
  this.then = promise.then.bind(promise);
};

Connect.prototype.refresh = function refresh() {
  const promise = onceResolved(this.connectionsQueue)
    .then(() => getInfo(this.doc))
    .then(workbook => {
      this.workbook = workbook;
      return workbook;
    });
  this.then = promise.then.bind(promise);
  return this;
};

Connect.prototype.getWorksheets = function getWorksheet() {
  const promise = onceResolved(this.connectionsQueue)
    .then(() => {
      this.worksheets = this.workbook.worksheets;
      return this.worksheets;
    });
  this.updateQueues('worksheetsQueue', promise, 'all');
  return this;
};

Connect.prototype.getWorksheet = function getWorksheet(id) {
  const promise = onceResolved(this.connectionsQueue)
    .then(() => {
      this.worksheet = this.workbook.worksheets.find(sheet => sheet.title.toLowerCase() === id);
      return this.worksheet;
    });
  this.updateQueues('worksheetsQueue', promise, id);
  return this;
};

Connect.prototype.addWorksheet = function ConnectAddWorksheet(opts) {
  const promise = onceResolved(this.connectionsQueue)
    .then(() => {
      return addWorksheet(this.doc, opts)
        .then(sheet => {
          this.worksheet = sheet;
          this.refresh();
        });
    });
  this.updateQueues('worksheetsQueue', promise);
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
  const promise = onceResolved(this.worksheetsQueue)
    .then(() => {
      return new Promise((resolve) => addRows(this.worksheet, rows, resolve));
    });
  this.updateQueues('rowsQueue', promise);
  return this;
};

Connect.prototype.getRows = function ConnectGetRows() {
  const promise = onceResolved(this.worksheetsQueue)
    .then(() => getRows(this.worksheet));
  this.updateQueues('rowsQueue', promise);
  return this;
};


Connect.prototype.getCells = function ConnectCellsRows(opts) {
  const promise = onceResolved(this.worksheetsQueue)
    .then(() => getCells(this.worksheet, opts));
  this.updateQueues('rowsQueue', promise);
  return this;
};

Connect.prototype.addRowsBulk = function ConnectAddRowsBulk(rows, opts) {
  const promise = onceResolved(this.worksheetsQueue)
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
  this.updateQueues('rowsQueue', promise);
  return this;
};

Connect.prototype.toJson = function toJson(creator) {
  const promise = onceResolved(this.worksheetsQueue).then(() => {
    return getRows(this.worksheet).then((rows) => {
      return rows.reduce((prev, item) => {
        const row = creator(item);
        return Object.assign(prev, row);
      }, {});
    });
  });
  this.updateQueues('jsonQueue', promise);
  return this;
};
