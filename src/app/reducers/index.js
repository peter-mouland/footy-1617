import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { GET_PRODUCTS, ADD_TO_CART } from '../actions';

function products(state = {}, action) {
  switch (action.type) {
    case GET_PRODUCTS:
      return {
        ...state,
        ...action
      };
    case ADD_TO_CART:
      return {
        ...state,
        inventory: state.inventory - 1
      };
    default:
      return {
        ...state,
        ...action
      };
  }
}

export default combineReducers({
  products,
  routing
});
