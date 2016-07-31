import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import debug from 'debug'

const log = debug('lego:reducers/index');

// import cart, * as fromCart from './cart'
// import products, * as fromProducts from './products'

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

export default function products(state = {}, action) {
  log(action.type)
  switch(action.type) {
    case 'GET_PRODUCTS':
      return {
        ...state,
        ...action
      };
    default:
      return state;
  }
}


export default combineReducers({
  products,
  routing
})
