/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/animation.js":
/*!*****************************!*\
  !*** ./src/js/animation.js ***!
  \*****************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Animation: function() { return /* binding */ Animation; }
/* harmony export */ });
/**
 * Represents an Animation class that provides various animation effects.
 */
class Animation {
  constructor() {}

  /**
   * Apply a fadeIn animation effect to the target HTML element.
   * 
   * @param {HTMLElement} element - The target HTML element.
   * 
   * @returns {Void}
   * 
   * @todo Manage duration
   */
  static fadeIn(element) {
    element.style.opacity = 0;
    element.style.display = 'block';
    (function fade(){
      let value = parseFloat(element.style.opacity);
      if (!((value += .1) > 1)) {
        element.style.opacity = value;
        requestAnimationFrame(fade);
      }
    })();
  }

  /**
   * Apply a fadeOut animation effect to the target HTML element.
   * 
   * @param {HTMLElement} element - The target HTML element.
   * 
   * @returns {Void}
   * 
   * @todo Manage duration
   */
  static fadeOut(element) {
    element.style.opacity = 1;
    (function fade() {
      if ((element.style.opacity -= .1) < 0) {
        element.style.display = 'none';
      } else {
        requestAnimationFrame(fade);
      }
    })();
  }
}

/***/ }),

/***/ "./src/js/broadcaster.js":
/*!*******************************!*\
  !*** ./src/js/broadcaster.js ***!
  \*******************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Broadcaster: function() { return /* binding */ Broadcaster; }
/* harmony export */ });
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./enums.js */ "./src/js/enums.js");


/**
 * Represents a Broadcaster that allows subscribing to and triggering events.
 */
class Broadcaster {
  subscribers = [];

  constructor() {}

  /**
   * Subscribes to an event.
   * 
   * @param {string} type - The type of event to subscribe to.
   * @param {Function} handler - The event handler function.
   * 
   * @throws {Error} If the event type is not valid.
   */
  subscribe(type, handler) {
    if (!Object.values(_enums_js__WEBPACK_IMPORTED_MODULE_0__.event).includes(type)) {
      throw new Error(`Event should be one of ${Object.keys(_enums_js__WEBPACK_IMPORTED_MODULE_0__.event)}: ${type} given.`);
    }
    this.subscribers.push({ type, handler });
  }

  /**
   * Listens for an event on a specified element.
   * 
   * @param {HTMLElement} element - The element to listen on.
   * @param {string} type - The type of event to listen for.
   * @param {Function} handler - The event handler function.
   */
  listen(element, type, handler) {
    element.addEventListener(type, handler);
  }

  /**
   * Triggers an event.
   * 
   * @param {string} type - The type of event to trigger.
   * @param {Object} detail - Additional details to pass to the event handler.
   * 
   * @throws {Error} If the event type is not valid.
   */
  trigger(type, detail = {}) {
    if (!Object.values(_enums_js__WEBPACK_IMPORTED_MODULE_0__.event).includes(type)) {
      throw new Error(`Event should be one of ${Object.keys(_enums_js__WEBPACK_IMPORTED_MODULE_0__.event)}: ${type} given.`);
    }
    
    this.subscribers
      .filter(subscriber => subscriber.type === type)
      .forEach(subscriber => subscriber.handler(detail));
  }
}

/***/ }),

/***/ "./src/js/cache.js":
/*!*************************!*\
  !*** ./src/js/cache.js ***!
  \*************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Cache: function() { return /* binding */ Cache; }
/* harmony export */ });
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./enums.js */ "./src/js/enums.js");


/**
 * @description Kompletr simple caching mechanism implementation.
 * 
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Cache
 * @see https://web.dev/articles/cache-api-quick-guide
 */
class Cache {

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
        this._broadcaster.trigger(_enums_js__WEBPACK_IMPORTED_MODULE_0__.event.error, e);
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
        this._broadcaster.trigger(_enums_js__WEBPACK_IMPORTED_MODULE_0__.event.error, e);
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
      this._broadcaster.trigger(_enums_js__WEBPACK_IMPORTED_MODULE_0__.event.error, e);
    }
  }
}

/***/ }),

/***/ "./src/js/configuration.js":
/*!*********************************!*\
  !*** ./src/js/configuration.js ***!
  \*********************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Configuration: function() { return /* binding */ Configuration; }
/* harmony export */ });
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./enums.js */ "./src/js/enums.js");


