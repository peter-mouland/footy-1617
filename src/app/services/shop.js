/**
 * Mocking client-server processing
 */
import products from './products.json'
import debug from 'debug'

const log = debug('lego:services/shop');

const TIMEOUT = 1000;

export default {
  getProducts(timeout) {
    log(`getProducts`);
    return new Promise((resolve) => {
      setTimeout(() => resolve(products), timeout || TIMEOUT)
    });
  },

  buyProducts(payload, timeout) {
    log(`buyProducts`);
    return new Promise((resolve) => {
      setTimeout(() => resolve(payload), timeout || TIMEOUT)
    });
  }
}
