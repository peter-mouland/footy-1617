require('babel-core/register')({
  only: [/tests/, /src/, /config/]
});
require('babel-polyfill');
const hook = require('node-hook').hook;
hook('.scss', (source, filename) => {}); // eslint-disable-line

require('./config/environment');

const server = require('./server/server');
const createFFJson = require('./server/lib/update-player-positions');

createFFJson().then(() => {
  server.listen(process.env.PORT, () => {
    console.log(`listening at http://localhost:${process.env.PORT}`); // eslint-disable-line
  });
});