/**
 * @description Represents the configuration for the Kompleter library.
 */
class Configuration {
  /**
   * Indicates whether multiple selections are allowed.
   * @type {boolean}
   * @private
   */
  _multiple = false;
  
  /**
   * The theme for the kompletr options.
   * @type {string}
   */
  _theme = _enums_js__WEBPACK_IMPORTED_MODULE_0__.theme.light;

  /**
   * Array containing the fields to be displayed.
   * @type {Array}
   * @private
   */
  _fieldsToDisplay = [];

  /**
   * The maximum number of results to display.
   * @type {number}
   */
  _maxResults = 10;

  /**
   * The character index from which querying should start.
   * @type {number}
   */
  _startQueryingFromChar = 2;

  /**
   * Represents the value of a property to be mapped.
   * @type {string}
   * @private
   */
  _propToMapAsValue = '';

  /**
   * The filter option used for filtering data.
   * Possible values are 'prefix', 'expression'.
   * @type {string}
   */
  _filterOn = _enums_js__WEBPACK_IMPORTED_MODULE_0__.searchExpression.prefix;

  /**
   * Represents the cache value.
   * @type {number}
   * @private
   */
  _cache = 0;

  /**
   * @description Enable / disable multiple choices
   */
  get multiple() {
    return this._multiple;
  }

  set multiple(value) {
    this._multiple = value;
  }

  /**
   * @description Display theme between light | dark
   */
  get theme() {
    return this._theme;
  }

  set theme(value) {
    const valid = Object.keys(_enums_js__WEBPACK_IMPORTED_MODULE_0__.theme);
    if (!valid.includes(value)) {
      throw new Error(`theme should be one of ${valid.toString()}, ${value} given`);
    }
    this._theme = value;
  }

  /**
   * @description Fields to display in each suggestion item
   */
  get fieldsToDisplay() {
    return this._fieldsToDisplay;
  }

  set fieldsToDisplay(value) {
    this._fieldsToDisplay = value;
  }
  
  /**
   * @description Maximum number of results to display as suggestions (can be different thant the number of results availables)
   */
  get maxResults() {
    return this._maxResults;
  }

  set maxResults(value) {
    this._maxResults = value;
  }

  /**
   * @description Input minimal value length before to fire research
   */
  get startQueryingFromChar() {
    return this._startQueryingFromChar;
  }

  set startQueryingFromChar(value) {
    this._startQueryingFromChar = value;
  }

  /**
   * @description Property to map as value
   */
  get propToMapAsValue() {
    return this._propToMapAsValue;
  }

  set propToMapAsValue(value) {
    this._propToMapAsValue = value;
  }

  /**
   * @description Apply filtering from the beginning of the word (prefix) or on the entire expression (expression)
   */
  get filterOn() {
    return this._filterOn;
  }

  set filterOn(value) {
    const valid = Object.keys(_enums_js__WEBPACK_IMPORTED_MODULE_0__.searchExpression);
    if (!valid.includes(value)) {
      throw new Error(`filterOn should be one of ${valid.toString()}, ${value} given`);
    }
    this._filterOn = value;
  }

  /**
   * @description Time life of the cache when data is retrieved from an API call
   */
  get cache() {
    return this._cache;
  }

  set cache(value) {
    if (isNaN(parseInt(value, 10))) {
      throw new Error('cache should be an integer');
    }
    this._cache = value;
  }

  constructor(options) {
    if (options === undefined) return;
    if (typeof options !== 'object') {
      throw new Error('options should be an object');
    }
    this.theme = options?.theme || this._theme;
    this.multiple = options?.multiple || this._multiple;
    this.fieldsToDisplay = options?.fieldsToDisplay || this._fieldsToDisplay;
    this.maxResults = options?.maxResults || this._maxResults;
    this.startQueryingFromChar = options?.startQueryingFromChar || this._startQueryingFromChar;
    this.propToMapAsValue = options?.propToMapAsValue || this._propToMapAsValue;
    this.filterOn = options?.filterOn || this._filterOn;
    this.cache = options?.cache || this._cache;
  }
}

/***/ }),

/***/ "./src/js/dom.js":
/*!***********************!*\
  !*** ./src/js/dom.js ***!
  \***********************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DOM: function() { return /* binding */ DOM; }
/* harmony export */ });
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./enums.js */ "./src/js/enums.js");


