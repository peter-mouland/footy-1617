import React from 'react';
import { renderToString } from 'react-dom/server';
import express from 'express';
import bodyParser from 'body-parser';
import debug from 'debug';
import compression from 'compression';
import Error500 from './templates/Error500';
import { routingApp, setRoutes } from './router';
import saveToGoogle from './lib/saveToGoogle';
import webpackConfig from '../config/webpack.config.dev.babel';

const webpackEntries = Object.keys(webpackConfig.entry);
const assets = {
  javascript: webpackEntries.map(entry => `/${entry}.js`),
  styles: webpackEntries.map(entry => `/${entry}.css`)
};
const server = express();
const log = debug('lego:server.js');
log('starting');

server.set('etag', false);
server.use((req, res, next) => {
  res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.header('Pragma', 'no-cache');
  res.header('Expires', 0);
  next();
});
server.use(bodyParser.json({limit: '50mb'}));
server.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
server.use(compression());
server.enable('view cache');
server.enable('strict routing');

Object.assign(express.response, {
  renderPageToString(page) {
    return `<!doctype html>${renderToString(page)}`;
  },
  render500(e) {
    log('render500', e);
    return this.status(500).send(this.renderPageToString(<Error500 error={ e } />));
  }
});

setRoutes(assets);
server.post('/save-data', (req, res, next) =>{
  // console.log(req.body)
  saveToGoogle(req.body.players)
    .then((response)=>{
      console.log(`response`, response)
      res.status(200).send(response);
    })
    .catch((e) => {
      res.sendStatus(500, e)
    })
});
server.use('/', routingApp);

export default server;
