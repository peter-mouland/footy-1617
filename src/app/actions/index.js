import shop from '../api/shop';

export const GET_PRODUCTS = 'FETCH_PRODUCTS';
export const ADD_TO_CART = 'ADD_TO_CART';

export function getAllProducts() {
  return {
    type: GET_PRODUCTS,
    promise: shop.getProducts()
  };
}
