/**
 * Mocking client-server processing
 */
import products from './products.json'

const TIMEOUT = 100;

export default {
  getProducts(cb, timeout) {
    setTimeout(() => cb(products), timeout || TIMEOUT)
  },

  buyProducts(payload, cb, timeout) {
    setTimeout(() => cb(), timeout || TIMEOUT)
  }
}
