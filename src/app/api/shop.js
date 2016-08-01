/**
 * Mocking client-server processing
 */
import products from './products.json';

const TIMEOUT = 1000;

export default {
  getProducts(timeout) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(products), timeout || TIMEOUT);
    });
  },

  buyProducts(payload, timeout) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(payload), timeout || TIMEOUT);
    });
  }
};
