import debug from 'debug';

const log = debug('lego:fetchComponentData')

export default function fetchComponentData(dispatch, components, params) {
  const needs = components.reduce( (prev, current) => {
    return current ? (current.needs || []).concat(prev) : prev;
  }, []);

  log(needs)
  const promises = needs.map(need => dispatch(need(params)));
  return Promise.all(promises);
}
