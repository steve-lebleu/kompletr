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
     * 
     * @todo: Full review / validation of the Cache feature
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
        return typeof kompleter.options.cache !== 'undefined';
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
        if (parseInt(createdAt + kompleter.options.cache, 10) <= Date.now()) {
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
       * @description Manage filtering of entries when data is fully provided when kompltr is initialized
       *
       * @param {*} string 
       * @param {*} records 
       * @returns 
       */
      filter: function (string, records) {
        return records.filter(record => {
          const value = typeof record === 'string' ? record : record[kompleter.options.propToMapAsValue];
          if (kompleter.options.filterOn === 'prefix') {
            return value.toLowerCase().lastIndexOf(string.toLowerCase(), 0) === 0;
          }
          return value.toLowerCase().lastIndexOf(string.toLowerCase()) !== -1;
        });
      },

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
        try {
          // TODO manage cache -> if data available in the cache, get it from there
          // TODO udpate requestDOne to take care of the new signature of the detail, without queryString, but just base on the search term
          // TODO origin is not longer valid arg, querystring no more
          if (kompleter.callbacks.onKeyup) {
            kompleter.callbacks.onKeyup(value, (data) => {
              document.dispatchEvent(kompleter.events.requestDone({ from: kompleter.enums.origin.local, queryString: null, data }));
            });
          } else {
            const data = kompleter.handlers.filter(value, kompleter.props.data);
            document.dispatchEvent(kompleter.events.requestDone({ from: kompleter.enums.origin.local, queryString: null, data }));
          }
        } catch(e) {
          document.dispatchEvent(kompleter.events.error(e));
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
       * @description Select a suggested item as user choice
       * 
       * @param {Number} idx The index of the selected suggestion
       * 
       * @emits CustomEvent 'kompleter.select.done'
       * 
       * @returns {Void}
       */
      select: function (idx = 0) {
        kompleter.htmlElements.input.value = typeof kompleter.props.data[idx] === 'object' ? kompleter.props.data[idx][kompleter.options.propToMapAsValue] : kompleter.props.data[idx];
        kompleter.callbacks.onSelect(kompleter.props.data[idx]);
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
          kompleter.props.data = e.detail.data;
          if (kompleter.cache.isActive() && await kompleter.cache.isValid()) {
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

      _multiple: false,
      _theme: 'light',
      _fieldsToDisplay: [],
      _maxResults: 10,
      _startQueriyngFromChar: 2,
      _propToMapAsValue: '',
      _filterOn: 'prefix',
      _cache: 0,

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
       * @description Enable / disable multiple choices
       */
      get multiple() {
        return this._multiple;
      },

      set multiple(value) {
        this._multiple = value;
      },

      /**
       * @description Display theme between light | dark
       */
      get theme() {
        return this._theme;
      },

      set theme(value) {
        if (!['light', 'dark'].includes(value)) {
          throw new Error(`theme should be one of ['light', 'dark'], ${value} given`);
        }
        this._theme = value;
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
       */
      get maxResults() {
        return this._maxResults;
      },

      set maxResults(value) {
        this._maxResults = value;
      },

      /**
       * @description Input minimal value length before to fire research
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
       * @description Apply filtering from the beginning of the word (prefix) or on the entire expression (expression)
       */
      get filterOn() {
        return this._filterOn;
      },

      set filterOn(value) {
        if (!['prefix', 'expression'].includes(value)) {
          throw new Error(`filterOn should be one of ['prefix', 'expression'], ${value} given`);
        }
        this._filterOn = value;
      },

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
    },

    /**
     * @description Kompleter internal properties.
     */
    props: {
      
      _data: null, _pointer: null, _previousValue: null,

      /**
       * @description Data storage
       */
      get data() {
        return this._dataSet;
      },

      set data(value) {
        if (!Array.isArray(value)) {
          throw new Error(`data must be an array (${value.toString()} given)`);
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
        if (input && input instanceof HTMLInputElement === false && !document.getElementById(input)) {
          throw new Error(`input should be an HTMLInputElement instance or a valid id identifier. None of boths given, ${input} received.`);
        }
        return true;
      },

      /**
       * @description Valid data format
       * 
       * @param {Array} data 
       *
       * @returns {Boolean}
       */
      data: (data) => {
        if (data && !Array.isArray(data)) {
          throw new Error(`Invalid data. Please provide a valid data as Array of what you want (${data} given).`);
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
          if (callbacks[key] && typeof callbacks[key] !== 'function') {
            throw new Error(`callback function ${key} should be a function, ${callbacks[key]} given`);
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

        if(kompleter.props.data && kompleter.props.data.length) {
          for(let i = 0; i < kompleter.props.data.length && i <= kompleter.options.maxResults - 1; i++) {
            if(typeof kompleter.props.data[i] !== 'undefined') {
              html += `<div id="${i}" class="item--result ${i + 1 === kompleter.props.data.length ? 'last' : ''}">`;
              switch (typeof kompleter.props.data[i]) {
                case 'string':
                  html += '<span class="item--data">' + kompleter.props.data[i] + '</span>';
                  break;
                case 'object':
                  let properties = Array.isArray(kompleter.options.fieldsToDisplay) && kompleter.options.fieldsToDisplay.length ? kompleter.options.fieldsToDisplay.slice(0, 3) : Object.keys(kompleter.props.data[i]).slice(0, 3);
                  for(let j = 0; j < properties.length; j++) {
                    html += '<span class="item--data">' + kompleter.props.data[i][properties[j]] + '</span>';
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
    init: function({ input, data, options, onKeyup, onSelect, onError }) {

      try {

        // 1. Validate

        kompleter.validators.input(input);
        kompleter.validators.data(data);    
        kompleter.validators.callbacks({ onKeyup, onSelect, onError });

        // 2. Assign TODO: possible to do better with this ?

        if (data) {
          kompleter.props.data = data;
        }

        if(options) {
          kompleter.options = Object.assign(kompleter.options, options);
        }
        
        if (onKeyup || onSelect || onError) {
          kompleter.callbacks = Object.assign(kompleter.callbacks, { onKeyup, onSelect, onError });
        }

        // 3. Build DOM

        kompleter.htmlElements.input = input instanceof HTMLInputElement ? input : document.getElementById(input);

        kompleter.htmlElements.result = kompleter.utils.build('div', [ { id: 'kpl-result' }, { class: 'form--search__result' } ]);

        kompleter.htmlElements.wrapper = kompleter.htmlElements.input.parentElement;
        kompleter.htmlElements.wrapper.setAttribute('class', `${kompleter.htmlElements.wrapper.getAttribute('class')} kompletr ${kompleter.options.theme}`);
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
  
  window.HTMLInputElement.prototype.kompleter = function({ data, options, onKeyup, onSelect, onError }) {
    window.kompleter({ input: this, data, options, onKeyup, onSelect, onError });
  };

})(window);