class DOM {
  /**
   * @description Identifiers for the DOM elements
   */
  _identifiers = {
    results: 'kpl-result',
  };

  /**
   * @description Classes for the DOM elements
   */
  _classes = {
    main: 'kompletr',
    input: 'input--search',
    results: 'form--search__result',
    result: 'item--result',
    data: 'item--data',
    focus: 'focus',
  };

  /**
   * @description Body tag
   */
  _body = null;

  get body() {
    return this._body;
  }

  set body(value) {
    this._body = value;
  }

  /**
   * @description Main input text
   */
  _input = null;

  get input() {
    return this._input;
  }

  set input(value) {
    if (value instanceof HTMLInputElement === false) {
      throw new Error(`input should be an HTMLInputElement instance: ${value} given.`);
    }
    this._input = value;
  }

  /**
   * @description HTMLElement in suggestions who's have the focus
   */
  _focused = null;

  get focused() {
    return this._focused;
  }

  set focused(value) {
    this._focused = value;
  }

  /**
   * @description HTMLElement results container
   */
  _result = null;

  get result() {
    return this._result;
  }

  set result(value) {
    this._result = value;
  }
  
  /**
   * @description Broadcaster instance
   */
  _broadcaster = null;

  /**
   * Represents a Kompletr DOM container.
   * 
   * @param {string|HTMLInputElement} input - The input element or its ID.
   * @param {object} broadcaster - The broadcaster object.
   * @param {object} [options] - The options for the DOM object.
   * @param {string} [options.theme='light'] - The theme for the DOM object.
   * 
   * @returns {void}
   */
  constructor(input, broadcaster, options = { theme: 'light' }) {
    this._broadcaster = broadcaster;

    this.body = document.getElementsByTagName('body')[0];
    
    this.input = input instanceof HTMLInputElement ? input : document.getElementById(input); // TODO: if the input is in the DOM, don't set class here but directly in the HTML
    this.input.setAttribute('class', `${this._input.getAttribute('class')} ${this._classes.input}`);
    
    this.result = this.build('div', [ { id: this._identifiers.results }, { class: this._classes.results } ]);

    this.input.parentElement.setAttribute('class', `${this._input.parentElement.getAttribute('class')} ${this._classes.main} ${options.theme}`);
    this.input.parentElement.appendChild(this._result);
  }

  /**
  * @description Build an HTML element and set his attributes
  * 
  * @param {String} element HTML tag to build
  * @param {Object[]} attributes Key / values pairs
  * 
  * @returns {HTMLElement}
  */
  build(element, attributes = []) {
    const htmlElement = document.createElement(element);
    attributes.forEach(attribute => {
      htmlElement.setAttribute(Object.keys(attribute)[0], Object.values(attribute)[0]);
    });
    return htmlElement;
  }

  /**
   * @description Add / remove the focus on a HTMLElement
   * 
   * @param {String} action add|remove
   *
   * @returns {Void}
   */
  focus(pointer) {
    if (isNaN(parseInt(pointer, 10)) || pointer < 0 || pointer > this.result.children.length - 1) {
      throw new Error('pointer should be a valid integer in the result lenght range: ' + pointer + ' given.');
    }

    this.focused = null;
    Array.from(this.result.children).forEach(result => {
      ((result) => {
        result.className = this._classes.result;
      })(result);
    });

    this.focused = this.result.children[pointer];
    this.result.children[pointer].className += ` ${this._classes.focus}`;
  }

  /**
   * @description Display results according to the current input value / setup
   * 
   * @returns {Void}
   */
  buildResults(data, fieldsToDisplay) {
    let html = '';

    if(data && data.length) {
      html = data
        .reduce((html, current) => {
          html += `<div id="${current.idx}" class="${this._classes.result}">`;
          switch (typeof current.data) {
          case 'string':
            html += `<span class="${this._classes.data}">${current.data}</span>`;
            break;
          case 'object': {
            let properties = Array.isArray(fieldsToDisplay) && fieldsToDisplay.length ? fieldsToDisplay: Object.keys(current.data);
            for(let j = 0; j < properties.length; j++) {
              html += `<span class="${this._classes.data}">${current.data[properties[j]]}</span>`;
            }
            break;
          }}
          html += '</div>';
          return html;
        }, '');
      
    } else {
      html = `<div class="${this._classes.result}">Not found</div>`;
    }

    this.result.innerHTML = html;

    this._broadcaster.trigger(_enums_js__WEBPACK_IMPORTED_MODULE_0__.event.domDone, this.result); // TODO: to be validated
  }
}

