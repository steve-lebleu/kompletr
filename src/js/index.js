import Kompletr from './kompletr.js';

import { Configuration } from './configuration.js';
import { Cache } from './cache.js';
import { Broadcaster } from './broadcaster.js';
import { Properties } from './properties.js';
import { DOM } from './dom.js';

/**
 * Initializes the module with the provided data and options.
 *
 * @param {string|HTMLInputElement} input - The target input as selector or instance.
 * @param {Object} data - The data used by the application.
 * @param {Object} options - The configuration options for the application.
 * @param {Function} onKeyup - The callback function to be executed on keyup event.
 * @param {Function} onSelect - The callback function to be executed on select event.
 * @param {Function} onError - The callback function to be executed on error event.
 * 
 * @returns {void}
 */
const kompletr = function({ input, data, options, onKeyup, onSelect, onError }) {
  const [broadcaster, configuration, properties] = [
    new Broadcaster(),
    new Configuration(options),
    new Properties(data),
  ];

  const [dom, cache] = [
    new DOM(input, broadcaster, configuration),
    configuration.cache ? new Cache(broadcaster, configuration.cache) : null,
  ];
 
  new Kompletr({ configuration, properties, dom, cache, broadcaster, onKeyup, onSelect, onError });
};

window.kompletr = kompletr;

export { kompletr };