import Kompletr from "./kompletr.js"

import { Configuration } from './configuration.js';
import { Cache } from './cache.js';
import { Broadcaster } from "./broadcaster.js";
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
  const broadcaster = new Broadcaster();

  const configuration = new Configuration(options);
  const properties = new Properties(data);

  const dom = new DOM(this || input, broadcaster, configuration); // FIXME: broken when this is not an input element (when kompleter is called from a different context)
  const cache = configuration.cache ? new Cache(broadcaster, configuration.cache) : null;
  
  new Kompletr({ configuration, properties, dom, cache, broadcaster, onKeyup, onSelect, onError });
};

window.HTMLInputElement.prototype.kompletr = kompletr;

export default kompletr;