/***/ }),

/***/ "./src/js/enums.js":
/*!*************************!*\
  !*** ./src/js/enums.js ***!
  \*************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   event: function() { return /* binding */ event; },
/* harmony export */   origin: function() { return /* binding */ origin; },
/* harmony export */   searchExpression: function() { return /* binding */ searchExpression; },
/* harmony export */   theme: function() { return /* binding */ theme; }
/* harmony export */ });
/**
 * Enum representing different custom events.
 * 
 * @enum {string}
 * @readonly
 */
const event = Object.freeze({
  error: 'kompletr.error',
  domDone: 'kompletr.dom.done',
  dataDone: 'kompletr.data.done',
  selectDone: 'kompletr.select.done'
});

/**
 * Enum representing the origin of a value.
 * 
 * @enum {string}
 * @readonly
 */
const origin = Object.freeze({
  cache: 'cache',
  callback: 'callback',
  local: 'local',
});

/**
 * Enum representing the search expression options.
 * 
 * @enum {string}
 * @readonly
 */
const searchExpression = Object.freeze({
  prefix: 'prefix',
  expression: 'expression',
});

/**
 * Enum representing the theme options.
 *
 * @enum {string}
 * @readonly
 */
const theme = Object.freeze({
  light: 'light',
  dark: 'dark',
});



/***/ }),

/***/ "./src/js/kompletr.js":
/*!****************************!*\
  !*** ./src/js/kompletr.js ***!
  \****************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Kompletr; }
/* harmony export */ });
/* harmony import */ var _animation_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./animation.js */ "./src/js/animation.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./enums.js */ "./src/js/enums.js");




/**
 * @summary Kømpletr.js is a library providing features dedicated to autocomplete fields.
 * 
 * @author Steve Lebleu <ping@steve-lebleu.dev>
 * 
 * @see https://github.com/steve-lebleu/kompletr
 */
class Kompletr {
  /**
   * 
   */
  broadcaster = null;

  /**
   * 
   */
  cache = null;

  /**
   * 
   */
  callbacks = {};

  /**
   * 
   */
  configuration = null;

  /**
   * 
   */
  dom = null;

  /**
   * 
   */
  props = null;

  constructor({ configuration, properties, dom, cache, broadcaster, onKeyup, onSelect, onError }) {
    try {
      this.configuration = configuration;
      this.broadcaster = broadcaster;
      this.props = properties;
      this.dom = dom;
      this.cache = cache;

      this.broadcaster.subscribe(_enums_js__WEBPACK_IMPORTED_MODULE_1__.event.error, this.error);
      this.broadcaster.subscribe(_enums_js__WEBPACK_IMPORTED_MODULE_1__.event.dataDone, this.showResults);
      this.broadcaster.subscribe(_enums_js__WEBPACK_IMPORTED_MODULE_1__.event.domDone, _animation_js__WEBPACK_IMPORTED_MODULE_0__.Animation.fadeIn.bind(null, this.dom.result));
      this.broadcaster.subscribe(_enums_js__WEBPACK_IMPORTED_MODULE_1__.event.domDone, this.bindResults);
      this.broadcaster.subscribe(_enums_js__WEBPACK_IMPORTED_MODULE_1__.event.selectDone, this.closeTheShop);

      this.broadcaster.listen(this.dom.input, 'keyup', this.suggest);
      this.broadcaster.listen(this.dom.body, 'click', this.closeTheShop);

      if(onKeyup || onSelect || onError) {
        this.callbacks = Object.assign(this.callbacks, { onKeyup, onSelect, onError });
      }
    } catch(e) {
      broadcaster ? broadcaster.trigger(_enums_js__WEBPACK_IMPORTED_MODULE_1__.event.error, e) : console.error(`[kompletr] An error has occured -> ${e.stack}`);
    }
  }

  closeTheShop = (e) => {
    if (e.srcElement === this.dom.input) {
      return true;
    }
    _animation_js__WEBPACK_IMPORTED_MODULE_0__.Animation.fadeOut(this.dom.result);
    this.resetPointer();
  };

  resetPointer = () => {
    this.props.pointer = -1;
  };

  error = (e) => {
    console.error(`[kompletr] An error has occured -> ${e.stack}`);
    _animation_js__WEBPACK_IMPORTED_MODULE_0__.Animation.fadeOut(this.dom.result);
    this.callbacks.onError && this.callbacks.onError(e);
  };

