import debug from 'debug';
import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
// import cart, * as fromCart from './cart'
// import products, * as fromProducts from './products'

const log = debug('lego:reducers/index');

// function getAddedIds(state) {
//   return fromCart.getAddedIds(state.cart)
// }
//
// function getQuantity(state, id) {
//   return fromCart.getQuantity(state.cart, id)
// }
//
// function getProduct(state, id) {
//   return fromProducts.getProduct(state.products, id)
// }
//
// export function getTotal(state) {
//   return getAddedIds(state).reduce((total, id) =>
//     total + getProduct(state, id).price * getQuantity(state, id),
//     0
//   ).toFixed(2)
// }
//
// export function getCartProducts(state) {
//   return getAddedIds(state).map(id => Object.assign(
//     {},
//     getProduct(state, id),
//     {
//       quantity: getQuantity(state, id)
//     }
//   ))
// }

import Immutable from 'immutable';

const defaultState = new Immutable.List();

export default function products(state = defaultState, action) {
  log(action.type);
  log(action.res);
  switch(action.type) {
    case 'GET_PRODUCTS':
      return new Immutable.List(action.res);
    case 'CREATE_TODO':
      return state.concat(action.res.data.text);
    case 'EDIT_TODO':
      return state.set(action.id, action.text);
    case 'DELETE_TODO':
      return state.delete(action.id);
    default:
      return state;
  }
}


export default combineReducers({
  products,
  routing
})
