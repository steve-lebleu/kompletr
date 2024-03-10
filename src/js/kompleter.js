import { Validation } from './kompletr.validation';
import { Options } from './kompletr.options';
import { Cache } from './kompletr.cache';
import { Properties } from './kompletr.properties';
import { DOM } from './kompletr.dom';
import { ViewEngine } from './kompletr.view-engine';
import { EventManager } from './kompletr.events';

import { animation, origin } from './kompletr.enums';
import { uuid } from './kompletr.utils';
import { fadeIn, fadeOut } from './kompletr.animations';

((window) => {
  if (window.kompletr) {
    throw new Error('window.kompletr already exists !');
  }

  /**
   * @summary Kømpletr.js is a library providing features dedicated to autocomplete fields.
   * 
   * @author Steve Lebleu <ping@steve-lebleu.dev>
   * @see https://github.com/steve-lebleu/kompletr
   */
  const kompletr = {

    /**
     * @description Cache related functions.
     */
    cache: null,

    /**
     * @description Client callbacks functions.
     */
    callbacks: {

      /**
       * @description Callback function exposed to consummer to allow errors management.
       * 
       * Default: null
       * Signature: (error) => {}
       * Trigger: error catched
       * 
       * @param {Error} error The fired Error instance
       */
      onError: null,

      /**
       * @description Callback function exposed to consummer to allow dataset hydratation
       * 
       * Default: null
       * Signature: async (value, cb) => {}
       * Trigger: keyup event, after input value is greater or equals than the options.startQueryingFromChar value
       * 
       * @param {String} value Current value of the input text to use for searching
       * @param {Function} cb Callback function expecting data in parameter
       * 
       * @async
       * 
       * @todo Manage a loader display when you need to wait after the data
       */
      onKeyup: null,

      /**
       * @description Callback function exposed to consumer to allow choice management
       * 
       * Default: null
       * Signature: (selected) => {}
       * Trigger: keyup + enter OR mouse click on a suggested item
       * 
       * @param {*} selected The current selected item, as String|Object
       */
      onSelect: null,
    },

    /**
     * @description kompletr events handlers.
     */
    handlers: {

      /**
       * @description Manage the data hydration according to the current setup (cache, request or local data)
       * 
       * @param {String} value Current input value
       * 
       * @emits CustomEvent 'kompletr.request.done' { from, queryString, data }
       * @emits CustomEvent 'kompletr.error' { error }
       * 
       * @returns {Void}
       */
      hydrate: async function(value) {
        try {
          // TODO manage cache -> if data available in the cache, get it from there

          if (kompletr.cache.isActive() && await kompletr.cache.isValid(value)) {
            kompletr.cache.emit(value);
          } else if (kompletr.callbacks.onKeyup) {
            kompletr.callbacks.onKeyup(value, (data) => {
              EventManager.trigger('requestDone', { from: origin.local, data })
            });
          } else {
            EventManager.trigger('requestDone', { from: origin.local, data: kompletr.props.data })
          }
        } catch(e) {
          EventManager.trigger('error', e)
        }
      },

      /**
       * @description Apply visual navigation into the suggestions set
       * 
       * @param {Number} keyCode The current keyCode value
       * 
       * @returns {Void}
       */
      navigate: function (keyCode) {
        if (keyCode != 38 && keyCode != 40) {
          return false;
        }

        if(kompletr.props.pointer < -1 || kompletr.props.pointer > kompletr.dom.result.children.length - 1) {
          return false;
        }

        if (keyCode === 38 && kompletr.props.pointer >= -1) {
          kompletr.props.pointer--;
        } else if (keyCode === 40 && kompletr.props.pointer < kompletr.dom.result.children.length - 1) {
          kompletr.props.pointer++;
        } 

        // todo trigger something ?
        kompletr.viewEngine.focus(kompletr.props.pointer, 'remove');
        kompletr.viewEngine.focus(kompletr.props.pointer, 'add');
      },

      /**
       * @description Select a suggested item as user choice
       * 
       * @param {Number} idx The index of the selected suggestion
       * 
       * @emits CustomEvent 'kompletr.select.done'
       * 
       * @returns {Void}
       */
      select: function (idx = 0) {
        // TODO as a view part ?
        
        kompletr.dom.input.value = typeof kompletr.props.data[idx] === 'object' ? kompletr.props.data[idx][kompletr.options.propToMapAsValue] : kompletr.props.data[idx];
        
        kompletr.callbacks.onSelect(kompletr.props.data[idx]); // TODO more clean -> give details ? -> put in same handler listener dans selectDone
        
        EventManager.trigger('selectDone');
  
      },
    },

    /**
     * @description kompletr dom container.
     */
    dom: null,

    /**
     * @description kompletr events listeners of all religions.
     * @dependency callbacks + dom + events + props + listeners
     */
    listeners: {

      /**
       * @description CustomEvent 'kompletr.error' listener
       */
      onError: (e) => {
        console.error(`[kompletr] An error has occured -> ${e.detail.stack}`);
        fadeIn(kompletr.dom.result);
        kompletr.callbacks.onError && kompletr.callbacks.onError(e.detail);
      },

      /**
       * @description 'body.click' && kompletr.select.done listeners
       */
      onHide: (e) => {
        fadeOut(kompletr.dom.result);
        EventManager.trigger('navigationDone');
      },

      /**
       * @description CustomEvent 'kompletr.navigation.done' listener
       */
      onNavigationDone: (e) => {
        kompletr.props.pointer = -1;
      },

      /**
       * @description CustomEvent 'kompletr.request.done' listener
       */
      onRequestDone: async (e) => {

        kompletr.props.data = e.detail.data;

        let data = kompletr.props.data.map((record, idx) => ({ idx, data: record }) ); 

        if (!kompletr.callbacks.onKeyup) {
          data = data.filter((record) => {
            const value = typeof record.data === 'string' ? record.data : record.data[kompletr.options.propToMapAsValue];
            if (kompletr.options.filterOn === 'prefix') {
              return value.toLowerCase().lastIndexOf(kompletr.dom.input.value.toLowerCase(), 0) === 0;
            }
            return value.toLowerCase().lastIndexOf(kompletr.dom.input.value.toLowerCase()) !== -1;
          });
        }

        // With CB, the utility is to prevent some HTTP calls, and to retrieve data in small set as well
        // Without CB, the utility is to retrieve data in a small lot

        // TODO -> data doit retourner Promise<Array>, de même que le callback onKeyup

        if (kompletr.cache.isActive() && await kompletr.cache.isValid(kompletr.dom.input.value) === false) {
          kompletr.cache.set({ string: kompletr.dom.input.value, data: e.detail.data });
        }

        // TODO do the render done, and plug the show result on it or ?
        kompletr.viewEngine.showResults(data.slice(0, kompletr.options.maxResults), kompletr.options, function() {
          EventManager.trigger('renderDone')
        });
      },

      /**
       * @description 'input.keyup' listener
       */
      onKeyup: async (e) => {
        if (kompletr.dom.input.value.length < kompletr.options.startQueriyngFromChar) {
          return;
        }
        
        const keyCode = e.keyCode;

        switch (keyCode) {
          case 13:  // Enter
            kompletr.handlers.select(kompletr.dom.focused.id);
            break;
          case 38: // Up
          case 40: // Down
            kompletr.handlers.navigate(keyCode);
            break;
          default:
            if (kompletr.dom.input.value !== kompletr.props.previousValue) {
              kompletr.handlers.hydrate(kompletr.dom.input.value);
            }
            EventManager.trigger('navigationDone');
            break
        }
      },

      /**
       * @description CustomEvent 'kompletr.render.done' listener
       */
      onRenderDone: () => {
        fadeIn(kompletr.dom.result);
        if(typeof kompletr.dom.result.children !== 'undefined') {
          const numberOfResults = kompletr.dom.result.children.length;
          if(numberOfResults) {
            for(let i = 0; i < numberOfResults; i++) {
              ((i) => {
                return kompletr.dom.result.children[i].addEventListener('click', (e) => {
                  kompletr.dom.focused = kompletr.dom.result.children[i];
                  kompletr.handlers.select(kompletr.dom.focused.id);
                });
              })(i)
            }
          }
        }
      },
    },

    /**
     * @description kompletr public options.
     */
    options: null,

    /**
     * @description kompletr internal properties.
     */
    props: null,

    /**
     * @description kompletr rendering functions.
     */
    viewEngine: null,

    /**
     * @description kompletr entry point.
     * 
     * @param {String|HTMLInputElement} input HTMLInputElement
     * @param {Object} options Main options and configuration parameters
     * @param {Array} dataSet Set of data to use if consummer take ownership on the data
     * @param {Object} callbacks Callback functions { onKeyup, onSelect, onError }
     * 
     * @returns {Void}
     */
    init: function({ input, data, options, onKeyup, onSelect, onError }) {

      try {

        // 1. Validate

        Validation.validate(input, data, { onKeyup, onSelect, onError });

        // 2. Assign 

        if(data) {
          kompletr.props = new Properties({ data });
        }

        if(options) {
          kompletr.options = new Options(options);
        }
        
        if(onKeyup || onSelect || onError) {
          kompletr.callbacks = Object.assign(kompletr.callbacks, { onKeyup, onSelect, onError });
        }

        kompletr.cache = new Cache(EventManager, options.cache);

        // 3. Build DOM

        kompletr.dom = new DOM(input, options);

        kompletr.viewEngine = new ViewEngine(kompletr.dom);

        // 4. Listeners

        kompletr.dom.input.addEventListener('keyup', kompletr.listeners.onKeyup);
        
        const body = document.getElementsByTagName('body')[0];
        body.addEventListener('click', kompletr.listeners.onHide);

        document.addEventListener('kompletr.select.done', kompletr.listeners.onHide);
        document.addEventListener('kompletr.navigation.done', kompletr.listeners.onNavigationDone);        
        document.addEventListener('kompletr.request.done', kompletr.listeners.onRequestDone);
        document.addEventListener('kompletr.render.done', kompletr.listeners.onRenderDone);
        document.addEventListener('kompletr.error', kompletr.listeners.onError);

      } catch(e) {
        console.error(e);
      }
    },
  };

  window.kompletr = kompletr.init;
  
  window.HTMLInputElement.prototype.kompletr = function({ data, options, onKeyup, onSelect, onError }) {
    window.kompletr({ input: this, data, options, onKeyup, onSelect, onError });
  };

})(window);