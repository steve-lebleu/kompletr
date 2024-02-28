((window) => {
  if (window.kompleter) {
    throw new Error('window.kompleter already exists !');
  }

  /**
   * @summary Kompleter.js is a library providing features dedicated to autocomplete fields.
   * 
   * @author Steve Lebleu <ping@steve-lebleu.dev>
   */
  const kompleter = {

    /**
     * @descrption Animations functions
     */
    animations: {
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
     * @description Cache related methods
     */
    cache: {
      emit: (queryString) => {
        window.caches.open('kompleter.cache')
          .then(cache => {
            cache.match(queryString)
              .then(async (data) => {
                document.dispatchEvent(kompleter.events.requestDone({ fromCache: true, data: await data.json() }));
              });
          })
          .catch(e => {
            document.dispatchEvent(kompleter.events.error({ error: e }));
          });
      },
      isActive: () => {
        return typeof kompleter.options.cache !== 'undefined';
      },
      isValid: async (queryString) => {
        const uuid = kompleter.handlers.uuid(queryString);
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
      reset: () => {},
      set: ({ queryString, data }) => {
        data = JSON.stringify(data);
        window.caches.open('kompleter.cache')
          .then(cache => {
            const headers = new Headers;
            headers.set('content-type', 'application/json');
            const uuid = kompleter.handlers.uuid(queryString);
            cache.put(uuid, new Response(Date.now(), { headers }));
            cache.put(queryString, new Response(data, { headers }));
          })
          .catch(e => {
            document.dispatchEvent(kompleter.events.error({ error: e }));
          });
      },
    },

    /**
     * @description Client callbacks
     */
    callbacks: {
      onError: (error) => {},
      onKeyup: (value, cb) => {},
      onSelect: (selected) => {},
    },

    /**
     * @description Custom events
     */
    events: {
      error: (detail = {}) => new CustomEvent('kompleter.error', {
        detail,
        bubble: true,
        cancelable: false,
        composed: false,
      }),
      navigationEnd: (detail = {}) => new CustomEvent('kompleter.navigation.end', {
        detail,
        bubble: true,
        cancelable: false,
        composed: false,
      }),
      renderResultDone: (detail = {}) => new CustomEvent('kompleter.view.result.done', {
        detail,
        bubble: true,
        cancelable: false,
        composed: false,
      }),
      requestDone: (detail = {}) => new CustomEvent('kompleter.request.done', {
        detail,
        bubble: true,
        cancelable: false,
        composed: false,
      }),
      selectDone: (detail = {}) => new CustomEvent('kompleter.select.done', {
        detail,
        bubble: true,
        cancelable: false,
        composed: false,
      }),
      warning: (detail = {}) => new CustomEvent('kompleter.warning', {
        detail,
        bubble: true,
        cancelable: false,
        composed: false,
      }),
    },

    /**
     * @description Handlers of all religions
     */
    handlers: {
      build: function (element, attributes = []) {
        const htmlElement = document.createElement(element);
        attributes.forEach(attribute => {
          htmlElement.setAttribute(Object.keys(attribute)[0], Object.values(attribute)[0]);
        });
        return htmlElement;
      },
      navigate: function (keyCode) {
        if (this.point(keyCode)) {
          kompleter.view.focus('remove').focus('add');
        };
      },
      point: function(keyCode) {
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

        return true;
      },
      qs: function(term = '') {
        const qs = new URLSearchParams();
        Object.keys(kompleter.props.dataSource.queryString.keys)
          .forEach(param => qs.append(kompleter.props.dataSource.queryString.keys[param], param === 'term' ? term : kompleter.props.dataSource.queryString.values[param]));
        return qs.toString();
      },
      request: function() {
        const headers = new Headers();
        headers.append('content-type', 'application/x-www-form-urlencoded');
        headers.append('method', 'GET');
        
        fetch(`${kompleter.props.dataSource.url}?${this.qs(kompleter.htmlElements.input.value)}`, headers)
          .then(result => result.json())
          .then(data => {
            document.dispatchEvent(kompleter.events.requestDone({ fromCache: false, queryString: this.qs(kompleter.htmlElements.input.value), data })); 
          })
          .catch(e => {
            document.dispatchEvent(kompleter.events.error(e));
          });
      },
      select: function () {
        const id = kompleter.htmlElements.focused.id || 0;
        kompleter.htmlElements.input.value = kompleter.props.dataSource.data[id][0];
        kompleter.callbacks.onSelect(kompleter.props.dataSource.data[id]);
        document.dispatchEvent(kompleter.events.selectDone());
      },
      uuid: function(string) {
        return string.split('')
          .map(v => v.charCodeAt(0))
          .reduce((a, v) => a + ((a<<7) + (a<<3)) ^ v)
          .toString(16);
      },
    },

    /**
     * @description HTMLElements container
     */
    htmlElements: {
      focused: null,
      input: null,
      result: null,
      suggestions: [],
      wrapper: null,
    },

    /**
     * @description Events listeners
     */
    listeners: {
      onError: () => {
        document.addEventListener('kompleter.error', (e) => {
          console.error(`[kompleter] An error has occured -> ${e?.detail?.stack}`);
          kompleter.callbacks.onError(e?.detail);
        });
      },
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
      onNavigationEnd: () => {
        document.addEventListener('kompleter.navigation.end', (e) => {
          kompleter.props.pointer = -1;
        });
      },
      onSelect: (className) => {
        kompleter.htmlElements.suggestions = document.getElementsByClassName(className);
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
      onRequestDone: () => {
        document.addEventListener('kompleter.request.done', (e) => {
          kompleter.props.dataSource.data = e.detail.data;
          if (!e.detail.fromCache) {
            kompleter.cache.set(e.detail);
          }
          kompleter.view.results(e.detail.data);
        });
      },
      onType: () => {
        kompleter.htmlElements.input.addEventListener('keyup', async (e) => {
          if (kompleter.htmlElements.input.value.length < kompleter.options.startQueriyngFromChar) {
            return;
          }
          
          const keyCode = e.keyCode;

          switch (keyCode) {
            case 13:  // Enter
              kompleter.handlers.select();
              break;
            case 38: // Up
            case 40: // Down
              kompleter.handlers.navigate(keyCode);
              break;
            default:
              if ( kompleter.htmlElements.input.value !== kompleter.props.previousValue ) {
                if (kompleter.props.dataSource.url) {
                  const qs = kompleter.handlers.qs(kompleter.htmlElements.input.value);
                  kompleter.cache.isActive() && await kompleter.cache.isValid(qs) ? kompleter.cache.emit(qs) : kompleter.handlers.request();
                } else if (kompleter.props.dataSource.data) {
                  kompleter.callbacks.onKeyup(kompleter.htmlElements.input.value, (data) => {
                    document.dispatchEvent(kompleter.events.requestDone({ fromCache: false, queryString: 'test', data })); // TODO: change fromCache by from: cache|local|request
                  });
                } else {
                  document.dispatchEvent(kompleter.events.error(new Error('None of url or data found on dataSource')));
                }
              }
              document.dispatchEvent(kompleter.events.navigationEnd());
              break
          }
        });
      },
      onViewResultDone: () => {
        document.addEventListener('kompleter.view.result.done', (e) => {
          kompleter.animations.fadeIn(kompleter.htmlElements.result);
          kompleter.listeners.onSelect('item--result');
        });
      },
      onWarning: () => {
        document.addEventListener('kompleter.warning', (e) => {
          console.warn(e.detail.message);
        });
      }
    },

    /**
     * @description Public options
     */
    options: {
      animation: {
        type: 'fadeIn',
        duration: 500
      },
      cache: 5000,
      fieldsToDisplay: null,
      maxResults: 10,
      startQueriyngFromChar: 2,
    },

    /**
     * @description Internal properties
     */
    props: {
      dataSource: {
        url: null,
        data: null,
        queryString: {  
          keys: {
            term: 'q',
            limit: 'limit',
            offset: 'offset',
            perPage: 'perPage',
          },
          values: {
            limit: 100,
            offset: 0,
            perPage: 10,
          }
        },
        propertyToValue: null,
      },
      pointer: -1,
      previousValue: null,
    },

    validators: {
      input: (input) => {
        if (input instanceof HTMLInputElement === false && !document.getElementById(input)) {
          throw new Error(`input should be an HTMLInputElement instance or a valid id identifier. None of boths given, ${input} received`);
        }
        return true;
      },
      dataSource: (dataSource) => {
        if (!dataSource?.url && !dataSource?.data) {
          throw new Error(`None of dataSource.url or dataSource.data found on dataSource. Please provide a valid url or dataset.`);
        }

        if (dataSource?.url && /^http|https/i.test(dataSource.url) === false) {
          throw new Error(`Valid URL is required as dataSource.url when you delegate querying. Please provide a valid url (${dataSource.url} given)`);
        }

        if (dataSource?.data && !Array.isArray(dataSource.data)) {
          throw new Error(`Valid dataset is required as dataSource.data when you take ownsership on the data hydratation. Please provide a valid data set array (${dataSource.data} given)`);
        }

        if (dataSource?.queryString && !Object.keys(dataSource.queryString?.keys || []).length) {
          dataSource.queryString.keys = kompleter.props.dataSource.queryString.keys;
          document.dispatchEvent(kompleter.events.warning({ message: `dataSource.queryString.keys should be an object with a keys mapping, ${dataSource.queryString.keys.toString()} given. Fallback on default values` }));
        }

        if (dataSource?.queryString && !Object.keys(dataSource.queryString?.values || []).length) {
          dataSource.queryString.values = kompleter.props.dataSource.queryString.values;
          document.dispatchEvent(kompleter.events.warning({ message: `options.dataSource.queryString.values should be an object with a values mapping, ${dataSource.queryString.values.toString()} given. Fallback on default values` }));
        }
      },
      options: (options) => {
        if (options.animation) {
          if (!['fadeIn', 'slideDown'].includes(options.animation.type)) {
            options.animation.type = kompleter.options.animation.type;
            document.dispatchEvent(kompleter.events.warning({ message: `options.animation.type should be one of ['fadeIn', 'slideDown'], ${options.animation.type.toString()} given. Fallback on default value 'fadeIn'.` }));
          }

          if (isNaN(parseInt(options.animation.duration))) {
            options.animation.duration = kompleter.options.animation.duration;
            document.dispatchEvent(kompleter.events.warning({ message: `options.animation.duration should be integer, ${options.animation.duration.toString()} given. Fallback on default value of 5000ms.` }));
          }
        }

        if (options.cache && isNaN(parseInt(options.cache))) {
          options.cache = kompleter.options.cache;
          document.dispatchEvent(kompleter.events.warning({ message: `options.cache should be integer, ${options.cache.toString()} given. Fallback on default value of 5000ms.` }));
        }

        if (options.fieldsToDisplay && (!Array.isArray(options.fieldsToDisplay) || !options.fieldsToDisplay.length)) {
          options.fieldsToDisplay = kompleter.options.fieldsToDisplay;
          document.dispatchEvent(kompleter.events.warning({ message: `options.fieldsToDisplay should be array, ${options.fieldsToDisplay.toString()} given. Fallback on default value of 10` }));
        }

        if (options.maxResults && isNaN(parseInt(options.maxResults))) {
          options.maxResults = kompleter.options.maxResults;
          document.dispatchEvent(kompleter.events.warning({ message: `options.maxResults should be integer, ${options.maxResults.toString()} given. Fallback on default value of 10` }));
        }

        if (options.startQueriyngFromChar && isNaN(parseInt(options.startQueriyngFromChar))) {
          options.startQueriyngFromChar = kompleter.options.startQueriyngFromChar;
          document.dispatchEvent(kompleter.events.warning({ message: `options.startQueriyngFromChar should be integer, ${options.startQueriyngFromChar.toString()} given. Fallback on default value of 2` }));
        }

        return true;
      },
      callbacks: (callbacks) => {
        Object.keys(callbacks).forEach(key => {
          if (!Object.keys(kompleter.callbacks).includes(key)) {
            throw new Error(`Unrecognized callback function ${key}. Please use onKeyup, onSelect and onError as valid callbacks functions.`);
          }
          if (typeof callbacks[key] !== 'function') {
            throw new Error(`callback function ${key} should be a function`);
          }
        });
      }
    },

    /**
     * @description Rendering methods
     */
    view: {
      error: function(e) {
        kompleter.htmlElements.result.innerHTML = '<div class="item--result">Error</div>';
        kompleter.animations.fadeIn(kompleter.htmlElements.result);
      },
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
        return this;
      },
      results: function(e) {
        let html = '';
        if(kompleter.props.dataSource.data && kompleter.props.dataSource.data.length) {
          const properties = kompleter.options.fieldsToDisplay.length; // TODO should be validated as 3 or 4 max + flexbox design + this works only on current dataSet ?
          for(let i = 0; i < kompleter.props.dataSource.data.length && i <= kompleter.options.maxResults; i++) {
            if(typeof kompleter.props.dataSource.data[i] !== 'undefined') {
              html += `<div id="${i}" class="item--result ${i + 1 === kompleter.props.dataSource.data.length ? 'last' : ''}">`;
              for(let j = 0; j < properties; j++) {
                html += '<span class="data-' + j + '">' + kompleter.props.dataSource.data[i][j] + '</span>';
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
     * @description Kompleter entry point
     * 
     * @param {String|HTMLInputElement} input 
     * @param {Object} dataSource
     * @param {Object} options 
     * @param {Object} callbacks { onKeyup, onSelect, onError }
     */
    init: function(input, dataSource, options, callbacks) {

      try {

        // 1. Validate

        kompleter.validators.input(input);
        kompleter.validators.dataSource(dataSource);
        options && kompleter.validators.options(options);
        dataSource.data && kompleter.validators.callbacks(callbacks);

        // 2. Assign

        kompleter.props.dataSource = Object.assign(kompleter.props.dataSource, dataSource);
        
        if(options) {
          kompleter.options = Object.assign(kompleter.options, options);
        }

        if (dataSource.data) {
          kompleter.callbacks = Object.assign(kompleter.callbacks, callbacks);
        }

        // 3. Build HTML

        kompleter.htmlElements.wrapper = input.parentElement;

        kompleter.htmlElements.input = input instanceof HTMLInputElement ? input : document.getElementById(input);

        kompleter.htmlElements.result = kompleter.handlers.build('div', [ { id: 'result' }, { className: 'form--lightsearch__result' } ]);

        kompleter.htmlElements.wrapper.appendChild(kompleter.htmlElements.result);

        // 4. Listeners

        kompleter.listeners.onError();
        kompleter.listeners.onHide();
        kompleter.listeners.onNavigationEnd();
        kompleter.listeners.onType();
        kompleter.listeners.onRequestDone();
        kompleter.listeners.onViewResultDone();
        kompleter.listeners.onWarning();

        console.log('Kompleter', kompleter);
      } catch(e) {
        console.error(e);
      }
    },
  };

  window.kompleter = kompleter.init;
  
  window.HTMLInputElement.prototype.kompleter = function(dataSource, options, callbacks) {
    window.kompleter(this, dataSource, options, callbacks);
  }

})(window);