  filter = (data, pattern) => {
    return data.filter((record) => {
      const value = typeof record.data === 'string' ? record.data : record.data[this.configuration.propToMapAsValue];
      if (this.configuration.filterOn === _enums_js__WEBPACK_IMPORTED_MODULE_1__.searchExpression.prefix) {
        return value.toLowerCase().lastIndexOf(pattern.toLowerCase(), 0) === 0;
      }
      return value.toLowerCase().lastIndexOf(pattern.toLowerCase()) !== -1;
    });
  };

  /**
   * @description CustomEvent 'this.request.done' listener
   * 
   * @todo Check something else to determine if we filter or not -> currently just the presence of onKeyup callback
   */
  showResults = async ({ from, data }) => {
    this.props.data = data;

    data = this.props.data.map((record, idx) => ({ idx, data: record }) ); // TODO: Check to avoid this

    if (!this.callbacks.onKeyup) {
      data = this.filter(data, this.dom.input.value);
    }

    if (this.configuration.cache && from !== _enums_js__WEBPACK_IMPORTED_MODULE_1__.origin.cache) {
      this.cache.set({ string: this.dom.input.value, data });
    }

    this.dom.buildResults(data.slice(0, this.configuration.maxResults), this.configuration.fieldsToDisplay);
  };

  /**
   * @description CustomEvent 'kompletr.dom.done' listener
   */
  bindResults = () => {    
    if(this.dom.result?.children?.length) {
      for(let i = 0; i < this.dom.result.children.length; i++) {
        ((i) => {
          return this.broadcaster.listen(this.dom.result.children[i], 'click', () => {
            this.dom.focused = this.dom.result.children[i];
            this.select(this.dom.focused.id);
          });
        })(i);
      }
    }
  };

  /**
   * @description 'input.keyup' listener
   */
  suggest = (e) => {
    if (this.dom.input.value.length < this.configuration.startQueryingFromChar) {
      return _animation_js__WEBPACK_IMPORTED_MODULE_0__.Animation.fadeOut(this.dom.result);
    }
    
    switch (e.keyCode) {
    case 13:  // Enter
      this.select(this.dom.focused.id);
      break;
    case 38: // Up
    case 40: // Down
      this.navigate(e.keyCode);
      break;
    default:
      if (this.dom.input.value !== this.props.previousValue) {
        this.hydrate(this.dom.input.value);
      }
      this.resetPointer();
      break;
    }
  };

  /**
   * @description Manage the data hydration according to the current setup (cache, request or local data)
   * 
   * @param {String} value Current input value
   * 
   * @emits CustomEvent 'this.request.done' { from, data }
   * @emits CustomEvent 'this.error' { error }
   * 
   * @returns {Void}
   * 
   * @todo options.data could returns Promise<Array>, and same for the onKeyup callback
   */
  hydrate = async (value) => {
    try {
      if (this.configuration.cache && await this.cache.isValid(value)) {
        this.cache.get(value, (data) => {
          this.broadcaster.trigger(_enums_js__WEBPACK_IMPORTED_MODULE_1__.event.dataDone, { from: _enums_js__WEBPACK_IMPORTED_MODULE_1__.origin.cache, data: data });  
        });
      } else if (this.callbacks.onKeyup) {
        this.callbacks.onKeyup(value, (data) => {
          this.broadcaster.trigger(_enums_js__WEBPACK_IMPORTED_MODULE_1__.event.dataDone, { from: _enums_js__WEBPACK_IMPORTED_MODULE_1__.origin.callback, data: data });
        });
      } else {
        this.broadcaster.trigger(_enums_js__WEBPACK_IMPORTED_MODULE_1__.event.dataDone, { from: _enums_js__WEBPACK_IMPORTED_MODULE_1__.origin.local, data: this.props.data });
      }
    } catch(e) {
      this.broadcaster.trigger(_enums_js__WEBPACK_IMPORTED_MODULE_1__.event.error, e);
    }
  };

