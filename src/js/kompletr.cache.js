import { EventManager } from "./kompletr.events.js";

/**
 * @description Kompletr simple caching mechanism implementation.
 * 
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Cache
 * @see https://web.dev/articles/cache-api-quick-guide
 */
export class Cache {

  /**
   * @description Cache name value
   */
  _name = null;

  /**
   * @description Cache timelife duration
   */
  _duration = null;
  
  constructor(duration = 0, name = 'kompletr.cache') {
    this._name = name;
    this._duration = duration;
  }

  /**
   * @description Retrieve the data stored in cache and dispatch event with
   * 
   * @param {String} string Input value of the current request as string
   * @param {Function} done Callback function
   * 
   * @emits CustomEvent 'kompltetr.request.done' { from, data }
   * @emits CustomEvent 'kompltetr.error' { error }
   * 
   * @returns {Void}
   */
  get(string, done) {
    window.caches.open(this._name)
      .then(cache => {
        cache.match(string)
          .then(async (data) => {
            done(await data.json());
          });
      })
      .catch(e => {
        EventManager.trigger(EventManager.event.error, e);
      });
  }

  /**
   * @description Indicate if the cache is active or not
   * 
   * @returns {Boolean} Cache is active or not
   */
  isActive() {
    return this._duration !== 0;
  }

  /**
   * @description Check the cache validity regarding the current request and the cache timelife
   * 
   * @param {String} string The current request value
   *
   * @returns {Promise<Boolean>} 
   */
  async isValid(string) {
    const cache = await window.caches.open(this._name);
    
    const response = await cache.match(`/${string}`);
    if (!response) {
      return false;
    }

    const createdAt = await response.text();
    if (parseInt(createdAt + this._duration, 10) <= Date.now()) {
      return false;   
    }
    return true;
  }

  /**
   * @description Push data into the cache
   * 
   * @param {Object} args { string, data }
   * 
   * @emits CustomEvent 'kompltetr.error' { error }
   * 
   * @returns {Void}
   */
  set({ string, data }) {
    window.caches.open(this._name)
      .then(cache => {
        const headers = new Headers();
        headers.set('Content-Type', 'application/json');
        headers.set('Cache-Control', `max-age=${this._duration}`);
        cache.put(`/${string}`, new Response(JSON.stringify(data), { headers }));
      })
      .catch(e => {
        EventManager.trigger(EventManager.event.error, e);
      });
  }
};