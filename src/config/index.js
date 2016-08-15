import devConfig from './config.development.js';
import prodConfig from './config.production.js';

export default {
  production: prodConfig,
  development: {
    ...prodConfig,
    ...devConfig,
  },
}[process.env.CONFIG_FILE];
