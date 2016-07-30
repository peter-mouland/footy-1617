import debug from 'debug';

const log = debug('lego:fetchComponentData')

export default function fetchComponentData(dispatch, components, params) {
  const componentsWithNeeds = [];
  const needs = components.reduce( (prev, current) => {
    if (current.needs) {
      componentsWithNeeds.push(current.WrappedComponent ? current.WrappedComponent.name : current.name)
    }
    return current ? (current.needs || []).concat(prev) : prev;
  }, []);
  log('componentsWithNeeds', componentsWithNeeds)
  const promises = needs.map(need => dispatch(need(params)));
  return Promise.all(promises);
}
