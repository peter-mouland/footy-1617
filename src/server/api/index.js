import express from 'express';
import debug from 'debug';
import bodyParser from 'body-parser';

import fetchSkyPlayers from './fetch-sky-players';
import fetchWeeklyPoints from './fetch-weekly-points';
import fetchStatsSnapshots from './fetch-stats-snapshots';
import saveWeekEndTag from './save-week-end-tag';
import savePlayerStats from './save-player-stats';
import savePlayerPositions from './save-player-positions';
import GoogleSpreadsheet from '../lib/google-sheets';
import creds from '../lib/google-sheets/google-generated-creds.json';

const log = debug('footy:api/index');
const apiRouter = new express.Router();
const spreadsheet = new GoogleSpreadsheet('167qhKgUtQAUto19Jniveo0pzrz59l2A9uDZcV50noTY', creds);
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

apiRouter.get('/sky-players', (req, res) => {
  fetchSkyPlayers()
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

apiRouter.post('/save-player-stats', (req, res) => {
  savePlayerStats(spreadsheet, req.body)
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
