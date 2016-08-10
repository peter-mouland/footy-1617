import debug from 'debug';

const log = debug('footy:promiseMiddleware');
const status = {
  isLoading: false,
  isTimeout: false,
  isError: false,
};

function delay(time) {
  return new Promise((fulfill) => setTimeout(fulfill, time));
}

export default function promiseMiddleware() {
  return next => action => {
    const { promise, type, timeoutMs = 15000, ...rest } = action;
    log('FETCH with promise', !!promise);

    if (!promise) return next(action);

    const SUCCESS = type;
    const FETCH = `${type}_FETCH`;
    const FAILURE = `${type}_FETCH_FAILURE`;
    const TIMEOUT = `${type}_FETCH_TIMEOUT`;

    next({ ...rest, status: { ...status, isLoading: true }, type: FETCH });

    const fetchData = promise
      .then(data => {
        log('SUCCESS');
        next({ ...rest, status, data, type: SUCCESS });
        return true;
      })
      .catch(error => {
        log('FAILURE', error);
        next({ ...rest, status: { ...status, isError: true }, error, type: FAILURE });
        return false;
      });

    const dataTimeout = delay(timeoutMs).then(() => {
      log('TIMEOUT');
      next({ ...rest, status: { ...status, isTimeout: true }, type: TIMEOUT });
    });

    return Promise.race([fetchData, dataTimeout])
      .then((data) => data, reason => log(reason));
  };
}
