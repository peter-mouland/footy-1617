import express from 'express';
import debug from 'debug';
import bodyParser from 'body-parser';
import fetchArchives from './fetch-archives';
import savePlayerStats from './save-player-stats';
import savePlayerPositions from './save-player-positions';
import GoogleSpreadsheet from '../lib/google-sheets';
import creds from '../lib/google-sheets/google-generated-creds.json';
const log = debug('footy:api/index');

const apiRouter = new express.Router();
apiRouter.use(bodyParser.json({ limit: '50mb' }));
apiRouter.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));


const spreadsheet = new GoogleSpreadsheet('167qhKgUtQAUto19Jniveo0pzrz59l2A9uDZcV50noTY', creds);

function errorHandler(err, req, res) {
  log(err);
  const e = new Error();
  e.name = err.name;
  e.message = err.message;
  e.stackd = err.stack;
  res.status(err.status || 500).json({ error: e });
  res.end();
}

apiRouter.get('/archives', (req, res) => {
  fetchArchives(spreadsheet)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((e) => {
      res.sendStatus(500, e);
    });
});

apiRouter.post('/save-player-positions', (req, res) => {
  savePlayerPositions(spreadsheet, req.body)
    .then(() => {
      res.sendStatus(200);
    })
    .catch((e) => {
      res.sendStatus(500, e);
    });
});

apiRouter.post('/save-player-stats', (req, res) => {
  savePlayerStats(spreadsheet, req.body)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((e) => {
      res.sendStatus(500, e);
    });
});

apiRouter.get('*', (req, res) => {
  const e = new Error();
  e.name = 'APIError';
  e.message = 'API Route Not Found';
  res.status(404).json({ error: e });
  res.end();
});

apiRouter.use(errorHandler);

export default apiRouter;
