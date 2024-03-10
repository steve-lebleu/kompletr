
/**
 * @description
 */
export class Validation {
  constructor() {}

  /**
   * @description Valid input as HTMLInputElement or DOM eligible
   * 
   * @param {HTMLInputElement|String} input
   * 
   * @throws {Error}
   * 
   * @returns {Boolean}
   */
  static input(input) {
    if (input && input instanceof HTMLInputElement === false && !document.getElementById(input)) {
      throw new Error(`input should be an HTMLInputElement instance or a valid id identifier. None of boths given, ${input} received.`);
    }
    return true;
  }

  /**
   * @description Valid data format
   * 
   * @param {Array} data 
   *
   * @returns {Boolean}
   */
  static data (data) {
    if (data && !Array.isArray(data)) {
      throw new Error(`Invalid data. Please provide a valid data as Array of what you want (${data} given).`);
    }
    return true;
  }

  /**
   * @description Valid callbacks
   * 
   * @param {Object} callbacks 
   *
   * @returns {Boolean}
   */
  static callbacks(callbacks) {
    Object.keys(callbacks).forEach(key => {
      if (!['onKeyup', 'onSelect', 'onError'].includes(key)) {
        throw new Error(`Unrecognized callback function ${key}. Please use onKeyup, onSelect and onError as valid callbacks functions.`);
      }
      if (callbacks[key] && typeof callbacks[key] !== 'function') {
        throw new Error(`callback function ${key} should be a function, ${callbacks[key]} given`);
      }
    });
    return true;
  }

  /**
   * @description One line validation
   * 
   * @param {HTMLInputElement|String} input 
   * @param {Array} data 
   * @param {Object} callbacks 
   * 
   * @returns {Boolean}
   */
  static validate(input, data, callbacks) {
    return Validation.input(input) && Validation.data(data) && Validation.callbacks(callbacks);
  }
}