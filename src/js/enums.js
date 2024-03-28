/**
 * Enum representing different animation types.
 * 
 * @enum {string}
 * @readonly
 */
const animation = Object.freeze({
  fadeIn: 'fadeIn',
  slideDown: 'slideDown',
});


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

export { animation, event, origin, searchExpression, theme };