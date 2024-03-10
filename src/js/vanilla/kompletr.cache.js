import { animation, origin } from './kompletr.enums';
import { build, uuid } from './kompletr.utils';

 /**
   * @description Kompletr caching mechanism implementation.
   * 
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Cache
   * @see https://web.dev/articles/cache-api-quick-guide
   * 
   * @todo: Full review / validation of the Cache feature
   */
export class Cache {

  _name = null;

  _duration = null;
  
  constructor(eventManager, duration = 0, name = 'kompletr.cache') {
    this._eventManager = eventManager;
    this._name = name;
    this._duration = duration;
  }

  /**
   * @description Retrieve the data stored in cache and dispatch event with
   * 
   * @param {String} string Input value of the current request as string
   * 
   * @emits CustomEvent 'kompltetr.request.done' { from, data }
   * @emits CustomEvent 'kompltetr.error' { error }
   * 
   * @returns {Void}
   */
  emit(string) {
    console.log('get from the cache')
    window.caches.open(this._name)
      .then(cache => {
        cache.match(string)
          .then(async (data) => {
            this._eventManager.trigger('requestDone', { from: origin.cache, data: await data.json() });
          });
      })
      .catch(e => {
        this._eventManager.trigger('error', e);
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
    console.log('set the cache')
    data = JSON.stringify(data);
    window.caches.open(this._name)
      .then(cache => {
        const headers = new Headers;
        headers.set('content-type', 'application/json');
        headers.set('cache-control', `max-age=${this._duration}`);
        cache.put(`/${string}`, new Response(data, { headers }));
      })
      .catch(e => {
        this._eventManager.trigger('error', e);
      });
  }
};