import { event } from "./enums.js";

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
  
  /**
   * @description Broadcaster instance
   */
  _braodcaster = null;
  
  constructor(broadcaster, duration = 0, name = 'kompletr.cache') {
    if (!window.caches) {
      return false;
    }
    this._broadcaster = broadcaster;
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
        this._broadcaster.trigger(event.error, e);
      });
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
        this._broadcaster.trigger(event.error, e);
      });
  }

  /**
   * @description Check the cache validity regarding the current request and the cache timelife
   * 
   * @param {String} string The current request value
   *
   * @returns {Promise<Boolean>}
   */
  async isValid(string) {
    try {
      const cache = await window.caches.open(this._name);
      const response = await cache.match(`/${string}`);
      if (!response) {
        return false;
      }
      return true;
    } catch(e) {
      this._broadcaster.trigger(event.error, e);
    }
  }
};