import debug from 'debug';

const log = debug('lego:promiseMiddleware');

function delay(time) {
  return new Promise(function (fulfill) {
    setTimeout(fulfill, time);
  });
}

export default function promiseMiddleware() {
  return next => action => {
    const { promise, type, ...rest } = action;
    log('FETCH with promise', !!promise)
    if (!promise) return next(action);

    const timeoutMs = 10000;
    const SUCCESS = type;
    const FETCH = type + '_FETCH';
    const FAILURE = type + '_FETCH_FAILURE';
    const TIMEOUT = type + '_FETCH_TIMEOUT';

    next({ ...rest, type: FETCH });

    const fetchData = promise
      .then(res => {
        log(`SUCCESS`);
        next({ ...rest, res, type: SUCCESS });
        return true;
      })
      .catch(error => {
        log(`FAILURE`, error);
        next({ ...rest, error, type: FAILURE });
        return false;
      });

    const dataTimeout = delay(timeoutMs).then(() => {
      log(`TIMEOUT`);
      next({ ...rest, type: TIMEOUT });
    });

    return Promise.race([fetchData, dataTimeout]);
  };
}
