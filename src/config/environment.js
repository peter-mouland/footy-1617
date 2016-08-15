const debug = require('debug');
debug.enable(process.env.DEBUG);
const log = debug('footy: Environment:');

const argv = require('yargs')
  .usage('Usage: $0 --config=[string]')
  .default('config', 'development')
  .argv;

log({
  PORT: process.env.PORT,
  CONFIG_FILE: process.env.CONFIG_FILE,
  NODE_ENV: process.env.NODE_ENV
});

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

if (!process.env.PORT) {
  process.env.PORT = 3000;
}

process.env.CONFIG_FILE = argv.config || process.env.NODE_ENV;

log({
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV
});
