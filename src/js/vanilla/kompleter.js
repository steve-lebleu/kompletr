((window) => {
  if (window.kompleter) {
    throw new Error('window.kompleter already exists !');
  }

  /**
   * @summary Kompleter.js is a library providing features dedicated to autocomplete fields.
   * 
   * @author Steve Lebleu <ping@steve-lebleu.dev>
   * @see https://github.com/steve-lebleu/kompleter
   */
  const kompleter = {

    /**
     * @descrption Animations functions.
     */
    animations: {

      /**
       * @description Apply a fadeIn animation effect
       * 
       * @param {HTMLElement} element Target HTML element
       * @param {String} display CSS3 display property value
       * @param {Number} duration Duration of the animation in ms
       * 
       * @returns {Void}
       * 
       * @todo Manage duration
       */
      fadeIn: function(element, display = 'block', duration = 500) {
        element.style.opacity = 0;
        element.style.display = display;
        (function fade(){
          let value = parseFloat(element.style.opacity);
          if (!((value += .1) > 1)) {
            element.style.opacity = value;
            requestAnimationFrame(fade);
          }
        })()
      },

      /**
       * @description Apply a fadeOut animation effect
       * 
       * @param {HTMLElement} element Target HTML element
       * @param {Number} duration Duration of the animation in ms. Default 500ms
       * 
       * @returns {Void}
       * 
       * @todo Manage duration
       */
      fadeOut: function(element, duration = 500) {
        element.style.opacity = 1;
        (function fade() {
          if ((element.style.opacity -= .1) < 0) {
            element.style.display = 'none';
          } else {
            requestAnimationFrame(fade);
          }
        })();
      },

      /**
       * @description Apply a slideUp animation effect
       * 
       * @param {HTMLElement} element Target HTML element
       * @param {Number} duration Duration of the animation in ms. Default 500ms
       * 
       * @returns {Void}
       */
      slideUp: function(element, duration = 500) {
        element.style.transitionProperty = 'height, margin, padding';
        element.style.transitionDuration = duration + 'ms';
        element.style.boxSizing = 'border-box';
        element.style.height = element.offsetHeight + 'px';
        element.offsetHeight;
        element.style.overflow = 'hidden';
        element.style.height = 0;
        element.style.paddingTop = 0;
        element.style.paddingBottom = 0;
        element.style.marginTop = 0;
        element.style.marginBottom = 0;
        window.setTimeout( () => {
          element.style.display = 'none';
          element.style.removeProperty('height');
          element.style.removeProperty('padding-top');
          element.style.removeProperty('padding-bottom');
          element.style.removeProperty('margin-top');
          element.style.removeProperty('margin-bottom');
          element.style.removeProperty('overflow');
          element.style.removeProperty('transition-duration');
          element.style.removeProperty('transition-property');
        }, duration);
      },

      /**
       * @description Apply a slideDown animation effect
       * 
       * @param {HTMLElement} element Target HTML element
       * @param {Number} duration Duration of the animation in ms. Default 500ms
       * 
       * @returns {Void}
       */
      slideDown: function(element, duration = 500) {
        element.style.removeProperty('display');
        let display = window.getComputedStyle(element).display;
        if (display === 'none') display = 'block';
        element.style.display = display;
        let height = element.offsetHeight;
        element.style.overflow = 'hidden';
        element.style.height = 0;
        element.style.paddingTop = 0;
        element.style.paddingBottom = 0;
        element.style.marginTop = 0;
        element.style.marginBottom = 0;
        element.offsetHeight;
        element.style.boxSizing = 'border-box';
        element.style.transitionProperty = "height, margin, padding";
        element.style.transitionDuration = duration + 'ms';
        element.style.height = height + 'px';
        element.style.removeProperty('padding-top');
        element.style.removeProperty('padding-bottom');
        element.style.removeProperty('margin-top');
        element.style.removeProperty('margin-bottom');
        window.setTimeout( () => {
          element.style.removeProperty('height');
          element.style.removeProperty('overflow');
          element.style.removeProperty('transition-duration');
          element.style.removeProperty('transition-property');
        }, duration);
      }
    },

    /**
     * @description Cache related functions.
     * 
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Cache
     * @see https://web.dev/articles/cache-api-quick-guide
     */
    cache: {

      /**
       * @description Retrieve the data stored in cache and dispatch event with
       * 
       * @param {String} queryString URLSearchParams of the current request as string. IE q=term&limit=10&perPage=10&offset=0
       * 
       * @emits CustomEvent 'kompleter.request.done' { from, queryString, data }
       * @emits CustomEvent 'kompleter.error' { error }
       * 
       * @returns {Void}
       */
      emit: (queryString) => {
        window.caches.open('kompleter.cache')
          .then(cache => {
            cache.match(queryString)
              .then(async (data) => {
                document.dispatchEvent(kompleter.events.requestDone({ from: kompleter.enums.origin.cache, queryString: null, data: await data.json() }));
              });
          })
          .catch(e => {
            document.dispatchEvent(kompleter.events.error(e));
          });
      },

      /**
       * @description Indicate if the cache is active or not
       * 
       * @returns {Boolean} Cache is active or not
       */
      isActive: () => {
        return typeof kompleter.options.dataSource.cache !== 'undefined';
      },

      /**
       * @description Check the cache validity regarding the current request and the cache timelife
       * 
       * @param {String} queryString The current request query string
       *
       * @returns {Promise<Boolean>} 
       */
      isValid: async (queryString) => {
        const uuid = kompleter.utils.uuid(queryString);
        const cache = await window.caches.open('kompleter.cache');
        
        const response = await cache.match(uuid);
        if (!response) {
          return false;
        }

        const createdAt = await response.text();
        if (parseInt(createdAt + kompleter.options.dataSource.cache, 10) <= Date.now()) {
          return false;   
        }
        return true;
      },

      /**
       * @description Push data into the cache
       * 
       * @param {Object} args { queryString, data }
       * 
       * @emits CustomEvent 'kompleter.error' { error }
       * 
       * @returns {Void}
       */
      set: ({ queryString, data }) => {
        data = JSON.stringify(data);
        window.caches.open('kompleter.cache')
          .then(cache => {
            const headers = new Headers;
            headers.set('content-type', 'application/json');
            const uuid = kompleter.utils.uuid(queryString);
            cache.put(uuid, new Response(Date.now(), { headers }));
            cache.put(queryString, new Response(data, { headers }));
          })
          .catch(e => {
            document.dispatchEvent(kompleter.events.error(e));
          });
      },
    },

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
       * Default: (value, cb) => {}
       * Signature: (value, cb) => {}
       * Trigger: keyup event, after input value is greater or equals than the options.startQueryingFromChar value
       * 
       * @param {String} value Current value of the input text to use for searching
       * @param {Function} cb Callback function expecting data in parameter 
       */
      onKeyup: (value, cb) => {},

      /**
       * @description Callback function exposed to consumer to allow choice management
       * 
       * Default: (selected) => {}
       * Signature: (selected) => {}
       * Trigger: keyup + enter OR mouse click on a suggested item
       * 
       * @param {*} selected The current selected item, as String|Object
       */
      onSelect: (selected) => {},
    },

    /**
     * @description Local pseudo enums.
     */
    enums: {

      /**
       * @description Animation types
       */
      animation: Object.freeze({
        fadeIn: 'fadeIn',
        slideUp: 'slideUp'
      }),

      /**
       * @description Data origins
       */
      origin: Object.freeze({
        api: 'api',
        cache: 'cache',
        local: 'local'
      })
    },

    /**
     * @description Kompleter custom events getters functions.
     */
    events: {

      /**
       * @description Get a CustomEvent instance for an event with name 'kompleter.error'
       * 
       * @param {*} detail 
       * 
       * @returns {CustomEvent}
       */
      error: (detail = { message: '', stack: '', name: ''}) => new CustomEvent('kompleter.error', {
        detail,
        bubble: true,
        cancelable: false,
        composed: false,
      }),

      /**
       * @description Get a CustomEvent instance for an event with name 'kompleter.navigation.end'
       * 
       * @param {*} detail 
       * 
       * @returns {CustomEvent}
       */
      navigationEnd: (detail = {}) => new CustomEvent('kompleter.navigation.end', {
        detail,
        bubble: true,
        cancelable: false,
        composed: false,
      }),

      /**
       * @description Get a CustomEvent instance for an event with name 'kompleter.view.result.done'
       * 
       * @param {*} detail 
       * 
       * @returns {CustomEvent}
       */
      renderResultDone: (detail = {}) => new CustomEvent('kompleter.view.result.done', {
        detail,
        bubble: true,
        cancelable: false,
        composed: false,
      }),

      /**
       * @description Get a CustomEvent instance for an event with name 'kompleter.request.done'
       * 
       * @param {*} detail 
       * 
       * @returns {CustomEvent}
       */
      requestDone: (detail = { from: '', queryString: null, data: null }) => new CustomEvent('kompleter.request.done', {
        detail,
        bubble: true,
        cancelable: false,
        composed: false,
      }),

      /**
       * @description Get a CustomEvent instance for an event with name 'kompleter.select.done'
       * 
       * @param {Object} detail 
       * 
       * @returns {CustomEvent}
       */
      selectDone: (detail = {}) => new CustomEvent('kompleter.select.done', {
        detail,
        bubble: true,
        cancelable: false,
        composed: false,
      }),
    },

    /**
     * @description Kompleter events handlers.
     */
    handlers: {

      /**
       * @description Manage the data hydration according to the current setup (cache, request or local data)
       * 
       * @param {String} value Current input value
       * 
       * @emits CustomEvent 'kompleter.request.done' { from, queryString, data }
       * @emits CustomEvent 'kompleter.error' { error }
       * 
       * @returns {Void}
       */
      hydrate: async function(value) {
        if (kompleter.options.dataSource.url) {
          const qs = kompleter.utils.qs(kompleter.options.dataSource.queryString.keys, kompleter.options.dataSource.queryString.values, value);
          kompleter.cache.isActive() && await kompleter.cache.isValid(qs) ? kompleter.cache.emit(qs) : kompleter.handlers.request();
        } else if (kompleter.props.dataSet) {
          kompleter.callbacks.onKeyup(value, (data) => {
            document.dispatchEvent(kompleter.events.requestDone({ from: kompleter.enums.origin.local, queryString: null, data }));
          });
        } else {
          document.dispatchEvent(kompleter.events.error(new Error('None of valid dataSource or dataSet found in props')));
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
        
        console.log(kompleter.props.pointer)
        if(kompleter.props.pointer < -1 || kompleter.props.pointer > kompleter.htmlElements.suggestions.length - 1) {
          return false;
        }

        if (keyCode === 38 && kompleter.props.pointer >= -1) {
          kompleter.props.pointer--;
        } else if (keyCode === 40 && kompleter.props.pointer < kompleter.htmlElements.suggestions.length - 1) {
          kompleter.props.pointer++;
        } 

        kompleter.view.focus('remove');
        kompleter.view.focus('add');
      },

      /**
       * @description Do HTTP request to fetch data
       * 
       * @emits CustomEvent 'kompleter.request.done' { from, queryString, data }
       * @emits CustomEvent 'kompleter.error' { error }
       * 
       * @returns {Void}
       */
      request: function() {
        const headers = new Headers();
        headers.append('content-type', 'application/x-www-form-urlencoded');
        headers.append('method', 'GET');
        
        const qs = kompleter.utils.qs(kompleter.options.dataSource.queryString.keys, kompleter.options.dataSource.queryString.values, kompleter.htmlElements.input.value);

        fetch(`${kompleter.options.dataSource.url}?${qs}`, headers)
          .then(result => result.json())
          .then(data => {
            document.dispatchEvent(kompleter.events.requestDone({ from: kompleter.enums.origin.api, queryString: qs, data })); 
          })
          .catch(e => {
            document.dispatchEvent(kompleter.events.error(e));
          });
      },

      /**
       * @description Select a suggested item as user choice
       * 
       * @param {Number} idx The index of the selected suggestion
       * 
       * @emits CustomEvent 'kompleter.select.done'
       * 
       * @returns {Void}
       */
      select: function (idx = 0) {
        kompleter.htmlElements.input.value = typeof kompleter.props.dataSet[idx] === 'object' ? kompleter.props.dataSet[idx][kompleter.options.propToMapAsValue] : kompleter.props.dataSet[idx];
        kompleter.callbacks.onSelect(kompleter.props.dataSet[idx]);
        document.dispatchEvent(kompleter.events.selectDone());
      },
    },

    /**
     * @description Kompleter HTMLElements container.
     */
    htmlElements: {

      /**
       * @description HTMLElement in suggestions who's have the focus
       */
      focused: null,

      /**
       * @description Main input text
       */
      input: null,

      /**
       * @description HTMLElement results container
       */
      result: null,

      /**
       * @description HTMLElements suggestions set according to the current input value
       */
      suggestions: [],

      /**
       * @description HTMLElemnt identifed as first direct parent of the HTMLInputElement kompleter.htmlElements.input
       */
      wrapper: null,
    },

    /**
     * @description Kompleter events listeners of all religions.
     */
    listeners: {

      /**
       * @description CustomEvent 'kompleter.error' listener
       */
      onError: () => {
        document.addEventListener('kompleter.error', (e) => {
          console.error(`[kompleter] An error has occured -> ${e.detail.stack}`);
          kompleter.animations.fadeIn(kompleter.htmlElements.result);
          kompleter.callbacks.onError && kompleter.callbacks.onError(e.detail);
        });
      },

      /**
       * @description 'body.click' && kompleter.select.done listeners
       */
      onHide: () => {
        const body = document.getElementsByTagName('body')[0];
        body.addEventListener('click', (e) => {
          kompleter.animations.fadeOut(kompleter.htmlElements.result);
          document.dispatchEvent(kompleter.events.navigationEnd());
        });
        document.addEventListener('kompleter.select.done', (e) => {
          kompleter.animations.fadeOut(kompleter.htmlElements.result);
          document.dispatchEvent(kompleter.events.navigationEnd());
        });
      },

      /**
       * @description CustomEvent 'kompleter.navigation.end' listener
       */
      onNavigationEnd: () => {
        document.addEventListener('kompleter.navigation.end', (e) => {
          kompleter.props.pointer = -1;
        });
      },

      /**
       * @description HTMLElements.click listener 
       */
      onSelect: () => {
        kompleter.htmlElements.suggestions = document.getElementsByClassName('item--result');

        if(typeof kompleter.htmlElements.suggestions !== 'undefined') {
          const numberOfSuggestions = kompleter.htmlElements.suggestions.length;
          
          if(numberOfSuggestions) {
            for(let i = 0; i < numberOfSuggestions; i++) {
              ((i) => {
                return kompleter.htmlElements.suggestions[i].addEventListener('click', (e) => {
                  kompleter.htmlElements.focused = kompleter.htmlElements.suggestions[i];
                  kompleter.handlers.select();
                });
              })(i)
            }
          }
        }
      },

      /**
       * @description CustomEvent 'kompleter.request.done' listener
       */
      onRequestDone: () => {
        document.addEventListener('kompleter.request.done', async (e) => {
          kompleter.props.dataSet = e.detail.data;
          if (e.detail.from === kompleter.enums.origin.api && kompleter.cache.isActive() && await kompleter.cache.isValid()) {
            kompleter.cache.set(e.detail);
          }
          kompleter.view.results(e.detail.data);
        });
      },

      /**
       * @description 'input.keyup' listener
       */
      onKeyup: () => {
        kompleter.htmlElements.input.addEventListener('keyup', async (e) => {
          if (kompleter.htmlElements.input.value.length < kompleter.options.startQueriyngFromChar) {
            return;
          }
          
          const keyCode = e.keyCode;

          switch (keyCode) {
            case 13:  // Enter
              kompleter.handlers.select(kompleter.htmlElements.focused.id);
              break;
            case 38: // Up
            case 40: // Down
              kompleter.handlers.navigate(keyCode);
              break;
            default:
              if (kompleter.htmlElements.input.value !== kompleter.props.previousValue) {
                kompleter.handlers.hydrate(kompleter.htmlElements.input.value);
              }
              document.dispatchEvent(kompleter.events.navigationEnd());
              break
          }
        });
      },

      /**
       * @description CustomEvent 'kompleter.view.result.done' listener
       * 
       * @todo Try to move the event listener into the event handler instead ot this listener
       */
      onViewResultDone: () => {
        document.addEventListener('kompleter.view.result.done', (e) => {
          kompleter.animations.fadeIn(kompleter.htmlElements.result);
          kompleter.listeners.onSelect();
        });
      },
    },

    /**
     * @description Kompleter public options.
     */
    options: {

      _fieldsToDisplay: [], _maxResults: 10, _startQueriyngFromChar: 2, _propToMapAsValue: '',

      /**
       * @description Describe the animation configuration to apply to show / hide the results
       */
      animation: {

        _type: null, _duration: 500,

        /**
         * @description Type of animation between valid types
         */
        get type() {
          return this._type;
        },

        set type(value) {
          const valid = Object.keys(kompleter.enums.animation);
          if (!valid.includes(value)) {
            throw new Error(`animation.type should be one of ${valid}`);
          }
          this._type = value;
        },

        /**
         * @description Duration of some animation in ms. Default 500
         */
        get duration() {
          return this._duration;
        },

        set duration(value) {
          if (isNaN(parseInt(value, 10))) {
            throw new Error(`animation.duration should be an integer`);
          }
          this._duration = value;
        }
      },

      /**
       * @description Data source definition
       */
      dataSource: {

        _cache: null, _url: null,

        /**
         * @description Time life of the cache when data is retrieved from an API call
         */
        get cache() {
          return this._cache;
        },

        set cache(value) {
          if (isNaN(parseInt(value, 10))) {
            throw new Error(`cache should be an integer`);
          }
          this._cache = value;
        },

        /**
         * @description Endpoint URL to reach to retrieve data
         */
        get url() {
          return this._url;
        },

        set url(value) {
          if (/^http|https/i.test(value) === false) {
            throw new Error(`datasource.url must be a valid url (${options.dataSource?.url} given)`);
          }
          this._url = value;
        },

        /**
         * @description Query string parameters mapping
         */
        queryString: {

          /**
           * @description Keys to use in query string to request the API
           */
          keys: {
            
            _term: 'q', _limit: 'limit', _offset: 'offset', _perPage: 'perPage',

            /**
             * @decription URLSearchParam for the term (input.value) to search
             */
            get term() {
              return this._term;
            },

            set term(value) {
              this._term = value;
            },

            /**
             * @decription URLSearchParam for the limit results to return. Can be different of the maxResult
             */
            get limit() {
              return this._limit;
            },

            set limit(value) {
              this._limit = value;
            },

            /**
             * @decription URLSearchParam for the offset start value
             */
            get offset() {
              return this._offset;
            },

            set offset(value) {
              this._offset = value;
            },

            /**
             * @decription URLSearchParam for the per page results to return.
             */
            get perPage() {
              return this._perPage || 'perPage';
            },

            set perPage(value) {
              this._perPage = value;
            }
          },

          /**
           * @description Values to use in query string to request the API
           */
          values: {
            _limit: 100, _offset: 0, _perPage: 10,

            /**
             * @decription URLSearchParam value for the limit key
             */
            get limit() {
              return this._limit;
            },

            set limit(value) {
              this._limit = value;
            },

            /**
             * @decription URLSearchParam value for the offset key
             */
            get offset() {
              return this._offset;
            },

            set offset(value) {
              this._offset = value;
            },

            /**
             * @decription URLSearchParam value for the perPage key
             */
            get perPage() {
              return this._perPage;
            },

            set perPage(value) {
              this._perPage = value;
            }
          }
        },
      },

      /**
       * @description Fields to display in each suggestion item
       */
      get fieldsToDisplay() {
        return this._fieldsToDisplay;
      },

      set fieldsToDisplay(value) {
        this._fieldsToDisplay = value;
      },
      
      /**
       * @description Maximum number of results to display as suggestions (can be different thant the number of results availables)
       * 
       * @deprecated
       */
      get maxResults() {
        return this._maxResults;
      },

      set maxResults(value) {
        this._maxResults = value;
      },

      /**
       * @description Input minimal value length before to fire research
       * 
       * @deprecated
       */
      get startQueriyngFromChar() {
        return this._startQueriyngFromChar;
      },

      set startQueriyngFromChar(value) {
        this._startQueriyngFromChar = value;
      },

      /**
       * @description Property to map as value
       */
      get propToMapAsValue() {
        return this._propToMapAsValue;
      },

      set propToMapAsValue(value) {
        this._propToMapAsValue = value;
      },

      /**
       * @description Styles customization
       * 
       * @todo
       */
      styles: {}
    },

    /**
     * @description Kompleter internal properties.
     */
    props: {
      
      _dataSet: null, _pointer: null, _previousValue: null,

      /**
       * @description Data storage
       */
      get dataSet() {
        return this._dataSet;
      },

      set dataSet(value) {
        if (!Array.isArray(value)) {
          throw new Error(`dataset must be an array (${value.toString()} given)`);
        }
        this._dataSet = value;
      },

      /**
       * @description Position of the pointer inside the suggestions
       */
      get pointer() {
        return this._pointer;
      },

      set pointer(value) {
        if (isNaN(parseInt(value, 10))) {
          throw new Error(`pointer must be an integer (${value.toString()} given)`);
        }
        this._pointer = value;
      },

      /**
       * @description Previous input value
       */
      get previousValue() {
        return this._previousValue;
      },

      set previousValue(value) {
        this._previousValue = value;
      },
    },

    /**
     * @description Kompleter params validation functions.
     */
    validators: {

      /**
       * @description Valid input as HTMLInputElement or DOM eligible
       * 
       * @param {HTMLInputElement|String} input
       * 
       * @throws {Error}
       * 
       * @returns {Boolean}
       */
      input: (input) => {
        if (input instanceof HTMLInputElement === false && !document.getElementById(input)) {
          throw new Error(`input should be an HTMLInputElement instance or a valid id identifier. None of boths given, ${input} received.`);
        }
        return true;
      },

      /**
       * @description Valid dataset format
       * 
       * @param {Array} dataSet 
       *
       * @returns {Boolean}
       */
      dataSet: (dataSet) => {
        console.log(dataSet)
        if (dataSet && !Array.isArray(dataSet)) {
          throw new Error(`Invalid dataset. Please provide a valid dataset or nothing if you provide a dataSource (${dataSet} given).`);
        }
        return true;
      },

      /**
       * @description Valid options
       * 
       * @param {Object} options 
       *
       * @returns {Boolean}
       */
      options: (options) => {
        if (options.dataSource && !options.dataSource?.url) {
          throw new Error(`Invalid datasource.url. Please provide a valid datasource url (${options.dataSource?.url} given).`);
        }
        return true;
      },

      /**
       * @description Valid callbacks
       * 
       * @param {Object} callbacks 
       *
       * @returns {Boolean}
       */
      callbacks: (callbacks) => {
        Object.keys(callbacks).forEach(key => {
          if (!Object.keys(kompleter.callbacks).includes(key)) {
            throw new Error(`Unrecognized callback function ${key}. Please use onKeyup, onSelect and onError as valid callbacks functions.`);
          }
          if (typeof callbacks[key] !== 'function') {
            throw new Error(`callback function ${key} should be a function`);
          }
        });
        return true;
      }
    },

    /**
     * @description Kompleter utils functions.
     */
    utils: {

      /**
       * @description Build an HTML element and set his attributes
       * 
       * @param {String} element HTML tag to build
       * @param {Object[]} attributes Key / values pairs
       * 
       * @returns {HTMLElement}
       */
      build: function (element, attributes = []) {
        const htmlElement = document.createElement(element);
        attributes.forEach(attribute => {
          htmlElement.setAttribute(Object.keys(attribute)[0], Object.values(attribute)[0]);
        });
        return htmlElement;
      },

      /**
       * @description Build a query string and returns it as String
       * 
       * @param {Object} keys
       * @param {Object} values 
       * @param {String} term 
       * 
       * @returns {String} The generated query string
       */
      qs: function(keys, values, term = '') {
        const qs = new URLSearchParams();
        Object.keys(kompleter.options.dataSource.queryString.keys)
          .forEach(param => qs.append(kompleter.options.dataSource.queryString.keys[param], param === 'term' ? term : kompleter.options.dataSource.queryString.values[param]));
        return qs.toString();
      },

      /**
       * @description Get a simple uuid generated from given string
       * 
       * @param {String} string The string to convert in uuid
       * 
       * @returns {String} The generate uuid value
       */
      uuid: function(string) {
        return string.split('')
          .map(v => v.charCodeAt(0))
          .reduce((a, v) => a + ((a<<7) + (a<<3)) ^ v)
          .toString(16);
      },
    },

    /**
     * @description Kompleter rendering functions.
     */
    view: {

      /**
       * @description Add / remove the focus on a HTMLElement
       * 
       * @param {String} action add|remove
       *
       * @returns {Void}
       */
      focus: function(action) {
        if (!['add', 'remove'].includes(action)) {
          throw new Error('action should be one of ["add", "remove]: ' + action + ' given.');
        }

        switch (action) {
          case 'add':
            kompleter.htmlElements.focused = kompleter.htmlElements.suggestions[kompleter.props.pointer];
            kompleter.htmlElements.suggestions[kompleter.props.pointer].className += ' focus';
            break;
          case 'remove':
            kompleter.htmlElements.focused = null;
            Array.from(kompleter.htmlElements.suggestions).forEach(suggestion => {
              ((suggestion) => {
                suggestion.className = 'item--result';
              })(suggestion)
            });
            break;
        }
      },

      /**
       * @description Display results according to the current input value / setup
       * 
       * @emits CustomEvent 'kompleter.view.result.done'
       * 
       * @returns {Void}
       */
      results: function() {
        let html = '';

        if(kompleter.props.dataSet && kompleter.props.dataSet.length) {
          for(let i = 0; i < kompleter.props.dataSet.length && i <= kompleter.options.maxResults; i++) {
            if(typeof kompleter.props.dataSet[i] !== 'undefined') {
              html += `<div id="${i}" class="item--result ${i + 1 === kompleter.props.dataSet.length ? 'last' : ''}">`;
              switch (typeof kompleter.props.dataSet[i]) {
                case 'string':
                  html += '<span class="data-' + j + '">' + kompleter.props.dataSet[i] + '</span>';
                  break;
                case 'object':
                  let properties = Array.isArray(kompleter.options.fieldsToDisplay) && kompleter.options.fieldsToDisplay.length ? kompleter.options.fieldsToDisplay.slice(0, 3) : Object.keys(kompleter.props.dataSet[i]).slice(0, 3);
                  for(let j = 0; j < properties.length; j++) {
                    html += '<span class="data-' + j + '">' + kompleter.props.dataSet[i][properties[j]] + '</span>';
                  }
                  break;
              }
              html += '</div>';
            } 
          } 
        } else {
          html = '<div class="item--result">Not found</div>';
        }

        kompleter.htmlElements.result.innerHTML = html;
        
        document.dispatchEvent(kompleter.events.renderResultDone());
      }
    },

    /**
     * @description Kompleter entry point.
     * 
     * @param {String|HTMLInputElement} input HTMLInputElement
     * @param {Object} options Main options and configuration parameters
     * @param {Array} dataSet Set of data to use if consummer take ownership on the data
     * @param {Object} callbacks Callback functions { onKeyup, onSelect, onError }
     * 
     * @returns {Void}
     */
    init: function(input, options, dataSet = [], callbacks = { onKeyup: (value, cb) => {}, onSelect: (selected) => {} }) {

      try {

        // 1. Validate

        kompleter.validators.input(input);
        kompleter.validators.options(options)
        kompleter.validators.dataSet(dataSet);
        kompleter.validators.callbacks(callbacks);

        // 2. Assign

        if(options) {
          kompleter.options = Object.assign(kompleter.options, options);
        }

        if (dataSet) {
          kompleter.props.dataSet = dataSet;
        }
        
        if (callbacks) {
          kompleter.callbacks = Object.assign(kompleter.callbacks, callbacks);
        }

        // 3. Build DOM

        kompleter.htmlElements.input = input instanceof HTMLInputElement ? input : document.getElementById(input);

        kompleter.htmlElements.result = kompleter.utils.build('div', [ { id: 'kpl-result' }, { class: 'form--search__result' } ]);

        kompleter.htmlElements.wrapper = kompleter.htmlElements.input.parentElement;
        kompleter.htmlElements.wrapper.setAttribute('class', 'kompleter');
        kompleter.htmlElements.wrapper.appendChild(kompleter.htmlElements.result);

        // 4. Listeners

        kompleter.listeners.onError();
        kompleter.listeners.onHide();
        kompleter.listeners.onKeyup();
        kompleter.listeners.onNavigationEnd();
        kompleter.listeners.onRequestDone();
        kompleter.listeners.onViewResultDone();
      } catch(e) {
        console.error(e);
      }
    },
  };

  window.kompleter = kompleter.init;
  
  window.HTMLInputElement.prototype.kompleter = function(config, dataSet, callbacks) {
    window.kompleter(this, config, dataSet, callbacks);
  };

})(window);