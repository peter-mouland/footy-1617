import express from 'express';
import debug from 'debug';
import bodyParser from 'body-parser';

import config from '../../config';
import fetchWeeklyPoints from './fetch-weekly-points';
import fetchStatsSnapshots from './fetch-stats-snapshots';
import saveWeeklyPoints from './save-weekly-points';
import saveWeekEndTag from './save-week-end-tag';
import saveStatsSnapshot from './save-stats-snapshot';
import savePlayerPositions from './save-player-positions';
import GoogleSpreadsheet from '../lib/google-sheets';
import fetchPlayers from './fetch-players';
import creds from '../lib/google-sheets/google-generated-creds.json';

const log = debug('footy:api/index');
const apiRouter = new express.Router();
const spreadsheet = new GoogleSpreadsheet(config.googleSheetKey, creds);
const sendStatus = (code, res, results) => res.status(code).send(results);

apiRouter.use(bodyParser.json({ limit: '50mb' }));
apiRouter.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

function errorHandler(err, req, res) {
  log(err);
  const e = new Error();
  e.name = err.name;
  e.message = err.message;
  e.stackd = err.stack;
  res.status(err.status || 500).json({ error: e });
  res.end();
}

apiRouter.get('/player-stats', (req, res) => {
  fetchPlayers()
    .then((results) => sendStatus(200, res, results))
    .catch((e) => sendStatus(500, res, e));
});

apiRouter.get('/weekly-points', (req, res) => {
  fetchWeeklyPoints(spreadsheet)
    .then((results) => sendStatus(200, res, results))
    .catch((e) => sendStatus(500, res, e));
});

apiRouter.get('/stats-snapshots', (req, res) => {
  fetchStatsSnapshots(spreadsheet)
    .then((results) => sendStatus(200, res, results))
    .catch((e) => sendStatus(500, res, e));
});

apiRouter.post('/save-player-positions', (req, res) => {
  savePlayerPositions(spreadsheet, req.body)
    .then((results) => sendStatus(200, res, results))
    .catch((e) => sendStatus(500, res, e));
});

apiRouter.post('/save-weekly-points', (req, res) => {
  saveWeeklyPoints(spreadsheet, req.body)
    .then((results) => sendStatus(200, res, results))
    .catch((e) => sendStatus(500, res, e));
});

apiRouter.post('/save-stats-snapshot', (req, res) => {
  saveStatsSnapshot(spreadsheet, req.body)
    .then((results) => sendStatus(200, res, results))
    .catch((e) => sendStatus(500, res, e));
});

apiRouter.post('/save-week-end-tag', (req, res) => {
  saveWeekEndTag(spreadsheet, req.body)
    .then((results) => sendStatus(200, res, results))
    .catch((e) => sendStatus(500, res, e));
});

apiRouter.use('*', (req, res) => {
  const e = new Error();
  e.name = 'APIError';
  e.message = 'API Route Not Found';
  res.status(404).json({ error: e });
  res.end();
});

apiRouter.use(errorHandler);

export default apiRouter;
