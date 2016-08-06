import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { FETCH_PLAYERS } from '../actions';



function stats(state = {}, action) {
  switch (action.type) {
    case FETCH_PLAYERS:
      return {
        ...state,
        data: action.data,
        status: action.status
      };
    default:
      return {
        ...state,
        ...action
      };
  }
}

export default combineReducers({
  stats,
  routing
});
