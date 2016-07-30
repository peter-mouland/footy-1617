import debug from 'debug';

const log = debug('lego:promiseMiddleware');

export default function promiseMiddleware() {
  return next => action => {
    const { promise, type, ...rest } = action;
    log('FETCH with promise', !!promise)
    if (!promise) return next(action);

    const SUCCESS = type;
    const FETCH = type + '_FETCH';
    const FAILURE = type + '_FETCH_FAILURE';

    next({ ...rest, loading: true, type: FETCH });

    return promise
      .then(res => {
        log(`SUCCESS`);
        next({ ...rest, res, loading: false, type: SUCCESS });
        return true;
      })
      .catch(error => {
        log(`FAILURE`, error);
        next({ ...rest, error, loading: false,  type: FAILURE });
        return false;
      });
  };
}
