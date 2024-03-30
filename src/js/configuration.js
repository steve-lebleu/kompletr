import { searchExpression, theme } from './enums.js';

/**
 * @description Represents the configuration for the Kompleter library.
 */
export class Configuration {
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
  _theme = theme.light;

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
  _filterOn = searchExpression.prefix;

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
    const valid = Object.keys(theme);
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
    const valid = Object.keys(searchExpression);
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