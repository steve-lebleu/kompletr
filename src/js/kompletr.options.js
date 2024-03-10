/**
 * @description Kompletr options definition.
 */
export class Options {
  _animationType = null
  
  _animationDuration = 500

  _multiple = false
  
  _theme = 'light'

  _fieldsToDisplay = []

  _maxResults = 10

  _startQueriyngFromChar = 2

  _propToMapAsValue = ''

  _filterOn = 'prefix'

  _cache = 0

  /**
   * @description Type of animation between valid types
   */
  get animationType() {
    return this._type;
  }

  set animationType(value) {
    const valid = Object.keys(kompletr.enums.animation);
    if (!valid.includes(value)) {
      throw new Error(`animation.type should be one of ${valid}`);
    }
    this._type = value;
  }

  /**
   * @description Duration of some animation in ms. Default 500
   */
  get animationDuration() {
    return this._duration;
  }

  set animationDuration(value) {
    if (isNaN(parseInt(value, 10))) {
      throw new Error(`animation.duration should be an integer`);
    }
    this._duration = value;
  }

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
    if (!['light', 'dark'].includes(value)) {
      throw new Error(`theme should be one of ['light', 'dark'], ${value} given`);
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
  get startQueriyngFromChar() {
    return this._startQueriyngFromChar;
  }

  set startQueriyngFromChar(value) {
    this._startQueriyngFromChar = value;
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
    if (!['prefix', 'expression'].includes(value)) {
      throw new Error(`filterOn should be one of ['prefix', 'expression'], ${value} given`);
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
      throw new Error(`cache should be an integer`);
    }
    this._cache = value;
  }

  constructor(options) {
    this._theme = options?.theme;
    this._animationType = options?.animationType;
    this._animationDuration = options?.animationDuration;
    this._multiple = options?.multiple;
    this._fieldsToDisplay = options?.fieldsToDisplay;
    this._maxResults = options?.maxResults;
    this._startQueriyngFromChar = options?.startQueriyngFromChar;
    this._propToMapAsValue = options?.propToMapAsValue;
    this._filterOn = options?.filterOn;
    this._cache = options?.cache;
  }
}