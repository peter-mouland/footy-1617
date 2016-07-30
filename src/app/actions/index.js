import shop from '../services/shop'
import debug from 'debug'

const log = debug('lego:actions/index');

export const ADD_TO_CART = 'ADD_TO_CART';
// export const CHECKOUT_REQUEST = 'CHECKOUT_REQUEST';
// export const CHECKOUT_SUCCESS = 'CHECKOUT_SUCCESS';
// export const CHECKOUT_FAILURE = 'CHECKOUT_FAILURE';
// export const RECEIVE_PRODUCTS = 'RECEIVE_PRODUCTS';

export const GET_PRODUCTS = 'GET_PRODUCTS';

export const FETCH_PRODUCTS_AWAIT = 'FETCH_PRODUCTS_AWAIT';
export const FETCH_PRODUCTS_SUCCESS = 'FETCH_PRODUCTS_SUCCESS';
export const FETCH_PRODUCTS_FAILED = 'FETCH_PRODUCTS_FAILED';

const loadingProducts = ({
  type: FETCH_PRODUCTS_AWAIT,
});

export function getProducts() {
  log('getProducts')
  return {
    type: GET_PRODUCTS,
    promise: shop.getProducts()
  }
}

// function addToCartUnsafe(productId) {
//   return {
//     type: types.ADD_TO_CART,
//     productId
//   }
// }
//
// export function addToCart(productId) {
//   return (dispatch, getState) => {
//     if (getState().products.byId[productId].inventory > 0) {
//       dispatch(addToCartUnsafe(productId))
//     }
//   }
// }
//
// export function checkout(products) {
//   return (dispatch, getState) => {
//     const cart = getState().cart
//
//     dispatch({
//       type: types.CHECKOUT_REQUEST
//     })
//     shop.buyProducts(products, () => {
//       dispatch({
//         type: types.CHECKOUT_SUCCESS,
//         cart
//       })
//       // Replace the line above with line below to rollback on failure:
//       // dispatch({ type: types.CHECKOUT_FAILURE, cart })
//     })
//   }
// }