  /**
   * @description Apply visual navigation into the suggestions set
   * 
   * @param {Number} keyCode The current keyCode value
   * 
   * @returns {Void}
   */
  navigate = (keyCode) => {
    try {
      if (keyCode != 38 && keyCode != 40) {
        return false;
      }
  
      if(this.props.pointer < -1 || this.props.pointer > this.dom.result.children.length - 1) {
        return false;
      }
      
      if ((keyCode === 38 && this.props.pointer === 0) || (keyCode === 40 && this.props.pointer === this.dom.result.children.length - 1)) {
        return false;
      }

      if (keyCode === 38 && this.props.pointer >= -1) {
        this.props.pointer--;
      } else if (keyCode === 40 && this.props.pointer < this.dom.result.children.length - 1) {
        this.props.pointer++;
      } 
  
      this.dom.focus(this.props.pointer);
    } catch(e) {
      this.broadcaster.trigger(_enums_js__WEBPACK_IMPORTED_MODULE_1__.event.error, e);
    }
  };

  /**
   * @description Select a suggested item as user choice
   * 
   * @param {Number} idx The index of the selected suggestion
   * 
   * @emits CustomEvent 'this.select.done'
   * 
   * @returns {Void}
   */
  select = (idx = 0) => {
    try {
      this.dom.input.value = typeof this.props.data[idx] === 'object' ? this.props.data[idx][this.configuration.propToMapAsValue] : this.props.data[idx];
      this.callbacks.onSelect && this.callbacks.onSelect(this.props.data[idx]);
      this.broadcaster.trigger(_enums_js__WEBPACK_IMPORTED_MODULE_1__.event.selectDone);
    } catch(e) {
      this.broadcaster.trigger(_enums_js__WEBPACK_IMPORTED_MODULE_1__.event.error, e);
    }
  };
}

/***/ }),

/***/ "./src/js/properties.js":
/*!******************************!*\
  !*** ./src/js/properties.js ***!
  \******************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Properties: function() { return /* binding */ Properties; }
/* harmony export */ });
/**
 * @description Dynamic properties of current Kompltr instance.
 */
class Properties {

  /**
   * @description Data storage
   */
  _data = null;

  get data() {
    return this._data;
  }

  set data(value) {
    if (!Array.isArray(value)) {
      throw new Error(`data must be an array (${value.toString()} given)`);
    }
    this._data = value;
  }

  /**
   * @description Position of the pointer inside the suggestions
   */
  _pointer = null;

  get pointer() {
    return this._pointer;
  }

  set pointer(value) {
    if (isNaN(parseInt(value, 10))) {
      throw new Error(`pointer must be an integer (${value.toString()} given)`);
    }
    this._pointer = value;
  }

  /**
   * @description Previous input value
   */
  _previousValue = null;

  get previousValue() {
    return this._previousValue;
  }

  set previousValue(value) {
    this._previousValue = value;
  }

  constructor(data = []) {
    this._data = data;
  }
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {
/*!*************************!*\
  !*** ./src/js/index.js ***!
  \*************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   kompletr: function() { return /* binding */ kompletr; }
/* harmony export */ });
/* harmony import */ var _kompletr_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./kompletr.js */ "./src/js/kompletr.js");
/* harmony import */ var _configuration_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./configuration.js */ "./src/js/configuration.js");
/* harmony import */ var _cache_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./cache.js */ "./src/js/cache.js");
/* harmony import */ var _broadcaster_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./broadcaster.js */ "./src/js/broadcaster.js");
/* harmony import */ var _properties_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./properties.js */ "./src/js/properties.js");
/* harmony import */ var _dom_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./dom.js */ "./src/js/dom.js");








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
  try {
    const [broadcaster, configuration, properties] = [
      new _broadcaster_js__WEBPACK_IMPORTED_MODULE_3__.Broadcaster(),
      new _configuration_js__WEBPACK_IMPORTED_MODULE_1__.Configuration(options),
      new _properties_js__WEBPACK_IMPORTED_MODULE_4__.Properties(data),
    ];
  
    const [dom, cache] = [
      new _dom_js__WEBPACK_IMPORTED_MODULE_5__.DOM(input, broadcaster, configuration),
      configuration.cache ? new _cache_js__WEBPACK_IMPORTED_MODULE_2__.Cache(broadcaster, configuration.cache) : null,
    ];
   
    new _kompletr_js__WEBPACK_IMPORTED_MODULE_0__["default"]({ configuration, properties, dom, cache, broadcaster, onKeyup, onSelect, onError });
  } catch(e) {
    console.error(`[kompletr] An error has occured -> ${e.stack}`);
  }
};

window.kompletr = kompletr;


}();
/******/ })()
;
//# sourceMappingURL=main.js.map