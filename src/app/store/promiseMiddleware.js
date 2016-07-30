import debug from 'debug';

const log = debug('lego:promiseMiddleware');

export default function promiseMiddleware() {
  return next => action => {
    const { promise, type, ...rest } = action;
    log('FETCH', !!promise)
    if (!promise) return next(action);

    const SUCCESS = type;
    const FETCH = type + '_FETCH';
    const FAILURE = type + '_FETCH_FAILURE';

    next({ ...rest, type: FETCH });

    return promise
      .then(res => {
        log(`SUCCESS`, res)
        next({ ...rest, res, type: SUCCESS });
        return true;
      })
      .catch(error => {
        log(`FAILURE`, error)
        next({ ...rest, error, type: FAILURE });
        return false;
      });
  };
}
