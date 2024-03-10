/**
 * @description Dynamic properties of current Kompltr instance.
 */
export class Properties {

  /**
   * @description Data storage
   */
  _data = null

  /**
   * @description Position of the pointer inside the suggestions
   */
  _pointer = null

  /**
   * @description Previous input value
   */
  _previousValue = null

  get data() {
    return this._data;
  }

  set data(value) {
    if (!Array.isArray(value)) {
      throw new Error(`data must be an array (${value.toString()} given)`);
    }
    this._data = value;
  }

  get pointer() {
    return this._pointer;
  }

  set pointer(value) {
    if (isNaN(parseInt(value, 10))) {
      throw new Error(`pointer must be an integer (${value.toString()} given)`);
    }
    this._pointer = value;
  }

  get previousValue() {
    return this._previousValue;
  }

  set previousValue(value) {
    this._previousValue = value;
  }

  constructor(props) {
    this._data = props.data;
  }
}