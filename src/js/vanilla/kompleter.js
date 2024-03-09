((window) => {
  if (window.kompltetr) {
    throw new Error('window.kompltetr already exists !');
  }

  /**
   * @summary Kømpletr.js is a library providing features dedicated to autocomplete fields.
   * 
   * @author Steve Lebleu <ping@steve-lebleu.dev>
   * @see https://github.com/steve-lebleu/kompletr
   */
  const kompltetr = {

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
       * @emits CustomEvent 'kompltetr.request.done' { from, queryString, data }
       * @emits CustomEvent 'kompltetr.error' { error }
       * 
       * @returns {Void}
       */
      emit: (queryString) => {
        window.caches.open('kompltetr.cache')
          .then(cache => {
            cache.match(queryString)
              .then(async (data) => {
                document.dispatchEvent(kompltetr.events.requestDone({ from: kompltetr.enums.origin.cache, queryString: null, data: await data.json() }));
              });
          })
          .catch(e => {
            document.dispatchEvent(kompltetr.events.error(e));
          });
      },

      /**
       * @description Indicate if the cache is active or not
       * 
       * @returns {Boolean} Cache is active or not
       */
      isActive: () => {
        return typeof kompltetr.options.cache !== 'undefined';
      },

      /**
       * @description Check the cache validity regarding the current request and the cache timelife
       * 
       * @param {String} queryString The current request query string
       *
       * @returns {Promise<Boolean>} 
       */
      isValid: async (queryString) => {
        const uuid = kompltetr.utils.uuid(queryString);
        const cache = await window.caches.open('kompltetr.cache');
        
        const response = await cache.match(uuid);
        if (!response) {
          return false;
        }

        const createdAt = await response.text();
        if (parseInt(createdAt + kompltetr.options.cache, 10) <= Date.now()) {
          return false;   
        }
        return true;
      },

      /**
       * @description Push data into the cache
       * 
       * @param {Object} args { queryString, data }
       * 
       * @emits CustomEvent 'kompltetr.error' { error }
       * 
       * @returns {Void}
       */
      set: ({ queryString, data }) => {
        data = JSON.stringify(data);
        window.caches.open('kompltetr.cache')
          .then(cache => {
            const headers = new Headers;
            headers.set('content-type', 'application/json');
            const uuid = kompltetr.utils.uuid(queryString);
            cache.put(uuid, new Response(Date.now(), { headers }));
            cache.put(queryString, new Response(data, { headers }));
          })
          .catch(e => {
            document.dispatchEvent(kompltetr.events.error(e));
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
     * @description kompltetr custom events getters functions.
     */
    events: {

      /**
       * @description Get a CustomEvent instance for an event with name 'kompltetr.error'
       * 
       * @param {*} detail 
       * 
       * @returns {CustomEvent}
       */
      error: (detail = { message: '', stack: '', name: ''}) => new CustomEvent('kompltetr.error', {
        detail,
        bubble: true,
        cancelable: false,
        composed: false,
      }),

      /**
       * @description Get a CustomEvent instance for an event with name 'kompltetr.navigation.end'
       * 
       * @param {*} detail 
       * 
       * @returns {CustomEvent}
       */
      navigationEnd: (detail = {}) => new CustomEvent('kompltetr.navigation.end', {
        detail,
        bubble: true,
        cancelable: false,
        composed: false,
      }),

      /**
       * @description Get a CustomEvent instance for an event with name 'kompltetr.view.result.done'
       * 
       * @param {*} detail 
       * 
       * @returns {CustomEvent}
       */
      renderResultDone: (detail = {}) => new CustomEvent('kompltetr.view.result.done', {
        detail,
        bubble: true,
        cancelable: false,
        composed: false,
      }),

      /**
       * @description Get a CustomEvent instance for an event with name 'kompltetr.request.done'
       * 
       * @param {*} detail 
       * 
       * @returns {CustomEvent}
       */
      requestDone: (detail = { from: '', queryString: null, data: null }) => new CustomEvent('kompltetr.request.done', {
        detail,
        bubble: true,
        cancelable: false,
        composed: false,
      }),

      /**
       * @description Get a CustomEvent instance for an event with name 'kompltetr.select.done'
       * 
       * @param {Object} detail 
       * 
       * @returns {CustomEvent}
       */
      selectDone: (detail = {}) => new CustomEvent('kompltetr.select.done', {
        detail,
        bubble: true,
        cancelable: false,
        composed: false,
      }),
    },

    /**
     * @description kompltetr events handlers.
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
          const value = typeof record === 'string' ? record : record[kompltetr.options.propToMapAsValue];
          if (kompltetr.options.filterOn === 'prefix') {
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
       * @emits CustomEvent 'kompltetr.request.done' { from, queryString, data }
       * @emits CustomEvent 'kompltetr.error' { error }
       * 
       * @returns {Void}
       */
      hydrate: async function(value) {
        try {
          // TODO manage cache -> if data available in the cache, get it from there
          // TODO udpate requestDOne to take care of the new signature of the detail, without queryString, but just base on the search term
          // TODO origin is not longer valid arg, querystring no more
          if (kompltetr.callbacks.onKeyup) {
            kompltetr.callbacks.onKeyup(value, (data) => {
              document.dispatchEvent(kompltetr.events.requestDone({ from: kompltetr.enums.origin.local, queryString: null, data }));
            });
          } else {
            const data = kompltetr.handlers.filter(value, kompltetr.props.data);
            document.dispatchEvent(kompltetr.events.requestDone({ from: kompltetr.enums.origin.local, queryString: null, data }));
          }
        } catch(e) {
          document.dispatchEvent(kompltetr.events.error(e));
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
        
        if(kompltetr.props.pointer < -1 || kompltetr.props.pointer > kompltetr.htmlElements.suggestions.length - 1) {
          return false;
        }

        if (keyCode === 38 && kompltetr.props.pointer >= -1) {
          kompltetr.props.pointer--;
        } else if (keyCode === 40 && kompltetr.props.pointer < kompltetr.htmlElements.suggestions.length - 1) {
          kompltetr.props.pointer++;
        } 

        kompltetr.view.focus('remove');
        kompltetr.view.focus('add');
      },

      /**
       * @description Select a suggested item as user choice
       * 
       * @param {Number} idx The index of the selected suggestion
       * 
       * @emits CustomEvent 'kompltetr.select.done'
       * 
       * @returns {Void}
       */
      select: function (idx = 0) {
        kompltetr.htmlElements.input.value = typeof kompltetr.props.data[idx] === 'object' ? kompltetr.props.data[idx][kompltetr.options.propToMapAsValue] : kompltetr.props.data[idx];
        kompltetr.callbacks.onSelect(kompltetr.props.data[idx]);
        document.dispatchEvent(kompltetr.events.selectDone());
      },
    },

    /**
     * @description kompltetr HTMLElements container.
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
       * @description HTMLElemnt identifed as first direct parent of the HTMLInputElement kompltetr.htmlElements.input
       */
      wrapper: null,
    },

    /**
     * @description kompltetr events listeners of all religions.
     */
    listeners: {

      /**
       * @description CustomEvent 'kompltetr.error' listener
       */
      onError: () => {
        document.addEventListener('kompltetr.error', (e) => {
          console.error(`[kompltetr] An error has occured -> ${e.detail.stack}`);
          kompltetr.animations.fadeIn(kompltetr.htmlElements.result);
          kompltetr.callbacks.onError && kompltetr.callbacks.onError(e.detail);
        });
      },

      /**
       * @description 'body.click' && kompltetr.select.done listeners
       */
      onHide: () => {
        const body = document.getElementsByTagName('body')[0];
        body.addEventListener('click', (e) => {
          kompltetr.animations.fadeOut(kompltetr.htmlElements.result);
          document.dispatchEvent(kompltetr.events.navigationEnd());
        });
        document.addEventListener('kompltetr.select.done', (e) => {
          kompltetr.animations.fadeOut(kompltetr.htmlElements.result);
          document.dispatchEvent(kompltetr.events.navigationEnd());
        });
      },

      /**
       * @description CustomEvent 'kompltetr.navigation.end' listener
       */
      onNavigationEnd: () => {
        document.addEventListener('kompltetr.navigation.end', (e) => {
          kompltetr.props.pointer = -1;
        });
      },

      /**
       * @description HTMLElements.click listener 
       */
      onSelect: () => {
        kompltetr.htmlElements.suggestions = document.getElementsByClassName('item--result');

        if(typeof kompltetr.htmlElements.suggestions !== 'undefined') {
          const numberOfSuggestions = kompltetr.htmlElements.suggestions.length;
          
          if(numberOfSuggestions) {
            for(let i = 0; i < numberOfSuggestions; i++) {
              ((i) => {
                return kompltetr.htmlElements.suggestions[i].addEventListener('click', (e) => {
                  kompltetr.htmlElements.focused = kompltetr.htmlElements.suggestions[i];
                  kompltetr.handlers.select();
                });
              })(i)
            }
          }
        }
      },

      /**
       * @description CustomEvent 'kompltetr.request.done' listener
       */
      onRequestDone: () => {
        document.addEventListener('kompltetr.request.done', async (e) => {
          kompltetr.props.data = e.detail.data;
          if (kompltetr.cache.isActive() && await kompltetr.cache.isValid()) {
            kompltetr.cache.set(e.detail);
          }
          kompltetr.view.results(e.detail.data);
        });
      },

      /**
       * @description 'input.keyup' listener
       */
      onKeyup: () => {
        kompltetr.htmlElements.input.addEventListener('keyup', async (e) => {
          if (kompltetr.htmlElements.input.value.length < kompltetr.options.startQueriyngFromChar) {
            return;
          }
          
          const keyCode = e.keyCode;

          switch (keyCode) {
            case 13:  // Enter
              kompltetr.handlers.select(kompltetr.htmlElements.focused.id);
              break;
            case 38: // Up
            case 40: // Down
              kompltetr.handlers.navigate(keyCode);
              break;
            default:
              if (kompltetr.htmlElements.input.value !== kompltetr.props.previousValue) {
                kompltetr.handlers.hydrate(kompltetr.htmlElements.input.value);
              }
              document.dispatchEvent(kompltetr.events.navigationEnd());
              break
          }
        });
      },

      /**
       * @description CustomEvent 'kompltetr.view.result.done' listener
       * 
       * @todo Try to move the event listener into the event handler instead ot this listener
       */
      onViewResultDone: () => {
        document.addEventListener('kompltetr.view.result.done', (e) => {
          kompltetr.animations.fadeIn(kompltetr.htmlElements.result);
          kompltetr.listeners.onSelect();
        });
      },
    },

    /**
     * @description kompltetr public options.
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
          const valid = Object.keys(kompltetr.enums.animation);
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
     * @description kompltetr internal properties.
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
     * @description kompltetr params validation functions.
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
          if (!Object.keys(kompltetr.callbacks).includes(key)) {
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
     * @description kompltetr utils functions.
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
     * @description kompltetr rendering functions.
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
            kompltetr.htmlElements.focused = kompltetr.htmlElements.suggestions[kompltetr.props.pointer];
            kompltetr.htmlElements.suggestions[kompltetr.props.pointer].className += ' focus';
            break;
          case 'remove':
            kompltetr.htmlElements.focused = null;
            Array.from(kompltetr.htmlElements.suggestions).forEach(suggestion => {
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
       * @emits CustomEvent 'kompltetr.view.result.done'
       * 
       * @returns {Void}
       */
      results: function() {
        let html = '';

        if(kompltetr.props.data && kompltetr.props.data.length) {
          for(let i = 0; i < kompltetr.props.data.length && i <= kompltetr.options.maxResults - 1; i++) {
            if(typeof kompltetr.props.data[i] !== 'undefined') {
              html += `<div id="${i}" class="item--result ${i + 1 === kompltetr.props.data.length ? 'last' : ''}">`;
              switch (typeof kompltetr.props.data[i]) {
                case 'string':
                  html += '<span class="item--data">' + kompltetr.props.data[i] + '</span>';
                  break;
                case 'object':
                  let properties = Array.isArray(kompltetr.options.fieldsToDisplay) && kompltetr.options.fieldsToDisplay.length ? kompltetr.options.fieldsToDisplay.slice(0, 3) : Object.keys(kompltetr.props.data[i]).slice(0, 3);
                  for(let j = 0; j < properties.length; j++) {
                    html += '<span class="item--data">' + kompltetr.props.data[i][properties[j]] + '</span>';
                  }
                  break;
              }
              html += '</div>';
            } 
          } 
        } else {
          html = '<div class="item--result">Not found</div>';
        }

        kompltetr.htmlElements.result.innerHTML = html;
        
        document.dispatchEvent(kompltetr.events.renderResultDone());
      }
    },

    /**
     * @description kompltetr entry point.
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

        kompltetr.validators.input(input);
        kompltetr.validators.data(data);    
        kompltetr.validators.callbacks({ onKeyup, onSelect, onError });

        // 2. Assign TODO: possible to do better with this ?

        if (data) {
          kompltetr.props.data = data;
        }

        if(options) {
          kompltetr.options = Object.assign(kompltetr.options, options);
        }
        
        if (onKeyup || onSelect || onError) {
          kompltetr.callbacks = Object.assign(kompltetr.callbacks, { onKeyup, onSelect, onError });
        }

        // 3. Build DOM

        kompltetr.htmlElements.input = input instanceof HTMLInputElement ? input : document.getElementById(input);

        kompltetr.htmlElements.result = kompltetr.utils.build('div', [ { id: 'kpl-result' }, { class: 'form--search__result' } ]);

        kompltetr.htmlElements.wrapper = kompltetr.htmlElements.input.parentElement;
        kompltetr.htmlElements.wrapper.setAttribute('class', `${kompltetr.htmlElements.wrapper.getAttribute('class')} kompletr ${kompltetr.options.theme}`);
        kompltetr.htmlElements.wrapper.appendChild(kompltetr.htmlElements.result);

        // 4. Listeners

        kompltetr.listeners.onError();
        kompltetr.listeners.onHide();
        kompltetr.listeners.onKeyup();
        kompltetr.listeners.onNavigationEnd();
        kompltetr.listeners.onRequestDone();
        kompltetr.listeners.onViewResultDone();
      } catch(e) {
        console.error(e);
      }
    },
  };

  window.kompltetr = kompltetr.init;
  
  window.HTMLInputElement.prototype.kompltetr = function({ data, options, onKeyup, onSelect, onError }) {
    window.kompltetr({ input: this, data, options, onKeyup, onSelect, onError });
  };

})(window);